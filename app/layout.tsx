import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import AOSInit from "@/components/AOSInit";
import ConditionalNavFooter from "@/components/ConditionalNavFooter";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reclaim Hope Rwanda | Empowering Children Through Education & Care",
  description: "Join Reclaim Hope Rwanda in transforming lives through education, mentorship, and community support. Help underserved children in Rwanda build brighter futures through our comprehensive programs.",
  keywords: ["Rwanda", "education", "children", "mentorship", "community support", "NGO", "charity", "donate", "sponsor child", "empowerment"],
  authors: [{ name: "Reclaim Hope Rwanda" }],
  creator: "Reclaim Hope Rwanda",
  publisher: "Reclaim Hope Rwanda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://reclaimhope.rw'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Reclaim Hope Rwanda | Empowering Children Through Education & Care",
    description: "Join Reclaim Hope Rwanda in transforming lives through education, mentorship, and community support. Help underserved children in Rwanda build brighter futures.",
    url: 'https://reclaimhope.rw',
    siteName: 'Reclaim Hope Rwanda',
    images: [
      {
        url: '/hero-img.jpg',
        width: 1200,
        height: 630,
        alt: 'Reclaim Hope Rwanda - Empowering Children Through Education',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Reclaim Hope Rwanda | Empowering Children Through Education & Care",
    description: "Join Reclaim Hope Rwanda in transforming lives through education, mentorship, and community support.",
    images: ['/hero-img.jpg'],
    creator: '@reclaimhope',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "Reclaim Hope Rwanda",
    "description": "Reclaim Hope Rwanda supports underserved children and communities through education, mentorship, nutrition, and empowerment programs.",
    "url": "https://reclaimhope.rw",
    "logo": "https://reclaimhope.rw/logo.png",
    "sameAs": [
      "https://facebook.com/reclaimhope",
      "https://twitter.com/reclaimhope",
      "https://instagram.com/reclaimhope",
      "https://linkedin.com/company/reclaimhope"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kigali",
      "addressCountry": "RW"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+250-7XX-XXX-XXX",
      "contactType": "customer service",
      "email": "info@reclaimhope.org"
    },
    "foundingDate": "2024",
    "areaServed": "Rwanda",
    "cause": [
      {
        "@type": "Thing",
        "name": "Education"
      },
      {
        "@type": "Thing",
        "name": "Child Welfare"
      },
      {
        "@type": "Thing",
        "name": "Community Development"
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AOSInit />
        <ConditionalNavFooter>
          {children}
        </ConditionalNavFooter>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
