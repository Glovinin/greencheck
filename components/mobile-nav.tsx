"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { 
  House,
  MagnifyingGlass,
  Calendar,
  ForkKnife,
  Waves,
  ChatCircle,
} from '@phosphor-icons/react'

const navItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/rooms', label: 'Quartos', icon: MagnifyingGlass },
  { href: '/booking', label: 'Reservar', icon: Calendar },
  { href: '/dining', label: 'Restaurante', icon: ForkKnife },
  { href: '/contato', label: 'Contato', icon: ChatCircle },
]

export function MobileNav() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 border-t rounded-t-[2rem] md:hidden">
      <div className="flex items-center justify-around h-24 px-4">
        {navItems.slice(0, 5).map((item) => {
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
      </div>
    </nav>
  )
}