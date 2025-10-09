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
  const [authEndpoint, setAuthEndpoint] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null)

  const testOAuthFlow = async () => {
    if (!authEndpoint.trim()) return

    setIsValidating(true)
    setError(null)

    try {
      // Validate URL format
      const url = new URL(authEndpoint)

      if (!url.protocol.startsWith('https')) {
        setError('Authorization endpoint must use HTTPS')
        setIsValidating(false)
        return
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
      const flowState = {
        authEndpoint: authEndpoint,
        codeVerifier: verifier,
        codeChallenge: challenge,
        state: state,
        clientId: 'https://client.dev/oauth/metadata.json',
        redirectUri: 'https://client.dev/oauth/callback',
        timestamp: Date.now()
      }
      localStorage.setItem('oauth_flow_state', JSON.stringify(flowState))

      // Open in new window
      window.open(authUrl, '_blank', 'width=600,height=700')

      setIsValidating(false)
    } catch (err) {
      setError(`Invalid URL: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
              Test your authorization server's CIMD support by initiating an OAuth flow with client.dev's metadata document.
              This will open a new window with the authorization request.
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
                Authorization Endpoint (HTTPS required)
              </label>
              <input
                type="url"
                value={authEndpoint}
                onChange={(e) => {
                  setAuthEndpoint(e.target.value)
                  setError(null)
                }}
                placeholder="https://bart.vanshaj.dev/oauth/authorize"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Your authorization server's OAuth 2.0 authorization endpoint
              </p>
            </div>

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
              disabled={isValidating || !authEndpoint.trim()}
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
              <p className="font-medium">When you click "Start OAuth Flow", your server should:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                <li>Receive the authorization request with <code className="bg-gray-100 px-1 rounded">client_id</code> as a URL</li>
                <li>Fetch the metadata from <code className="bg-gray-100 px-1 rounded">https://client.dev/oauth/metadata.json</code></li>
                <li>Validate the metadata structure and required fields</li>
                <li>Verify the <code className="bg-gray-100 px-1 rounded">redirect_uri</code> matches what's in the metadata</li>
                <li>Store the <code className="bg-gray-100 px-1 rounded">code_challenge</code> for PKCE validation</li>
                <li>Display a consent screen showing client.dev's name and information</li>
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