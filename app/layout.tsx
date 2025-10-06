import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '../components/ui/toaster'
import { MobileNav } from '../components/mobile-nav'
import InitialLoading from '../components/initial-loading'
import { LoadingProvider } from '../contexts/loading-context'
import MainContent from '../components/main-content'

const inter = Inter({ subsets: ['latin'] })

// Metadata para GreenCheck
export const metadata: Metadata = {
  keywords: 'ESG certificação, sustentabilidade, blockchain, inteligência artificial, validação científica, carbono offset, marketplace sustentável',
  authors: [{ name: 'GreenCheck' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
    // Evitar que o browser hide/show a UI durante scroll
    interactiveWidget: 'resizes-content',
    // Altura estável
    height: 'device-height'
  },
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '32x32'
      },
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '16x16'
      }
    ],
    shortcut: [
      {
        url: '/favicon.png',
        type: 'image/png'
      }
    ],
    apple: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '180x180'
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.png',
        color: '#059669'
      }
    ]
  },
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://greencheck.replit.app'),
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'GreenCheck',
    'application-name': 'GreenCheck',
    'msapplication-TileColor': '#34C759',
    'format-detection': 'telephone=no'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-title" content="GreenCheck" />
        <meta name="application-name" content="GreenCheck" />
        
        {/* Preload crítico para otimizar carregamento inicial */}
        <link rel="preload" href="/favicon.png" as="image" type="image/png" />
        <link rel="preconnect" href="https://my.spline.design" />
        <link rel="dns-prefetch" href="https://my.spline.design" />
        
        {/* Estilo inline para evitar flash escuro */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: #f8fafc !important;
              background: linear-gradient(to bottom right, #f8fafc, #f1f5f9) !important;
            }
          `
        }} />
        {/* Links de favicon para máxima compatibilidade */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="mask-icon" href="/favicon.png" color="#059669" />
        {/* Meta tags sociais adicionais para máxima compatibilidade */}
        <meta property="og:image" content="/socialbanner.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="GreenCheck - Automated ESG Certification" />
        <meta name="twitter:image" content="/socialbanner.jpg" />
        <meta name="twitter:image:alt" content="GreenCheck - Automated ESG Certification" />
      </head>
      <body 
        className={`${inter.className} overflow-x-hidden bg-gradient-to-br from-slate-50 to-gray-100`}
        style={{ 
          backgroundColor: '#f8fafc', // slate-50 como fallback
          background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)' // from-slate-50 to-gray-100
        }}
      >
        <LoadingProvider>
          <InitialLoading />
          <MainContent>
            {children}
            <MobileNav />
            <Toaster />
          </MainContent>
        </LoadingProvider>
      </body>
    </html>
  )
}
