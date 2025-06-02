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
  Image as ImageIcon,
  CalendarCheck,
  Camera
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

// Itens na navegação inferior
const bottomNavItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/rooms', label: 'Quartos', icon: MagnifyingGlass },
  { href: '/booking', label: 'Reservar', icon: Calendar },
  { href: '/gallery', label: 'Galeria', icon: Camera },
]

// Todos os itens de navegação (para o menu expandido)
const allNavItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/rooms', label: 'Quartos', icon: MagnifyingGlass },
  { href: '/booking', label: 'Reservar', icon: Calendar },
  { href: '/restaurante', label: 'Restaurante', icon: ForkKnife },
  { href: '/eventos', label: 'Eventos', icon: CalendarCheck },
  { href: '/gallery', label: 'Galeria', icon: Camera },
  { href: '/sobre', label: 'Sobre Nós', icon: Info },
  { href: '/contato', label: 'Contato', icon: ChatCircle },
  { href: '/admin/login', label: 'Login Admin', icon: UserCircle },
]

export function MobileNav() {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [lastScrollPosition, setLastScrollPosition] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)
  const menuContentRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLUListElement>(null)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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

  // Detectar direção do scroll na página principal
  useEffect(() => {
    if (menuOpen) return;

    const handlePageScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Verificar direção do scroll
      const isScrollDown = currentScrollPos > lastScrollPosition;
      setIsScrollingDown(isScrollDown);
      
      // Expandir a navegação quando o scroll for para baixo
      if (isScrollDown) {
        setIsNavExpanded(true);
      } else {
        setIsNavExpanded(false);
      }
      
      setLastScrollPosition(currentScrollPos);
      
      // Reset após período de inatividade
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsNavExpanded(false);
      }, 1500);
    };
    
    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [lastScrollPosition, menuOpen]);

  // Monitorar scroll e calcular alturas para o indicador de posição
  useEffect(() => {
    if (!menuOpen || !menuContentRef.current || !menuItemsRef.current) return

    const handleResize = () => {
      if (menuContentRef.current && menuItemsRef.current) {
        setContainerHeight(menuContentRef.current.clientHeight)
        setContentHeight(menuItemsRef.current.scrollHeight)
      }
    }
    
    const handleScroll = () => {
      if (menuContentRef.current) {
        setScrollPosition(menuContentRef.current.scrollTop)
        
        // Ativar estado de scrolling
        setIsScrolling(true)
        
        // Desativar após 1 segundo sem scroll
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current)
        }
        scrollTimeout.current = setTimeout(() => {
          setIsScrolling(false)
        }, 1000)
      }
    }
    
    // Inicializar valores
    handleResize()
    
    // Event listeners
    window.addEventListener('resize', handleResize)
    menuContentRef.current.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (menuContentRef.current) {
        menuContentRef.current.removeEventListener('scroll', handleScroll)
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
    ? Math.min(100, Math.max(0, (scrollPosition / (contentHeight - containerHeight)) * 10))
    : 0
    
  // Verificar se há mais conteúdo abaixo (para mostrar o indicador)
  const hasMoreContent = true // Sempre mostrar o indicador

  return (
    <>
      {/* Barra de navegação inferior */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-t rounded-t-[2rem] block lg:hidden",
        isDark 
          ? "bg-[#4F3621]/80 border-[#EED5B9]/20" 
          : "bg-[#EED5B9]/80 border-[#4F3621]/20"
      )}>
        <div className="flex items-center justify-around px-4 py-4 pb-safe">
          {bottomNavItems.map((item) => {
            const ItemIcon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 transition-all duration-300 ease-spring",
                  isActive 
                    ? isDark ? "text-[#EED5B9]" : "text-[#4F3621]"
                    : isDark ? "text-[#EED5B9]/60 hover:text-[#EED5B9]" : "text-[#4F3621]/60 hover:text-[#4F3621]"
                )}
              >
                <div className="relative p-2 rounded-2xl transition-all duration-300">
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavBackground"
                      className={cn(
                        "absolute inset-0 rounded-2xl -z-10",
                        isDark ? "bg-[#EED5B9]/10" : "bg-[#4F3621]/10"
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                  <ItemIcon 
                    weight={isActive ? "fill" : "regular"} 
                    className="h-6 w-6 transition-all duration-300 sm:h-7 sm:w-7" 
                  />
                </div>
                <span className={cn(
                  "text-xs mt-1 font-medium transition-all duration-300 sm:text-sm",
                  isActive && "font-bold"
                )}>{item.label}</span>
              </Link>
            )
          })}
          
          {/* Botão do menu */}
          <button 
            onClick={() => setMenuOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 transition-all duration-300 ease-spring",
              isDark ? "text-[#EED5B9]/60 hover:text-[#EED5B9]" : "text-[#4F3621]/60 hover:text-[#4F3621]"
            )}
          >
            <div className="relative p-2 rounded-2xl transition-all duration-300">
              <List 
                weight="bold" 
                className="h-6 w-6 transition-all duration-300 sm:h-7 sm:w-7" 
              />
            </div>
            <span className="text-xs mt-1 font-medium transition-all duration-300 sm:text-sm">Menu</span>
          </button>
        </div>
      </nav>

      {/* Estilos para considerar áreas seguras (safe areas) em dispositivos iOS */}
      <style jsx global>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0.5rem);
        }
        
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .pb-safe {
            padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>

      {/* Menu fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed inset-0 z-[100] lg:hidden flex flex-col overflow-hidden",
              isDark 
                ? "bg-[#4F3621] text-[#EED5B9]" 
                : "bg-[#EED5B9] text-[#4F3621]"
            )}
            ref={menuRef}
          >
            {/* Cabeçalho do menu */}
            <div className={cn(
              "flex items-center justify-between p-6 border-b",
              isDark ? "border-[#EED5B9]/20" : "border-[#4F3621]/20"
            )}>
              <div className="flex items-center gap-3">
                <Logo 
                  width={160} 
                  height={24} 
                  className="transition-all duration-300"
                />
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-all sm:h-12 sm:w-12",
                  isDark ? "hover:bg-[#EED5B9]/10" : "hover:bg-[#4F3621]/10"
                )}
              >
                <X className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </div>

            {/* Conteúdo do menu */}
            <div 
              className={cn(
                "flex-1 overflow-y-auto py-8 px-6 relative",
                isDark 
                  ? "bg-[#4F3621]" 
                  : "bg-[#EED5B9]"
              )} 
              ref={menuContentRef}
            >
              {/* Efeito de fade na parte inferior - fixo */}
              <div className={cn(
                "fixed left-0 right-0 bottom-[72px] h-24 pointer-events-none z-10",
                isDark 
                  ? "bg-gradient-to-t from-[#4F3621] to-transparent" 
                  : "bg-gradient-to-t from-[#EED5B9] to-transparent"
              )} />
              
              {/* Efeito de fade no topo */}
              <div className={cn(
                "absolute left-0 right-0 top-0 h-6 pointer-events-none z-10",
                isDark 
                  ? "bg-gradient-to-b from-[#4F3621] to-transparent" 
                  : "bg-gradient-to-b from-[#EED5B9] to-transparent"
              )} />
              
              <ul ref={menuItemsRef} className="space-y-6 pb-24">
                {allNavItems.map((item, index) => {
                  const ItemIcon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <motion.li 
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: {
                          delay: 0.1 + index * 0.05,
                          duration: 0.3
                        }
                      }}
                    >
                      <Link 
                        href={item.href}
                        className={cn(
                          "flex items-center py-2 px-3 rounded-xl transition-all sm:py-3",
                          isActive 
                            ? isDark ? "bg-[#EED5B9]/10" : "bg-[#4F3621]/10"
                            : isDark ? "hover:bg-[#EED5B9]/5" : "hover:bg-[#4F3621]/5"
                        )}
                      >
                        <div className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center sm:h-14 sm:w-14",
                          isActive 
                            ? isDark ? "bg-[#EED5B9]/10 text-[#EED5B9]" : "bg-[#4F3621]/10 text-[#4F3621]"
                            : isDark ? "text-[#EED5B9]/80" : "text-[#4F3621]/80"
                        )}>
                          <ItemIcon weight={isActive ? "fill" : "regular"} className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        
                        <span className={cn(
                          "text-lg transition-all sm:text-xl ml-4",
                          isActive 
                            ? isDark ? "font-medium text-[#EED5B9]" : "font-medium text-[#4F3621]"
                            : isDark ? "text-[#EED5B9]/90" : "text-[#4F3621]/90"
                        )}>
                          {item.label}
                        </span>
                        
                        {isActive && (
                          <div className={cn(
                            "ml-auto h-2 w-2 rounded-full",
                            isDark ? "bg-[#EED5B9]" : "bg-[#4F3621]"
                          )} />
                        )}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              {/* Alternador de tema */}
              <div className={cn(
                "mt-12 p-6 rounded-2xl border sm:p-8 sm:mt-16",
                isDark 
                  ? "border-[#EED5B9]/20 bg-[#4F3621]/50" 
                  : "border-[#4F3621]/20 bg-[#EED5B9]/50"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={cn(
                      "font-medium text-lg sm:text-xl",
                      isDark ? "text-[#EED5B9]" : "text-[#4F3621]"
                    )}>Alternar Tema</h3>
                    <p className={cn(
                      "text-sm mt-1 sm:text-base sm:mt-2",
                      isDark ? "text-[#EED5B9]/70" : "text-[#4F3621]/70"
                    )}>Escolha entre modo claro ou escuro</p>
                  </div>
                  <Button 
                    onClick={toggleTheme}
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full h-12 w-12 sm:h-14 sm:w-14",
                      isDark 
                        ? "bg-[#4F3621] border-[#EED5B9]/30 hover:bg-[#EED5B9]/10" 
                        : "bg-[#EED5B9] border-[#4F3621]/30 hover:bg-[#4F3621]/10"
                    )}
                  >
                    {isDark ? (
                      <SunDim className="h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
                    ) : (
                      <Moon className="h-5 w-5 text-indigo-600 sm:h-6 sm:w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className={cn(
              "p-6 border-t",
              isDark ? "border-[#EED5B9]/20" : "border-[#4F3621]/20"
            )}>
              <div className="flex items-center justify-center space-x-6">
                <a 
                  href="#" 
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all sm:h-12 sm:w-12",
                    isDark 
                      ? "bg-[#EED5B9]/10 hover:bg-[#EED5B9]/20" 
                      : "bg-[#4F3621]/10 hover:bg-[#4F3621]/20"
                  )}
                >
                  <InstagramLogo className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6",
                    isDark ? "text-[#EED5B9]" : "text-[#4F3621]"
                  )} />
                </a>
                <a 
                  href="#" 
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all sm:h-12 sm:w-12",
                    isDark 
                      ? "bg-[#EED5B9]/10 hover:bg-[#EED5B9]/20" 
                      : "bg-[#4F3621]/10 hover:bg-[#4F3621]/20"
                  )}
                >
                  <FacebookLogo className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6",
                    isDark ? "text-[#EED5B9]" : "text-[#4F3621]"
                  )} />
                </a>
              </div>
              <p className={cn(
                "text-center text-sm mt-4 sm:text-base",
                isDark ? "text-[#EED5B9]/70" : "text-[#4F3621]/70"
              )}>
                © 2024 Aqua Vista Monchique. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}