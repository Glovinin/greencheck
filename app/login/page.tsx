"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Lock, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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
      containerPadding: 'px-3',
      maxWidth: 'max-w-sm',
      sectionPadding: 'py-12',
      titleSize: 'text-2xl',
      subtitleSize: 'text-base',
      cardPadding: 'p-4',
      buttonHeight: 'h-11',
      inputHeight: 'h-10'
    }
  }

  // Layout para mobile pequeno (380px - 640px)
  if (isSm) {
    return {
      containerPadding: 'px-4',
      maxWidth: 'max-w-md',
      sectionPadding: 'py-16',
      titleSize: 'text-3xl',
      subtitleSize: 'text-lg',
      cardPadding: 'p-5',
      buttonHeight: 'h-12',
      inputHeight: 'h-11'
    }
  }

  // Layout para mobile landscape (640px - 768px)
  if (isMd) {
    return {
      containerPadding: 'px-6',
      maxWidth: 'max-w-lg',
      sectionPadding: 'py-20',
      titleSize: 'text-3xl',
      subtitleSize: 'text-lg',
      cardPadding: 'p-6',
      buttonHeight: 'h-12',
      inputHeight: 'h-11'
    }
  }

  // Layout para tablets (768px - 1024px)
  if (isTablet) {
    return {
      containerPadding: 'px-8',
      maxWidth: 'max-w-xl',
      sectionPadding: 'py-24',
      titleSize: 'text-4xl',
      subtitleSize: 'text-xl',
      cardPadding: 'p-7',
      buttonHeight: 'h-12',
      inputHeight: 'h-12'
    }
  }

  // Layout para desktop pequeno (1024px - 1280px)
  if (isLg) {
    return {
      containerPadding: 'px-8',
      maxWidth: 'max-w-2xl',
      sectionPadding: 'py-24',
      titleSize: 'text-4xl',
      subtitleSize: 'text-xl',
      cardPadding: 'p-8',
      buttonHeight: 'h-12',
      inputHeight: 'h-12'
    }
  }

  // Layout para desktop grande (> 1280px)
  return {
    containerPadding: 'px-4 sm:px-6 lg:px-8',
    maxWidth: 'max-w-2xl',
    sectionPadding: 'py-24',
    titleSize: 'text-5xl',
    subtitleSize: 'text-xl',
    cardPadding: 'p-8',
    buttonHeight: 'h-12',
    inputHeight: 'h-12'
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Hook de breakpoints inteligentes 
  const breakpoints = useSmartBreakpoints()

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular login
    setTimeout(() => {
      setIsLoading(false)
      alert('Funcionalidade em desenvolvimento')
    }, 1000)
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  // Obter layout inteligente baseado nos breakpoints
  const {
    containerPadding,
    maxWidth,
    sectionPadding,
    titleSize,
    subtitleSize,
    cardPadding,
    buttonHeight,
    inputHeight
  } = getSmartLayout(breakpoints)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      <div className={`absolute top-0 left-0 ${breakpoints.isMobile ? 'w-48 h-48' : 'w-96 h-96'} bg-emerald-200/30 rounded-full blur-[100px] opacity-60`} />
      <div className={`absolute bottom-0 right-0 ${breakpoints.isMobile ? 'w-48 h-48' : 'w-96 h-96'} bg-emerald-200/30 rounded-full blur-[100px] opacity-60`} />
      
      {/* Header com Botão Voltar - Mobile e Desktop */}
      <div className={`flex items-center justify-between relative z-10 ${
        breakpoints.isMobile ? 'p-4' : 'p-6'
      }`}>
        {/* Botão Voltar */}
        <Link 
          href="/"
          className={`flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group ${
            breakpoints.isMobile ? '' : 'hover:gap-3'
          }`}
        >
          <div className={`${
            breakpoints.isMobile ? 'w-10 h-10' : 'w-12 h-12'
          } rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center group-hover:bg-white transition-colors`}>
            <ArrowLeft className={`${breakpoints.isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          {!breakpoints.isMobile && (
            <span className="font-medium">Voltar</span>
          )}
        </Link>

        {/* Logo GreenCheck - Apenas Mobile */}
        {breakpoints.isMobile && (
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo greencheck.png"
              alt="GreenCheck Logo"
              width={28}
              height={28}
              className="transition-all duration-300"
              priority
            />
            <span className="font-light text-slate-900 tracking-wide text-lg">
              <span className="font-extralight">Green</span><span className="font-medium">Check</span>
            </span>
          </Link>
        )}

        {/* Espaço para balanceamento */}
        <div className={`${breakpoints.isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}></div>
      </div>
      
      <div className={`${maxWidth} mx-auto ${containerPadding} ${breakpoints.isMobile ? 'pt-0' : sectionPadding} relative`}>
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center ${breakpoints.isMobile ? 'mb-6' : 'mb-8'}`}
          >
            {/* Logo apenas no desktop */}
            {!breakpoints.isMobile && (
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-600/20 p-3">
                <Image
                  src="/images/logo greencheck.png"
                  alt="GreenCheck Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            )}
            
            <h1 className={`${breakpoints.isMobile ? 'text-2xl' : 'text-3xl'} font-light text-slate-900 ${breakpoints.isMobile ? 'mb-2' : 'mb-3'} tracking-tight`}>
              {breakpoints.isMobile ? 'Entrar' : 'Bem-vindo de volta'}
            </h1>
            <p className={`${subtitleSize} text-slate-500 font-light`}>
              {breakpoints.isMobile ? 'Entre na sua conta' : 'Entre na sua conta para continuar'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`backdrop-blur-sm ${cardPadding} ${breakpoints.isMobile ? 'rounded-2xl' : 'rounded-3xl'} shadow-lg border transition-all duration-500 group relative overflow-hidden bg-white/90 border-slate-200 shadow-slate-200/60`}>
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Login
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Entre com suas credenciais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 ${inputHeight} bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300`}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 ${inputHeight} bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300`}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full ${buttonHeight} bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300 hover:scale-105 font-medium tracking-wide shadow-lg hover:shadow-emerald-600/30`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Entrando..."
                    ) : (
                      <>
                        Entrar
                        <ArrowRight className="ml-2 w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="text-center space-y-2">
                    <Button 
                      variant="ghost" 
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                    >
                      Esqueci minha senha
                    </Button>
                    <div className="text-sm text-slate-500">
                      Não tem conta? {" "}
                      <Button 
                        variant="link" 
                        className="text-emerald-600 hover:text-emerald-700 p-0 h-auto font-medium"
                      >
                        Criar conta
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card className={`backdrop-blur-sm ${breakpoints.isMobile ? 'p-4' : 'p-5'} ${breakpoints.isMobile ? 'rounded-xl' : 'rounded-2xl'} shadow-lg border bg-emerald-50/80 border-emerald-200 shadow-emerald-200/40`}>
              <CardContent className="p-0 text-center">
                <p className={`${breakpoints.isXs ? 'text-xs' : 'text-sm'} text-emerald-700 leading-relaxed`}>
                  🚧 Esta é uma versão de demonstração. O sistema de autenticação completo 
                  estará disponível em breve.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
