"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  ExternalLink,
  Users,
  Zap,
  Database,
  Shield,
  CheckCircle,
} from "lucide-react";
import { CodeBlock } from "@/components/codeblock";
import { Header } from "@/components/header";
import { Main } from "@/components/main";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Header />

      <Main>
        <div className="space-y-16">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xl text-gray-600 max-w-3xl">
                Client ID Metadata Documents (CIMD) let OAuth clients identify
                themselves using a URL. No preregistration necessary.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 font-medium">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                CIMD reduces friction, supports dynamic ecosystems like MCP, and
                eliminates interoperability headaches.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/servers">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Database className="w-4 h-4 mr-2" />
                  Explore CIMD for OAuth Servers
                </Button>
              </Link>
              <Link href="/clients">
                <Button size="lg" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Explore CIMD for OAuth Clients
                </Button>
              </Link>
            </div>
          </div>

          {/* Core Concepts */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">How CIMD Works</h2>

            <div className="space-y-6">
              {/* Flow Steps */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      1
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Client hosts metadata at URL
                    </h3>
                    <p className="text-gray-600 mb-3">
                      The client creates a JSON document with their metadata and
                      hosts it at an HTTPS URL.
                    </p>
                    <CodeBlock language="json">{`{
  "client_id": "https://client.dev/oauth/metadata.json",
  "client_name": "client.dev",
  "client_uri": "https://client.dev",
  "redirect_uris": ["https://client.dev/oauth/callback"]
}`}</CodeBlock>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      2
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Client uses URL as client_id
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Instead of a pre-registered client ID, the client passes
                      the metadata URL directly.
                    </p>
                    <CodeBlock language="http">{`GET /authorize?client_id=https://client.dev/oauth/metadata.json&...`}</CodeBlock>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      3
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Server fetches and validates metadata
                    </h3>
                    <p className="text-gray-600 mb-3">
                      The authorization server fetches the JSON from the
                      client_id URL and validates it.
                    </p>
                    <div className="text-sm text-gray-500">
                      • Validates JSON structure and required fields
                      <br />
                      • Ensures client_id matches the source URL
                      <br />• Checks redirect URIs and other parameters
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Server shows client info in consent screen
                    </h3>
                    <p className="text-gray-600">
                      The server displays the client_name and client_uri to help
                      users make informed consent decisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Benefit */}
              <div className="flex space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex justify-center">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                </div>
                <div className="flex-1">
                  <p className="text-blue-700 mb-3">
                    CIMD provides{" "}
                    <strong>
                      built-in protection against client impersonation
                    </strong>{" "}
                    because the authorization server can verify that the
                    client_uri has the same origin as the CIMD URL.
                  </p>
                  <div className="text-sm text-blue-700">
                    <strong>Example:</strong> If the CIMD is hosted at{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      https://cimd.dev/oauth/metadata.json
                    </code>{" "}
                    but claims{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      client_uri: &quot;https://client.dev&quot;
                    </code>
                    , the server can detect this mismatch and show appropriate
                    warnings.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Use Cases</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Zap className="w-8 h-8 text-yellow-600" />
                  <h3 className="font-bold text-lg">Model Context Protocol</h3>
                  <p className="text-sm text-gray-600">
                    Connect AI tools and servers without the registration
                    bottleneck. Every MCP client can authenticate dynamically.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <h3 className="font-bold text-lg">Developer Tools</h3>
                  <p className="text-sm text-gray-600">
                    CLI tools, desktop apps, and developer utilities that need
                    OAuth without complex setup flows.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <Database className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-lg">Enterprise Platforms</h3>
                  <p className="text-sm text-gray-600">
                    SaaS platforms with hundreds of integrations that don&apos;t
                    want to manage thousands of client registrations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Learn More */}
          <div className="space-y-6 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold">Learn More</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/"
                target="_blank"
                className="block"
              >
                <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        IETF Draft: OAuth Client ID Metadata Document
                      </span>
                      <ExternalLink className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Read the full technical specification and implementation
                      details.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href="https://stytch.com/blog/oauth-client-id-metadata-mcp/"
                target="_blank"
                className="block"
              >
                <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        Stytch Blog: Building MCP with CIMD
                      </span>
                      <ExternalLink className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Learn about how Stytch implements CIMD in its product
                      suite.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href="https://blog.modelcontextprotocol.io/posts/client_registration/"
                target="_blank"
                className="block"
              >
                <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        MCP Blog: Evolving OAuth Client Registration
                      </span>
                      <ExternalLink className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Discover the motivation behind CIMD from the Model Context
                      Protocol team's perspective.
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
              <Link href="/servers">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Database className="w-4 h-4 mr-2" />
                  Explore CIMD for OAuth Servers
                </Button>
              </Link>
              <Link href="/clients">
                <Button size="lg" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Explore CIMD for OAuth Clients
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
}
