"use client"

import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { ArrowRight, ChevronDown, ArrowUpRight, Shield, Globe, Cpu, TrendingUp, Leaf, CheckCircle2, Upload, BarChart3, Users, Zap, Star, X } from 'lucide-react'
import { Navbar } from '../components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import SplineBackground from '../components/spline-background'
import { useRouter } from 'next/navigation'
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
      heroSpacing: 'pt-16 pb-6',
      titleSize: 'text-3xl',
      subtitleSize: 'text-base',
      buttonSize: 'h-11 text-sm w-full max-w-[280px]',
      spacingY: 'space-y-3',
      
      // Seções Gerais
      sectionPadding: 'py-12',
      containerPadding: 'px-3',
      maxWidth: 'max-w-sm',
      sectionTitleSize: 'text-2xl',
      sectionSubtitleSize: 'text-sm',
      sectionTextSize: 'text-sm',
      badgeSize: 'text-xs px-3 py-1.5',
      gridCols: 'grid-cols-1',
      gap: 'gap-4',
      imageHeight: 'h-48',
      cardPadding: 'p-4',
      iconSize: 'w-5 h-5',
      buttonHeight: 'h-9'
    }
  }

  // Layout para mobile pequeno (380px - 640px)
  if (isSm) {
    return {
      // Hero Section
      containerClass: 'min-h-screen-fixed flex flex-col justify-start items-center',
      heroContentClass: 'px-4 py-4',
      heroSpacing: 'pt-20 pb-6',
      titleSize: 'text-4xl',
      subtitleSize: 'text-lg',
      buttonSize: 'h-12 text-base w-full max-w-[320px]',
      spacingY: 'space-y-4',
      
      // Seções Gerais
      sectionPadding: 'py-16',
      containerPadding: 'px-4',
      maxWidth: 'max-w-md',
      sectionTitleSize: 'text-2xl',
      sectionSubtitleSize: 'text-sm',
      sectionTextSize: 'text-base',
      badgeSize: 'text-sm px-4 py-2',
      gridCols: 'grid-cols-1',
      gap: 'gap-5',
      imageHeight: 'h-56',
      cardPadding: 'p-5',
      iconSize: 'w-6 h-6',
      buttonHeight: 'h-10'
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
      sectionPadding: 'py-20',
      containerPadding: 'px-6',
      maxWidth: 'max-w-2xl',
      sectionTitleSize: 'text-3xl',
      sectionSubtitleSize: 'text-base',
      sectionTextSize: 'text-base',
      badgeSize: 'text-sm px-4 py-2',
      gridCols: 'grid-cols-1 md:grid-cols-2',
      gap: 'gap-6',
      imageHeight: 'h-64',
      cardPadding: 'p-6',
      iconSize: 'w-6 h-6',
      buttonHeight: 'h-11'
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
      sectionPadding: 'py-24',
      containerPadding: 'px-8',
      maxWidth: 'max-w-5xl',
      sectionTitleSize: 'text-3xl md:text-4xl',
      sectionSubtitleSize: 'text-base',
      sectionTextSize: 'text-lg',
      badgeSize: 'text-sm px-4 py-2',
      gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      gap: 'gap-8',
      imageHeight: 'h-72',
      cardPadding: 'p-7',
      iconSize: 'w-7 h-7',
      buttonHeight: 'h-12'
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
      sectionPadding: 'py-24',
      containerPadding: 'px-8',
      maxWidth: 'max-w-6xl',
      sectionTitleSize: 'text-4xl',
      sectionSubtitleSize: 'text-base',
      sectionTextSize: 'text-lg',
      badgeSize: 'text-sm px-4 py-2',
      gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      gap: 'gap-8',
      imageHeight: 'h-80',
      cardPadding: 'p-8',
      iconSize: 'w-6 h-6',
      buttonHeight: 'h-12'
    }
  }

  // Layout para desktop grande (> 1280px)
  return {
    // Hero Section
    containerClass: 'min-h-screen-fixed flex flex-col justify-center items-center',
    heroContentClass: 'px-4 sm:px-6 lg:px-8 py-12',
    heroSpacing: 'pt-16 md:pt-0',
    titleSize: 'text-4xl sm:text-5xl md:text-8xl',
    subtitleSize: 'text-xl sm:text-2xl md:text-3xl',
    buttonSize: 'h-12 sm:h-14 text-base sm:text-lg min-w-[200px] sm:min-w-[220px]',
    spacingY: 'space-y-6 md:space-y-8',
    
    // Seções Gerais
    sectionPadding: 'py-24',
    containerPadding: 'px-4 sm:px-6 lg:px-8',
    maxWidth: 'max-w-7xl',
    sectionTitleSize: 'text-4xl',
    sectionSubtitleSize: 'text-lg',
    sectionTextSize: 'text-lg',
    badgeSize: 'text-sm px-4 py-2',
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    gap: 'gap-8',
    imageHeight: 'h-full',
    cardPadding: 'p-8',
    iconSize: 'w-6 h-6',
    buttonHeight: 'h-12'
  }
}

