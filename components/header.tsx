"use client"

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Navbar } from './navbar'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300",
      isScrolled
        ? "bg-background/50 backdrop-blur-xl border-border"
        : "bg-transparent border-transparent"
    )}>
      <div className="container">
        <Navbar />
      </div>
    </header>
  )
} 