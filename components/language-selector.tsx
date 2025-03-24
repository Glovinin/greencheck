
"use client"

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'pt-BR', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'nl', label: 'Nederlands' }
]

export function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const handleLanguageChange = (langCode: string) => {
    // Obtém o caminho atual sem o prefixo de idioma
    const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '') || '/'
    
    // Navega para o mesmo caminho, mas com o novo idioma
    router.push(`/${langCode}${pathWithoutLocale}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Mudar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`cursor-pointer ${locale === lang.code ? 'bg-primary/10' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
