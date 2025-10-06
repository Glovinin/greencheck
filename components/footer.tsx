"use client"

import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()
  
  // Sempre modo claro
  const isDark = false
  
  return (
    <footer className="bg-[#1C2526] pt-24 pb-40 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">GreenCheck</h3>
              <span className="text-sm text-[#34C759]">Certificação ESG</span>
            </div>
            <p className="text-white/70 text-sm mb-6">
              Automated ESG certification system with artificial intelligence, scientific validation and blockchain. Revolutionizing corporate sustainability.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 bg-[#34C759]/20 hover:bg-[#34C759]/30 text-[#34C759]">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 bg-[#34C759]/20 hover:bg-[#34C759]/30 text-[#34C759]">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 bg-[#34C759]/20 hover:bg-[#34C759]/30 text-[#34C759]">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-white">Navigation</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">Home</a></li>
              <li><a href="/validacao" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">Validation</a></li>
              <li><a href="/marketplace" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">Marketplace</a></li>
              <li><a href="/sobre" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">About</a></li>
              <li><a href="/login" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">Login</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-[#34C759] mt-1 flex-shrink-0" />
                <span className="text-white/70">Lisbon, Portugal</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-[#34C759] flex-shrink-0" />
                <span className="text-white/70">+351 XXX XXX XXX</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-[#34C759] flex-shrink-0" />
                <span className="text-white/70">contact@greencheck.app</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-white">Newsletter</h4>
            <p className="text-white/70 text-sm mb-4">
              Receive updates on ESG certification and sustainability.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-full border text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#34C759]/20 focus:border-[#34C759] border-[#34C759]/20 bg-[#1C2526]/50 text-white placeholder-white/60"
              />
              <Button size="sm" className="rounded-full w-full sm:w-auto bg-[#34C759] hover:bg-[#34C759]/90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-white/70">
              © {currentYear} GreenCheck. All rights reserved.
            </p>
            <p className="text-sm text-white/70 mt-2">
              Made with <span className="text-red-500">❤️</span> by <a href="https://arcadesoft.webflow.io/" target="_blank" rel="noopener noreferrer" className="text-[#34C759] hover:underline">Arcadesoft</a>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm mt-4 md:mt-0 mb-16 lg:mb-0">
            <a href="/privacy" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">Privacy Policy</a>
            <a href="/terms" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">Terms of Use</a>
            <a href="/cookies" className="text-white/70 hover:text-[#34C759] transition-colors duration-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
} 