"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Globe, User, ChevronDown, Upload, Languages } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"

// Main navigation items (always visible on desktop)
const primaryNavItems = [
  { href: "/", label: "Home" },
  { href: "/validacao", label: "Validation" },
  { href: "/marketplace", label: "Marketplace" },
]

// Secondary items (grouped in dropdown on smaller screens)
const secondaryNavItems = [
  { href: "/sobre", label: "About" },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOutOfHero, setIsOutOfHero] = useState(false)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [logoTransitionActive, setLogoTransitionActive] = useState(false)

  // Breakpoints responsivos
  const breakpoints = {
    isXs: viewport.width < 380,
    isMobile: viewport.width < 768,
    isTablet: viewport.width >= 768 && viewport.width < 1024,
    isDesktop: viewport.width >= 1024
  }

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
    
    // Definir viewport inicial
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    updateViewport()
    window.addEventListener('resize', updateViewport)
    
    // Listener para sincronizar com a transição da logo do initial-loading
    const handleLogoTransition = () => {
      console.log('🎯 Navbar detectou início da transição da logo')
      setLogoTransitionActive(true)
    }
    
    window.addEventListener('logo-transition-start', handleLogoTransition)
    
    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('logo-transition-start', handleLogoTransition)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // ULTRA CEDO: Mesmo ponto do mobile nav
      const heroTransitionPoint = window.innerHeight * 0.2 // 20% = bem no início
      
      setIsScrolled(scrollY > 20)
      
      // ULTRA RÁPIDO: Muda logo no início do scroll - sincronizado
      setIsOutOfHero(scrollY > heroTransitionPoint)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleIniciarUpload = () => {
    router.push('/validacao')
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  // Estilos harmoniosos - totalmente transparente no topo, ilha quando rola
  const navStyles = {
    // No topo: sem fundo/borda, full width | Com scroll: ilha com fundo
    container: !isScrolled 
      ? 'bg-transparent border-transparent w-full' 
      : 'bg-white/95 border-gray-200/50 shadow-2xl shadow-black/10 w-[94%] sm:w-[90%] md:w-[84%] lg:w-[78%] xl:w-[72%]',
    
    // No topo: texto branco sobre hero | Com scroll: texto escuro sobre ilha clara
    textColor: !isScrolled ? 'text-white' : 'text-[#044050]',
    textColorSecondary: !isScrolled ? 'text-white/80' : 'text-[#044050]/70',
    hoverColor: !isScrolled ? 'hover:text-white' : 'hover:text-[#5FA037]',
    
    // Botão se adapta ao contexto
    buttonBg: !isScrolled 
      ? 'bg-[#5FA037] text-white hover:bg-[#4d8c2d] hover:shadow-[#5FA037]/30' 
      : 'bg-[#5FA037] text-white hover:bg-[#4d8c2d] hover:shadow-[#5FA037]/30',
    buttonIconColor: 'group-hover:opacity-80',
    
    // Ícones se adaptam
    iconHover: !isScrolled 
      ? 'text-white/80 hover:text-white hover:bg-white/10' 
      : 'text-[#044050]/70 hover:text-[#5FA037] hover:bg-[#5FA037]/10',
    
    // Dropdown se adapta
    dropdownBg: !isScrolled 
      ? 'bg-[#044050]/95 border-white/20 shadow-black/20' 
      : 'bg-white/95 border-gray-200/50 shadow-black/10',
    dropdownItem: !isScrolled 
      ? 'text-white/90 hover:bg-white/10 focus:bg-white/10' 
      : 'text-[#044050]/90 hover:bg-[#5FA037]/10 focus:bg-[#5FA037]/10'
  }

  return (
    <motion.nav 
      className="fixed top-0 w-full z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <div 
        className={`
          mx-auto flex items-center justify-between border
          ${!isScrolled 
            ? 'rounded-none backdrop-blur-sm' 
            : 'rounded-full backdrop-blur-xl'
          }
          ${breakpoints.isMobile 
            ? !isScrolled ? 'my-0 h-16 px-4' : 'my-2 h-14 px-3'
            : !isScrolled ? 'my-0 h-20 px-8' : 'my-3 h-[72px] px-4 sm:px-6 lg:px-8'
          }
          ${navStyles.container}
        `}
        style={{
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Logo - Responsivo */}
        <div>
          <Link href="/" className={`flex items-center flex-shrink-0 group transition-all duration-500 ${
            !isScrolled ? 'gap-4' : 'gap-3'
          }`}>
            {/* Logo Image */}
            <div className="relative">
              <Image
                src="/favicon.png"
                alt="GreenCheck Logo"
                width={
                  breakpoints.isXs
                    ? (!isScrolled ? 36 : 32)
                    : breakpoints.isMobile 
                    ? (!isScrolled ? 44 : 36)
                    : (!isScrolled ? 72 : 56)
                }
                height={
                  breakpoints.isXs
                    ? (!isScrolled ? 36 : 32)
                    : breakpoints.isMobile 
                    ? (!isScrolled ? 44 : 36)
                    : (!isScrolled ? 72 : 56)
                }
                className="transition-all duration-500"
                priority
              />
            </div>
            
            {/* Logo Text */}
            <span 
              className={`font-light ${navStyles.textColor} ${
                !isScrolled ? 'group-hover:text-white/80' : 'group-hover:text-[#003631]/80'
              } tracking-wide ${
                breakpoints.isXs
                  ? (!isScrolled ? 'text-base' : 'text-sm')
                  : breakpoints.isMobile 
                  ? (!isScrolled ? 'text-lg' : 'text-base')
                  : (!isScrolled ? 'text-3xl' : 'text-xl')
              }`}
              style={{
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span className="font-extralight inline-block">
                Green
              </span>
              <span className="font-medium inline-block">
                Check™
              </span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Minimalista - OCULTO NO MOBILE/TABLET */}
        <div className="hidden xl:flex items-center space-x-8">
          {primaryNavItems.map((item) => (
            <div key={item.href}>
              <Link 
                href={item.href} 
                style={{
                  transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className={`group relative text-sm font-light tracking-wide ${
                  pathname === item.href 
                    ? navStyles.textColor
                    : `${navStyles.textColorSecondary} ${navStyles.hoverColor}`
                }`}
              >
                {item.label}
                {/* Indicador ativo - bolinha pequena */}
                {pathname === item.href && (
                  <div 
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-500 ${
                      !isScrolled ? 'bg-[#5FA037]' : 'bg-[#5FA037]'
                    }`}
                  />
                )}
                {/* Indicador hover - bolinha pequena */}
                <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 rounded-full transition-all duration-300 group-hover:w-0.5 group-hover:h-0.5 ${
                  !isScrolled ? 'bg-white/60' : 'bg-[#5FA037]/60'
                }`} />
              </Link>
            </div>
          ))}
          {secondaryNavItems.map((item) => (
            <div key={item.href}>
              <Link 
                href={item.href} 
                style={{
                  transition: 'color 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className={`group relative text-sm font-light tracking-wide ${
                  pathname === item.href 
                    ? navStyles.textColor
                    : `${navStyles.textColorSecondary} ${navStyles.hoverColor}`
                }`}
              >
                {item.label}
                {/* Indicador ativo - bolinha pequena */}
                {pathname === item.href && (
                  <div 
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-500 ${
                      !isScrolled ? 'bg-[#5FA037]' : 'bg-[#5FA037]'
                    }`}
                  />
                )}
                {/* Indicador hover - bolinha pequena */}
                <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 rounded-full transition-all duration-300 group-hover:w-0.5 group-hover:h-0.5 ${
                  !isScrolled ? 'bg-white/60' : 'bg-[#5FA037]/60'
                }`} />
              </Link>
            </div>
          ))}
        </div>


        {/* Right Side - Responsivo */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
          {/* Botão Iniciar Upload - Responsivo */}
          <div>
            <Button 
              variant="default"
              className={`group rounded-full font-medium tracking-wide shadow-xl
                ${breakpoints.isMobile 
                  ? 'h-9 px-3 text-xs' 
                  : 'h-10 px-6 text-sm'
                }
                ${navStyles.buttonBg}`}
              style={{
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={handleIniciarUpload}
            >
              <span className="flex items-center">
                <span className="hidden sm:inline">Start Upload</span>
                <span className="sm:hidden">Upload</span>
                <Upload className={`transition-all duration-300 group-hover:translate-x-0.5 ${
                  breakpoints.isMobile ? 'ml-1 h-3.5 w-3.5' : 'ml-2 h-4 w-4'
                } ${navStyles.buttonIconColor}`} />
              </span>
            </Button>
          </div>
          
          {/* Separador sutil - Oculto no mobile */}
          <div className="hidden sm:block w-px h-6 bg-white/20 transition-colors duration-300" />
          
          {/* Seletor de Idioma - Menor no mobile */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  style={{
                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  className={`rounded-full ${
                    breakpoints.isMobile ? 'h-9 w-9' : 'h-10 w-10'
                  } ${navStyles.iconHover}`}
                >
                  <Globe className={breakpoints.isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={`w-[140px] backdrop-blur-xl shadow-2xl rounded-2xl p-2 transition-colors duration-300 ${navStyles.dropdownBg}`}
              >
                <DropdownMenuItem className={`rounded-lg px-3 py-2 text-sm font-light transition-colors ${navStyles.dropdownItem}`}>
                  🇵🇹 Português
                </DropdownMenuItem>
                <DropdownMenuItem className={`rounded-lg px-3 py-2 text-sm font-light transition-colors ${navStyles.dropdownItem}`}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem className={`rounded-lg px-3 py-2 text-sm font-light transition-colors ${navStyles.dropdownItem}`}>
                  🇪🇸 Español
                </DropdownMenuItem>
                <DropdownMenuItem className={`rounded-lg px-3 py-2 text-sm font-light transition-colors ${navStyles.dropdownItem}`}>
                  🇫🇷 Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Botão de Login - Responsivo */}
          <div>
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`transition-all duration-300 rounded-full ${
                  breakpoints.isMobile ? 'h-9 w-9' : 'h-10 w-10'
                } ${navStyles.iconHover}`}
              >
                <User className={breakpoints.isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}