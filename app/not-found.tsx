import Link from "next/link";
import { HeartHandshake, House, HandCoins, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page Not Found | Reclaim Hope Rwanda",
  description:
    "The page you are looking for does not exist. Explore how you can still support children in Rwanda.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-16">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-[#f9d20a]/15 text-yellow-600">
          <HeartHandshake className="size-8" />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-600">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          This path leads nowhere, but hope still does.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-gray-600">
          The page you are looking for was moved, renamed, or never existed.
          Let&apos;s get you back to supporting children across Rwanda.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f9d20a] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-yellow-500/25 transition hover:bg-yellow-500 sm:w-auto"
          >
            <House className="size-5" />
            Back to Homepage
          </Link>
          <Link
            href="/sponsor"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-bold text-gray-900 transition hover:border-yellow-400 hover:text-yellow-700 sm:w-auto"
          >
            Sponsor a Child
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-500">
          <Link href="/donate" className="inline-flex items-center gap-1.5 hover:text-yellow-700">
            <HandCoins className="size-4" />
            Donate
          </Link>
          <Link href="/programs" className="hover:text-yellow-700">
            Our Programs
          </Link>
          <Link href="/impact" className="hover:text-yellow-700">
            Our Impact
          </Link>
          <Link href="/contact" className="hover:text-yellow-700">
            Contact Us
          </Link>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="size-3.5" />
          Or use your browser&apos;s back button
        </Link>
      </div>
    </main>
  );
}
