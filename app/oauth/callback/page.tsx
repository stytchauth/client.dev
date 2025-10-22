'use client'

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface OAuthFlowState {
  tokenEndpoint: string
  codeVerifier: string
  codeChallenge: string
  state: string
  clientId: string
  redirectUri: string
  timestamp: number
}

function OAuthCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const processCallback = async () => {

      try {
        // Validate callback parameters
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          const errorMsg = `OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`
          setStatus('error')
          setMessage(errorMsg)

          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              error: errorMsg
            }, window.location.origin)
            setTimeout(() => window.close(), 2000)
          }
          return
        }

        if (!code) {
          const errorMsg = 'No authorization code received'
          setStatus('error')
          setMessage(errorMsg)

          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              error: errorMsg
            }, window.location.origin)
            setTimeout(() => window.close(), 2000)
          }
          return
        }

        // Retrieve stored flow state
        const storedStateStr = localStorage.getItem('oauth_flow_state')
        if (!storedStateStr) {
          const errorMsg = 'No OAuth flow state found. Please restart the flow.'
          setStatus('error')
          setMessage(errorMsg)

          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              error: errorMsg
            }, window.location.origin)
            setTimeout(() => window.close(), 2000)
          }
          return
        }

        const flowState: OAuthFlowState = JSON.parse(storedStateStr)

        // Validate state parameter
        if (state !== flowState.state) {
          const errorMsg = 'State mismatch - possible CSRF attack'
          setStatus('error')
          setMessage(errorMsg)

          if (window.opener) {
            window.opener.postMessage({
              type: 'oauth-callback',
              error: errorMsg
            }, window.location.origin)
            setTimeout(() => window.close(), 2000)
          }
          return
        }

        // Success! Send code and flow state back to opener
        setStatus('success')
        setMessage('Authorization successful! Closing popup...')

        if (window.opener) {
          window.opener.postMessage({
            type: 'oauth-callback',
            code: code,
            state: state,
            flowState: flowState
          }, window.location.origin)

          // Close the popup after a short delay
          setTimeout(() => {
            window.close()
          }, 500)
        }

      } catch (err) {
        console.error('Callback processing error:', err)
        const errorMessage = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
        setStatus('error')
        setMessage(errorMessage)

        if (window.opener) {
          window.opener.postMessage({
            type: 'oauth-callback',
            error: errorMessage
          }, window.location.origin)

          setTimeout(() => window.close(), 2000)
        }
      }
    }

    processCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <Card className={status === 'loading' ? '' : status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              {status === 'loading' && <Loader2 className="w-6 h-6 text-blue-600 animate-spin mt-0.5" />}
              {status === 'success' && <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />}
              {status === 'error' && <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />}
              <div>
                <p className={`font-semibold ${status === 'loading' ? 'text-gray-900' : status === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                  {status === 'loading' ? 'Processing...' : status === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${status === 'loading' ? 'text-gray-700' : status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {message || 'Processing your authorization response...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  )
}
