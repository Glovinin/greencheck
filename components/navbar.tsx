"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Globe, User, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from "next-themes"
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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <nav className="fixed top-0 w-full z-[100] flex items-center justify-center">
      <div className={`
        mx-auto my-3 h-12 rounded-full flex items-center justify-between px-5
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? isDark
            ? 'bg-black/70 backdrop-blur-lg border border-white/10 md:w-[76%] w-[94%]'
            : 'bg-white/70 backdrop-blur-lg border border-black/10 md:w-[76%] w-[94%]'
          : 'bg-transparent md:w-[95%] w-[98%]'
        }
      `}>
        {/* Logo - Visível em todas as telas */}
        <Link href="/" className="flex items-center">
          <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Aqua Vista
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className={`${isDark ? 'text-white/90 hover:text-white' : 'text-gray-800/90 hover:text-gray-900'} transition-colors text-[13px] font-medium px-1`}
          >
            Início
          </Link>
          <Link 
            href="/rooms" 
            className={`${isDark ? 'text-white/90 hover:text-white' : 'text-gray-800/90 hover:text-gray-900'} transition-colors text-[13px] font-medium px-1`}
          >
            Quartos
          </Link>
          <Link 
            href="/restaurante" 
            className={`${isDark ? 'text-white/90 hover:text-white' : 'text-gray-800/90 hover:text-gray-900'} transition-colors text-[13px] font-medium px-1`}
          >
            Restaurante
          </Link>
          <Link 
            href="/eventos" 
            className={`${isDark ? 'text-white/90 hover:text-white' : 'text-gray-800/90 hover:text-gray-900'} transition-colors text-[13px] font-medium px-1`}
          >
            Eventos
          </Link>
          <Link 
            href="/sobre" 
            className={`${isDark ? 'text-white/90 hover:text-white' : 'text-gray-800/90 hover:text-gray-900'} transition-colors text-[13px] font-medium px-1`}
          >
            Sobre Nós
          </Link>
          <Link 
            href="/contato" 
            className={`${isDark ? 'text-white/90 hover:text-white' : 'text-gray-800/90 hover:text-gray-900'} transition-colors text-[13px] font-medium px-1`}
          >
            Contato
          </Link>
        </div>

        {/* Right Side - Adaptado para Mobile e Desktop */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost" 
            className={`${isDark ? 'text-white hover:text-white/90' : 'text-gray-900 hover:text-gray-900/90'} text-[13px] font-medium h-8 px-2 md:px-3`}
            onClick={handleReservar}
          >
            Reservar
          </Button>
          {/* Linha divisória - visível em Desktop e Mobile */}
          <div className={`mx-1.5 md:mx-2 w-px h-3 md:h-3.5 ${isDark ? 'bg-white/20' : 'bg-gray-400/20'}`} />
          
          {/* Botão de Tema */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isDark ? 'text-white hover:text-white/90' : 'text-gray-900 hover:text-gray-700'} h-8 w-8`}
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${isDark ? 'text-white hover:text-white/90' : 'text-gray-900 hover:text-gray-700'} h-8 w-8`}
              >
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className={`w-[150px] ${isDark 
                ? 'bg-black/90 backdrop-blur-lg border-white/10' 
                : 'bg-white/90 backdrop-blur-lg border-gray-200'} max-h-[300px] overflow-y-auto`}
            >
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={`
                    text-[13px] ${isDark 
                      ? 'text-white/90 hover:text-white focus:text-white' 
                      : 'text-gray-700 hover:text-gray-900 focus:text-gray-900'}
                    ${currentLang === lang.code 
                      ? isDark ? 'bg-white/10' : 'bg-gray-200/80'
                      : ''}
                  `}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Botão de Admin Login */}
          <Link href="/admin/login">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isDark ? 'text-white hover:text-white/90' : 'text-gray-900 hover:text-gray-700'} h-8 w-8`}
            >
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}