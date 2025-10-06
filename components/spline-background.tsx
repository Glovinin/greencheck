"use client"

import { useState, useEffect } from 'react'

interface SplineBackgroundProps {
  className?: string
}

export default function SplineBackground({ className = "" }: SplineBackgroundProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    // Simular carregamento do iframe
    const timer = setTimeout(() => {
      setIframeLoaded(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Detectar quando o usuário sai da hero section para otimizar performance
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Desktop: desaparece aos 60% da viewport (mais suave)
      // Mobile: desaparece aos 30% (melhor performance)
      const heroHeight = window.innerHeight * (isMobile ? 0.3 : 0.6)
      
      // Fade progressivo baseado no scroll
      const fadeProgress = Math.max(0, 1 - (scrollPosition / heroHeight))
      setOpacity(fadeProgress)
      
      // Esconder iframe completamente quando atinge o limite
      setIsVisible(scrollPosition < heroHeight)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Placeholder enquanto carrega */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 bg-[#044050] ${
          iframeLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Spline 3D Animation - Crystal Ball (renderizado apenas quando visível) */}
      {isVisible && (
        <iframe           src='https://my.spline.design/crystalball-35c36a2f9650bec5da71971cf512f33f/' 

          frameBorder='0' 
          width='100%' 
          height='100%'
          className={`transition-opacity ${
            iframeLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: iframeLoaded ? opacity : 0,
            transition: 'opacity 0.15s linear'
          }}
          onLoad={() => {
            console.log('🔮 Spline Crystal Ball loaded - otimizado para desaparecer ao scroll')
            setIframeLoaded(true)
          }}
          title="Crystal Ball 3D Animation"
        />
      )}

      
      {/* Fundo branco sólido com acabamento iOS - Desktop */}
      <div 
        className="absolute bottom-0 right-0 left-0 pointer-events-none hidden md:block rounded-t-[48px]"
        style={{
          height: '200px',
          background: 'white',
          zIndex: 20
        }}
      />
      
      {/* Elementos decorativos e informativos - Desktop */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto hidden md:block z-[21]">
        {/* Botão Explorar centralizado */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#003631]/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#003631]/60 group-hover:bg-[#003631]/5">
              <svg 
                className="w-5 h-5 text-[#003631]/60 transition-all duration-300 group-hover:text-[#003631] group-hover:translate-y-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="text-xs font-light tracking-[0.2em] uppercase text-[#003631]/60 transition-all duration-300 group-hover:text-[#003631]">
              Saiba mais
            </span>
          </button>
        </div>
        
        {/* Urgência CSRD - Lado esquerdo */}
        <div className="absolute bottom-8 left-8 max-w-sm pointer-events-none">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50" />
              <span className="text-xs font-semibold tracking-[0.15em] text-[#003631]/70 uppercase">
                CSRD Obrigatório 2025
              </span>
            </div>
            <p className="text-sm font-medium text-[#003631]/80 leading-relaxed">
              Sua empresa precisa de certificação ESG<br />
              <span className="text-xs font-light text-[#003631]/60">Conformidade garantida com EU Taxonomy</span>
            </p>
          </div>
        </div>
        
        {/* Benefícios para empresas - Lado direito */}
        <div className="absolute bottom-8 right-8 pointer-events-none">
          <div className="flex items-start gap-6">
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-600">€35</div>
              <div className="text-xs font-light text-[#003631]/60 tracking-wide">por tCO₂e</div>
              <div className="text-[10px] font-light text-emerald-600/70 mt-0.5">Economize 40%</div>
            </div>
            <div className="w-px h-12 bg-[#003631]/20" />
            <div className="text-right">
              <div className="text-xl font-bold text-[#003631]/80">21 dias</div>
              <div className="text-xs font-light text-[#003631]/60 tracking-wide">Certificado</div>
              <div className="text-[10px] font-light text-[#003631]/40 mt-0.5">NFT Blockchain</div>
            </div>
            <div className="w-px h-12 bg-[#003631]/20" />
            <div className="text-right">
              <div className="text-xl font-bold text-[#003631]/80">100%</div>
              <div className="text-xs font-light text-[#003631]/60 tracking-wide">Científico</div>
              <div className="text-[10px] font-light text-[#003631]/40 mt-0.5">Validado</div>
            </div>
          </div>
        </div>
        
        {/* Linha decorativa sutil */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#003631]/10 to-transparent pointer-events-none" />
      </div>
      
      {/* Fundo branco sólido com acabamento iOS - Mobile */}
      <div 
        className="absolute bottom-0 right-0 left-0 md:hidden rounded-t-[40px] pointer-events-none"
        style={{
          height: '200px',
          background: 'white',
          zIndex: 19
        }}
      />
    </div>
  )
}

