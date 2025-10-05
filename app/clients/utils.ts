export interface ValidationError {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  metadata?: any
}

export const validateCIMDDocument = async (
  metadata: any,
  sourceUrl: string | null,
  checkReachability: boolean
): Promise<ValidationResult> => {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Check required fields
  if (!metadata.client_id) {
    errors.push({
      path: 'client_id',
      message: 'Missing required field: client_id',
      severity: 'error'
    })
  } else if (sourceUrl && metadata.client_id !== sourceUrl) {
    errors.push({
      path: 'client_id',
      message: 'client_id must match the source URL',
      severity: 'error'
    })
  } else if (!metadata.client_id.startsWith('https://')) {
    errors.push({
      path: 'client_id',
      message: 'client_id must be an HTTPS URL',
      severity: 'error'
    })
  }

  if (!metadata.redirect_uris || !Array.isArray(metadata.redirect_uris)) {
    errors.push({
      path: 'redirect_uris',
      message: 'Missing required field: redirect_uris (must be an array)',
      severity: 'error'
    })
  } else {
    if (metadata.redirect_uris.length === 0) {
      errors.push({
        path: 'redirect_uris',
        message: 'redirect_uris cannot be empty',
        severity: 'error'
      })
    }

    metadata.redirect_uris.forEach((uri: any, index: number) => {
      if (typeof uri !== 'string') {
        errors.push({
          path: `redirect_uris[${index}]`,
          message: 'Redirect URI must be a string',
          severity: 'error'
        })
      } else {
        // Check for non-HTTPS URIs (warning, not error)
        if (!uri.startsWith('https://') && !uri.startsWith('http://localhost')) {
          warnings.push({
            path: `redirect_uris[${index}]`,
            message: 'Redirect URIs should use HTTPS for security (except localhost for development)',
            severity: 'warning'
          })
        }

        // Check for localhost URIs in production context
        if (uri.startsWith('localhost') || uri.startsWith('http://localhost') || uri.startsWith("https://localhost") || uri.includes('127.0.0.1')) {
          warnings.push({
            path: `redirect_uris[${index}]`,
            message: 'Localhost redirect URIs should not be used in production. Consider a separate CIMD for local development.',
            severity: 'warning'
          })
        }
      }
    })

    // Check for duplicates
    const uniqueUris = new Set(metadata.redirect_uris)
    if (uniqueUris.size !== metadata.redirect_uris.length) {
      errors.push({
        path: 'redirect_uris',
        message: 'Redirect URIs must be unique',
        severity: 'error'
      })
    }
  }

  // Validate optional URI fields
  const uriFields = ['logo_uri', 'client_uri', 'policy_uri', 'tos_uri', 'jwks_uri']
  uriFields.forEach(field => {
    if (metadata[field]) {
      if (typeof metadata[field] !== 'string') {
        errors.push({
          path: field,
          message: `${field} must be a string`,
          severity: 'error'
        })
      } else if (!metadata[field].startsWith('https://')) {
        warnings.push({
          path: field,
          message: `${field} should use HTTPS for security`,
          severity: 'warning'
        })
      }
    }
  })

  // Check document size (simulate)
  const jsonSize = JSON.stringify(metadata).length
  if (jsonSize > 65536) { // 64KB
    errors.push({
      path: 'document',
      message: 'Document size exceeds 64KB limit',
      severity: 'error'
    })
  }

  // Field length checks
  if (metadata.client_name && metadata.client_name.length > 200) {
    warnings.push({
      path: 'client_name',
      message: 'Client name is very long (>200 chars)',
      severity: 'warning'
    })
  }

  // Reachability checks (if enabled)
  if (checkReachability) {
    const urlsToCheck: Array<{ field: string; url: string }> = []

    // Collect URLs to check
    uriFields.forEach(field => {
      if (metadata[field] && typeof metadata[field] === 'string' && metadata[field].startsWith('https://')) {
        urlsToCheck.push({ field, url: metadata[field] })
      }
    })

    // Also check redirect URIs
    if (metadata.redirect_uris && Array.isArray(metadata.redirect_uris)) {
      metadata.redirect_uris.forEach((uri: any, index: number) => {
        if (typeof uri === 'string' && uri.startsWith('https://')) {
          urlsToCheck.push({ field: `redirect_uris[${index}]`, url: uri })
        }
      })
    }

    // Perform reachability checks
    for (const { field, url } of urlsToCheck) {
      try {
        await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors' // Avoid CORS issues for reachability check
        })
        // Note: no-cors mode means we can't check the actual status,
        // but if the request completes without error, the URL is likely reachable
      } catch (error) {
        warnings.push({
          path: field,
          message: `URL may not be reachable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'warning'
        })
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata
  }
}

export const generateTextReport = (result: ValidationResult, type: string): string => {
  const timestamp = new Date().toISOString()
  const lines = [
    'CIMD Validation Report',
    `Generated: ${timestamp}`,
    `Input Type: ${type === 'url' ? 'URL' : 'Raw JSON'}`,
    `Status: ${result.valid ? 'VALID' : 'INVALID'}`,
    ''
  ]

  if (result.errors.length > 0) {
    lines.push('ERRORS:')
    result.errors.forEach(error => {
      lines.push(`  • ${error.path}: ${error.message}`)
    })
    lines.push('')
  }

  if (result.warnings.length > 0) {
    lines.push('WARNINGS:')
    result.warnings.forEach(warning => {
      lines.push(`  • ${warning.path}: ${warning.message}`)
    })
    lines.push('')
  }

  if (result.valid) {
    lines.push('✓ Document is production-ready!')
  } else {
    lines.push('✗ Document requires fixes before production use.')
  }

  return lines.join('\n')
}