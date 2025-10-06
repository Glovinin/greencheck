"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useLoading } from '../contexts/loading-context'
import Image from 'next/image'

// Cache key para o Spline iframe
const SPLINE_CACHE_KEY = 'greencheck_spline_loaded'
const SPLINE_CACHE_TIMESTAMP = 'greencheck_spline_timestamp'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

export default function InitialLoading() {
  const { isInitialLoading, isPageLoading } = useLoading()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [splinePreloaded, setSplinePreloaded] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [logoTransitioning, setLogoTransitioning] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Detectar se é mobile para otimizar performance
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Verificar se o Spline já foi carregado antes (cache)
    const checkSplineCache = () => {
      try {
        const cached = localStorage.getItem(SPLINE_CACHE_KEY)
        const timestamp = localStorage.getItem(SPLINE_CACHE_TIMESTAMP)
        
        if (cached && timestamp) {
          const cacheAge = Date.now() - parseInt(timestamp)
          if (cacheAge < CACHE_DURATION) {
            console.log('🔮 Spline encontrado no cache local')
            setSplinePreloaded(true)
            return
          }
        }
        
        console.log('🔮 Spline não encontrado no cache, carregando...')
      } catch (error) {
        console.error('Erro ao verificar cache do Spline:', error)
      }
    }
    
    checkSplineCache()
    
    // Após 2.5s, iniciar a transição da logo para o navbar
    const transitionTimer = setTimeout(() => {
      console.log('🚀 Iniciando transição da logo para o navbar')
      setLogoTransitioning(true)
      
      // Notificar o navbar que a transição começou
      window.dispatchEvent(new CustomEvent('logo-transition-start'))
    }, 2500)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(transitionTimer)
    }
  }, [])

  if (!mounted) {
    return null
  }

  // Loading rápido para navegação entre páginas
  if (isPageLoading && !isInitialLoading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/20 p-3 mb-2">
              <Image
                src="/images/logo greencheck.png"
                alt="GreenCheck Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Versão única com Crystal Ball 3D para todos os dispositivos
  return (
    <AnimatePresence>
      {isInitialLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: logoTransitioning ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-[#044050]"
        >
          {/* Placeholder gradient enquanto carrega - oculta mais rápido se já está em cache */}
          <motion.div 
            className={`absolute inset-0 transition-opacity ${
              splinePreloaded ? 'duration-300' : 'duration-1000'
            } bg-gradient-to-br from-blue-900 via-slate-900 to-black`}
            animate={{ 
              opacity: (iframeLoaded || splinePreloaded) ? (logoTransitioning ? 0 : 0) : 1
            }}
            transition={{ duration: logoTransitioning ? 0.6 : 1 }}
          />
          
          {/* Spline 3D Animation - Crystal Ball com watermark escondido */}
          <motion.iframe 
            src='https://my.spline.design/crystalball-35c36a2f9650bec5da71971cf512f33f/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            animate={{ 
              opacity: logoTransitioning ? 0 : ((iframeLoaded || splinePreloaded) ? 1 : 0)
            }}
            transition={{ 
              duration: logoTransitioning ? 0.6 : (splinePreloaded ? 0.3 : 1)
            }}
            style={{
              position: 'absolute',
              // Desktop: aumenta o iframe e desloca para esconder o watermark
              // Mobile: mantém normal
              top: isMobile ? 0 : '-5%',
              left: isMobile ? 0 : '-5%',
              width: isMobile ? '100%' : '110%',
              height: isMobile ? '100%' : '110%',
              border: 'none',
              overflow: 'hidden'
            }}
            onLoad={() => {
              console.log('🔮 Spline Crystal Ball carregado - watermark escondido')
              setIframeLoaded(true)
              
              // Salvar no cache local
              try {
                localStorage.setItem(SPLINE_CACHE_KEY, 'true')
                localStorage.setItem(SPLINE_CACHE_TIMESTAMP, Date.now().toString())
                console.log('✅ Spline salvo no cache local por 24h')
              } catch (error) {
                console.error('Erro ao salvar cache do Spline:', error)
              }
            }}
            title="Crystal Ball 3D Loading Animation"
          />

          {/* Bloco sólido para esconder watermark - Desktop apenas */}
          {!isMobile && (
            <div 
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{
                width: '300px',
                height: '100px',
                backgroundColor: '#044050',
                zIndex: 10
              }}
            />
          )}

          {/* Logo GreenCheck - Transição épica do centro para o navbar */}
          <motion.div 
            className="absolute z-[10000] pointer-events-none"
            initial={{ 
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%'
            }}
            animate={logoTransitioning ? {
              top: isMobile ? '8px' : '20px',
              left: isMobile ? '24px' : '40px',
              x: '0%',
              y: '0%',
              scale: isMobile ? 0.4 : 0.6
            } : {
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%'
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1], // easing suave e profissional
              delay: 0
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="flex flex-col items-center gap-4"
            >
              {/* Logo com pulse effect - para quando inicia transição */}
              <motion.div
                animate={!logoTransitioning ? {
                  scale: [1, 1.05, 1],
                  filter: [
                    "drop-shadow(0 0 20px rgba(229, 255, 186, 0.3))",
                    "drop-shadow(0 0 30px rgba(229, 255, 186, 0.5))",
                    "drop-shadow(0 0 20px rgba(229, 255, 186, 0.3))"
                  ]
                } : {
                  filter: "drop-shadow(0 0 0px rgba(229, 255, 186, 0))"
                }}
                transition={{
                  duration: 2,
                  repeat: logoTransitioning ? 0 : Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/favicon.png"
                  alt="GreenCheck Logo"
                  width={isMobile ? 100 : 120}
                  height={isMobile ? 100 : 120}
                  className="drop-shadow-2xl"
                  priority
                />
              </motion.div>
              
              {/* Nome GreenCheck e dots - desaparecem na transição */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: logoTransitioning ? 0 : 1, 
                  y: 0 
                }}
                transition={{ 
                  opacity: { duration: 0.3 },
                  y: { duration: 0.6, delay: 0.8 }
                }}
                className="text-center"
              >
                <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-light text-white drop-shadow-lg tracking-wide`}>
                  <span className="font-extralight">Green</span>
                  <span className="font-medium">Check</span>
                  <span className="text-lg align-super">™</span>
                </h1>
                
                {/* Loading dots animados */}
                <motion.div
                  className="flex items-center justify-center gap-1 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: logoTransitioning ? 0 : 1 }}
                  transition={{ delay: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-[#E5FFBA] rounded-full"
                      animate={{
                        y: logoTransitioning ? 0 : [0, -8, 0],
                        opacity: logoTransitioning ? 0 : [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: logoTransitioning ? 0 : Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
