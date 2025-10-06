"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cpu, Shield, CheckCircle2, Leaf, TrendingUp, Users, Globe, Zap, Star, Award, ChevronDown, ArrowRight, BarChart3, Lightbulb, Target } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import SplineBackground from '@/components/spline-background'
import { useRouter } from 'next/navigation'

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

const features = [
  {
    icon: Cpu,
    title: "Advanced Artificial Intelligence",
    description: "Specialized OCR and NLP with 98.5% accuracy in ESG data extraction from multilingual documents."
  },
  {
    icon: Shield,
    title: "Automated Scientific Validation",
    description: "Integrated APIs with recognized scientific institutions like the Botanical Garden for real-time validation."
  },
  {
    icon: CheckCircle2,
    title: "Blockchain Certification",
    description: "Immutable NFTs on Polygon network with embedded scientific metadata, fraud-resistant."
  },
  {
    icon: Leaf,
    title: "Carbon Marketplace",
    description: "AI-powered offset recommendations with satellite monitoring for verified carbon credits."
  }
]

const advantages = [
  { label: "Cost Reduction", value: "40%", description: "€35 vs €45-60 traditional", icon: TrendingUp },
  { label: "Speed", value: "4x", description: "3 weeks vs 6-12 months", icon: Zap },
  { label: "AI Accuracy", value: "98.5%", description: "ESG data extraction", icon: BarChart3 },
  { label: "Market Size", value: "€8.5B", description: "Annual opportunity", icon: Target }
]

const team = [
  {
    name: "Bruno Santos",
    role: "CTO & Co-founder",
    description: "Full-stack developer with 10 years of experience in SaaS platforms for sustainability.",
    image: "👨‍💻"
  },
  {
    name: "AI Team",
    role: "Artificial Intelligence",
    description: "Experts in OCR, NLP and specialized algorithms for ESG documents.",
    image: "🤖"
  },
  {
    name: "Scientific Partners",
    role: "Validation",
    description: "Lisbon Botanical Garden and other institutions for scientific validation.",
    image: "🔬"
  }
]

const aboutFeatures = [
  {
    icon: Lightbulb,
    title: "Technological Innovation",
    description: "First solution combining AI, scientific validation and blockchain for ESG"
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Serving 2.4M European SMEs with mandatory CSRD compliance by 2025"
  },
  {
    icon: Award,
    title: "Patented Technology",
    description: "Unique system protected by patent with proven competitive advantages"
  }
]

