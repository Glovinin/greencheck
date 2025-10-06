"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Leaf, TrendingUp, Shield, Zap, Star, Users, ChevronDown, ArrowRight, BarChart3, Globe, Coins, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import SplineBackground from '@/components/spline-background'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/contexts/loading-context'
import Image from 'next/image'

// Interface para breakpoints inteligentes
interface ScreenBreakpoints {
  isXs: boolean      // < 380px - muito pequeno (mobile portrait pequeno)
  isSm: boolean      // 380px - 640px - pequeno (mobile portrait)
  isMd: boolean      // 640px - 768px - médio (mobile landscape)
  isTablet: boolean  // 768px - 1024px - tablet (iPad Mini/Pro)
  isLg: boolean      // 1024px - 1280px - desktop pequeno
  isXl: boolean      // > 1280px - desktop grande
  
  // Altura
  isShortHeight: boolean    // < 600px
  isMediumHeight: boolean   // 600px - 800px
  isTallHeight: boolean     // > 800px
  
  // Combinações úteis
  isMobile: boolean         // < 768px
  isDesktop: boolean        // >= 1024px
  
  width: number
  height: number
}

// Hook de breakpoints inteligentes
const useSmartBreakpoints = (): ScreenBreakpoints => {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Set initial viewport
    updateViewport()

    // Listen for resize events
    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [])

  const breakpoints = {
    isXs: viewport.width < 380,
    isSm: viewport.width >= 380 && viewport.width < 640,
    isMd: viewport.width >= 640 && viewport.width < 768,
    isTablet: viewport.width >= 768 && viewport.width < 1024,
    isLg: viewport.width >= 1024 && viewport.width < 1280,
    isXl: viewport.width >= 1280,
    
    isShortHeight: viewport.height < 600,
    isMediumHeight: viewport.height >= 600 && viewport.height < 800,
    isTallHeight: viewport.height >= 800,
    
    isMobile: viewport.width < 768,
    isDesktop: viewport.width >= 1024,
    
    width: viewport.width,
    height: viewport.height
  }

  return breakpoints
}

