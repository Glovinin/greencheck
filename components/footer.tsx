"use client"

import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()
  
  const isDark = theme === 'dark'
  
  return (
    <footer className={`${isDark ? 'bg-neutral-900/90' : 'bg-muted/80'} pt-24 pb-40 lg:pb-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Aqua Vista</h3>
              <span className="text-sm text-muted-foreground">Monchique</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              Seu refúgio acolhedor na Serra de Monchique, onde a simplicidade rústica se harmoniza com a natureza para proporcionar experiências inesquecíveis com vista panorâmica.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center transition-colors duration-300 hover:bg-primary/10">
                <Facebook size={18} className="text-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center transition-colors duration-300 hover:bg-primary/10">
                <Instagram size={18} className="text-foreground" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center transition-colors duration-300 hover:bg-primary/10">
                <Twitter size={18} className="text-foreground" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Navegação</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors duration-300">Início</a></li>
              <li><a href="/rooms" className="text-muted-foreground hover:text-primary transition-colors duration-300">Quartos</a></li>
              <li><a href="/restaurante" className="text-muted-foreground hover:text-primary transition-colors duration-300">Restaurante</a></li>
              <li><a href="/eventos" className="text-muted-foreground hover:text-primary transition-colors duration-300">Eventos</a></li>
              <li><a href="/gallery" className="text-muted-foreground hover:text-primary transition-colors duration-300">Galeria</a></li>
              <li><a href="/sobre" className="text-muted-foreground hover:text-primary transition-colors duration-300">Sobre</a></li>
              <li><a href="/contato" className="text-muted-foreground hover:text-primary transition-colors duration-300">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Estrada da Foia, 8550-257 Monchique, Algarve, Portugal</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+351 282 249 728</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">info@aquavista-monchique.pt</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Inscreva-se para receber ofertas exclusivas e novidades.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="px-4 py-2 rounded-full border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm w-full"
              />
              <Button size="sm" className="rounded-full w-full sm:w-auto">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Aqua Vista Monchique. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Made with <span className="text-red-500">❤️</span> by <a href="https://arcadesoft.webflow.io/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Arcadesoft</a>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm mt-4 md:mt-0 mb-16 lg:mb-0">
            <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300">Política de Privacidade</a>
            <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300">Termos de Uso</a>
            <a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors duration-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
} 