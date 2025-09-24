import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Footer } from '@/components/ui/footer'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    default: 'CIMD - Client ID Metadata Documents',
    template: '%s | CIMD'
  },
  description: 'Learn about Client ID Metadata Documents (CIMD) - a new OAuth approach that lets clients identify themselves using URLs instead of preregistration. Built by Stytch.',
  keywords: ['OAuth', 'CIMD', 'Client ID Metadata Documents', 'OAuth client registration', 'MCP', 'Model Context Protocol', 'Stytch', 'authentication'],
  authors: [{ name: 'Stytch' }],
  creator: 'Stytch',
  publisher: 'Stytch',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cimd.dev',
    siteName: 'CIMD',
    title: 'CIMD - Client ID Metadata Documents',
    description: 'Learn about Client ID Metadata Documents (CIMD) - a new OAuth approach that lets clients identify themselves using URLs instead of preregistration. Built by Stytch.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'CIMD - Client ID Metadata Documents for OAuth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIMD - Client ID Metadata Documents',
    description: 'Learn about Client ID Metadata Documents (CIMD) - a new OAuth approach that lets clients identify themselves using URLs instead of preregistration. Built by Stytch.',
    images: ['/opengraph-image.png'],
    creator: '@stytch',
  },
  alternates: {
    canonical: 'https://cimd.dev',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-mono">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