// Função para obter layout inteligente baseado nos breakpoints
const getSmartLayout = (breakpoints: ScreenBreakpoints) => {
  const { isXs, isSm, isMd, isTablet, isLg, isXl, isShortHeight, isMediumHeight, isTallHeight, isMobile, isDesktop } = breakpoints

  // Layout para telas muito pequenas (< 380px)
  if (isXs) {
    return {
      // Hero Section
      containerClass: 'min-h-screen-fixed flex flex-col justify-start items-center',
      heroContentClass: 'px-3 py-2',
      heroSpacing: 'pt-20 pb-8',
      titleSize: 'text-4xl',
      subtitleSize: 'text-xl',
      buttonSize: 'h-12 text-sm w-full max-w-[280px]',
      spacingY: 'space-y-4',
      
      // Seções Gerais
      containerPadding: 'px-3',
      maxWidth: 'max-w-6xl',
      sectionPadding: 'py-12',
      sectionTitleSize: 'text-2xl',
      sectionSubtitleSize: 'text-sm',
      cardPadding: 'p-4',
      buttonHeight: 'h-11',
      gap: 'gap-4'
    }
  }

  // Layout para mobile pequeno (380px - 640px)
  if (isSm) {
    return {
      // Hero Section
      containerClass: 'min-h-screen-fixed flex flex-col justify-start items-center',
      heroContentClass: 'px-4 py-4',
      heroSpacing: 'pt-24 pb-8',
      titleSize: 'text-5xl',
      subtitleSize: 'text-2xl',
      buttonSize: 'h-12 text-base w-full max-w-[320px]',
      spacingY: 'space-y-5',
      
      // Seções Gerais
      containerPadding: 'px-4',
      maxWidth: 'max-w-6xl',
      sectionPadding: 'py-16',
      sectionTitleSize: 'text-2xl',
      sectionSubtitleSize: 'text-sm',
      cardPadding: 'p-5',
      buttonHeight: 'h-12',
      gap: 'gap-5'
    }
  }

  // Layout para mobile landscape (640px - 768px)
  if (isMd) {
    return {
      // Hero Section
      containerClass: 'min-h-screen-fixed flex flex-col justify-start items-center',
      heroContentClass: 'px-6 py-4',
      heroSpacing: 'pt-20 pb-8',
      titleSize: 'text-5xl',
      subtitleSize: 'text-2xl',
      buttonSize: 'h-12 text-base w-full max-w-[340px]',
      spacingY: 'space-y-6',
      
      // Seções Gerais
      containerPadding: 'px-6',
      maxWidth: 'max-w-6xl',
      sectionPadding: 'py-20',
      sectionTitleSize: 'text-3xl',
      sectionSubtitleSize: 'text-base',
      cardPadding: 'p-6',
      buttonHeight: 'h-12',
      gap: 'gap-6'
    }
  }

  // Layout para tablets (768px - 1024px)
  if (isTablet) {
    return {
      // Hero Section
      containerClass: 'min-h-screen-fixed flex flex-col justify-center items-center',
      heroContentClass: 'px-8 py-10',
      heroSpacing: isShortHeight ? 'pt-12 pb-8' : 'pt-16 pb-12',
      titleSize: 'text-5xl md:text-6xl',
      subtitleSize: 'text-2xl',
      buttonSize: 'h-12 text-lg min-w-[210px]',
      spacingY: 'space-y-7',
      
      // Seções Gerais
      containerPadding: 'px-8',
      maxWidth: 'max-w-6xl',
      sectionPadding: 'py-24',
      sectionTitleSize: 'text-3xl md:text-4xl',
      sectionSubtitleSize: 'text-base',
      cardPadding: 'p-7',
      buttonHeight: 'h-12',
      gap: 'gap-6'
    }
  }

  // Layout para desktop pequeno (1024px - 1280px)
  if (isLg) {
    return {
      // Hero Section
      containerClass: 'min-h-screen-fixed flex flex-col justify-center items-center',
      heroContentClass: 'px-8 py-12',
      heroSpacing: 'pt-16 md:pt-0',
      titleSize: 'text-6xl md:text-7xl',
      subtitleSize: 'text-2xl md:text-3xl',
      buttonSize: 'h-12 sm:h-14 text-base sm:text-lg min-w-[200px] sm:min-w-[220px]',
      spacingY: 'space-y-6 md:space-y-8',
      
      // Seções Gerais
      containerPadding: 'px-8',
      maxWidth: 'max-w-7xl',
      sectionPadding: 'py-24',
      sectionTitleSize: 'text-4xl',
      sectionSubtitleSize: 'text-base',
      cardPadding: 'p-8',
      buttonHeight: 'h-12',
      gap: 'gap-6'
    }
  }

  // Layout para desktop grande (> 1280px)
  return {
    // Hero Section
    containerClass: 'min-h-screen-fixed flex flex-col justify-center items-center',
    heroContentClass: 'px-4 sm:px-6 lg:px-8 py-12',
    heroSpacing: 'pt-16 md:pt-0',
    titleSize: 'text-4xl sm:text-5xl md:text-7xl',
    subtitleSize: 'text-xl sm:text-2xl md:text-3xl',
    buttonSize: 'h-12 sm:h-14 text-base sm:text-lg min-w-[200px] sm:min-w-[220px]',
    spacingY: 'space-y-6 md:space-y-8',
    
    // Seções Gerais
    containerPadding: 'px-4 sm:px-6 lg:px-8',
    maxWidth: 'max-w-7xl',
    sectionPadding: 'py-24',
    sectionTitleSize: 'text-4xl',
    sectionSubtitleSize: 'text-lg',
    cardPadding: 'p-8',
    buttonHeight: 'h-12',
    gap: 'gap-6'
  }
}

