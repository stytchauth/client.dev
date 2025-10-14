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

  if (!metadata.client_uri) {
    warnings.push({
      path: 'client_uri',
      message: 'Missing recommended field: client_uri',
      severity: 'warning'
    })
  } else if (metadata.client_uri.hostname !== metadata.client_id.hostname) {
    warnings.push({
      path: 'client_uri',
      message: 'client_uri should share the same domain as client_id',
      severity: 'warning'
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
        if (!uri.startsWith('https://') && !uri.startsWith('http://localhost') && !uri.startsWith('http://127.0.0.1')) {
          warnings.push({
            path: `redirect_uris[${index}]`,
            message: 'Redirect URIs should use HTTPS for security (except localhost)',
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
  const uriFields = ['logo_uri', 'policy_uri', 'tos_uri', 'jwks_uri']
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