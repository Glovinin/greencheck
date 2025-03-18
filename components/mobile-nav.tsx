"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { useTheme } from "next-themes"
import { 
  House,
  MagnifyingGlass,
  Calendar,
  ForkKnife,
  ChatCircle,
  UserCircle,
  Info,
  List,
  X,
  SunDim,
  Moon,
  InstagramLogo,
  FacebookLogo,
  Waves,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

// Itens na navegação inferior
const bottomNavItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/rooms', label: 'Quartos', icon: MagnifyingGlass },
  { href: '/booking', label: 'Reservar', icon: Calendar },
  { href: '/contato', label: 'Contato', icon: ChatCircle },
]

// Todos os itens de navegação (para o menu expandido)
const allNavItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/rooms', label: 'Quartos', icon: MagnifyingGlass },
  { href: '/booking', label: 'Reservar', icon: Calendar },
  { href: '/restaurante', label: 'Restaurante', icon: ForkKnife },
  { href: '/eventos', label: 'Eventos', icon: Calendar },
  { href: '/sobre', label: 'Sobre Nós', icon: Info },
  { href: '/contato', label: 'Contato', icon: ChatCircle },
  { href: '/admin/login', label: 'Login Admin', icon: UserCircle },
]

export function MobileNav() {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Prevenir scroll quando o menu está aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [menuOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Fechar menu ao navegar
    setMenuOpen(false)
  }, [pathname])

  if (!mounted || pathname.startsWith('/admin/')) return null

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <>
      {/* Barra de navegação inferior */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-t rounded-t-[2rem] md:hidden",
        isDark 
          ? "bg-black/80 border-white/10" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="flex items-center justify-around h-20 px-4">
          {bottomNavItems.map((item) => {
            const ItemIcon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ease-spring",
                  isActive 
                    ? "text-primary scale-110 transform" 
                    : "text-muted-foreground hover:text-primary hover:scale-110 transform"
                )}
              >
                <div className={cn(
                  "relative p-2 rounded-2xl transition-all duration-300",
                  isActive && "bg-primary/10"
                )}>
                  <ItemIcon 
                    weight={isActive ? "fill" : "regular"} 
                    className="h-6 w-6 transition-all duration-300" 
                  />
                </div>
                <span className={cn(
                  "text-xs mt-1 font-medium transition-all duration-300",
                  isActive && "font-bold"
                )}>{item.label}</span>
              </Link>
            )
          })}
          
          {/* Botão do menu */}
          <button 
            onClick={() => setMenuOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ease-spring",
              "text-muted-foreground hover:text-primary hover:scale-110 transform"
            )}
          >
            <div className="relative p-2 rounded-2xl transition-all duration-300">
              <List 
                weight="bold" 
                className="h-6 w-6 transition-all duration-300" 
              />
            </div>
            <span className="text-xs mt-1 font-medium transition-all duration-300">Menu</span>
          </button>
        </div>
      </nav>

      {/* Menu fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed inset-0 z-[100] md:hidden flex flex-col overflow-hidden",
              isDark 
                ? "bg-black text-white" 
                : "bg-white text-gray-900"
            )}
          >
            {/* Cabeçalho do menu */}
            <div className={cn(
              "flex items-center justify-between p-6 border-b",
              isDark ? "border-white/10" : "border-gray-200"
            )}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Waves className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-xl font-bold">Aqua Vista</h1>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="h-10 w-10 rounded-full flex items-center justify-center transition-all hover:bg-primary/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Conteúdo do menu */}
            <div className="flex-1 overflow-y-auto py-8 px-6">
              <ul className="space-y-6">
                {allNavItems.map((item) => {
                  const ItemIcon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <motion.li 
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * allNavItems.indexOf(item) }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 py-3 px-4 rounded-xl transition-all",
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          isActive ? "bg-primary/20" : "bg-primary/5"
                        )}>
                          <ItemIcon 
                            weight={isActive ? "fill" : "regular"} 
                            className="h-5 w-5" 
                          />
                        </div>
                        <span className="text-lg">{item.label}</span>
                        
                        {isActive && (
                          <motion.div 
                            layoutId="activeIndicator"
                            className="ml-auto h-2 w-2 rounded-full bg-primary" 
                          />
                        )}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              {/* Alternador de tema */}
              <div className={cn(
                "mt-10 p-6 rounded-xl border",
                isDark ? "border-white/10" : "border-gray-200"
              )}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Alternar Tema</span>
                  <Button 
                    onClick={toggleTheme}
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-10 w-10"
                  >
                    {isDark ? (
                      <SunDim className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className={cn(
              "p-6 border-t",
              isDark ? "border-white/10" : "border-gray-200"
            )}>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <InstagramLogo className="h-6 w-6" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <FacebookLogo className="h-6 w-6" />
                </a>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                © 2023 Aqua Vista Monchique. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}