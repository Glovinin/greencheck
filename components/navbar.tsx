"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Globe, User, Moon, Sun, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { Logo } from "./logo"

const languages = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'it', name: 'Italiano' },
]

// Itens principais de navegação (sempre visíveis em desktop)
const primaryNavItems = [
  { href: "/", label: "Início" },
  { href: "/rooms", label: "Quartos" },
  { href: "/gallery", label: "Galeria" },
]

// Itens secundários (agrupados em dropdown em telas menores)
const secondaryNavItems = [
  { href: "/restaurante", label: "Restaurante" },
  { href: "/eventos", label: "Eventos" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/contato", label: "Contato" },
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
        mx-auto my-3 h-12 rounded-full flex items-center justify-between px-3 sm:px-4 lg:px-5
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? isDark
            ? 'bg-[#4F3621]/80 backdrop-blur-lg border border-[#EED5B9]/20 w-[96%] sm:w-[94%] md:w-[88%] lg:w-[82%] xl:w-[76%]'
            : 'bg-[#EED5B9]/90 backdrop-blur-lg border border-[#4F3621]/20 w-[96%] sm:w-[94%] md:w-[88%] lg:w-[82%] xl:w-[76%]'
          : 'bg-transparent w-[98%] sm:w-[96%] md:w-[92%] lg:w-[88%] xl:w-[95%]'
        }
      `}>
        {/* Logo - Responsivo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Logo 
            width={160} 
            height={21} 
            priority={true}
            className="transition-all duration-300 hover:opacity-80 sm:w-[130px] sm:h-[22px] lg:w-[140px] lg:h-[24px]"
          />
        </Link>

        {/* Desktop Navigation - Visível apenas em telas grandes (xl:) */}
        <div className="hidden xl:flex items-center space-x-6">
          {primaryNavItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`${isDark ? 'text-[#EED5B9]/90 hover:text-[#EED5B9]' : 'text-[#4F3621]/90 hover:text-[#4F3621]'} transition-colors text-[13px] font-medium px-1 ${pathname === item.href ? (isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]') : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {secondaryNavItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`${isDark ? 'text-[#EED5B9]/90 hover:text-[#EED5B9]' : 'text-[#4F3621]/90 hover:text-[#4F3621]'} transition-colors text-[13px] font-medium px-1 ${pathname === item.href ? (isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]') : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Medium Screen Navigation - Visível em telas médias (lg: até xl:) */}
        <div className="hidden lg:flex xl:hidden items-center space-x-4">
          {primaryNavItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`${isDark ? 'text-[#EED5B9]/90 hover:text-[#EED5B9]' : 'text-[#4F3621]/90 hover:text-[#4F3621]'} transition-colors text-[12px] font-medium px-1 ${pathname === item.href ? (isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]') : ''}`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Dropdown para itens secundários */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`${isDark ? 'text-[#EED5B9]/90 hover:text-[#EED5B9] hover:bg-[#EED5B9]/10' : 'text-[#4F3621]/90 hover:text-[#4F3621] hover:bg-[#4F3621]/10'} text-[12px] font-medium h-8 px-2 flex items-center gap-1`}
              >
                Mais <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className={`w-[160px] ${isDark 
                ? 'bg-[#4F3621]/90 backdrop-blur-lg border-[#EED5B9]/20' 
                : 'bg-[#EED5B9]/90 backdrop-blur-lg border-[#4F3621]/20'}`}
            >
              {secondaryNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link 
                    href={item.href}
                    className={`text-[13px] ${isDark 
                      ? 'text-[#EED5B9]/90 hover:text-[#EED5B9] focus:text-[#EED5B9]' 
                      : 'text-[#4F3621]/90 hover:text-[#4F3621] focus:text-[#4F3621]'} ${pathname === item.href ? (isDark ? 'bg-[#EED5B9]/10' : 'bg-[#4F3621]/10') : ''}`}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side - Adaptado para todas as telas */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
          {/* Botão Reservar - Visível em todas as telas */}
          <Button 
            variant="ghost" 
            className={`${isDark ? 'text-[#EED5B9] hover:text-[#EED5B9]/90 hover:bg-[#EED5B9]/10' : 'text-[#4F3621] hover:text-[#4F3621]/90 hover:bg-[#4F3621]/10'} text-[11px] sm:text-[12px] lg:text-[13px] font-medium h-7 sm:h-8 px-2 sm:px-3`}
            onClick={handleReservar}
          >
            <span className="hidden sm:inline">Reservar</span>
            <span className="sm:hidden">Reserva</span>
          </Button>
          
          {/* Linha divisória */}
          <div className={`w-px h-3 sm:h-3.5 ${isDark ? 'bg-[#EED5B9]/20' : 'bg-[#4F3621]/20'}`} />
          
          {/* Botão de Tema */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isDark ? 'text-[#EED5B9] hover:text-[#EED5B9]/90 hover:bg-[#EED5B9]/10' : 'text-[#4F3621] hover:text-[#4F3621]/90 hover:bg-[#4F3621]/10'} h-7 w-7 sm:h-8 sm:w-8`}
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {isDark ? (
              <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
          
          {/* Dropdown de Idiomas - Visível em todas as telas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${isDark ? 'text-[#EED5B9] hover:text-[#EED5B9]/90 hover:bg-[#EED5B9]/10' : 'text-[#4F3621] hover:text-[#4F3621]/90 hover:bg-[#4F3621]/10'} h-7 w-7 sm:h-8 sm:w-8`}
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className={`w-[140px] sm:w-[150px] ${isDark 
                ? 'bg-[#4F3621]/90 backdrop-blur-lg border-[#EED5B9]/20' 
                : 'bg-[#EED5B9]/90 backdrop-blur-lg border-[#4F3621]/20'} max-h-[300px] overflow-y-auto`}
            >
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={`
                    text-[12px] sm:text-[13px] ${isDark 
                      ? 'text-[#EED5B9]/90 hover:text-[#EED5B9] focus:text-[#EED5B9]' 
                      : 'text-[#4F3621]/90 hover:text-[#4F3621] focus:text-[#4F3621]'}
                    ${currentLang === lang.code 
                      ? isDark ? 'bg-[#EED5B9]/10' : 'bg-[#4F3621]/10'
                      : ''}
                  `}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Botão de Admin Login - Visível em todas as telas */}
          <Link href="/admin/login">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${isDark ? 'text-[#EED5B9] hover:text-[#EED5B9]/90 hover:bg-[#EED5B9]/10' : 'text-[#4F3621] hover:text-[#4F3621]/90 hover:bg-[#4F3621]/10'} h-7 w-7 sm:h-8 sm:w-8`}
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}