const carbonCredits = [
  // Florestal
  {
    id: 1,
    title: "Reflorestamento Amazônia",
    location: "Brasil",
    type: "Florestal",
    price: 12,
    available: 1500,
    sold: 75,
    verification: "Monitoramento via Satélite",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    description: "Projeto de recuperação de áreas degradadas na Amazônia"
  },
  {
    id: 2,
    title: "Mata Atlântica",
    location: "São Paulo, Brasil",
    type: "Florestal",
    price: 15,
    available: 800,
    sold: 60,
    verification: "Monitoramento via Satélite",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80",
    description: "Preservação e restauração da Mata Atlântica brasileira"
  },
  {
    id: 3,
    title: "Cerrado Brasileiro",
    location: "Goiás, Brasil",
    type: "Florestal",
    price: 10,
    available: 1200,
    sold: 45,
    verification: "Monitoramento via Satélite",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    description: "Conservação do segundo maior bioma da América do Sul"
  },
  {
    id: 4,
    title: "Mangue Costeiro",
    location: "Bahia, Brasil",
    type: "Florestal",
    price: 18,
    available: 500,
    sold: 85,
    verification: "Monitoramento via Satélite",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    description: "Restauração de manguezais e proteção costeira"
  },
  // Renovável
  {
    id: 5,
    title: "Energia Solar",
    location: "Portugal",
    type: "Renovável",
    price: 14,
    available: 900,
    sold: 70,
    verification: "Monitoramento via Satélite",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    description: "Parque solar fotovoltaico de grande escala"
  },
  {
    id: 6,
    title: "Energia Eólica",
    location: "Ceará, Brasil",
    type: "Renovável",
    price: 16,
    available: 700,
    sold: 55,
    verification: "Monitoramento via Satélite",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80",
    description: "Fazenda eólica offshore com energia limpa"
  },
  {
    id: 7,
    title: "Hidrelétrica PCH",
    location: "Minas Gerais, Brasil",
    type: "Renovável",
    price: 13,
    available: 600,
    sold: 40,
    verification: "Monitoramento via Satélite",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    description: "Pequena Central Hidrelétrica sustentável"
  },
  {
    id: 8,
    title: "Biomassa",
    location: "Paraná, Brasil",
    type: "Renovável",
    price: 11,
    available: 1000,
    sold: 30,
    verification: "Monitoramento via Satélite",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
    description: "Geração de energia a partir de resíduos agrícolas"
  },
  // Tecnologia
  {
    id: 9,
    title: "Captura Direta de CO₂",
    location: "Suíça",
    type: "Tecnologia",
    price: 25,
    available: 300,
    sold: 90,
    verification: "Monitoramento via Satélite",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    description: "Tecnologia DAC para remoção atmosférica de carbono"
  },
  {
    id: 10,
    title: "Biochar",
    location: "Estados Unidos",
    type: "Tecnologia",
    price: 22,
    available: 400,
    sold: 65,
    verification: "Monitoramento via Satélite",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
    description: "Sequestro de carbono através de carvão vegetal"
  },
  {
    id: 11,
    title: "Mineração de Carbono",
    location: "Islândia",
    type: "Tecnologia",
    price: 28,
    available: 250,
    sold: 80,
    verification: "Monitoramento via Satélite",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1465778893808-9b3d1b443be4?w=800&q=80",
    description: "Mineralização de CO₂ em rochas basálticas"
  },
  {
    id: 12,
    title: "Algas Oceânicas",
    location: "Austrália",
    type: "Tecnologia",
    price: 20,
    available: 500,
    sold: 50,
    verification: "Monitoramento via Satélite",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80",
    description: "Cultivo de algas para captura de carbono marinho"
  }
]

const categories = [
  { id: 'todos', label: 'All' },
  { id: 'Florestal', label: 'Forestry' },
  { id: 'Renovável', label: 'Renewable' },
  { id: 'Tecnologia', label: 'Technology' }
]

const stats = [
  { label: "Credits Sold", value: "125.8K", icon: TrendingUp },
  { label: "CO₂ Offset", value: "89.2t", icon: Leaf },
  { label: "Active Companies", value: "2.1K", icon: Users },
  { label: "Validations", value: "98.5%", icon: Shield }
]

const marketplaceFeatures = [
  {
    icon: Shield,
    title: "Scientific Verification",
    description: "All credits validated by recognized institutions"
  },
  {
    icon: Coins,
    title: "Transparent Pricing",
    description: "Fair marketplace with competitive prices and no hidden fees"
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Certified projects worldwide with full traceability"
  }
]

