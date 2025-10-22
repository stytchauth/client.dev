import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import {
  ArrowLeft,
  Server,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  Code,
  Database,
  Zap,
  Monitor,
  Network,
  Lock,
} from "lucide-react";
import { CodeBlock } from "@/components/codeblock";

export function LearnContent() {
  return (
    <div className="space-y-12">
      {/* Key Concept */}
      <div className="flex space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex justify-center">
          <Server className="w-6 h-6 text-blue-600 mt-1" />
        </div>
        <div className="flex-1">
          <p className="text-blue-700">
            With CIMD, your authorization server can fetch client metadata
            just-in-time from the client_id URL. In most cases, you don't even
            need a client registry &mdash; just fetch the metadata in real time.
          </p>
        </div>
      </div>

      {/* CIMD Flow */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">CIMD Integration Flow</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Receive OAuth Request</h3>
              <p className="text-sm text-gray-600">
                Client sends authorization request with client_id as HTTPS URL
              </p>
              <div className="mt-2">
                <CodeBlock language="http">{`GET /authorize?client_id=https://client.dev/oauth/metadata.json&...`}</CodeBlock>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">2</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Fetch CIMD Document</h3>
              <p className="text-sm text-gray-600">
                Make HTTPS GET request to client_id URL to retrieve metadata
              </p>
              <div className="mt-2">
                <CodeBlock language="http">{`GET /oauth/metadata.json HTTP/1.1
Host: client.dev
Accept: application/json`}</CodeBlock>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">3</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Validate Schema & Content</h3>
              <p className="text-sm text-gray-600">
                Parse JSON, validate required fields, check redirect URIs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">4</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Enforce Policies</h3>
              <p className="text-sm text-gray-600">
                Apply security rules, rate limits, and organizational policies
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">
                Proceed with OAuth Flow
              </h3>
              <p className="text-sm text-green-700">
                Continue with standard OAuth authorization flow using fetched
                metadata
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Implementation Notes</h2>

        {/* Fetching & Caching */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Fetching & Caching
          </h3>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">HTTPS Only</p>
                    <p className="text-sm text-gray-600">
                      Never fetch metadata over HTTP - reject such client_ids
                      immediately
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Reasonable TTL</p>
                    <p className="text-sm text-gray-600">
                      Cache metadata for 5-15 minutes to balance freshness with
                      performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Respect Cache-Control</p>
                    <p className="text-sm text-gray-600">
                      Honor HTTP caching headers if provided by the client
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Backoff on Failures</p>
                    <p className="text-sm text-gray-600">
                      Implement exponential backoff when metadata fetches fail
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Validation Requirements
          </h3>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Strict JSON Parsing</p>
                    <p className="text-sm text-gray-600">
                      Reject malformed JSON immediately
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Required Fields</p>
                    <p className="text-sm text-gray-600">
                      Ensure <code>client_id</code> matches the fetched URL and{" "}
                      <code>redirect_uris</code> is present
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">URI Validation</p>
                    <p className="text-sm text-gray-600">
                      Validate all URIs are well-formed and use appropriate
                      schemes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Redirect URI Security</p>
                    <p className="text-sm text-gray-600">
                      Enforce HTTPS for redirect URIs and require exact matches
                      (no wildcards)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Handling */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Error Handling
          </h3>
          <Card className="border border-orange-200">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-orange-800">Fetch Failures</p>
                  <p className="text-sm text-gray-600">
                    If metadata fetch fails → return clear OAuth error response
                  </p>
                  <div className="mt-2">
                    <CodeBlock language="json">{`{
  "error": "invalid_client",
  "error_description": "Unable to fetch client metadata from specified URL"
}`}</CodeBlock>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-orange-800">
                    Validation Failures
                  </p>
                  <p className="text-sm text-gray-600">
                    If JSON is invalid or missing required fields → return
                    descriptive error
                  </p>
                  <div className="mt-2">
                    <CodeBlock language="json">{`{
  "error": "invalid_client_metadata",
  "error_description": "Client metadata missing required 'redirect_uris' field"
}`}</CodeBlock>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-orange-800">Retry Strategy</p>
                  <p className="text-sm text-gray-600">
                    Consider implementing a retry window before permanent
                    failure
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Security Considerations</h2>

        <Card className="border border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Critical: SSRF Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700 text-sm">
              Fetching arbitrary URLs creates Server-Side Request Forgery (SSRF)
              risks. Implement these protections:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Network Restrictions</p>
                  <p className="text-sm text-gray-600">
                    Allowlist egress to public IPv4/IPv6 only - block private
                    ranges (10.0.0.0/8, 192.168.0.0/16, 127.0.0.0/8)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">DNS Security</p>
                  <p className="text-sm text-gray-600">
                    Resolve DNS once and pin IP for the request to prevent DNS
                    rebinding attacks
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Request Limits</p>
                  <p className="text-sm text-gray-600">
                    Set tight timeouts (5-10s), limit content length (5KB),
                    restrict redirects (max 3)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Dedicated Proxy</p>
                  <p className="text-sm text-gray-600">
                    Use a separate egress proxy for metadata fetches, isolated
                    from internal networks
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="w-5 h-5 mr-2" />
                Network Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Block link-local addresses (169.254.0.0/16)</p>
              <p>• Reject file:// and other non-HTTP schemes</p>
              <p>• Validate TLS certificates</p>
              <p>• Use modern TLS versions only</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Rate Limiting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Limit metadata fetches per client_id</p>
              <p>• Implement per-IP rate limiting</p>
              <p>• Use exponential backoff on failures</p>
              <p>• Monitor for abuse patterns</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Operational Tips */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Operational Guidelines</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Monitoring & Logging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Log All Fetch Outcomes</p>
                <p className="text-gray-600">
                  Success, failures, validation errors with correlation IDs
                </p>
              </div>
              <div>
                <p className="font-medium">Track Performance Metrics</p>
                <p className="text-gray-600">
                  Response times, cache hit rates, error rates by client_id
                </p>
              </div>
              <div>
                <p className="font-medium">Alert on Anomalies</p>
                <p className="text-gray-600">
                  High failure rates, slow responses, suspicious patterns
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Management Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Manual Refresh</p>
                <p className="text-gray-600">
                  Admin tool to force re-fetch when clients update metadata
                </p>
              </div>
              <div>
                <p className="font-medium">Cache Inspection</p>
                <p className="text-gray-600">
                  View cached metadata and expiration times
                </p>
              </div>
              <div>
                <p className="font-medium">Debugging Support</p>
                <p className="text-gray-600">
                  Trace metadata fetch process for troubleshooting
                </p>
              </div>
              <div>
                <p className="font-medium">Consent Screen Enhancement</p>
                <p className="text-gray-600">
                  Display client_uri on consent screens. Show trust warnings for
                  localhost redirects.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Implementation Example */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Implementation Pseudocode</h2>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              CIMD Processing Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock language="python">{`async def process_cimd_client(client_id_url: str) -> ClientMetadata:
    # 1. Validate URL format
    if not client_id_url.startswith('https://'):
        raise InvalidClientError("client_id must be HTTPS URL")

    # 2. Check cache first
    cached_metadata = cache.get(client_id_url)
    if cached_metadata and not cached_metadata.is_expired():
        return cached_metadata

    # 3. Fetch with security protections
    try:
        # Apply SSRF protections
        validated_url = ssrf_validator.validate(client_id_url)

        # Fetch with timeouts and limits
        response = await http_client.get(
            validated_url,
            timeout=10,
            max_size=5120,  # 5KB limit
            follow_redirects=3
        )

        if response.content_type != 'application/json':
            raise InvalidClientMetadataError("Invalid Content-Type")

    except (TimeoutError, NetworkError) as e:
        # Log failure and return error
        logger.error(f"Failed to fetch CIMD",
                    client_id=client_id_url, error=str(e))
        raise InvalidClientError("Unable to fetch client metadata")

    # 4. Parse and validate JSON
    try:
        metadata = json.loads(response.body)
        validate_cimd_schema(metadata, client_id_url)
    except (JSONDecodeError, ValidationError) as e:
        logger.error(f"Invalid CIMD document",
                    client_id=client_id_url, error=str(e))
        raise InvalidClientMetadataError("Invalid metadata format")

    # 5. Cache and return
    cache.set(client_id_url, metadata, ttl=600)  # 10 minutes
    return ClientMetadata(metadata)

def validate_cimd_schema(metadata: dict, expected_client_id: str):
    # Ensure required fields
    if metadata.get('client_id') != expected_client_id:
        raise ValidationError("client_id mismatch")

    if not metadata.get('redirect_uris'):
        raise ValidationError("Missing redirect_uris")

    # Validate redirect URIs
    for uri in metadata['redirect_uris']:
        if not uri.startswith('https://'):
            raise ValidationError("Redirect URIs must use HTTPS")`}</CodeBlock>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="space-y-6 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold">Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/clients" className="block">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span className="font-semibold">CIMD for Clients</span>
                </div>
                <p className="text-sm text-gray-600">
                  Learn how clients create and host their metadata documents.
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
  );
}