// Interface para o item de galeria
interface GalleryItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  featured: boolean
  displayOrder?: number
  createdAt: number
  isHomeAboutImage?: boolean
  homePosition?: number
}

// Homepage slogans for GreenCheck - Focused on B2B benefits
const slogans = [
  "ESG Certification in 21 days, not 6 months",
  "98.5% accuracy with AI + Scientific Validation",
  "Save 40% vs traditional methods - €35/tCO₂e",
  "Immutable NFT certificates on Polygon Blockchain",
  "Guaranteed CSRD compliance for your SME"
]

// Main GreenCheck features
const features = [
  {
    title: "Advanced Artificial Intelligence",
    description: "Specialized OCR and NLP with 98.5% accuracy in ESG data extraction",
    icon: <Cpu className="w-6 h-6" />
  },
  {
    title: "Automated Scientific Validation",
    description: "Integrated APIs with recognized scientific institutions for real-time validation",
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: "Blockchain Certification",
    description: "Immutable NFTs on Polygon network with embedded scientific metadata",
    icon: <CheckCircle2 className="w-6 h-6" />
  },
  {
    title: "Carbon Marketplace",
    description: "AI-powered offset recommendations with satellite monitoring",
    icon: <Leaf className="w-6 h-6" />
  }
]

// GreenCheck statistics and impact
const impactStats = [
  {
    value: "2.4M",
    label: "European SMEs",
    description: "Companies requiring CSRD certification by 2025",
    icon: <Users className="w-8 h-8" />
  },
  {
    value: "€8.5B",
    label: "Annual Market",
    description: "Opportunity in European ESG certification market",
    icon: <TrendingUp className="w-8 h-8" />
  },
  {
    value: "98.5%",
    label: "AI Accuracy",
    description: "Accuracy rate in ESG data extraction",
    icon: <Cpu className="w-8 h-8" />
  },
  {
    value: "4x",
    label: "Faster",
    description: "Compared to traditional certification methods",
    icon: <Zap className="w-8 h-8" />
  }
]

const certificationPartners = [
  {
    name: "Plantarum Botanical Garden",
    role: "Scientific Validation",
    description: "Partnership for environmental data validation via institutional APIs from Rio de Janeiro"
  },
  {
    name: "Polygon Network",
    role: "Blockchain Certificate",
    description: "Immutable NFTs with embedded scientific metadata"
  },
  {
    name: "Sentinel-2 Satellite",
    role: "Orbital Monitoring",
    description: "Carbon offset verification via satellite data"
  }
]