export default function MarketplacePage() {
  const router = useRouter()
  const { setIsCartOpen } = useLoading()
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([])
  const [userFootprint] = useState(85) // Pegada de carbono do usuário em tCO₂e
  
  // Hook de breakpoints inteligentes 
  const breakpoints = useSmartBreakpoints()
  
  const { scrollY } = useScroll()

  // Funções do carrinho
  const addToCart = (creditId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === creditId)
      if (existing) {
        return prev.map(item => 
          item.id === creditId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { id: creditId, quantity: 1 }]
    })
  }

  const removeFromCart = (creditId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === creditId)
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === creditId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      return prev.filter(item => item.id !== creditId)
    })
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const credit = carbonCredits.find(c => c.id === item.id)
      return total + (credit?.price || 0) * item.quantity
    }, 0)
  }

  const getCartCO2Total = () => {
    return cart.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  }

  // Filtrar projetos por categoria
  const filteredCredits = selectedCategory === 'todos' 
    ? carbonCredits 
    : carbonCredits.filter(credit => credit.type === selectedCategory)

  // Controlar estado do carrinho para mobile nav
  useEffect(() => {
    if (breakpoints.isMobile) {
      setIsCartOpen(cart.length > 0)
    }
    return () => {
      if (breakpoints.isMobile) {
        setIsCartOpen(false)
      }
    }
  }, [cart.length, breakpoints.isMobile, setIsCartOpen])

  // Fix viewport height for mobile to prevent browser UI from hiding
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the viewport height and multiply by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial viewport height
    setViewportHeight();

    // Listen for resize events (orientation change, etc.)
    const handleResize = () => {
      setViewportHeight();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  // Obter layout inteligente baseado nos breakpoints
  const {
    // Hero Section
    containerClass,
    heroContentClass,
    heroSpacing,
    titleSize,
    subtitleSize,
    buttonSize,
    spacingY,
    
    // Seções Gerais
    containerPadding,
    maxWidth,
    sectionPadding,
    sectionTitleSize,
    sectionSubtitleSize,
    cardPadding,
    buttonHeight,
    gap
  } = getSmartLayout(breakpoints)

  return (
    <div className="relative">
      <Navbar />
      
      {/* Hero Section - Design moderno da homepage */}
      <section 
        className={`fixed inset-0 ${containerClass} ${heroSpacing} h-screen`}
      >
        {/* Cor de fundo padrão */}
        <div className="absolute inset-0 bg-[#044050]" />
        
        <div className="absolute inset-0 overflow-hidden">
          {/* SplineBackground - Crystal Ball */}
          <SplineBackground />
          
          {/* Overlay para melhor legibilidade do conteúdo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 backdrop-blur-[0.5px]" style={{ zIndex: 2 }} />
        </div>
        
        <div className={`relative ${containerClass}`} style={{ zIndex: 10 }}>
          <div 
            className={`w-full max-w-6xl mx-auto text-center ${heroContentClass}`}
          >
            <div className={spacingY}>
              {/* Badge - Animação em cascata */}
              <motion.div 
                className={`inline-block ${breakpoints.isTablet ? 'mt-8' : breakpoints.isDesktop ? 'mt-12' : ''}`}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <motion.div 
                  className={`${breakpoints.isXs ? 'text-xs' : breakpoints.isMobile ? 'text-sm' : 'text-sm md:text-base'} font-medium tracking-[0.2em] uppercase text-white/80 transition-all duration-300 ${
                    breakpoints.isMobile 
                      ? '' // Mobile: sem fundo, apenas texto
                      : 'bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-xl hover:bg-white/10 hover:border-white/20'
                  } ${breakpoints.isXs ? 'px-0 py-0' : breakpoints.isMobile ? 'px-0 py-0' : 'px-6 py-3'}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Carbon Marketplace
                </motion.div>
              </motion.div>
              
              {/* Título principal com animação letra por letra */}
              <motion.div 
                className={`${breakpoints.isMobile ? 'mt-8' : 'mt-12'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.h1 
                  className={`${titleSize} font-light tracking-[-0.02em] leading-[0.9] text-white`}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <motion.span 
                    className="font-extralight inline-block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    Verified
                  </motion.span>
                  <br />
                  <motion.span 
                    className="font-medium inline-block"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    Credits
                  </motion.span>
                </motion.h1>
                
                <motion.div 
                  className={`${breakpoints.isMobile ? 'mt-4' : 'mt-6'} flex items-center justify-center space-x-2`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 1.2, 
                    duration: 0.8,
                    ease: "backOut"
                  }}
                >
                  <motion.div 
                    className="w-8 h-[1px] bg-gradient-to-r from-transparent to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  />
                  <motion.span 
                    className={`${breakpoints.isXs ? 'text-base' : breakpoints.isMobile ? 'text-lg' : 'text-xl'} font-light tracking-[0.15em] text-emerald-400/90 uppercase`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    Blockchain + Ciência
                  </motion.span>
                  <motion.div 
                    className="w-8 h-[1px] bg-gradient-to-l from-transparent to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: 32 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* Content Container - Scrolls over fixed hero (igual homepage) */}
      <main className={`relative z-10 ${
        breakpoints.isXs 
          ? 'mt-[calc(100vh-200px)]' 
          : breakpoints.isSm
          ? 'mt-[calc(100vh-250px)]'
          : breakpoints.isMobile 
          ? 'mt-[calc(100vh-280px)]' 
          : 'mt-[100vh]'
      } ${
        breakpoints.isMobile 
          ? 'pb-[140px]' 
          : 'pb-0'
      }`}>
      
      {/* Stats Section - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-white rounded-t-[48px]`}>
        {/* Linha de Slide iOS - Mobile apenas */}
        {breakpoints.isMobile && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full z-10" />
        )}
        
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <div className={`text-center ${breakpoints.isMobile ? 'mb-16' : 'mb-24'}`}>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4"
            >
              Impact in Numbers
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
            >
              <span className="font-extralight text-[#044050]">Active</span>
              <br />
              <span className="font-normal text-[#044050]">marketplace</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light leading-relaxed`}
            >
              Connecting companies to verified carbon projects with measurable impact
            </motion.p>
          </div>

          {/* Statistics Grid */}
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-2' : breakpoints.isTablet ? 'grid-cols-2' : 'grid-cols-4'} ${gap} ${breakpoints.isMobile ? 'mb-12' : 'mb-16'}`}>
            {stats.map((stat, index) => {
              const StatIcon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="mb-6 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#044050] flex items-center justify-center transition-all duration-300 group-hover:bg-[#5FA037]">
                      <StatIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className={`${breakpoints.isXs ? 'text-3xl' : breakpoints.isMobile ? 'text-4xl' : 'text-5xl'} font-extralight text-[#044050] mb-2`}>
                    {stat.value}
                  </div>
                  <h3 className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} font-medium text-gray-500 uppercase tracking-wider`}>
                    {stat.label}
                  </h3>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Marketplace - Projetos Visíveis */}
      <section className={`${sectionPadding} relative bg-gray-50`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          {/* Pegada de Carbono Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`border border-gray-200 ${breakpoints.isMobile ? 'rounded-2xl' : 'rounded-3xl'} bg-white p-6 mb-8`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#044050] flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Your Footprint</p>
                  <p className="text-2xl font-light text-[#044050]">{userFootprint} tCO₂<sub className="text-lg">e</sub></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-2">Offset</p>
                <p className="text-lg font-medium text-[#5FA037]">{getCartCO2Total()} tCO₂<sub>e</sub></p>
              </div>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex gap-3 mb-12 overflow-x-auto pb-2"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#5FA037] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#5FA037]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Section Title */}
          <div className={`text-center ${breakpoints.isMobile ? 'mb-12' : 'mb-16'}`}>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4"
            >
              Available Credits
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
            >
              <span className="font-extralight text-[#044050]">Verified</span>
              {' '}
              <span className="font-normal text-[#044050]">projects</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-base text-gray-500 font-light"
            >
              {filteredCredits.length} {filteredCredits.length === 1 ? 'project' : 'projects'} {selectedCategory !== 'todos' && `in ${selectedCategory} category`}
            </motion.p>
          </div>
          
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1' : breakpoints.isTablet ? 'grid-cols-2' : 'grid-cols-3'} ${gap} mb-12`}>
            {filteredCredits.map((credit, index) => {
              const cartItem = cart.find(item => item.id === credit.id)
              const quantity = cartItem?.quantity || 0
              
              return (
                <motion.div
                  key={credit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`border border-gray-200 ${breakpoints.isMobile ? 'rounded-2xl' : 'rounded-3xl'} overflow-hidden hover:border-[#5FA037] transition-colors duration-300 bg-white`}>
                    {/* Imagem do Projeto */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image 
                        src={credit.image}
                        alt={credit.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-white/90 backdrop-blur-sm text-[#044050] border-0">
                          {credit.type}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      {/* Título e Localização */}
                      <div>
                        <h3 className="text-xl font-medium text-[#044050] mb-1">
                          {credit.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-light">
                          {credit.location}
                        </p>
                      </div>

                      {/* Descrição */}
                      <p className="text-sm text-gray-600 font-light leading-relaxed">
                        {credit.description}
                      </p>

                      {/* Sold Percentage */}
                      {credit.sold > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-500 font-light">Sold</span>
                            <span className="font-medium text-[#044050]">{credit.sold}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#5FA037] rounded-full transition-all duration-500"
                              style={{ width: `${credit.sold}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Verificação */}
                      <div className="flex items-center gap-2 py-2">
                        <div className="w-5 h-5 rounded-full bg-[#5FA037]/10 flex items-center justify-center">
                          <Shield className="w-3 h-3 text-[#5FA037]" />
                        </div>
                        <span className="text-xs text-gray-600 font-light">
                          {credit.verification}
                        </span>
                      </div>

                      {/* Preço e Botão */}
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <div className="text-2xl font-light text-[#044050]">
                            €{credit.price}
                          </div>
                          <div className="text-xs text-gray-500">/tCO₂<sub>e</sub></div>
                        </div>
                        
                        {quantity > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(credit.id)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium text-[#044050] min-w-[20px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => addToCart(credit.id)}
                              className="w-8 h-8 rounded-full bg-[#5FA037] hover:bg-[#4d8c2d] text-white flex items-center justify-center transition-colors"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(credit.id)}
                            className="h-10 px-6 bg-[#5FA037] hover:bg-[#4d8c2d] text-white rounded-full text-sm font-medium transition-all duration-300"
                          >
                            Buy
                          </Button>
                        )}
                      </div>

                      {quantity > 0 && (
                        <div className="text-xs text-center text-gray-500 font-light pt-2">
                          {quantity} tCO₂e = €{(credit.price * quantity).toFixed(2)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Coming Soon Section - Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className={`border border-gray-200 ${breakpoints.isMobile ? 'rounded-2xl' : 'rounded-3xl'} bg-white overflow-hidden`}>
              <div className={`${breakpoints.isMobile ? 'p-8' : 'p-12 lg:p-16'} text-center`}>
                {/* Icon com animação */}
                <motion.div 
                  className="mb-8 flex justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2 
                  }}
                  viewport={{ once: true }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#044050] flex items-center justify-center">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* Título */}
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className={`${breakpoints.isMobile ? 'text-3xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
                >
                  <span className="font-extralight text-[#044050]">Marketplace</span>
                  <br />
                  <span className="font-normal text-[#044050]">in development</span>
                </motion.h3>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className={`${breakpoints.isMobile ? 'text-base' : 'text-lg lg:text-xl'} text-gray-600 font-light ${breakpoints.isMobile ? 'mb-10' : 'mb-12'} max-w-2xl mx-auto leading-relaxed`}
                >
                  Blockchain platform for secure transactions of verified carbon credits
                </motion.p>

                {/* Botões com animação */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className={`flex ${breakpoints.isMobile ? 'flex-col' : 'flex-row'} items-center justify-center ${breakpoints.isMobile ? 'gap-3' : 'gap-4'}`}
                >
                  {/* Botão Primário - Notificar */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={breakpoints.isMobile ? 'w-full' : ''}
                  >
                    <Button 
                      className={`group ${breakpoints.isMobile ? 'w-full' : 'min-w-[240px]'} ${
                        breakpoints.isXs 
                          ? 'h-11 text-sm px-6' 
                          : breakpoints.isMobile 
                          ? 'h-12 text-base px-8' 
                          : 'h-[52px] text-base px-10'
                      } rounded-full transition-all duration-500 bg-[#5FA037] text-white hover:bg-[#4d8c2d] font-normal tracking-tight shadow-md hover:shadow-lg hover:shadow-[#5FA037]/25 border-0 relative overflow-hidden`}
                    >
                      {/* Subtle shine effect on hover */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      
                      <span className="relative font-medium">Notify When Available</span>
                    </Button>
                  </motion.div>

                  {/* Secondary Button - Roadmap */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={breakpoints.isMobile ? 'w-full' : ''}
                  >
                    <Button 
                      variant="ghost"
                      className={`group ${breakpoints.isMobile ? 'w-full' : 'min-w-[200px]'} ${
                        breakpoints.isXs 
                          ? 'h-11 text-sm px-6' 
                          : breakpoints.isMobile 
                          ? 'h-12 text-base px-8' 
                          : 'h-[52px] text-base px-10'
                      } rounded-full transition-all duration-500 text-[#044050] hover:bg-[#044050]/5 border border-gray-300 hover:border-[#044050] font-normal tracking-tight backdrop-blur-md relative overflow-hidden`}
                    >
                      {/* Glass morphism effect */}
                      <span className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <span className="relative flex items-center justify-center gap-2">
                        <span className="font-medium">View Roadmap</span>
                        <ArrowRight className={`${breakpoints.isXs ? 'h-4 w-4' : 'h-[18px] w-[18px]'} transition-transform duration-300 group-hover:translate-x-1`} />
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </main>

      {/* Carrinho Fixo - Apple Style */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed ${
              breakpoints.isMobile 
                ? 'bottom-0 left-0 right-0' 
                : 'bottom-8 right-8'
            } z-[60]`}
          >
          <div className={`bg-white ${
            breakpoints.isMobile 
              ? 'border-t border-gray-200 rounded-t-[2rem] pb-safe-area-inset-bottom' 
              : 'border border-gray-200 rounded-3xl'
          } shadow-2xl shadow-black/10 overflow-hidden backdrop-blur-xl`}>
            <div className={breakpoints.isMobile ? 'p-4 pb-6' : 'p-6'}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5FA037] flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Your Cart</p>
                    <p className="text-lg font-light text-[#044050]">
                      {getCartCO2Total()} tCO₂<sub>e</sub>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCart([])}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {cart.map(item => {
                  const credit = carbonCredits.find(c => c.id === item.id)
                  if (!credit) return null
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{credit.title}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × €{credit.price}</p>
                      </div>
                      <p className="font-medium text-[#044050]">
                        €{(credit.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4 border-t border-gray-200 mb-4">
                <span className="text-lg font-medium text-gray-700">Total</span>
                <span className="text-2xl font-light text-[#044050]">
                  €{getCartTotal().toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button className={`w-full group ${
                breakpoints.isXs 
                  ? 'h-11 text-sm' 
                  : 'h-12 text-base'
              } rounded-full transition-all duration-500 bg-[#5FA037] text-white hover:bg-[#4d8c2d] font-normal tracking-tight shadow-md hover:shadow-lg hover:shadow-[#5FA037]/25 border-0 relative overflow-hidden`}>
                {/* Subtle shine effect on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                
                <span className="relative flex items-center justify-center gap-2">
                  <span className="font-medium">Checkout</span>
                  <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos para safe area (iOS) */}
      <style jsx global>{`
        .pb-safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0.75rem);
        }
        
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .pb-safe-area-inset-bottom {
            padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  )
}