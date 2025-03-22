"use client"

import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export default function Header({ title, subtitle, className }: HeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  )
} 