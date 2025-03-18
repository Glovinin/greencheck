"use client"

import { useState, useEffect, useRef } from 'react'
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
  CaretDown,
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
  const [scrollPosition, setScrollPosition] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)
  const menuContentRef = useRef<HTMLUListElement>(null)

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

  // Monitorar scroll e calcular alturas para o indicador de posição
  useEffect(() => {
    if (!menuOpen || !menuRef.current || !menuContentRef.current) return

    const handleResize = () => {
      if (menuRef.current && menuContentRef.current) {
        setContainerHeight(menuRef.current.clientHeight)
        setContentHeight(menuContentRef.current.scrollHeight)
      }
    }
    
    const handleScroll = () => {
      if (menuRef.current) {
        setScrollPosition(menuRef.current.scrollTop)
      }
    }
    
    // Inicializar valores
    handleResize()
    
    // Event listeners
    window.addEventListener('resize', handleResize)
    menuRef.current.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (menuRef.current) {
        menuRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [menuOpen])

  if (!mounted || pathname.startsWith('/admin/')) return null

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  // Calcular progresso de scroll (0-100)
  const scrollPercentage = containerHeight && contentHeight 
    ? Math.min(100, Math.max(0, (scrollPosition / (contentHeight - containerHeight)) * 100))
    : 0
    
  // Verificar se há mais conteúdo abaixo (para mostrar o indicador)
  const hasMoreContent = contentHeight > containerHeight && scrollPercentage < 100

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
                <div className="relative p-2 rounded-2xl transition-all duration-300">
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
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
            ref={menuRef}
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
            <div 
              className={cn(
                "flex-1 overflow-y-auto py-8 px-6 relative scrollbar",
                isDark 
                  ? "scrollbar-dark" 
                  : "scrollbar-light"
              )} 
              ref={menuRef}
              style={{
                scrollbarWidth: "auto",
                scrollbarColor: isDark ? "#6366f1 #1e1e2a" : "#6366f1 #f5f5f7",
              }}
            >
              {/* Custom scrollbar para o menu */}
              <style jsx global>{`
                /* Estilização para navegadores webkit (Chrome, Safari, etc) */
                .scrollbar::-webkit-scrollbar {
                  width: 6px;
                  height: 6px;
                }
                
                .scrollbar-dark::-webkit-scrollbar-track {
                  background: rgba(30, 30, 42, 0.6);
                  margin: 8px 0;
                  border-radius: 10px;
                }
                
                .scrollbar-dark::-webkit-scrollbar-thumb {
                  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
                  border-radius: 10px;
                  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .scrollbar-dark::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(to bottom, #818cf8, #a78bfa);
                  border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .scrollbar-light::-webkit-scrollbar-track {
                  background: rgba(245, 245, 247, 0.7);
                  margin: 8px 0;
                  border-radius: 10px;
                }
                
                .scrollbar-light::-webkit-scrollbar-thumb {
                  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
                  border-radius: 10px;
                  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
                  border: 1px solid rgba(0, 0, 0, 0.05);
                }
                
                .scrollbar-light::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
                  border: 1px solid rgba(0, 0, 0, 0.1);
                }
                
                @keyframes pulseScrollbar {
                  0% { opacity: 0.5; }
                  50% { opacity: 1; }
                  100% { opacity: 0.5; }
                }
                
                .scrollbar::-webkit-scrollbar-thumb {
                  animation: pulseScrollbar 2s ease-in-out 1;
                }
              `}</style>
              
              {/* Efeito de fade na parte inferior */}
              <div className={cn(
                "absolute left-0 right-0 bottom-0 h-20 pointer-events-none z-10",
                isDark 
                  ? "bg-gradient-to-t from-black to-transparent" 
                  : "bg-gradient-to-t from-white to-transparent"
              )} />
              
              {/* Indicador de scroll personalizado para iOS/mobile */}
              {hasMoreContent && (
                <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col items-center gap-1.5">
                  {/* Círculos indicadores de posição - aparecem apenas em mobile */}
                  <div className="hidden sm:flex flex-col items-center gap-1.5">
                    {Array.from({ length: 3 }).map((_, i) => {
                      // Determinar qual círculo está ativo baseado na posição de scroll
                      const isActive = 
                        (i === 0 && scrollPercentage < 33) || 
                        (i === 1 && scrollPercentage >= 33 && scrollPercentage < 66) || 
                        (i === 2 && scrollPercentage >= 66);
                      
                      return (
                        <div 
                          key={i}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            isActive 
                              ? "bg-primary scale-125" 
                              : isDark ? "bg-white/30" : "bg-gray-300"
                          )}
                        />
                      )
                    })}
                  </div>
                  
                  {/* Indicador de scroll em forma de barra para iOS */}
                  <div className="w-1.5 h-24 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 relative">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-primary"
                      style={{ 
                        height: `${scrollPercentage}%`,
                        borderRadius: '9999px' 
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Indicador de "mais conteúdo abaixo" para iOS */}
              {hasMoreContent && scrollPercentage < 10 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute left-1/2 bottom-20 transform -translate-x-1/2 z-30 pointer-events-none"
                >
                  <div className={cn(
                    "flex flex-col items-center",
                    isDark ? "text-white" : "text-gray-800"
                  )}>
                    <p className="text-xs font-medium mb-2">Deslize para ver mais</p>
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full",
                        isDark ? "bg-white/10" : "bg-gray-100"
                      )}
                    >
                      <CaretDown weight="bold" className="h-5 w-5" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              <ul className="space-y-6" ref={menuContentRef}>
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
                          "flex items-center gap-4 py-3 px-4 rounded-xl transition-all relative",
                          isActive ? "text-primary font-medium" : "hover:bg-primary/5"
                        )}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="activeMenuBackground"
                            className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                          />
                        )}
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