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
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/lib/firebase/auth"
import { useAuth } from "@/lib/context/auth-context"
import { cn } from "@/lib/utils"

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

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Home, label: "Propriedade", href: "/admin/property" },
    { icon: BedDouble, label: "Quartos", href: "/admin/rooms" },
    { icon: Users, label: "Hóspedes", href: "/admin/guests" },
    { icon: Calendar, label: "Reservas", href: "/admin/bookings" },
    { icon: Utensils, label: "Restaurante", href: "/admin/restaurant" },
    { icon: MessageSquare, label: "Mensagens", href: "/admin/messages", badge: "3" },
    { icon: BarChart3, label: "Relatórios", href: "/admin/reports" },
    { icon: Settings, label: "Configurações", href: "/admin/settings" },
  ]

  if (!mounted) return null

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
          isCollapsed ? "w-[80px]" : "w-64",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo e toggle */}
          <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <LayoutDashboard className="h-4 w-4 text-primary" />
              </div>
              {!isCollapsed && <span className="font-semibold text-lg">Aqua Vista</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isCollapsed && "hidden")}
              onClick={toggleCollapsed}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", !isCollapsed && "hidden")}
              onClick={toggleCollapsed}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Perfil do usuário */}
          <div className={cn(
            "px-4 py-3 border-b border-border/50 flex items-center gap-3",
            isCollapsed && "justify-center"
          )}>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.email?.substring(0, 2).toUpperCase() || 'AV'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.email?.split('@')[0] || 'Administrador'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'admin@aquavista.com'}
                </p>
              </div>
            )}
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
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
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
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Botão de logout */}
          <div className={cn("p-4 border-t", isCollapsed && "flex justify-center")}>
            <Button
              variant="ghost"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start"
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
              {!isCollapsed && <span>Sair</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md whitespace-nowrap opacity-0 hover:opacity-100 pointer-events-none transition-opacity">
                  Sair
                </div>
              )}
            </Button>
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
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">Aqua Vista</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* Perfil do usuário */}
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.email?.substring(0, 2).toUpperCase() || 'AV'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.email?.split('@')[0] || 'Administrador'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'admin@aquavista.com'}
                  </p>
                </div>
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
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
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

              {/* Botão de logout */}
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
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