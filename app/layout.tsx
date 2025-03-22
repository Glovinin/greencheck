import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from '../components/ui/toaster'
import { MobileNav } from '../components/mobile-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aqua Vista Monchique - Luxury Hotel in Portugal',
  description: 'Experience luxury and tranquility at Aqua Vista Monchique, a premium hotel nestled in the beautiful mountains of Monchique, Portugal.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <MobileNav />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}