'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, BookOpen, Users, Zap, Database, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { CodeBlock } from "@/lib/shiki"
import { BuiltByStytch } from '@/components/ui/built-by-stytch';
import { Header } from '@/components/ui/header';

export default function Component() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 overflow-x-hidden">
        <div className="space-y-16">
        {/* <BuiltByStytch /> */}

          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-black leading-tight">
                OAuth Client Registration, <br />
                <span className="text-blue-600">Reimagined</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Client ID Metadata Documents (CIMD) let OAuth clients identify themselves using just a URL.
                No preregistration. No database bloat. No operational headaches.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                CIMD reduces friction, supports dynamic ecosystems like MCP, and eliminates interoperability headaches.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/clients">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  Explore CIMD for Clients
                </Button>
              </Link>
              <Link href="/servers">
                <Button size="lg" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Explore CIMD for Servers
                </Button>
              </Link>
            </div>
          </div>

          {/* Core Concepts */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">How CIMD Works</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-red-600">Before: Traditional DCR</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500">×</span>
                        <span>Every client instance registers separately</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500">×</span>
                        <span>Unbounded database growth</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500">×</span>
                        <span>Complex client lifecycle management</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500">×</span>
                        <span>Vulnerable to client impersonation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-green-600">After: CIMD</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>URL as client_id points to metadata JSON</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Just-in-time metadata fetching</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Single URL per application, scales infinitely</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Cryptographic client verification</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Simple Example */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">It's Simple</h2>
            <div className="space-y-4">
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-lg font-semibold">Instead of registering your client...</div>
                    <CodeBlock language="javascript">{`// Traditional OAuth: Pre-register to get client_id
const client_id = "abc123def456"; // From registration process`}</CodeBlock>

                    <div className="text-lg font-semibold">Just use a URL that serves your metadata:</div>
                    <CodeBlock language="javascript">{`// CIMD: Use your own URL as client_id
const client_id = "https://myapp.com/oauth-metadata";

// That URL returns:
{
  "client_id": "https://myapp.com/oauth-metadata",
  "client_name": "My Awesome App",
  "redirect_uris": ["https://myapp.com/callback"],
  "token_endpoint_auth_method": "private_key_jwt",
  "jwks_uri": "https://myapp.com/jwks"
}`}</CodeBlock>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Use Cases */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Perfect For</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Zap className="w-8 h-8 text-yellow-600" />
                  <h3 className="font-bold text-lg">Model Context Protocol</h3>
                  <p className="text-sm text-gray-600">
                    Connect AI tools and servers without the registration bottleneck. Every MCP client can authenticate dynamically.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <h3 className="font-bold text-lg">Developer Tools</h3>
                  <p className="text-sm text-gray-600">
                    CLI tools, desktop apps, and developer utilities that need OAuth without complex setup flows.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Database className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-lg">Enterprise Platforms</h3>
                  <p className="text-sm text-gray-600">
                    SaaS platforms with hundreds of integrations that don't want to manage thousands of client registrations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <h3 className="font-bold text-lg">Open Source Projects</h3>
                  <p className="text-sm text-gray-600">
                    Projects that need OAuth but want to avoid complex onboarding and registration processes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <ArrowRight className="w-8 h-8 text-orange-600" />
                  <h3 className="font-bold text-lg">Dynamic Ecosystems</h3>
                  <p className="text-sm text-gray-600">
                    Any environment where clients need to connect to multiple servers without pre-coordination.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                  <h3 className="font-bold text-lg">Prototyping & Testing</h3>
                  <p className="text-sm text-gray-600">
                    Rapid development scenarios where traditional OAuth registration creates unnecessary friction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Learn More */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold">Learn More</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="https://blog.modelcontextprotocol.io/posts/client_registration/"
                target="_blank"
                className="block"
              >
                <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">MCP Blog: Evolving OAuth Client Registration</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Discover the motivation behind CIMD from the Model Context Protocol team's perspective.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href="https://datatracker.ietf.org/doc/draft-parecki-oauth-client-id-metadata-document/"
                target="_blank"
                className="block"
              >
                <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">IETF Draft: OAuth Client ID Metadata Document</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Read the full technical specification and implementation details.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/clients">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  Explore CIMD for Clients
                </Button>
              </Link>
              <Link href="/servers">
                <Button size="lg" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Explore CIMD for Servers
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <BuiltByStytch />
          </div>
        </div>
      </main>
    </div>
  )
}