export default function Home() {
  const router = useRouter()
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [processSteps] = useState([
    { id: 1, title: "Document Upload", description: "Submit your ESG report in PDF" },
    { id: 2, title: "AI Processing", description: "OCR and NLP analysis with 98.5% accuracy" },
    { id: 3, title: "Scientific Validation", description: "Automatic verification via institutional APIs" },
    { id: 4, title: "Blockchain Certification", description: "Immutable NFT on Polygon network" }
  ])
  
  const { scrollY } = useScroll()
  
  // Hook de breakpoints inteligentes 
  const breakpoints = useSmartBreakpoints()

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

  // Simulação de dados para demo
  useEffect(() => {
    // Simular carregamento
  }, [mounted])

  // Typewriter effect - solução funcional da internet
  useEffect(() => {
    const currentText = slogans[currentIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Digitando
        setDisplayedText(currentText.substring(0, displayedText.length + 1))
        
        // Se terminou de digitar
        if (displayedText === currentText) {
          setTimeout(() => setIsDeleting(true), 2000) // Pausa 2s
        }
      } else {
        // Apagando
        setDisplayedText(currentText.substring(0, displayedText.length - 1))
        
        // Se terminou de apagar
        if (displayedText === '') {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % slogans.length)
        }
      }
    }, isDeleting ? 30 : 50) // Apagar é mais rápido que digitar
    
    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentIndex])

  const handleIniciarValidacao = () => {
    router.push('/validacao')
  }

  const handleVerMarketplace = () => {
    router.push('/marketplace')
  }

  const handleSaibaMais = () => {
    router.push('/sobre')
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  // Tema claro moderno para GreenCheck
  const isDark = false
  
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
    sectionPadding,
    containerPadding,
    maxWidth,
    sectionTitleSize,
    sectionSubtitleSize,
    sectionTextSize,
    badgeSize,
    gridCols,
    gap,
    imageHeight,
    cardPadding,
    iconSize,
    buttonHeight
  } = getSmartLayout(breakpoints)

  return (
    <div className="relative">
      <Navbar />
      
      {/* Hero Section - Fixed Background (All devices) - Design limpo igual outras páginas */}
      <section 
        className={`fixed inset-0 ${containerClass} ${heroSpacing} h-screen`}
      >
        {/* Cor de fundo padrão */}
        <div className="absolute inset-0 bg-[#044050]" />
        
        <div className="absolute inset-0 overflow-hidden">
          {/* Iframe Spline - Crystal Ball */}
          <SplineBackground />
          
          {/* Overlay para melhor legibilidade do conteúdo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 backdrop-blur-[0.5px]" style={{ zIndex: 2 }} />
        </div>
        
        <div className={`relative ${containerClass}`} style={{ zIndex: 10 }}>
          <div 
            className={`w-full max-w-6xl mx-auto text-center ${heroContentClass}`}
          >
            <div className={spacingY}>
              {/* Badge minimalista */}
              <motion.div 
                className={`inline-block ${breakpoints.isTablet ? 'mt-6' : breakpoints.isDesktop ? 'mt-8' : 'mt-4'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <motion.div 
                  className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} font-light tracking-[0.3em] uppercase text-[#E5FFBA]/90 drop-shadow-md ${
                    breakpoints.isMobile 
                      ? 'px-4 py-2' 
                      : 'px-6 py-2.5 bg-[#E5FFBA]/10 border border-[#E5FFBA]/30 rounded-full backdrop-blur-md'
                  }`}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(229, 255, 186, 0.08)' }}
                  transition={{ duration: 0.3 }}
                >
                  Automated ESG Certification
                </motion.div>
              </motion.div>
              
              {/* Título principal elegante */}
              <motion.div 
                className={`${breakpoints.isMobile ? 'mt-12' : 'mt-16'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <motion.h1 
                  className={`${titleSize} font-extralight tracking-[-0.03em] leading-[0.95] text-white drop-shadow-lg`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <motion.span 
                    className="inline-block font-extralight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    Green
                  </motion.span>
                  <motion.span 
                    className="inline-block font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    Check
                  </motion.span>
                </motion.h1>
                
                {/* Linha decorativa minimalista */}
                <motion.div 
                  className={`${breakpoints.isMobile ? 'mt-6' : 'mt-8'} flex items-center justify-center gap-4`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  <motion.div 
                    className="h-px bg-gradient-to-r from-transparent via-[#E5FFBA]/40 to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: breakpoints.isMobile ? '60%' : '280px' }}
                    transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>
                
                <motion.p 
                  className={`${breakpoints.isXs ? 'text-sm' : breakpoints.isMobile ? 'text-base' : 'text-lg'} font-light tracking-[0.2em] text-[#E5FFBA]/80 uppercase mt-6 drop-shadow-md`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  IA + Blockchain + Ciência
                </motion.p>
              </motion.div>
              
              {/* Descrição elegante */}
              <motion.div 
                className={`${breakpoints.isMobile ? 'mt-10' : 'mt-12'} ${breakpoints.isMobile ? 'max-w-[90%]' : 'max-w-3xl'} mx-auto px-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 1.6, 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <motion.div 
                  className={`${breakpoints.isXs ? 'text-sm' : breakpoints.isMobile ? 'text-base' : 'text-xl'} font-light leading-relaxed text-white/95 drop-shadow-md ${breakpoints.isMobile ? 'min-h-[3.5em]' : 'min-h-[2.5em]'} flex items-center justify-center text-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.8 }}
                >
                  <span className="inline-flex items-baseline">
                    <span>{displayedText}</span>
                    <span 
                      className={`inline-block bg-white/90 ml-0.5 ${breakpoints.isMobile ? 'w-[2px] h-[1em]' : 'w-0.5 h-[1.2em]'}`}
                      style={{
                        animation: 'blink 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    />
                  </span>
                </motion.div>
              </motion.div>
              
              {/* Botões elegantes e minimalistas - Apple Style */}
              <motion.div 
                className={`${breakpoints.isMobile ? 'mt-10' : 'mt-14'} flex ${breakpoints.isMobile ? 'flex-col' : 'flex-row'} items-center justify-center ${breakpoints.isMobile ? 'gap-3' : 'gap-4'} ${breakpoints.isMobile ? 'px-6' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 2.0, 
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {/* Botão Primário - Upload */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 2.2, 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={breakpoints.isMobile ? 'w-full' : ''}
                >
                  <Button 
                    size="lg" 
                    onClick={handleIniciarValidacao}
                    className={`group ${breakpoints.isMobile ? 'w-full' : 'min-w-[200px] px-8'} ${
                      breakpoints.isXs 
                        ? 'h-11 text-sm' 
                        : breakpoints.isMobile 
                        ? 'h-12 text-base' 
                        : 'h-[52px] text-base'
                    } rounded-full transition-all duration-500 bg-[#5FA037] text-white hover:bg-[#4d8c2d] font-normal tracking-tight shadow-md hover:shadow-lg hover:shadow-[#5FA037]/25 border-0 relative overflow-hidden`}
                  >
                    {/* Subtle shine effect on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    
                    <span className="relative flex items-center justify-center gap-2.5">
                      <span className="font-medium">Start Upload</span>
                      <Upload className={`${breakpoints.isXs ? 'h-4 w-4' : 'h-[18px] w-[18px]'} transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105`} />
                    </span>
                  </Button>
                </motion.div>
                
                {/* Botão Secundário - Marketplace */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 2.4, 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={breakpoints.isMobile ? 'w-full' : ''}
                >
                  <Button 
                    size="lg" 
                    variant="ghost"
                    onClick={handleVerMarketplace}
                    className={`group ${breakpoints.isMobile ? 'w-full' : 'min-w-[200px] px-8'} ${
                      breakpoints.isXs 
                        ? 'h-11 text-sm' 
                        : breakpoints.isMobile 
                        ? 'h-12 text-base' 
                        : 'h-[52px] text-base'
                    } rounded-full transition-all duration-500 text-white hover:bg-white/[0.08] border border-white/20 hover:border-white/40 font-normal tracking-tight backdrop-blur-md bg-white/[0.03] relative overflow-hidden`}
                  >
                    {/* Glass morphism effect */}
                    <span className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <span className="relative flex items-center justify-center gap-2.5">
                      <span className="font-medium">View Marketplace</span>
                      <ArrowRight className={`${breakpoints.isXs ? 'h-4 w-4' : 'h-[18px] w-[18px]'} transition-transform duration-300 group-hover:translate-x-1`} />
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* Content Container - Scrolls over fixed hero (All devices) */}
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
      
      {/* O Que Fazemos - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-white rounded-t-[48px]`}>
        {/* Linha de Slide iOS - Mobile apenas */}
        {breakpoints.isMobile && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 rounded-full z-10" />
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
              What We Do
            </motion.p>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}
              >
              <span className="font-extralight text-[#044050]">Sustainability</span>
              <br />
              <span className="font-normal text-[#044050]">without complexity</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light leading-relaxed`}
              >
              Integrated platform for ESG certification and carbon neutralization
              </motion.p>
          </div>

          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1' : breakpoints.isTablet ? 'grid-cols-2' : 'grid-cols-4'} ${breakpoints.isMobile ? 'gap-8' : 'gap-12'}`}>
            {[
              {
                icon: CheckCircle2,
                title: "Automated Certification",
                description: "98.5% accuracy with AI"
              },
              {
                icon: Shield,
                title: "Immutable Blockchain",
                description: "NFTs on Polygon network"
              },
              {
                icon: Leaf,
                title: "Scientific Validation",
                description: "Recognized partners"
              },
              {
                icon: Globe,
                title: "100% Digital",
                description: "Simple and intuitive"
              }
            ].map((item, index) => {
              const ItemIcon = item.icon
              return (
              <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                  className="group text-center"
                >
                  <div className="mb-6 flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#044050] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#5FA037]">
                      <ItemIcon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className={`${breakpoints.isXs ? 'text-base' : 'text-lg'} font-medium text-[#044050] mb-2`}>
                    {item.title}
                  </h3>
                  <p className={`${breakpoints.isXs ? 'text-sm' : 'text-base'} text-gray-600 font-light`}>
                    {item.description}
                  </p>
              </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-slate-50`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1 gap-16' : 'md:grid-cols-2 gap-20'} items-center`}>
            {/* Coluna Esquerda - Texto */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={breakpoints.isMobile ? 'text-center' : ''}
            >
              <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6">
                Technology
              </p>
              <h2 className={`${breakpoints.isMobile ? 'text-3xl' : 'text-4xl lg:text-5xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.15]`}>
                <span className="font-extralight text-[#044050]">The power of</span>
                <br />
                <span className="font-medium text-[#044050]">innovation</span>
              </h2>
              <p className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} text-gray-600 font-light leading-relaxed`}>
                Cutting-edge technology for accurate and reliable ESG certification
              </p>
            </motion.div>

            {/* Coluna Direita - Stack Tecnológico */}
                <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
              className="space-y-8"
            >
              {/* AI */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#044050] flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                    </div>
                  <h3 className="text-xl font-medium text-[#044050]">Artificial Intelligence</h3>
                  </div>
                <ul className="space-y-2 text-gray-600 font-light ml-16">
                  <li>• Automatic data extraction</li>
                  <li>• Carbon emission calculation</li>
                  <li>• Multi-standard compliance</li>
                </ul>
              </div>

              {/* Blockchain */}
              <div className="border-b border-gray-200 pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#044050] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[#044050]">Blockchain</h3>
                </div>
                <ul className="space-y-2 text-gray-600 font-light ml-16">
                  <li>• NFT certificates on Polygon</li>
                  <li>• Cost &lt; €0.01 per transaction</li>
                  <li>• Instant QR verification</li>
                </ul>
              </div>

              {/* Scientific */}
              <div className="pb-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#044050] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[#044050]">Scientific Validation</h3>
                </div>
                <ul className="space-y-2 text-gray-600 font-light ml-16">
                  <li>• Botanical garden partnership</li>
                  <li>• International methodologies</li>
                  <li>• Continuous monitoring</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Preços - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-white`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <div className={`text-center ${breakpoints.isMobile ? 'mb-16' : 'mb-24'}`}>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4">
              Pricing
            </p>
            <h2 className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}>
              <span className="font-extralight text-[#044050]">Simple pricing</span>
              <br />
              <span className="font-normal text-[#044050]">for everyone</span>
            </h2>
            <p className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light`}>
              From individuals to large enterprises
            </p>
          </div>
          
          {/* Plans Grid - Minimal */}
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1' : breakpoints.isTablet ? 'grid-cols-2' : 'grid-cols-4'} ${breakpoints.isMobile ? 'gap-6' : 'gap-8'}`}>
            {[
              { label: 'SMEs', title: 'ESG Certificate', price: '€35', unit: 'per tCO₂e', desc: 'For small businesses' },
              { label: 'People', title: 'Subscription', price: '€9.99', unit: 'per month', desc: 'For individuals' },
              { label: 'Corporate', title: 'Enterprise', price: '€2,500', unit: 'per month', desc: 'Custom solutions' },
              { label: 'All', title: 'Marketplace', price: '8%', unit: 'commission', desc: 'Carbon credits' }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="border border-gray-200 rounded-3xl p-8 hover:border-[#5FA037] transition-colors duration-300">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-8">{plan.label}</p>
                  <h3 className="text-2xl font-medium text-[#044050] mb-2">{plan.title}</h3>
                  <p className="text-sm text-gray-500 font-light mb-8">{plan.desc}</p>
                  <div className="mb-8">
                    <div className="text-4xl font-light text-black mb-1">{plan.price}</div>
                    <div className="text-sm text-gray-500 font-light">{plan.unit}</div>
                </div>
                  <Button 
                    onClick={index === 3 ? handleVerMarketplace : handleIniciarValidacao}
                    className="w-full h-11 bg-[#5FA037] hover:bg-[#4d8c2d] text-white rounded-full transition-all duration-300 font-normal"
                  >
                    {index === 2 ? 'Contact' : index === 3 ? 'Explore' : 'Start'}
                  </Button>
              </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-slate-50`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <div className={`text-center ${breakpoints.isMobile ? 'mb-16' : 'mb-24'}`}>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4">
              Why Choose Us
            </p>
            <h2 className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}>
              <span className="font-extralight text-[#044050]">Better, faster</span>
              <br />
              <span className="font-normal text-[#044050]">more affordable</span>
            </h2>
            <p className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light`}>
              Measurable advantages over traditional solutions
            </p>
          </div>
          
          {/* Simple Stats Grid */}
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-2' : 'grid-cols-4'} ${breakpoints.isMobile ? 'gap-8' : 'gap-12'} max-w-5xl mx-auto`}>
            {[
              { value: '40%', label: 'Cheaper' },
              { value: '4×', label: 'Faster' },
              { value: '98.5%', label: 'Accuracy' },
              { value: '100%', label: 'Transparent' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl lg:text-6xl font-extralight text-[#044050] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 font-light uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners - Clean Minimal */}
      <section className={`${sectionPadding} relative bg-white`}>
        <div className={`${maxWidth} mx-auto ${containerPadding}`}>
          <div className={`text-center ${breakpoints.isMobile ? 'mb-16' : 'mb-24'}`}>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4">
              Partners
            </p>
            <h2 className={`${breakpoints.isMobile ? 'text-4xl' : 'text-5xl lg:text-6xl'} font-light ${breakpoints.isMobile ? 'mb-6' : 'mb-8'} tracking-tight leading-[1.1]`}>
              <span className="font-extralight text-[#044050]">Scientific</span>
              <br />
              <span className="font-normal text-[#044050]">validation</span>
            </h2>
            <p className={`${breakpoints.isMobile ? 'text-lg' : 'text-xl'} ${breakpoints.isMobile ? 'max-w-lg' : 'max-w-2xl'} mx-auto text-gray-600 font-light`}>
              Working with leading institutions for certification credibility
            </p>
          </div>
          
          {/* Partners List - Minimal */}
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} ${breakpoints.isMobile ? 'gap-12' : 'gap-16'} max-w-5xl mx-auto`}>
            {certificationPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[#044050] flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-[#5FA037]">
                  {index === 0 && <Leaf className="w-8 h-8 text-white" />}
                  {index === 1 && <Shield className="w-8 h-8 text-white" />}
                  {index === 2 && <Globe className="w-8 h-8 text-white" />}
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{partner.role}</p>
                <h3 className="text-xl font-medium text-[#044050] mb-3">{partner.name}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    {/* Footer - Clean Minimal */}
    <footer className="bg-[#044050] text-white">
      <div className={`${maxWidth} mx-auto ${containerPadding}`}>
        {/* Links Grid */}
        <div className={`${breakpoints.isMobile ? 'py-12' : 'py-16'} border-b border-white/10`}>
          <div className={`grid ${breakpoints.isMobile ? 'grid-cols-2 gap-x-8 gap-y-12' : breakpoints.isTablet ? 'grid-cols-3 gap-12' : 'grid-cols-5 gap-8'}`}>
            
            {/* Platform */}
            <div>
              <h4 className="text-xs font-medium text-white uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><a href="/validacao" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">ESG Validation</a></li>
                <li><a href="/marketplace" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Marketplace</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">NFT Certificates</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">API</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-medium text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="/sobre" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">About</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Careers</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Press</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Blog</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-medium text-white uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Help Center</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Documentation</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Contact</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Status</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-medium text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Privacy</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Terms</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Cookies</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Licenses</a></li>
              </ul>
        </div>

            {/* Connect */}
            <div>
              <h4 className="text-xs font-medium text-white uppercase tracking-wider mb-4">Connect</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">Twitter</a></li>
                <li><a href="#" className="text-sm text-white/70 hover:text-[#5FA037] transition-colors font-light">GitHub</a></li>
              </ul>
          </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`${breakpoints.isMobile ? 'py-8' : 'py-10'} flex ${breakpoints.isMobile ? 'flex-col gap-4 text-center' : 'flex-row justify-between items-center'}`}>
          <p className="text-sm text-white/60 font-light">
            © 2025 GreenCheck. All rights reserved.
          </p>
          <p className="text-sm text-white/60 font-light">
            Made with care for the planet
          </p>
        </div>
      </div>
    </footer>
    </main>
    </div>
  )
}
