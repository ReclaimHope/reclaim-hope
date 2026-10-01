"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert, House, RotateCcw, Mail } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-16">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <TriangleAlert className="size-8" />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-500">
          Something went wrong
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Hope is resilient. So is this page.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-gray-600">
          An unexpected error stopped this page from loading. Your data is
          safe &mdash; try again, or head back home.
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <p className="mx-auto mt-4 max-w-lg break-all rounded-xl bg-gray-50 p-3 font-mono text-xs text-gray-500">
            {error.message}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#f9d20a] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-yellow-500/25 transition hover:bg-yellow-500 sm:w-auto"
          >
            <RotateCcw className="size-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-bold text-gray-900 transition hover:border-yellow-400 hover:text-yellow-700 sm:w-auto"
          >
            <House className="size-5" />
            Back to Homepage
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Still stuck?{" "}
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 font-semibold text-yellow-700 hover:underline"
          >
            <Mail className="size-4" />
            Contact our team
          </Link>
        </p>
      </div>
    </main>
  );
}
