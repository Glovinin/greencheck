"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface LoadingContextType {
  isInitialLoading: boolean
  isPageLoading: boolean
  isCartOpen: boolean
  setIsInitialLoading: (loading: boolean) => void
  setIsCartOpen: (open: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Detectar mobile para otimizar tempos
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Controlar loading inicial (primeira vez que abre o site)
  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, isMobile ? 1500 : 2500) // Mobile: 1.5s, Desktop: 2.5s

    return () => clearTimeout(timer)
  }, [isMobile])

  // Controlar loading entre páginas - DESABILITADO PERMANENTEMENTE
  useEffect(() => {
    if (!mounted) return
    // NUNCA mostrar loading ao navegar entre páginas
    setIsPageLoading(false)
  }, [pathname, mounted])

  const isLoading = isInitialLoading // APENAS loading inicial

  return (
    <LoadingContext.Provider value={{ 
      isInitialLoading: isLoading, 
      isPageLoading,
      isCartOpen,
      setIsInitialLoading,
      setIsCartOpen 
    }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
