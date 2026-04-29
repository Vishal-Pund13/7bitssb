import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/layout/Providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'SSB Research Journal — Defence Analysis & Strategy',
    template: '%s | SSB Research Journal',
  },
  description:
    'A curated research journal for SSB aspirants — combining strategic analysis, defence studies, and geopolitical insights to build comprehensive officer-grade thinking.',
  keywords: ['SSB', 'defence', 'geopolitics', 'strategy', 'India', 'armed forces', 'UPSC', 'GD topics'],
  authors: [{ name: 'SSB Research Journal' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'SSB Research Journal',
    title: 'SSB Research Journal — Defence Analysis & Strategy',
    description: 'Research-grade defence and geopolitics analysis for serious SSB aspirants.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSB Research Journal',
    description: 'Research-grade defence and geopolitics analysis for SSB aspirants.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
