"use client"

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export const Logo = ({ 
  className = "", 
  width = 160, 
  height = 24, 
  priority = false 
}: LogoProps) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return (
      <div 
        className={`animate-pulse bg-gray-300 rounded ${className}`}
        style={{ width, height }}
      />
    )
  }

  const isDark = theme === 'dark'
  // Modo escuro: usar logo claro (whitemode) para contrastar
  // Modo claro: usar logo escuro (drakmode) para contrastar
  const logoSrc = isDark ? '/logo whitemode.svg' : '/logo drakmode.svg'

  return (
    <Image
      src={logoSrc}
      alt="Aqua Vista Monchique"
      width={width}
      height={height}
      priority={priority}
      className={`transition-opacity duration-300 ${className}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  )
} 