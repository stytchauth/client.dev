import {ImageResponse} from 'next/og'

export async function GET() {
    return new ImageResponse(
        (<div style={{
                fontSize: "48px",
                fontWeight: "bold",
                background: "rgb(178,214,222)",
                color: "#333",
                width: "1200px",
                height: "630px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                padding: "48px",
            }}>
                <span style={{ fontSize: "68px", fontWeight: "bold" }}>👾 Client ID Metadata Documents</span>
                <div style={{ height: "68px" }} />
                <span style={{ fontSize: "48px", fontWeight: "bold" }}>Let OAuth clients identify themselves with a URL.</span>
                <span style={{ fontSize: "48px", fontWeight: "bold" }}>No preregistration, less friction, more flexibility.</span>
                <div style={{ height: "128px" }} />
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg 
                        fill="none" 
                        viewBox="0 0 15 18"
                        style={{ width: "30px", height: "36px" }}
                    >
                        <path
                        d="M6.90909 8.38462V0.846155H4.15599V3.98521C4.15599 4.81364 3.48442 5.48521 2.65599 5.48521H0.852273V8.38462H4.25348H6.90909Z"
                        fill="#1F2221"
                        />
                        <path
                        d="M8.09091 8.38462V0.846155H10.844V3.98521C10.844 4.81364 11.5156 5.48521 12.344 5.48521H14.1477V8.38462H10.7465H8.09091Z"
                        fill="#1F2221"
                        />
                        <path
                        d="M6.90909 9.61538V17.1538H4.15599V14.0148C4.15599 13.1864 3.48442 12.5148 2.65599 12.5148H0.852273V9.61538H4.25348H6.90909Z"
                        fill="#1F2221"
                        />
                        <path
                        d="M8.09091 9.61538V17.1538H10.844V14.0148C10.844 13.1864 11.5156 12.5148 12.344 12.5148H14.1477V9.61538H10.7465H8.09091Z"
                        fill="#1F2221"
                        />
                    </svg>

                    <span style={{ fontSize: "32px", fontWeight: "bold" }}>Presented by Stytch</span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}