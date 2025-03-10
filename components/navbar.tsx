"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const languages = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'it', name: 'Italiano' },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [currentLang, setCurrentLang] = useState('pt-BR')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode)
    // Aqui você pode adicionar lógica adicional de mudança de idioma se necessário
  }

  const handleReservar = () => {
    router.push('/booking')
  }

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-center">
      <div className={`
        mx-auto my-3 h-12 rounded-full flex items-center justify-between px-5
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'bg-black/70 backdrop-blur-lg border border-white/10 w-[75%]' 
          : 'bg-transparent w-[95%]'
        }
      `}>
        {/* Logo - Visível em todas as telas */}
        <Link href="/" className="flex items-center">
          <span className="text-lg font-semibold text-white">
            Aqua Vista
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-white/90 hover:text-white transition-colors text-[13px] font-medium px-1"
          >
            Início
          </Link>
          <Link 
            href="/rooms" 
            className="text-white/90 hover:text-white transition-colors text-[13px] font-medium px-1"
          >
            Quartos
          </Link>
          <Link 
            href="/restaurante" 
            className="text-white/90 hover:text-white transition-colors text-[13px] font-medium px-1"
          >
            Restaurante
          </Link>
          <Link 
            href="/eventos" 
            className="text-white/90 hover:text-white transition-colors text-[13px] font-medium px-1"
          >
            Eventos
          </Link>
          <Link 
            href="/contato" 
            className="text-white/90 hover:text-white transition-colors text-[13px] font-medium px-1"
          >
            Contato
          </Link>
        </div>

        {/* Right Side - Adaptado para Mobile e Desktop */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/90 text-[13px] font-medium h-8 px-2 md:px-3"
            onClick={handleReservar}
          >
            Reservar
          </Button>
          <div className="hidden md:block mx-2 w-px h-3.5 bg-white/20" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-white/90 h-8 w-8"
              >
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-[150px] bg-black/90 backdrop-blur-lg border-white/10 max-h-[300px] overflow-y-auto"
            >
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={`
                    text-[13px] text-white/90 hover:text-white focus:text-white
                    ${currentLang === lang.code ? 'bg-white/10' : ''}
                  `}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}