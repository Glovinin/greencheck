"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown, Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowUpRight, Waves, UtensilsCrossed, Flower, Mountain } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'

const slogans = [
  "Vista Privilegiada da Serra de Monchique",
  "Aconchego e Natureza em Harmonia",
  "Sua Estadia Perfeita na Montanha",
  "Experiências Únicas na Serra",
  "Conforto com Vista para o Paraíso"
]

const amenities = [
  {
    title: "Piscina Infinita",
    description: "Desfrute de uma piscina com vista panorâmica para as montanhas",
    icon: <Waves className="w-6 h-6" />
  },
  {
    title: "Restaurante Gourmet",
    description: "Gastronomia local e internacional com ingredientes frescos da região",
    icon: <UtensilsCrossed className="w-6 h-6" />
  },
  {
    title: "Spa & Bem-estar",
    description: "Tratamentos relaxantes com produtos naturais da serra",
    icon: <Flower className="w-6 h-6" />
  },
  {
    title: "Trilhas Exclusivas",
    description: "Explore a natureza com trilhas privativas saindo do hotel",
    icon: <Mountain className="w-6 h-6" />
  }
]

const testimonials = [
  {
    text: "Uma experiência absolutamente magnífica. As vistas são deslumbrantes, o serviço é impecável e as comodidades são de classe mundial. Definitivamente voltaremos!",
    author: "João Silva",
    location: "Brasil",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "O lugar perfeito para fugir da agitação da cidade. Acordar com a vista da serra e o café da manhã regional foi indescritível. A equipe é muito atenciosa!",
    author: "Maria Santos",
    location: "Portugal",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "Superou todas as nossas expectativas. O quarto era espaçoso e confortável, a área da piscina é simplesmente deslumbrante. Recomendo fortemente!",
    author: "Pedro Costa",
    location: "Espanha",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/67.jpg"
  }
]

