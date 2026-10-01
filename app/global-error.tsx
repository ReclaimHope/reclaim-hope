"use client";

import Link from "next/link";

/**
 * Last-resort error page when even the root layout fails.
 * Must render its own <html> and <body>.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "32rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#4b5563" }}>
              Reclaim Hope Rwanda ran into a critical error. Please reload the
              page or come back later.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                marginTop: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={reset}
                style={{
                  background: "#f9d20a",
                  color: "#fff",
                  border: 0,
                  borderRadius: "9999px",
                  padding: "0.875rem 2rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <Link
                href="/"
                style={{
                  border: "2px solid #e5e7eb",
                  borderRadius: "9999px",
                  padding: "0.875rem 2rem",
                  fontWeight: 700,
                  color: "#111827",
                  textDecoration: "none",
                }}
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
