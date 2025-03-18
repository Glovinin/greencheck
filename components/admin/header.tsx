"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/context/auth-context"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export default function Header({ title, subtitle, className }: HeaderProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar busca global
    console.log("Buscar por:", searchQuery)
  }

  return (
    <header className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar..." 
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">
              3
            </span>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.email?.substring(0, 2).toUpperCase() || 'AV'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
} 