import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, CheckCircle, ExternalLink, Code, Server, AlertCircle, ArrowLeft } from "lucide-react"
import { CodeBlock } from "@/lib/shiki"

export function LearnContent() {
  return (
    <div className="space-y-12">
      {/* Key Concept */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Globe className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Key Concept</h3>
            <p className="text-blue-800">
              With CIMD, your <code className="bg-blue-100 px-1 rounded">client_id</code> is simply an HTTPS URL that serves your client metadata as JSON.
              No preregistration required—just host your metadata and start using OAuth.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold mb-2">Create Metadata</h3>
              <p className="text-sm text-gray-600">Write a JSON document with your client information</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold mb-2">Host at URL</h3>
              <p className="text-sm text-gray-600">Serve it over HTTPS with proper Content-Type</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold mb-2">Use URL as client_id</h3>
              <p className="text-sm text-gray-600">Pass the metadata URL directly as your client identifier</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hosting Requirements */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Hosting Requirements</h2>

        <Card className="border border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              Critical Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm"><strong>HTTPS only</strong> - HTTP URLs are not allowed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm"><strong>Content-Type: application/json</strong> - Proper HTTP header required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm"><strong>Stable origin</strong> - Use a reliable, long-term domain</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm"><strong>Current metadata</strong> - Keep information accurate and up-to-date</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata Fields */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Metadata Fields</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Required Fields</h3>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">client_id</code>
                  <p className="text-sm text-gray-600 mt-1">Must match the URL serving this document</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">redirect_uris</code>
                  <p className="text-sm text-gray-600 mt-1">Array of exact redirect URIs for your application</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold">Recommended Fields</h3>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">client_name</code>
                  <p className="text-sm text-gray-600 mt-1">Human-readable name for your application</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">logo_uri</code>
                  <p className="text-sm text-gray-600 mt-1">URL to your application's logo image</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">client_uri</code>
                  <p className="text-sm text-gray-600 mt-1">URL to your application's homepage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold">Optional Fields</h3>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">tos_uri</code>
                  <p className="text-sm text-gray-600 mt-1">Terms of service</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">policy_uri</code>
                  <p className="text-sm text-gray-600 mt-1">Privacy policy</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">grant_types</code>
                  <p className="text-sm text-gray-600 mt-1">Supported grant types</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">response_types</code>
                  <p className="text-sm text-gray-600 mt-1">Supported response types</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">post_logout_redirect_uris</code>
                  <p className="text-sm text-gray-600 mt-1">Post-logout redirects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Minimal Example */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Minimal Example</h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Basic CIMD Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock language="json">{`{
  "client_id": "https://example.com/oauth/client-metadata.json",
  "client_name": "Example App",
  "redirect_uris": ["https://example.com/callback"],
  "logo_uri": "https://example.com/assets/logo.png"
}`}</CodeBlock>
            <p className="text-sm text-gray-600 mt-4">
              This minimal document includes just the essential fields. Host this JSON at the URL specified in <code>client_id</code>.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-world Examples */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Real-world Example</h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Bluesky/ATProto Ecosystem
              </div>
              <Link
                href="https://oauthbluesky.onrender.com/oauth/client-metadata.json"
                target="_blank"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View Live Example
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              The Bluesky/ATProto ecosystem uses CIMD-style client metadata. Here's an example from their OAuth implementation:
            </p>
            <CodeBlock language="json">{`{
  "client_id": "https://oauthbluesky.onrender.com/oauth/client-metadata.json",
  "client_name": "OAuth Bluesky Demo",
  "client_uri": "https://oauthbluesky.onrender.com",
  "logo_uri": "https://oauthbluesky.onrender.com/logo.png",
  "redirect_uris": [
    "https://oauthbluesky.onrender.com/oauth/callback"
  ],
  "grant_types": ["authorization_code"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "private_key_jwt",
  "jwks_uri": "https://oauthbluesky.onrender.com/.well-known/jwks.json"
}`}</CodeBlock>
          </CardContent>
        </Card>
      </div>

      {/* Authoring Checklist */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Authoring Checklist</h2>

        <Card className="border border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Pre-deployment Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">URL accessibility</p>
                  <p className="text-sm text-gray-600">Verify the URL used as client_id returns valid JSON</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Exact redirect URIs</p>
                  <p className="text-sm text-gray-600">Ensure all redirect URIs are exact matches (no wildcards). HTTPS is recommended but not required.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">HTTPS and Content-Type</p>
                  <p className="text-sm text-gray-600">Confirm HTTPS hosting with <code>application/json</code> header</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Optional fields for UX</p>
                  <p className="text-sm text-gray-600">Add logo_uri, client_uri, and policy links for better user experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">JSON validity</p>
                  <p className="text-sm text-gray-600">Validate JSON syntax and structure</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Production vs development</p>
                  <p className="text-sm text-gray-600">Avoid localhost redirect URIs in production. Use separate CIMD documents for development environments.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="space-y-6 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold">Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/servers" className="block">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Server className="w-5 h-5" />
                  <span className="font-semibold">CIMD for Servers</span>
                </div>
                <p className="text-sm text-gray-600">
                  Learn how authorization servers can support CIMD clients.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/" className="block">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">Back to Overview</span>
                </div>
                <p className="text-sm text-gray-600">
                  Return to the main CIMD explainer page.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}