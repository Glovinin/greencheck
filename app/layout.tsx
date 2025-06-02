import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { MobileNav } from '@/components/mobile-nav'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aqua Vista Monchique - Hotel de Luxo na Serra',
  description: 'Experimente momentos únicos no Aqua Vista Monchique, hotel de luxo localizado na Serra de Monchique. Quartos exclusivos, piscina com vista panorâmica e hospitalidade excepcional.',
  keywords: 'hotel monchique, serra monchique, hotel luxo portugal, turismo algarve, hospedagem monchique',
  authors: [{ name: 'Aqua Vista Monchique' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
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
        <meta name="theme-color" content="#4F3621" />
        <meta name="apple-mobile-web-app-title" content="Aqua Vista" />
        <meta name="application-name" content="Aqua Vista Monchique" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <MobileNav />
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