export default function Home() {
  const router = useRouter()
  const [currentSlogan, setCurrentSlogan] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const { scrollY } = useScroll()
  const videoY = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % slogans.length)
        setIsVisible(true)
      }, 400)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleReservar = () => {
    router.push('/booking')
  }

  const handleVerQuartos = () => {
    router.push('/rooms')
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-black' : 'bg-gray-50'} pb-32 md:pb-0`}>
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
            className={`absolute inset-0 backdrop-blur-[2px] ${
              isDark 
                ? 'bg-gradient-to-b from-black/70 via-black/50 to-black/80' 
                : 'bg-gradient-to-b from-white/80 via-white/60 to-white/90'
            }`} 
          />
          
          {/* Elementos Decorativos */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
          <div className={`absolute inset-x-0 top-0 h-32 ${
            isDark 
              ? 'bg-gradient-to-b from-black/60 to-transparent' 
              : 'bg-gradient-to-b from-white/60 to-transparent'
          }`} />
          <div className={`absolute inset-x-0 bottom-0 h-32 ${
            isDark 
              ? 'bg-gradient-to-t from-black/60 to-transparent' 
              : 'bg-gradient-to-t from-white/60 to-transparent'
          }`} />
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
                <span className={`text-sm md:text-base font-medium tracking-wider uppercase ${
                  isDark 
                    ? 'text-primary/90 bg-primary/10 border-primary/20' 
                    : 'text-gray-900 bg-gray-200/80 border-gray-300'
                } px-4 py-2 rounded-full backdrop-blur-sm border`}>
                  Bem-vindo ao seu refúgio na serra
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Aqua Vista
                <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 h-12 transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              } ${
                isDark ? 'text-white/90' : 'text-gray-800'
              }`}>
                {slogans[currentSlogan]}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Button 
                  size="lg" 
                  onClick={handleReservar}
                  className={`w-full sm:w-auto rounded-full transition-all duration-300 min-w-[200px] sm:min-w-[220px] h-12 sm:h-14 text-base sm:text-lg shadow-lg hover:scale-105 ${
                    isDark 
                      ? 'bg-white text-black hover:bg-white/90 shadow-white/10 hover:shadow-white/20' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-300/40 hover:shadow-gray-300/60'
                  }`}
                >
                  Reservar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleVerQuartos}
                  className={`w-full sm:w-auto rounded-full transition-all duration-300 min-w-[200px] sm:min-w-[220px] h-12 sm:h-14 text-base sm:text-lg backdrop-blur-sm hover:scale-105 ${
                    isDark 
                      ? 'border-white/20 text-white hover:bg-white/10 hover:border-white/40' 
                      : 'border-gray-400 text-gray-900 hover:bg-gray-200/40 hover:border-gray-500'
                  }`}
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
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            <div className={`p-3 sm:p-4 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
              isDark 
                ? 'border-2 border-white/30 bg-white/10 hover:bg-white/20' 
                : 'border-2 border-gray-400/60 bg-gray-300/40 hover:bg-gray-300/60'
            }`}>
              <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                isDark ? 'text-white/80 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'
              }`} />
            </div>
            <span className={`text-sm mt-3 font-medium tracking-wider uppercase ${
              isDark ? 'text-white/80' : 'text-gray-700'
            }`}>Explorar</span>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10 inline-block mb-6"
              >
                Sobre Nós
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-6 tracking-tight text-white"
              >
                Seu Refúgio nas Montanhas
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-white/70 mb-8 leading-relaxed"
              >
                Localizado nas belas montanhas de Monchique, nosso hotel oferece uma experiência única 
                de tranquilidade e conexão com a natureza. Com uma piscina refrescante e uma vista 
                deslumbrante da serra, nossos quartos proporcionam o ambiente perfeito para relaxar 
                e aproveitar momentos especiais longe da agitação da cidade.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:border-white/40 hover:scale-105 group"
                >
                  Saiba Mais
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                    alt="Fachada do Aqua Vista Monchique"
                    className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Fachada do Hotel</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070"
                    alt="Quarto Luxuoso com Vista para Serra"
                    className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Quarto Luxuoso</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070"
                    alt="Área de Eventos com Vista Panorâmica"
                    className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Área de Eventos</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070"
                    alt="Piscina Infinita do Hotel"
                    className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Piscina Infinita</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features/Amenities Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Nossos Diferenciais
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mt-6 mb-4 text-white"
            >
              Uma Experiência Exclusiva
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              O Aqua Vista Monchique oferece comodidades premium para garantir uma estadia memorável, 
              combinando conforto moderno com a beleza natural da serra.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 text-primary">
                  {amenity.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">{amenity.title}</h3>
                <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">{amenity.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
              Ver Todas as Comodidades
              <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Depoimentos
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mt-6 mb-4 text-white"
            >
              O que Nossos Hóspedes Dizem
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              Experiências reais de quem já desfrutou da tranquilidade e do conforto do Aqua Vista Monchique.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/10 hover:border-primary/20 transition-all duration-500 group relative"
              >
                <div className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shadow-lg border border-primary/20">
                  <span className="text-2xl text-primary">"</span>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-primary fill-primary"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/90 mb-8 leading-relaxed italic group-hover:text-white transition-colors duration-300">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-md transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 relative z-10"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-white group-hover:text-primary transition-colors duration-300">{testimonial.author}</p>
                    <p className="text-sm text-white/60">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
              Ver Mais Depoimentos
              <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Nossa Galeria
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mt-6 mb-4 text-white"
            >
              Momentos Inesquecíveis
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              Confira alguns registros de experiências especiais em nosso hotel.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1605537964076-3cb0ea2ff329?q=80&w=2070" 
                alt="Vista panorâmica do hotel" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-xl">Vista Panorâmica da Serra</p>
                  <p className="text-white/70 text-sm mt-2 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">Desfrute de vistas deslumbrantes da Serra de Monchique diretamente do nosso hotel.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1592229505726-ca121723b8ef?q=80&w=1974" 
                alt="Café da manhã regional" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Gastronomia Local</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=2073" 
                alt="Spa e bem-estar" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Spa & Bem-estar</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070" 
                alt="Suite luxuosa" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Suíte Premium</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070" 
                alt="Piscina ao pôr do sol" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Piscina ao Pôr do Sol</p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
              Ver Galeria Completa
              <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm rounded-3xl p-10 md:p-16 border border-white/10 shadow-2xl overflow-hidden group"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 text-center md:text-left md:flex items-center justify-between">
              <div className="md:max-w-xl mb-8 md:mb-0">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold mb-4 text-white"
                >
                  Pronto para relaxar nas alturas?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-lg text-white/70 mb-6"
                >
                  Reserve sua estadia agora e garanta momentos inesquecíveis com tarifas especiais em nosso refúgio na serra.
                </motion.p>
                <motion.ul 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8"
                >
                  <li className="flex items-center text-sm text-white/80 group/item">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 group-hover/item:bg-primary/30 transition-colors duration-300">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="group-hover/item:text-white transition-colors duration-300">Cancelamento gratuito</span>
                  </li>
                  <li className="flex items-center text-sm text-white/80 group/item">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 group-hover/item:bg-primary/30 transition-colors duration-300">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="group-hover/item:text-white transition-colors duration-300">Café da manhã incluso</span>
                  </li>
                  <li className="flex items-center text-sm text-white/80 group/item">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 group-hover/item:bg-primary/30 transition-colors duration-300">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="group-hover/item:text-white transition-colors duration-300">Experiências exclusivas</span>
                  </li>
                </motion.ul>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row md:flex-col gap-4"
              >
                <Button 
                  size="lg" 
                  onClick={handleReservar}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-14 min-w-[200px] shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105"
                >
                  Reservar Agora
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleVerQuartos}
                  className="rounded-full border-white/20 text-white hover:bg-white/10 transition-all duration-300 h-14 min-w-[200px] hover:border-white/40 hover:scale-105"
                >
                  Ver Disponibilidade
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/80 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Aqua Vista</h3>
                <span className="text-sm text-muted-foreground">Monchique</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Seu refúgio exclusivo na Serra de Monchique, onde o luxo encontra a natureza para proporcionar experiências inesquecíveis.
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
                <li><a href="/amenities" className="text-muted-foreground hover:text-primary transition-colors duration-300">Comodidades</a></li>
                <li><a href="/gallery" className="text-muted-foreground hover:text-primary transition-colors duration-300">Galeria</a></li>
                <li><a href="/booking" className="text-muted-foreground hover:text-primary transition-colors duration-300">Reservas</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-3 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Estrada da Serra, km 5, Monchique, Algarve, Portugal</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-3 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">+351 282 123 456</span>
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
                  className="px-4 py-2 rounded-full border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                <Button size="sm" className="rounded-full">
                  Inscrever-se
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aqua Vista Monchique. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300">Política de Privacidade</a>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300">Termos de Uso</a>
              <a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
