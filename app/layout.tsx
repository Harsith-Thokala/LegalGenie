import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { DocumentProvider } from "@/lib/document-context"
import { AuthProvider } from "@/lib/auth-context"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

export const metadata: Metadata = {
  title: "LegalGenie V4 - AI-Powered Legal Document Generator",
  description: "Generate professional legal documents instantly with AI. Create contracts, agreements, and legal forms using advanced AI technology. Includes legal chat assistant and document management.",
  keywords: [
    "AI legal documents",
    "legal document generator", 
    "contract generator",
    "legal AI assistant",
    "document automation",
    "legal tech",
    "AI contracts",
    "legal forms",
    "document drafting",
    "legal technology"
  ],
  authors: [{ name: "Harsith Thokala" }],
  creator: "Harsith Thokala",
  publisher: "LegalGenie",
  robots: "index, follow",
  metadataBase: new URL('https://legal-genie-five.vercel.app'),
  
  // Open Graph (OGP) for social media
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://legal-genie-five.vercel.app',
    title: 'LegalGenie V4 - AI-Powered Legal Document Generator',
    description: 'Generate professional legal documents instantly with AI. Create contracts, agreements, and legal forms using advanced AI technology.',
    siteName: 'LegalGenie V4',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LegalGenie V4 - AI Legal Document Generator',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'LegalGenie V4 - AI-Powered Legal Document Generator',
    description: 'Generate professional legal documents instantly with AI. Create contracts, agreements, and legal forms using advanced AI technology.',
    images: ['/og-image.png'],
    creator: '@HarsithThokala',
  },

  // Additional SEO
  category: 'Legal Technology',
  classification: 'AI Legal Document Generator',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
    { media: '(prefers-color-scheme: dark)', color: '#A855F7' },
  ],

  // App-specific
  applicationName: 'LegalGenie V4',
  generator: 'Next.js 15',
  
  // Verification (add these if you have them)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   yahoo: 'your-yahoo-verification-code',
  // },

  // Alternate languages (if you add i18n later)
  // alternates: {
  //   canonical: 'https://legal-genie-five.vercel.app',
  //   languages: {
  //     'en-US': 'https://legal-genie-five.vercel.app',
  //   },
  // },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "LegalGenie V4",
              "description": "AI-powered legal document generator with chat assistant",
              "url": "https://legal-genie-five.vercel.app",
              "applicationCategory": "LegalTech",
              "operatingSystem": "Any",
              "author": {
                "@type": "Person",
                "name": "Harsith Thokala",
                "url": "https://github.com/Harsith-Thokala"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "AI Document Generation",
                "Legal Chat Assistant", 
                "Document Management",
                "Folder Organization",
                "User Authentication",
                "PDF/TXT Export"
              ],
              "screenshot": "https://legal-genie-five.vercel.app/og-image.png"
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <DocumentProvider>
            <Navigation />
            <main className="min-h-screen bg-background">{children}</main>
          </DocumentProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
