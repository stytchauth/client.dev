'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, AlertCircle, Play, ExternalLink } from "lucide-react"

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
  const [resourceServer, setResourceServer] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null)
  const [discoveryStatus, setDiscoveryStatus] = useState<string>('')

  const testOAuthFlow = async () => {
    if (!resourceServer.trim()) return

    setIsValidating(true)
    setError(null)
    setDiscoveryStatus('')

    try {
      // Validate URL format
      const url = new URL(resourceServer)

      if (!url.protocol.startsWith('https')) {
        setError('Resource server must use HTTPS')
        setIsValidating(false)
        return
      }

      // Extract base URL
      const baseUrl = `${url.protocol}//${url.host}`

      // Step 1: Fetch resource server metadata
      setDiscoveryStatus('Fetching resource server metadata...')
      const resourceMetadataUrl = `${baseUrl}/.well-known/oauth-protected-resource`
      const resourceResponse = await fetch(resourceMetadataUrl)

      if (!resourceResponse.ok) {
        setError(`Failed to fetch resource server metadata: ${resourceResponse.status}`)
        setIsValidating(false)
        return
      }

      const resourceMetadata = await resourceResponse.json()

      if (!resourceMetadata.authorization_servers || resourceMetadata.authorization_servers.length === 0) {
        setError('No authorization servers found in resource metadata')
        setIsValidating(false)
        return
      }

      // Step 2: Get authorization server issuer
      const authServerIssuer = resourceMetadata.authorization_servers[0]
      setDiscoveryStatus('Fetching authorization server metadata...')

      // Step 3: Fetch authorization server metadata
      const authServerMetadataUrl = `${authServerIssuer}/.well-known/oauth-authorization-server`
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

      // Step 4: Use the discovered authorization endpoint
      const authEndpoint = authServerMetadata.authorization_endpoint
      setDiscoveryStatus('Starting OAuth flow...')

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
      // Store the resource server base URL, not the authorization endpoint
      const flowState = {
        authEndpoint: baseUrl,  // Store RS base URL for callback to discover
        codeVerifier: verifier,
        codeChallenge: challenge,
        state: state,
        clientId: 'https://client.dev/oauth/metadata.json',
        redirectUri: 'https://client.dev/oauth/callback',
        timestamp: Date.now()
      }
      localStorage.setItem('oauth_flow_state', JSON.stringify(flowState))

      // Open in new window
      window.location.href = authUrl;

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
              Test your authorization server's CIMD support by providing your resource server URL. We'll automatically discover
              your authorization endpoint using OAuth metadata discovery, then initiate the flow with client.dev's metadata document.
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
            <div>
              <label className="block text-sm font-medium mb-2">
                Resource Server URL (HTTPS required)
              </label>
              <input
                type="url"
                value={resourceServer}
                onChange={(e) => {
                  setResourceServer(e.target.value)
                  setError(null)
                }}
                placeholder="https://bart.vanshaj.dev"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                The base URL of your resource server. We'll discover the authorization endpoint automatically.
              </p>
            </div>

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
              disabled={isValidating || !resourceServer.trim()}
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
          </CardContent>
        </Card>

        {/* What This Tests */}
        <Card>
          <CardHeader>
            <CardTitle>What This Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="font-medium">When you click "Start OAuth Flow", the tester will:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                <li>Fetch <code className="bg-gray-100 px-1 rounded">{`{resource_server}/.well-known/oauth-protected-resource`}</code></li>
                <li>Extract the authorization server issuer from <code className="bg-gray-100 px-1 rounded">authorization_servers</code></li>
                <li>Fetch <code className="bg-gray-100 px-1 rounded">{`{issuer}/.well-known/oauth-authorization-server`}</code></li>
                <li>Extract the <code className="bg-gray-100 px-1 rounded">authorization_endpoint</code></li>
                <li>Redirect to the authorization endpoint with PKCE parameters</li>
              </ol>
              <p className="font-medium mt-4">Your authorization server should then:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2" start={6}>
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
  "logo_uri": "https://client.dev/logo.png",
  "redirect_uris": [
    "https://client.dev/oauth/callback"
  ],
  "grant_types": ["authorization_code"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "private_key_jwt",
  "jwks_uri": "https://client.dev/.well-known/jwks.json"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900">Testing Note</p>
                <p className="text-amber-800 mt-1">
                  This test opens a new window to your authorization endpoint with PKCE enabled. Make sure your server is configured to accept
                  requests and can fetch metadata from client.dev. The callback will redirect to client.dev/oauth/callback,
                  which is a static page for testing purposes. The <code className="bg-amber-100 px-1 rounded">code_verifier</code> is displayed
                  after starting the flow - you'll need it to complete the token exchange.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}