export default function SobrePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  // Hook de breakpoints inteligentes 
  const breakpoints = useSmartBreakpoints()
  
  const { scrollY } = useScroll()

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

  const handleIniciarValidacao = () => {
    router.push('/validacao')
  }

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
                  About GreenCheck
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
                    Revolutionizing
                  </motion.span>
                  <br />
                  <motion.span 
                    className="font-medium inline-block"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    ESG
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
                    className={`${breakpoints.isXs ? 'text-base' : breakpoints.isMobile ? 'text-lg' : 'text-xl'} font-light tracking-[0.15em] text-[#86FEA5]/90 uppercase`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    IA + Blockchain + Ciência
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
          ? 'pb-[120px]' 
          : 'pb-0'
      }`}>
      
      {/* Advantages Section - Clean Minimal */}
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
              Competitive Advantages
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
            >
              <span className="font-extralight text-[#044050]">Why</span>
              <br />
              <span className="font-normal text-[#044050]">GreenCheck?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light leading-relaxed`}
            >
              Patented technology with measurable advantages over traditional methods
            </motion.p>
          </div>

          {/* Advantages Grid */}
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-2' : breakpoints.isTablet ? 'grid-cols-2' : 'grid-cols-4'} ${gap} ${breakpoints.isMobile ? 'mb-12' : 'mb-16'}`}>
            {advantages.map((advantage, index) => {
              const AdvantageIcon = advantage.icon
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
                      <AdvantageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className={`${breakpoints.isXs ? 'text-3xl' : breakpoints.isMobile ? 'text-4xl' : 'text-5xl'} font-extralight text-[#044050] mb-2`}>
                    {advantage.value}
                  </div>
                  <h3 className={`${breakpoints.isXs ? 'text-sm' : 'text-base'} font-medium text-gray-500 uppercase tracking-wider mb-1`}>
                    {advantage.label}
                  </h3>
                  <p className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} text-gray-600 font-light`}>
                    {advantage.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
                  </div>
      </section>

          {/* Patent Section - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-gray-50`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className={`border border-gray-200 ${breakpoints.isMobile ? 'rounded-2xl' : 'rounded-3xl'} ${cardPadding} bg-white`}>
              <CardContent>
                <div className={`flex ${breakpoints.isMobile ? 'flex-col text-center' : 'items-center'} gap-6 ${breakpoints.isMobile ? 'mb-6' : 'mb-8'}`}>
                  <div className="w-16 h-16 rounded-full bg-[#044050] flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className={`${breakpoints.isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-light ${breakpoints.isMobile ? 'mb-2' : 'mb-4'} tracking-tight leading-[1.1]`}>
                      <span className="font-extralight text-[#044050]">Patented</span>
                      <br />
                      <span className="font-normal text-[#044050]">technology</span>
                    </h2>
                    <p className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} text-gray-600 font-light`}>Computational system for automated sustainable certification</p>
                  </div>
                </div>
                <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} ${gap}`}>
                  <div>
                    <h3 className={`${breakpoints.isXs ? 'text-lg' : 'text-xl'} font-medium text-[#044050] ${breakpoints.isMobile ? 'mb-4' : 'mb-6'}`}>Technical Innovations</h3>
                    <ul className={`space-y-3 ${breakpoints.isXs ? 'text-sm' : 'text-base'} text-gray-600 font-light`}>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>Specialized AI algorithms for ESG analysis</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>Automated scientific validation via APIs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>Immutable blockchain certificates with scientific proofs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>Integrated marketplace with AI recommendations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className={`${breakpoints.isXs ? 'text-lg' : 'text-xl'} font-medium text-[#044050] ${breakpoints.isMobile ? 'mb-4' : 'mb-6'}`}>Target Market</h3>
                    <ul className={`space-y-3 ${breakpoints.isXs ? 'text-sm' : 'text-base'} text-gray-600 font-light`}>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>2.4 million European SMEs (CSRD compliance)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>450 million environmentally conscious consumers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>B2B and B2C market with scalable solutions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5FA037] mt-2 flex-shrink-0"></div>
                        <span>€8.5 billion annual opportunity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-white`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <div className={`text-center ${breakpoints.isMobile ? 'mb-16' : 'mb-24'}`}>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4"
            >
              Features
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
            >
              <span className="font-extralight text-[#044050]">Cutting-edge</span>
              <br />
              <span className="font-normal text-[#044050]">technology</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light leading-relaxed`}
            >
              Solution integrating advanced technologies for accurate ESG certification
            </motion.p>
          </div>
          
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} ${gap} mb-12`}>
              {features.map((feature, index) => {
                const FeatureIcon = feature.icon
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className={`border border-gray-200 ${breakpoints.isMobile ? 'rounded-2xl' : 'rounded-3xl'} ${cardPadding} hover:border-[#5FA037] transition-colors duration-300 bg-white`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`${breakpoints.isXs ? 'w-12 h-12' : 'w-14 h-14'} rounded-full bg-[#044050] flex items-center justify-center transition-all duration-300 group-hover:bg-[#5FA037]`}>
                        <FeatureIcon className={`${breakpoints.isXs ? 'w-6 h-6' : 'w-7 h-7'} text-white`} />
                      </div>
                      <h3 className={`${breakpoints.isXs ? 'text-lg' : 'text-xl'} font-medium text-[#044050]`}>
                        {feature.title}
                      </h3>
                    </div>
                    <p className={`${breakpoints.isXs ? 'text-sm' : 'text-base'} text-gray-600 font-light leading-relaxed`}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
                )
              })}
            </div>
        </div>
      </section>

          {/* Team Section - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-gray-50`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <div className={`text-center ${breakpoints.isMobile ? 'mb-16' : 'mb-24'}`}>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4"
            >
              Our Team
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
            >
              <span className="font-extralight text-[#044050]">Experts</span>
              <br />
              <span className="font-normal text-[#044050]">in sustainability</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light leading-relaxed`}
            >
              Team combining technical expertise with scientific knowledge
            </motion.p>
          </div>
          
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1' : breakpoints.isTablet ? 'grid-cols-2' : 'grid-cols-3'} ${gap} mb-12`}>
              {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`border border-gray-200 ${breakpoints.isMobile ? 'rounded-2xl' : 'rounded-3xl'} ${cardPadding} hover:border-[#5FA037] transition-colors duration-300 bg-white text-center`}>
                  <div className="text-6xl mb-6">{member.image}</div>
                  <h3 className={`${breakpoints.isXs ? 'text-lg' : 'text-xl'} font-medium text-[#044050] mb-3`}>
                    {member.name}
                  </h3>
                  <Badge className="bg-[#5FA037]/10 text-[#5FA037] border-[#5FA037]/20 hover:bg-[#5FA037]/20 mb-4">
                    {member.role}
                  </Badge>
                  <p className={`${breakpoints.isXs ? 'text-sm' : 'text-base'} text-gray-600 font-light leading-relaxed`}>
                    {member.description}
                  </p>
                </div>
              </motion.div>
              ))}
            </div>
        </div>
      </section>

          {/* CTA Section - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-[#044050] text-white`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div               className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} font-medium tracking-[0.2em] uppercase text-white/80 bg-white/10 border border-white/20 px-6 py-3 rounded-full backdrop-blur-xl`}>
                Start Today
              </div>
            </motion.div>

            {/* Title */}
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
            >
              <span className="font-extralight text-white">Ready to</span>
              <br />
              <span className="font-normal text-white">transform ESG?</span>
            </motion.h3>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} text-white/90 ${breakpoints.isMobile ? 'mb-8' : 'mb-12'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto leading-relaxed font-light`}
            >
              Join companies that <span className="font-medium text-[#5FA037]">save 40%</span> on costs 
              and achieve results <span className="font-medium text-[#5FA037]">4x faster</span> with our patented technology.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className={`grid ${breakpoints.isMobile ? 'grid-cols-2' : 'grid-cols-4'} ${breakpoints.isMobile ? 'gap-4 mb-8' : 'gap-8 mb-12'} max-w-4xl mx-auto`}
            >
              <div className="text-center">
                <div className={`${breakpoints.isXs ? 'text-3xl' : breakpoints.isMobile ? 'text-4xl' : 'text-5xl'} font-extralight text-[#5FA037] mb-1`}>98.5%</div>
                <div className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} text-white/70 uppercase tracking-wider font-medium`}>AI Accuracy</div>
              </div>
              <div className="text-center">
                <div className={`${breakpoints.isXs ? 'text-3xl' : breakpoints.isMobile ? 'text-4xl' : 'text-5xl'} font-extralight text-[#5FA037] mb-1`}>40%</div>
                <div className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} text-white/70 uppercase tracking-wider font-medium`}>Savings</div>
              </div>
              <div className="text-center">
                <div className={`${breakpoints.isXs ? 'text-3xl' : breakpoints.isMobile ? 'text-4xl' : 'text-5xl'} font-extralight text-[#5FA037] mb-1`}>4x</div>
                <div className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} text-white/70 uppercase tracking-wider font-medium`}>Faster</div>
              </div>
              <div className="text-center">
                <div className={`${breakpoints.isXs ? 'text-3xl' : breakpoints.isMobile ? 'text-4xl' : 'text-5xl'} font-extralight text-[#5FA037] mb-1`}>€8.5B</div>
                <div className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} text-white/70 uppercase tracking-wider font-medium`}>Market</div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className={`flex ${breakpoints.isMobile ? 'flex-col' : 'flex-row'} ${breakpoints.isMobile ? 'gap-4' : 'gap-6'} justify-center items-center`}
            >
              <Button 
                onClick={handleIniciarValidacao}
                className={`${breakpoints.isMobile ? 'w-full max-w-sm' : 'px-10'} ${buttonHeight} bg-[#5FA037] text-white hover:bg-[#4d8c2d] rounded-full transition-all duration-300 font-normal tracking-wide group`}
              >
                <span className="flex items-center justify-center">
                  Start Free Validation
                  <ArrowRight className="ml-3 w-5 h-5 transition-all duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
              
              <Button 
                variant="ghost"
                className={`${breakpoints.isMobile ? 'w-full max-w-sm' : 'px-10'} ${buttonHeight} text-white hover:bg-white/10 border border-white/30 hover:border-white/50 rounded-full transition-all duration-300 font-normal tracking-wide backdrop-blur-xl`}
              >
                <span className="flex items-center justify-center">
                  Schedule Demo
                  <div className="ml-3 w-2 h-2 rounded-full bg-[#5FA037] transition-all duration-300 group-hover:bg-white"></div>
                </span>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'mt-8' : 'mt-12'} flex ${breakpoints.isMobile ? 'flex-col gap-4' : 'flex-row gap-8'} items-center justify-center text-white/70`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5FA037]" />
                <span className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} font-light`}>No commitment</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5FA037]" />
                <span className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} font-light`}>5 minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#5FA037]" />
                <span className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} font-light`}>Specialized support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </main>
    </div>
  )
}