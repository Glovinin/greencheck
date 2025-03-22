"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Home,
  Utensils,
  MessageSquare,
  BarChart3,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Clock,
  Image
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/lib/firebase/auth"
import { useAuth } from "@/lib/context/auth-context"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getDocument } from "@/lib/firebase/firestore"

interface AdminData {
  id: string
  name: string
  email: string
  role: string
}

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const { theme, setTheme } = useTheme()
  
  // Buscar dados do admin no Firestore
  useEffect(() => {
    const fetchAdminData = async () => {
      if (user?.uid) {
        try {
          const admin = await getDocument<AdminData>('admins', user.uid)
          if (admin) {
            setAdminData(admin)
          }
        } catch (error) {
          console.error('Erro ao buscar dados do admin:', error)
        }
      }
    }
    
    if (user) {
      fetchAdminData()
    }
  }, [user])
  
  // Formatar a data atual
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentDate(format(now, "EEEE, dd 'de' MMMM", { locale: ptBR }))
      setCurrentTime(format(now, "HH:mm", { locale: ptBR }))
    }
    
    updateDateTime()
    const timer = setInterval(updateDateTime, 60000) // Atualiza a cada minuto
    
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setMounted(true)
    
    // Fechar menu mobile ao navegar
    setIsMobileOpen(false)
    
    // Recuperar estado do menu do localStorage
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed')
    if (savedCollapsedState) {
      setIsCollapsed(savedCollapsedState === 'true')
    }
  }, [pathname])

  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Obter o nome de exibição do usuário
  const getUserDisplayName = () => {
    if (adminData?.name) {
      return adminData.name
    }
    return user?.email?.split('@')[0] || 'Administrador'
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: BedDouble, label: "Quartos", href: "/admin/rooms" },
    { icon: Users, label: "Hóspedes", href: "/admin/guests" },
    { icon: Calendar, label: "Reservas", href: "/admin/bookings" },
    { icon: MessageSquare, label: "Mensagens", href: "/admin/messages", badge: "3" },
    { icon: Image, label: "Galeria", href: "/admin/gallery" },
    { icon: Settings, label: "Configurações", href: "/admin/settings" },
  ]

  if (!mounted) return null
  
  const isDark = theme === "dark"
  const displayName = getUserDisplayName()

  return (
    <>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Botão do menu mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar para desktop */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ease-in-out bg-background border-r border-border/50 hidden md:flex flex-col",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo e toggle */}
          <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 transition-all duration-300">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-semibold text-lg"
                >
                  Aqua Vista
                </motion.span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 rounded-full", isCollapsed && "hidden")}
              onClick={toggleCollapsed}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 rounded-full", !isCollapsed && "hidden")}
              onClick={toggleCollapsed}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Data e hora - visível apenas quando expandido */}
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              <div>
                <p className="capitalize">{currentDate}</p>
                <p className="text-xs">{currentTime}</p>
              </div>
            </motion.div>
          )}

          {/* Perfil do usuário */}
          <div className={cn(
            "mt-2 px-4 py-3 border-y border-border/50 flex items-center gap-3 bg-muted/30",
            isCollapsed && "justify-center"
          )}>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {displayName.substring(0, 2).toUpperCase() || 'AV'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium truncate"
                >
                  {displayName}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs text-muted-foreground truncate"
                >
                  {user?.email || 'admin@aquavista.com'}
                </motion.p>
              </div>
            )}
          </div>

          {/* Mensagem de boas-vindas - visível apenas quando expandido */}
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-3 text-sm"
            >
              <p className="font-medium">Bem-vindo(a)!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Acesse as funcionalidades do sistema através do menu abaixo.
              </p>
            </motion.div>
          )}

          {/* Menu de navegação */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                >
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <div className={cn(
                            "h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200",
                            isActive ? "bg-primary/20" : "bg-muted/70 group-hover:bg-muted"
                          )}>
                            <item.icon className="h-5 w-5 shrink-0" />
                          </div>
                          {!isCollapsed && (
                            <>
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge className="ml-auto bg-primary text-primary-foreground">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                          {isCollapsed && item.badge && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="bg-popover border border-border/50">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )
            })}
          </nav>

          {/* Botões de configuração: tema e logout */}
          <div className={cn("p-4 border-t", isCollapsed ? "space-y-3" : "flex items-center justify-between")}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-lg border border-border/50 transition-all duration-200",
                      isCollapsed ? "mx-auto" : "",
                      isDark ? "bg-slate-800" : "bg-slate-100"
                    )}
                    onClick={toggleTheme}
                  >
                    {isDark ? (
                      <Moon className="h-5 w-5 text-blue-300" />
                    ) : (
                      <Sun className="h-5 w-5 text-amber-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-muted-foreground hover:text-foreground transition-all duration-200",
                      isCollapsed ? "w-10 h-10 p-0 rounded-lg mx-auto" : "justify-start rounded-lg gap-2"
                    )}
                    onClick={handleLogout}
                  >
                    <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Sair</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    Sair do sistema
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </aside>

      {/* Sidebar para mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ ease: "easeOut", duration: 0.25 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] z-50 bg-background border-r border-border/50 flex flex-col"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-4 flex items-center justify-between">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">Aqua Vista</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* Data e hora */}
              <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <div>
                  <p className="capitalize">{currentDate}</p>
                  <p className="text-xs">{currentTime}</p>
                </div>
              </div>

              {/* Perfil do usuário */}
              <div className="mt-2 px-4 py-3 border-y border-border/50 flex items-center gap-3 bg-muted/30">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {displayName.substring(0, 2).toUpperCase() || 'AV'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'admin@aquavista.com'}
                  </p>
                </div>
              </div>

              {/* Mensagem de boas-vindas */}
              <div className="px-4 py-3 text-sm">
                <p className="font-medium">Bem-vindo(a)!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Acesse as funcionalidades do sistema através do menu abaixo.
                </p>
              </div>

              {/* Menu de navegação */}
              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center",
                        isActive ? "bg-primary/20" : "bg-muted/70"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-primary text-primary-foreground">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Botões de configuração: tema e logout */}
              <div className="p-4 flex items-center justify-between border-t">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-lg border border-border/50",
                    isDark ? "bg-slate-800" : "bg-slate-100"
                  )}
                  onClick={toggleTheme}
                >
                  {isDark ? (
                    <Moon className="h-5 w-5 text-blue-300" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start rounded-lg gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
} 