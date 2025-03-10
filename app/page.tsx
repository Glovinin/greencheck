"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'

const slogans = [
  "Vista Privilegiada da Serra de Monchique",
  "Aconchego e Natureza em Harmonia",
  "Sua Estadia Perfeita na Montanha",
  "Experiências Únicas na Serra",
  "Conforto com Vista para o Paraíso"
]

export default function Home() {
  const router = useRouter()
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  const { scrollY } = useScroll()
  const videoY = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % slogans.length)
        setIsVisible(true)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleReservar = () => {
    router.push('/booking')
  }

  const handleVerQuartos = () => {
    router.push('/rooms')
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[100svh] pb-20 md:pb-0">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{ 
              y: videoY,
              scale: 1.1
            }}
            className="w-full h-[120%] -mt-10"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://videos.pexels.com/video-files/3119296/3119296-uhd_2560_1440_24fps.mp4" type="video/mp4" />
            </video>
          </motion.div>
          <motion.div 
            style={{ opacity }}
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 backdrop-blur-[2px]" 
          />
          
          {/* Elementos Decorativos */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="relative min-h-[100svh] flex flex-col justify-center items-center pt-16 md:pt-0">
          <motion.div 
            style={{ opacity }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="inline-block">
                <span className="text-sm md:text-base font-medium text-primary/90 tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/20">
                  Bem-vindo ao seu refúgio na serra
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold text-white tracking-tight leading-none">
                Aqua Vista
                <span className="block text-xl sm:text-2xl md:text-3xl mt-3 font-light text-white/80">Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl text-white/90 font-light mb-8 md:mb-12 h-12 transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}>
                {slogans[currentSlogan]}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Button 
                  size="lg" 
                  onClick={handleReservar}
                  className="w-full sm:w-auto rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 min-w-[200px] sm:min-w-[220px] h-12 sm:h-14 text-base sm:text-lg shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105"
                >
                  Reservar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleVerQuartos}
                  className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 transition-all duration-300 min-w-[200px] sm:min-w-[220px] h-12 sm:h-14 text-base sm:text-lg backdrop-blur-sm hover:border-white/40 hover:scale-105"
                >
                  Veja Nossos Quartos
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator Moderno */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 md:mt-16 flex flex-col items-center"
          >
            <div className="p-3 sm:p-4 rounded-full border-2 border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="text-white/80 text-sm mt-3 font-medium tracking-wider uppercase">Explorar</span>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">Seu Refúgio nas Montanhas</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Localizado nas belas montanhas de Monchique, nosso hotel oferece uma experiência única 
                de tranquilidade e conexão com a natureza. Com uma piscina refrescante e uma vista 
                deslumbrante da serra, nossos quartos proporcionam o ambiente perfeito para relaxar 
                e aproveitar momentos especiais longe da agitação da cidade.
              </p>
              <Button variant="outline" size="lg" className="rounded-full">
                Saiba Mais
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                  alt="Fachada do Aqua Vista Monchique"
                  className="rounded-3xl object-cover h-64 w-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070"
                  alt="Quarto Luxuoso com Vista para Serra"
                  className="rounded-3xl object-cover h-40 w-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070"
                  alt="Área de Eventos com Vista Panorâmica"
                  className="rounded-3xl object-cover h-40 w-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070"
                  alt="Piscina Infinita do Hotel"
                  className="rounded-3xl object-cover h-64 w-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">O que Nossos Hóspedes Dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background/50 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-border/50 hover:border-primary/20 transition-colors duration-300">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-primary fill-primary"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-card-foreground mb-6 leading-relaxed">
                  "Uma experiência absolutamente magnífica. As vistas são deslumbrantes, o serviço é
                  impecável e as comodidades são de classe mundial. Definitivamente voltaremos!"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-muted-foreground">Brasil</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
