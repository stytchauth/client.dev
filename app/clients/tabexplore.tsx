import { useState } from "react";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Textarea } from "@/components/textarea";
import {
  Search,
  CheckCircle,
  Code,
  AlertCircle,
  Copy,
  Play,
} from "lucide-react";
import { CodeBlock } from "@/components/codeblock";
import {
  validateCIMDDocument,
  generateTextReport,
  ValidationResult,
} from "./utils";

export function ExploreContent() {
  const [inputType, setInputType] = useState<"url" | "json">("url");
  const [inputValue, setInputValue] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateInput = async () => {
    if (!inputValue.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      let metadata: any;
      let sourceUrl: string | null = null;

      if (inputType === "url") {
        sourceUrl = inputValue.trim();

        // Basic URL validation
        if (!sourceUrl.startsWith("https://")) {
          setValidationResult({
            valid: false,
            errors: [
              {
                path: "client_id",
                message: "Client ID must be an HTTPS URL",
                severity: "error",
              },
            ],
            warnings: [],
          });
          setIsValidating(false);
          return;
        }

        // Frontend-only fetch for security
        try {
          const response = await fetch("/cimd-proxy", {
            method: "POST",
            body: JSON.stringify({ cimd: sourceUrl }),
          });
          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}: Failed to fetch metadata`,
            );
          }

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            setValidationResult({
              valid: false,
              errors: [
                {
                  path: "content-type",
                  message: `Server returned Content-Type: ${contentType || "unknown"}, expected: application/json`,
                  severity: "error",
                },
              ],
              warnings: [],
            });
            setIsValidating(false);
            return;
          }

          metadata = await response.json();
        } catch (error) {
          setValidationResult({
            valid: false,
            errors: [
              {
                path: "fetch",
                message: `Unable to fetch metadata: ${error instanceof Error ? error.message : "Unknown error"}`,
                severity: "error",
              },
            ],
            warnings: [],
          });
          setIsValidating(false);
          return;
        }
      } else {
        // JSON input
        try {
          metadata = JSON.parse(inputValue);
        } catch {
          setValidationResult({
            valid: false,
            errors: [
              {
                path: "json",
                message: "Invalid JSON format",
                severity: "error",
              },
            ],
            warnings: [],
          });
          setIsValidating(false);
          return;
        }
      }

      // Validate the metadata
      const result = await validateCIMDDocument(metadata, sourceUrl);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: [
          {
            path: "general",
            message: `Validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            severity: "error",
          },
        ],
        warnings: [],
      });
    }

    setIsValidating(false);
  };

  const copyReport = () => {
    if (!validationResult) return;

    const report = generateTextReport(validationResult, inputType);
    navigator.clipboard.writeText(report);
  };

  return (
    <div className="space-y-8">
      {/* CIMD Debugger */}
      <div className="space-y-6">
        <div className="flex space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex justify-center">
            <Search className="w-6 h-6 text-blue-600 mt-1" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 mb-2">CIMD Validator</h3>
            <p className="text-blue-700">
              Validate that your Client ID Metadata Document is well-formed and
              production-ready. Paste a client_id URL or raw JSON to get
              detailed validation feedback.
            </p>
          </div>
        </div>

        {/* Input Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Input Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode Selector */}
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  checked={inputType === "url"}
                  onChange={() => {
                    setInputType("url");
                    setValidationResult(null);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Client ID URL</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="inputMode"
                  checked={inputType === "json"}
                  onChange={() => {
                    setInputType("json");
                    setValidationResult(null);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Raw JSON</span>
              </label>
            </div>

            <div className="space-y-3">
              {inputType === "url" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Client ID URL (HTTPS required)
                  </label>
                  <input
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://client.dev/oauth/metadata.json"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Raw JSON Document
                  </label>
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={JSON.stringify(
                      {
                        client_id: "https://client.dev/oauth/metadata.json",
                        client_name: "client.dev",
                        client_uri: "https://client.dev",
                        redirect_uris: ["https://client.dev/oauth/callback"],
                        grant_types: ["authorization_code"],
                        response_types: ["code"],
                        token_endpoint_auth_method: "none",
                      },
                      null,
                      2,
                    )}
                    className="w-full min-h-[200px] font-mono text-sm"
                  />
                </div>
              )}

              <Button
                onClick={validateInput}
                disabled={isValidating || !inputValue.trim()}
                className="w-full"
              >
                {isValidating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Validating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Validate Document</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Validation Results */}
        {validationResult && (
          <Card
            className={
              validationResult.valid
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          >
            <CardHeader>
              <CardTitle
                className={`flex items-center ${validationResult.valid ? "text-green-800" : "text-red-800"}`}
              >
                {validationResult.valid ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Validation Passed
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Validation Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationResult.valid ? (
                <p className="text-green-700 text-sm">
                  ✓ Your CIMD document is well-formed and production-ready!
                </p>
              ) : (
                <p className="text-red-700 text-sm">
                  ✗ Your document has issues that need to be resolved.
                </p>
              )}

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800">Errors:</h4>
                  <div className="space-y-2">
                    {validationResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="bg-white border border-red-200 rounded p-3"
                      >
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <code className="text-sm font-mono bg-red-100 px-1 rounded">
                              {error.path}
                            </code>
                            <p className="text-sm text-red-700 mt-1">
                              {error.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-800">Warnings:</h4>
                  <div className="space-y-2">
                    {validationResult.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="bg-white border border-orange-200 rounded p-3"
                      >
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <code className="text-sm font-mono bg-orange-100 px-1 rounded">
                              {warning.path}
                            </code>
                            <p className="text-sm text-orange-700 mt-1">
                              {warning.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pretty-printed metadata */}
              {validationResult.metadata && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Parsed Metadata:</h4>
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <CodeBlock language="json">
                        {JSON.stringify(validationResult.metadata, null, 2)}
                      </CodeBlock>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Copy Report */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Document size:{" "}
                  {validationResult.metadata
                    ? `${(JSON.stringify(validationResult.metadata).length / 1024).toFixed(1)}KB`
                    : "Unknown"}
                </div>
                <Button onClick={copyReport} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
