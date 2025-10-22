import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Search, AlertCircle, Play, ExternalLink, CheckCircle, Loader2, ChevronDown, ChevronRight } from "lucide-react"

interface TokenResponse {
  access_token?: string
  token_type?: string
  expires_in?: number
  id_token?: string
  refresh_token?: string
  [key: string]: any
}

interface OAuthResult {
  status: 'success' | 'error'
  message: string
  steps: Array<{text: string, status: 'pending' | 'loading' | 'success' | 'error'}>
  tokenResponse?: TokenResponse
  decodedIdToken?: any
}

// Helper function to generate PKCE code verifier
function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

// Helper function to generate PKCE code challenge
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64URLEncode(new Uint8Array(hash))
}

// Base64 URL encode helper
function base64URLEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function ExploreContent() {
  const [inputMode, setInputMode] = useState<'issuer' | 'manual'>('issuer')
  const [issuerUrl, setIssuerUrl] = useState('')
  const [authorizationEndpoint, setAuthorizationEndpoint] = useState('')
  const [tokenEndpoint, setTokenEndpoint] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null)
  const [discoveryStatus, setDiscoveryStatus] = useState<string>('')
  const [oauthResult, setOAuthResult] = useState<OAuthResult | null>(null)
  const [flowSteps, setFlowSteps] = useState<Array<{text: string, status: 'pending' | 'loading' | 'success' | 'error'}>>([])
  const [showTokenResponse, setShowTokenResponse] = useState(false)
  const [showDecodedToken, setShowDecodedToken] = useState(false)

  const updateStep = (index: number, status: 'pending' | 'loading' | 'success' | 'error') => {
    setFlowSteps(prev => prev.map((step, i) => i === index ? {...step, status} : step))
  }

  // Listen for postMessage from OAuth callback
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== window.location.origin) {
        return
      }

      // Check if this is an OAuth callback message
      if (event.data && event.data.type === 'oauth-callback') {
        // Handle error from callback
        if (event.data.error) {
          setFlowSteps([
            { text: 'Validating OAuth callback parameters', status: 'error' }
          ])
          setOAuthResult({
            status: 'error',
            message: event.data.error,
            steps: [{ text: 'Validating OAuth callback parameters', status: 'error' }]
          })
          return
        }

        // Initialize steps for token exchange
        setFlowSteps([
          { text: 'Received authorization code', status: 'success' },
          { text: 'Exchanging authorization code for tokens', status: 'loading' },
          { text: 'Decoding tokens', status: 'pending' }
        ])

        const { code, flowState } = event.data

        try {
          // Exchange code for tokens
          const tokenRequestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: flowState.redirectUri,
            client_id: flowState.clientId,
            code_verifier: flowState.codeVerifier
          })

          const tokenExchangeResponse = await fetch(flowState.tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenRequestBody.toString()
          })

          if (!tokenExchangeResponse.ok) {
            const errorData = await tokenExchangeResponse.text()
            updateStep(1, 'error')
            setOAuthResult({
              status: 'error',
              message: `Token exchange failed: ${tokenExchangeResponse.status} - ${errorData}`,
              steps: flowSteps
            })
            return
          }

          const tokens: TokenResponse = await tokenExchangeResponse.json()
          updateStep(1, 'success')

          // Decode ID token if present
          updateStep(2, 'loading')
          let decodedIdToken = null
          if (tokens.id_token) {
            try {
              const parts = tokens.id_token.split('.')
              if (parts.length === 3) {
                decodedIdToken = JSON.parse(atob(parts[1]))
              }
            } catch (e) {
              console.error('Failed to decode ID token:', e)
            }
          }
          updateStep(2, 'success')

          // Set final result
          const finalSteps = [
            { text: 'Received authorization code', status: 'success' as const },
            { text: 'Exchanging authorization code for tokens', status: 'success' as const },
            { text: 'Decoding tokens', status: 'success' as const }
          ]
          setFlowSteps(finalSteps)
          setOAuthResult({
            status: 'success',
            message: 'OAuth flow completed successfully!',
            steps: finalSteps,
            tokenResponse: tokens,
            decodedIdToken: decodedIdToken
          })

          // Clean up localStorage
          localStorage.removeItem('oauth_flow_state')
          setCodeVerifier(null)

        } catch (err) {
          updateStep(1, 'error')
          setOAuthResult({
            status: 'error',
            message: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
            steps: flowSteps
          })
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const testOAuthFlow = async () => {
    setIsValidating(true)
    setError(null)
    setDiscoveryStatus('')
    setOAuthResult(null) // Clear previous results

    try {
      let authEndpoint: string
      let tokenEndpointUrl: string

      if (inputMode === 'issuer') {
        // Issuer URL mode - discover endpoints
        if (!issuerUrl.trim()) {
          setError('Please provide an issuer URL')
          setIsValidating(false)
          return
        }

        // Validate URL format
        const url = new URL(issuerUrl)

        if (!url.protocol.startsWith('https')) {
          setError('Issuer URL must use HTTPS')
          setIsValidating(false)
          return
        }

        // Extract base URL
        const baseUrlForStorage = `${url.protocol}//${url.host}`

        // Fetch authorization server metadata
        setDiscoveryStatus('Fetching authorization server metadata...')
        const authServerMetadataUrl = `${baseUrlForStorage}/.well-known/oauth-authorization-server`
        const authServerResponse = await fetch(authServerMetadataUrl)

        if (!authServerResponse.ok) {
          setError(`Failed to fetch authorization server metadata: ${authServerResponse.status}`)
          setIsValidating(false)
          return
        }

        const authServerMetadata = await authServerResponse.json()

        if (!authServerMetadata.authorization_endpoint) {
          setError('No authorization endpoint found in authorization server metadata')
          setIsValidating(false)
          return
        }

        if (!authServerMetadata.token_endpoint) {
          setError('No token endpoint found in authorization server metadata')
          setIsValidating(false)
          return
        }

        authEndpoint = authServerMetadata.authorization_endpoint
        tokenEndpointUrl = authServerMetadata.token_endpoint
        setDiscoveryStatus('Starting OAuth flow...')
      } else {
        // Manual mode - use provided endpoints
        if (!authorizationEndpoint.trim() || !tokenEndpoint.trim()) {
          setError('Please provide both authorization and token endpoints')
          setIsValidating(false)
          return
        }

        // Validate URLs
        try {
          const authUrl = new URL(authorizationEndpoint)
          const tokenUrl = new URL(tokenEndpoint)

          if (!authUrl.protocol.startsWith('https') || !tokenUrl.protocol.startsWith('https')) {
            setError('Endpoints must use HTTPS')
            setIsValidating(false)
            return
          }

          authEndpoint = authorizationEndpoint
          tokenEndpointUrl = tokenEndpoint
        } catch (err) {
          setError('Invalid URL format')
          setIsValidating(false)
          return
        }
      }

      // Generate PKCE parameters
      const verifier = generateCodeVerifier()
      const challenge = await generateCodeChallenge(verifier)

      // Store verifier for display
      setCodeVerifier(verifier)

      // Generate state
      const state = 'test_state_' + Math.random().toString(36).substring(7)

      // Build OAuth authorization URL with PKCE
      const params = new URLSearchParams({
        client_id: 'https://client.dev/oauth/metadata.json',
        redirect_uri: 'https://client.dev/oauth/callback',
        response_type: 'code',
        scope: 'openid profile email',
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      })

      const authUrl = `${authEndpoint}?${params.toString()}`

      // Store OAuth flow state in localStorage for callback page
      // Token endpoint is already discovered/provided, so callback can use it directly
      const flowState = {
        tokenEndpoint: tokenEndpointUrl,  // Token endpoint ready to use
        codeVerifier: verifier,
        codeChallenge: challenge,
        state: state,
        clientId: 'https://client.dev/oauth/metadata.json',
        redirectUri: 'https://client.dev/oauth/callback',
        timestamp: Date.now()
      }
      localStorage.setItem('oauth_flow_state', JSON.stringify(flowState))

      // Open in popup window
      const popup = window.open(authUrl, 'oauth-popup', 'width=600,height=700')

      if (!popup) {
        setError('Popup was blocked. Please allow popups for this site.')
        setDiscoveryStatus('')
        setIsValidating(false)
        return
      }

      setDiscoveryStatus('')
      setIsValidating(false)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setDiscoveryStatus('')
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* OAuth Flow Tester */}
      <div className="space-y-6">
        <div className="flex space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex justify-center">
          <Search className="w-6 h-6 text-blue-600 mt-1" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 mb-2">OAuth Flow Tester</h3>
            <p className="text-blue-700">
              Test your authorization server's CIMD support. Provide your issuer URL for automatic endpoint discovery,
              or manually specify your authorization and token endpoints. We'll initiate an OAuth flow using client.dev's metadata document.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Test Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode Selector */}
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  checked={inputMode === 'issuer'}
                  onChange={() => setInputMode('issuer')}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Issuer URL</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  checked={inputMode === 'manual'}
                  onChange={() => setInputMode('manual')}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Manual Endpoints</span>
              </label>
            </div>

            {inputMode === 'issuer' ? (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Issuer URL (HTTPS required)
                </label>
                <input
                  type="url"
                  value={issuerUrl}
                  onChange={(e) => {
                    setIssuerUrl(e.target.value)
                    setError(null)
                  }}
                  placeholder="https://login.client.dev"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The base URL of your authorization server. We'll discover endpoints from <code className="bg-gray-100 px-1 rounded">/.well-known/oauth-authorization-server</code>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Authorization Endpoint (HTTPS required)
                  </label>
                  <input
                    type="url"
                    value={authorizationEndpoint}
                    onChange={(e) => {
                      setAuthorizationEndpoint(e.target.value)
                      setError(null)
                    }}
                    placeholder="https://as.client.dev/oauth/authorize"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Token Endpoint (HTTPS required)
                  </label>
                  <input
                    type="url"
                    value={tokenEndpoint}
                    onChange={(e) => {
                      setTokenEndpoint(e.target.value)
                      setError(null)
                    }}
                    placeholder="https://login.client.dev/v1/oauth2/token"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {discoveryStatus && (
              <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-0.5" />
                <p className="text-sm text-blue-700">{discoveryStatus}</p>
              </div>
            )}

            {error && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Test Parameters:</h4>
              <div className="text-sm text-gray-600 space-y-1 font-mono">
                <div><strong>client_id:</strong> https://client.dev/oauth/metadata.json</div>
                <div><strong>redirect_uri:</strong> https://client.dev/oauth/callback</div>
                <div><strong>response_type:</strong> code</div>
                <div><strong>scope:</strong> openid profile email</div>
                <div><strong>code_challenge_method:</strong> S256 (PKCE enabled)</div>
              </div>
            </div>

            {codeVerifier && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm text-green-900">PKCE Code Verifier:</h4>
                <p className="text-xs text-green-700 mb-2">
                  Save this code_verifier - you'll need it to exchange the authorization code for tokens at your token endpoint.
                </p>
                <div className="bg-white rounded p-2 border border-green-300">
                  <code className="text-xs font-mono break-all text-gray-800">{codeVerifier}</code>
                </div>
              </div>
            )}

            <Button
              onClick={testOAuthFlow}
              disabled={isValidating || (inputMode === 'issuer' ? !issuerUrl.trim() : (!authorizationEndpoint.trim() || !tokenEndpoint.trim()))}
              className="w-full"
            >
              {isValidating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Preparing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Start OAuth Flow</span>
                </div>
              )}
            </Button>

            {/* Flow Progress - shown inline */}
            {flowSteps.length > 0 && (
              <div className="mt-4 space-y-4">
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3">Flow Progress</h4>
                  <div className="space-y-3">
                    {flowSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {step.status === 'loading' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                        {step.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {step.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                        <span className={`text-sm ${step.status === 'error' ? 'text-red-700' : 'text-gray-700'}`}>
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Message */}
                {oauthResult && (
                  <div className={`p-3 rounded-md ${oauthResult.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start space-x-3">
                      {oauthResult.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`font-semibold text-sm ${oauthResult.status === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                          {oauthResult.status === 'success' ? 'Success!' : 'Error'}
                        </p>
                        <p className={`text-xs mt-1 ${oauthResult.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                          {oauthResult.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Token Details - collapsible within test config */}
                {oauthResult?.tokenResponse && (
                  <div className="space-y-3 border-t pt-4 mt-4">
                    {/* Token Response */}
                    <div>
                      <button
                        onClick={() => setShowTokenResponse(!showTokenResponse)}
                        className="flex items-center justify-between w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-sm">Token Response</span>
                        {showTokenResponse ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      {showTokenResponse && (
                        <div className="mt-2 bg-gray-50 rounded-lg p-4">
                          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                            {JSON.stringify(oauthResult.tokenResponse, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Decoded ID Token */}
                    {oauthResult.decodedIdToken && (
                      <div>
                        <button
                          onClick={() => setShowDecodedToken(!showDecodedToken)}
                          className="flex items-center justify-between w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-sm">Decoded ID Token</span>
                          {showDecodedToken ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        {showDecodedToken && (
                          <div className="mt-2 space-y-2">
                            <p className="text-xs text-gray-600">
                              Claims extracted from the ID token JWT:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                                {JSON.stringify(oauthResult.decodedIdToken, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* What This Tests */}
        <Card>
          <CardHeader>
            <CardTitle>What This Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              {inputMode === 'issuer' ? (
                <>
                  <p className="font-medium">When you click "Start OAuth Flow", the tester will:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                    <li>Fetch <code className="bg-gray-100 px-1 rounded">{`{issuer}/.well-known/oauth-authorization-server`}</code></li>
                    <li>Extract the <code className="bg-gray-100 px-1 rounded">authorization_endpoint</code> and <code className="bg-gray-100 px-1 rounded">token_endpoint</code></li>
                    <li>Redirect to the authorization endpoint with PKCE parameters</li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="font-medium">When you click "Start OAuth Flow", the tester will:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                    <li>Use the authorization and token endpoints you provided</li>
                    <li>Redirect to the authorization endpoint with PKCE parameters</li>
                  </ol>
                </>
              )}
              <p className="font-medium mt-4">Your authorization server should then:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2" start={inputMode === 'issuer' ? 4 : 3}>
                <li>Receive the authorization request with <code className="bg-gray-100 px-1 rounded">client_id</code> as a URL</li>
                <li>Fetch the metadata from <code className="bg-gray-100 px-1 rounded">https://client.dev/oauth/metadata.json</code></li>
                <li>Validate the metadata structure and required fields</li>
                <li>Verify the <code className="bg-gray-100 px-1 rounded">redirect_uri</code> matches what's in the metadata</li>
                <li>Store the <code className="bg-gray-100 px-1 rounded">code_challenge</code> for PKCE validation</li>
                <li>Display a consent screen showing client.dev's information</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* View Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>client.dev Metadata</span>
              <a
                href="https://client.dev/oauth/metadata.json"
                target="_blank"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View Live Document
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              This is the metadata document your server will fetch during the OAuth flow:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-xs font-mono overflow-x-auto">
{`{
  "client_id": "https://client.dev/oauth/metadata.json",
  "client_name": "client.dev",
  "client_uri": "https://client.dev",
  "redirect_uris": [
    "https://client.dev/oauth/callback"
  ],
  "grant_types": ["authorization_code"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="text-sm">
                <p className="font-medium text-amber-900">Testing Note</p>
                <p className="text-amber-800 mt-1">
                  This test opens a new window to your authorization endpoint with PKCE enabled. Make sure your server
                  is configured to accept requests and can fetch metadata from client.dev. The callback will redirect
                  to client.dev/oauth/callback, which will exchange the authorization code for tokens.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}