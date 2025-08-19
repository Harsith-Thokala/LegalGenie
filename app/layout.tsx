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
  title: "LegalGenie - AI-Powered Legal Document Drafting",
  description: "Professional legal document generation powered by AI",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
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
