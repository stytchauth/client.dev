import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: {
    default: 'CIMD - OAuth Client ID Metadata Documents',
    template: '%s | CIMD'
  },
  description: 'Learn about Client ID Metadata Documents (CIMD) - a new OAuth approach that lets clients identify themselves using URLs instead of preregistration. Presented by Stytch.',
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
    url: 'https://client.dev',
    siteName: 'CIMD',
    title: 'CIMD - OAuth Client ID Metadata Documents',
    description: 'Learn about Client ID Metadata Documents (CIMD) - a new OAuth approach that lets clients identify themselves using URLs instead of preregistration. Presented by Stytch.',
    images: [
      {
        url: 'https://client.dev/og',
        width: 1200,
        height: 630,
        alt: 'CIMD - OAuth Client ID Metadata Documents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIMD - OAuth Client ID Metadata Documents',
    description: 'Learn about Client ID Metadata Documents (CIMD) - a new OAuth approach that lets clients identify themselves using URLs instead of preregistration. Presented by Stytch.',
    images: ['https://client.dev/og'],
    creator: '@stytchauth',
  },
  alternates: {
    canonical: 'https://client.dev',
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
