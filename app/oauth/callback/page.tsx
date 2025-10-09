'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Header } from '@/components/ui/header'
import { Main } from "@/components/ui/main"

interface OAuthFlowState {
  authEndpoint: string
  codeVerifier: string
  codeChallenge: string
  state: string
  clientId: string
  redirectUri: string
  timestamp: number
}

interface TokenResponse {
  access_token?: string
  token_type?: string
  expires_in?: number
  id_token?: string
  refresh_token?: string
  [key: string]: any
}

interface ResourceServerMetadata {
  resource: string
  authorization_servers: string[]
}

interface AuthorizationServerMetadata {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  [key: string]: any
}

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [steps, setSteps] = useState<Array<{text: string, status: 'pending' | 'loading' | 'success' | 'error'}>>([])
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(null)
  const [decodedIdToken, setDecodedIdToken] = useState<any>(null)

  const updateStep = (index: number, status: 'pending' | 'loading' | 'success' | 'error') => {
    setSteps(prev => prev.map((step, i) => i === index ? {...step, status} : step))
  }

  useEffect(() => {
    const processCallback = async () => {
      // Initialize steps
      setSteps([
        { text: 'Validating OAuth callback parameters', status: 'loading' },
        { text: 'Fetching resource server metadata', status: 'pending' },
        { text: 'Fetching authorization server metadata', status: 'pending' },
        { text: 'Exchanging authorization code for tokens', status: 'pending' },
        { text: 'Decoding tokens', status: 'pending' }
      ])

      try {
        // Step 1: Validate callback parameters
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          updateStep(0, 'error')
          setStatus('error')
          setMessage(`OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
          return
        }

        if (!code) {
          updateStep(0, 'error')
          setStatus('error')
          setMessage('No authorization code received')
          return
        }

        // Retrieve stored flow state
        const storedStateStr = localStorage.getItem('oauth_flow_state')
        if (!storedStateStr) {
          updateStep(0, 'error')
          setStatus('error')
          setMessage('No OAuth flow state found. Please restart the flow.')
          return
        }

        const flowState: OAuthFlowState = JSON.parse(storedStateStr)

        // Validate state parameter
        if (state !== flowState.state) {
          updateStep(0, 'error')
          setStatus('error')
          setMessage('State mismatch - possible CSRF attack')
          return
        }

        updateStep(0, 'success')

        // Step 2: Fetch resource server metadata
        updateStep(1, 'loading')

        // Extract base URL from authorization endpoint
        const authEndpointUrl = new URL(flowState.authEndpoint)
        const baseUrl = `${authEndpointUrl.protocol}//${authEndpointUrl.host}`

        const resourceMetadataUrl = `${baseUrl}/.well-known/oauth-protected-resource`
        const resourceResponse = await fetch(resourceMetadataUrl)

        if (!resourceResponse.ok) {
          updateStep(1, 'error')
          setStatus('error')
          setMessage(`Failed to fetch resource server metadata: ${resourceResponse.status}`)
          return
        }

        const resourceMetadata: ResourceServerMetadata = await resourceResponse.json()

        if (!resourceMetadata.authorization_servers || resourceMetadata.authorization_servers.length === 0) {
          updateStep(1, 'error')
          setStatus('error')
          setMessage('No authorization servers found in resource metadata')
          return
        }

        const authServerIssuer = resourceMetadata.authorization_servers[0]
        updateStep(1, 'success')

        // Step 3: Fetch authorization server metadata
        updateStep(2, 'loading')
        const authServerMetadataUrl = `${authServerIssuer}/.well-known/oauth-authorization-server`
        const authServerResponse = await fetch(authServerMetadataUrl)

        if (!authServerResponse.ok) {
          updateStep(2, 'error')
          setStatus('error')
          setMessage(`Failed to fetch authorization server metadata: ${authServerResponse.status}`)
          return
        }

        const authServerMetadata: AuthorizationServerMetadata = await authServerResponse.json()

        if (!authServerMetadata.token_endpoint) {
          updateStep(2, 'error')
          setStatus('error')
          setMessage('No token endpoint found in authorization server metadata')
          return
        }

        updateStep(2, 'success')

        // Step 4: Exchange code for tokens
        updateStep(3, 'loading')
        const tokenEndpoint = authServerMetadata.token_endpoint

        const tokenRequestBody = new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: flowState.redirectUri,
          client_id: flowState.clientId,
          code_verifier: flowState.codeVerifier
        })

        const tokenExchangeResponse = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: tokenRequestBody.toString()
        })

        if (!tokenExchangeResponse.ok) {
          const errorData = await tokenExchangeResponse.text()
          updateStep(3, 'error')
          setStatus('error')
          setMessage(`Token exchange failed: ${tokenExchangeResponse.status} - ${errorData}`)
          return
        }

        const tokens: TokenResponse = await tokenExchangeResponse.json()
        setTokenResponse(tokens)
        updateStep(3, 'success')

        // Step 5: Decode ID token if present
        updateStep(4, 'loading')
        if (tokens.id_token) {
          try {
            // Decode JWT (just the payload, not verifying signature for demo purposes)
            const parts = tokens.id_token.split('.')
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]))
              setDecodedIdToken(payload)
            }
          } catch (e) {
            console.error('Failed to decode ID token:', e)
          }
        }
        updateStep(4, 'success')

        // Clean up localStorage
        localStorage.removeItem('oauth_flow_state')

        setStatus('success')
        setMessage('OAuth flow completed successfully!')

      } catch (err) {
        console.error('Callback processing error:', err)
        setStatus('error')
        setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        steps.forEach((_, i) => {
          if (steps[i].status === 'loading') {
            updateStep(i, 'error')
          }
        })
      }
    }

    processCallback()
  }, [searchParams])

  const StepIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <Main>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">OAuth Callback</h1>
            <p className="text-xl text-gray-600 mt-2">Processing your authorization response...</p>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Flow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <StepIcon status={step.status} />
                    <span className={`text-sm ${step.status === 'error' ? 'text-red-700' : 'text-gray-700'}`}>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Message */}
          {status !== 'loading' && (
            <Card className={status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {status === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${status === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                      {status === 'success' ? 'Success!' : 'Error'}
                    </p>
                    <p className={`text-sm mt-1 ${status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                      {message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Token Response */}
          {tokenResponse && (
            <Card>
              <CardHeader>
                <CardTitle>Token Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(tokenResponse, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Decoded ID Token */}
          {decodedIdToken && (
            <Card>
              <CardHeader>
                <CardTitle>Decoded ID Token</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Claims extracted from the ID token JWT:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(decodedIdToken, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back Link */}
          <div className="pt-4">
            <a
              href="/servers"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Server Testing
            </a>
          </div>
        </div>
      </Main>
    </div>
  )
}
