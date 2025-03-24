
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { NextIntlClientProvider } from 'next-intl'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aqua Vista Hotel',
  description: 'Luxo à beira-mar para momentos inesquecíveis',
}

export function generateStaticParams() {
  return [{ locale: 'pt-BR' }, { locale: 'en' }];
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  // Carregar mensagens para o idioma atual
  let messages;
  try {
    messages = (await import(`../src/messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../src/messages/pt-BR.json`)).default;
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
