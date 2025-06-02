"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown, Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowUpRight, Waves, UtensilsCrossed, Flower, Mountain, Wifi, Check, Bed, Square, MessageSquare, Users, AlertCircle, Info, Car, Globe, Building } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { getDocuments } from "@/lib/firebase/firestore"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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

// Slogans da página inicial
const slogans = [
  "Vista Privilegiada da Serra de Monchique",
  "Aconchego e Natureza em Harmonia",
  "Sua Estadia Perfeita na Montanha",
  "Experiências Únicas na Serra",
  "Conforto com Vista para o Paraíso"
]

// Placeholder genérico para quando não houver imagens
const placeholderImage = "/images/placeholder.jpg";

const amenities = [
  {
    title: "Área de Lazer com Piscina",
    description: "Relaxe em nossa piscina com vista panorâmica para a Serra de Monchique",
    icon: <Waves className="w-6 h-6" />
  },
  {
    title: "Café da Manhã Regional",
    description: "Desfrute de um delicioso café da manhã com ingredientes frescos da região",
    icon: <UtensilsCrossed className="w-6 h-6" />
  },
  {
    title: "Wi-Fi Gratuito",
    description: "Conexão de alta velocidade disponível em todas as áreas do hotel",
    icon: <Wifi className="w-6 h-6" />
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
  const [sheetOpen, setSheetOpen] = useState(false)
  const [aboutImages, setAboutImages] = useState<{position: number, url: string, alt: string, caption: string}[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])
  const [isLoadingGallery, setIsLoadingGallery] = useState(true)
  
  const { scrollY } = useScroll()
  const videoY = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Carregar imagens do Firebase
  useEffect(() => {
    const fetchAboutImages = async () => {
      setIsLoadingImages(true)
      try {
        const items = await getDocuments<GalleryItem>('gallery')
        
        // Filtrar apenas as imagens da seção "Sobre Nós"
        const aboutImagesFromDB = items.filter(item => item.isHomeAboutImage && item.homePosition)
        
        if (aboutImagesFromDB.length > 0) {
          // Mapear para o formato necessário para exibição
          const formattedImages = aboutImagesFromDB.map(item => ({
            position: item.homePosition || 0,
            url: item.image,
            alt: item.title,
            caption: item.description || item.title
          }))
          
          // Ordenar por posição
          formattedImages.sort((a, b) => a.position - b.position)
          
          setAboutImages(formattedImages)
        } else {
          // Deixar o array vazio para que o componente possa renderizar condicionalmente
          setAboutImages([])
        }
        
        // Filtrar imagens para a seção de galeria na homepage
        // Obter imagens featured ou mostrar as 5 primeiras
        const galleryImagesFromDB = items
          .filter(item => !item.isHomeAboutImage) // Excluir imagens da seção sobre nós
          .sort((a, b) => {
            // Priorizar imagens featured
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            // Depois ordenar pelas mais recentes
            return b.createdAt - a.createdAt
          })
          .slice(0, 5) // Limitar a 5 imagens
        
        setGalleryImages(galleryImagesFromDB)
        
      } catch (error) {
        console.error('Erro ao carregar imagens:', error)
        // Deixar os arrays vazios em caso de erro
        setAboutImages([])
        setGalleryImages([])
      } finally {
        setIsLoadingImages(false)
        setIsLoadingGallery(false)
      }
    }
    
    if (mounted) {
      fetchAboutImages()
    }
  }, [mounted])

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

  const handleSaibaMais = () => {
    router.push('/sobre')
  }

  const handleVerGaleria = () => {
    router.push('/gallery')
  }

  const handleVerComodidades = () => {
    // Esta função não navega para outra página, apenas abre o Sheet
    // que já está configurado como trigger do botão
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'}`}>
      {!sheetOpen && <Navbar />}
      
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
                ? 'bg-gradient-to-b from-[#4F3621]/70 via-[#4F3621]/50 to-[#4F3621]/80' 
                : 'bg-gradient-to-b from-[#EED5B9]/80 via-[#EED5B9]/60 to-[#EED5B9]/90'
            }`} 
          />
          
          {/* Elementos Decorativos */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
          <div className={`absolute inset-x-0 top-0 h-32 ${
            isDark 
              ? 'bg-gradient-to-b from-[#4F3621]/60 to-transparent' 
              : 'bg-gradient-to-b from-[#EED5B9]/60 to-transparent'
          }`} />
          <div className={`absolute inset-x-0 bottom-0 h-32 ${
            isDark 
              ? 'bg-gradient-to-t from-[#4F3621]/60 to-transparent' 
              : 'bg-gradient-to-t from-[#EED5B9]/60 to-transparent'
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
                    ? 'text-[#EED5B9]/90 bg-[#EED5B9]/10 border-[#EED5B9]/20' 
                    : 'text-[#4F3621] bg-[#4F3621]/10 border-[#4F3621]/30'
                } px-4 py-2 rounded-full backdrop-blur-sm border`}>
                  Bem-vindo ao seu refúgio na serra
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
              }`}>
                Aqua Vista
                <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                  isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'
                }`}>Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 h-12 transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              } ${
                isDark ? 'text-[#EED5B9]/90' : 'text-[#4F3621]/90'
              }`}>
                {slogans[currentSlogan]}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Button 
                  size="lg" 
                  onClick={handleReservar}
                  className={`w-full sm:w-auto rounded-full transition-all duration-300 min-w-[200px] sm:min-w-[220px] h-12 sm:h-14 text-base sm:text-lg shadow-lg hover:scale-105 ${
                    isDark 
                      ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 shadow-[#EED5B9]/10 hover:shadow-[#EED5B9]/20' 
                      : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 shadow-[#4F3621]/40 hover:shadow-[#4F3621]/60'
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
                      ? 'border-[#EED5B9]/20 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/40' 
                      : 'border-[#4F3621]/40 text-[#4F3621] hover:bg-[#4F3621]/10 hover:border-[#4F3621]/60'
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
                ? 'border-2 border-[#EED5B9]/30 bg-[#EED5B9]/10 hover:bg-[#EED5B9]/20' 
                : 'border-2 border-[#4F3621]/60 bg-[#4F3621]/10 hover:bg-[#4F3621]/20'
            }`}>
              <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                isDark ? 'text-[#EED5B9]/80 group-hover:text-[#EED5B9]' : 'text-[#4F3621]/80 group-hover:text-[#4F3621]'
              }`} />
            </div>
            <span className={`text-sm mt-3 font-medium tracking-wider uppercase ${
              isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'
            }`}>Explorar</span>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className={`py-24 relative overflow-hidden ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
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
                className={`text-4xl font-bold mb-6 tracking-tight ${
                  isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                }`}
              >
                Seu Refúgio nas Montanhas
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className={`text-lg mb-8 leading-relaxed ${
                  isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                }`}
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
                  onClick={handleSaibaMais}
                  className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all duration-300 hover:scale-105"
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
                {/* Imagem 1: Superior Esquerda */}
                <div className={`overflow-hidden rounded-3xl shadow-lg group relative ${
                  isDark ? 'shadow-black/20' : 'shadow-[#4F3621]/20'
                }`}>
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img
                    src={aboutImages.find(img => img.position === 1)?.url || placeholderImage}
                    alt={aboutImages.find(img => img.position === 1)?.alt || 'Imagem de placeholder'}
                    className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/80 via-[#4F3621]/20 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {aboutImages.find(img => img.position === 1)?.caption || 'Imagem de placeholder'}
                    </p>
                  </div>
                </div>
                
                {/* Imagem 2: Inferior Esquerda */}
                <div className={`overflow-hidden rounded-3xl shadow-lg group relative ${
                  isDark ? 'shadow-black/20' : 'shadow-[#4F3621]/20'
                }`}>
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img
                    src={aboutImages.find(img => img.position === 2)?.url || placeholderImage}
                    alt={aboutImages.find(img => img.position === 2)?.alt || 'Imagem de placeholder'}
                    className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/80 via-[#4F3621]/20 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {aboutImages.find(img => img.position === 2)?.caption || 'Imagem de placeholder'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                {/* Imagem 3: Superior Direita */}
                <div className={`overflow-hidden rounded-3xl shadow-lg group relative ${
                  isDark ? 'shadow-black/20' : 'shadow-[#4F3621]/20'
                }`}>
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img
                    src={aboutImages.find(img => img.position === 3)?.url || placeholderImage}
                    alt={aboutImages.find(img => img.position === 3)?.alt || 'Imagem de placeholder'}
                    className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/80 via-[#4F3621]/20 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {aboutImages.find(img => img.position === 3)?.caption || 'Imagem de placeholder'}
                    </p>
                  </div>
                </div>
                
                {/* Imagem 4: Inferior Direita */}
                <div className={`overflow-hidden rounded-3xl shadow-lg group relative ${
                  isDark ? 'shadow-black/20' : 'shadow-[#4F3621]/20'
                }`}>
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img
                    src={aboutImages.find(img => img.position === 4)?.url || placeholderImage}
                    alt={aboutImages.find(img => img.position === 4)?.alt || 'Imagem de placeholder'}
                    className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/80 via-[#4F3621]/20 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {aboutImages.find(img => img.position === 4)?.caption || 'Imagem de placeholder'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features/Amenities Section */}
      <section className={`py-24 relative overflow-hidden ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span 
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Nossos Diferenciais
            </span>
            <h2 
              className={`text-4xl font-bold mt-6 mb-4 ${
                isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
              }`}
            >
              Uma Experiência Exclusiva
            </h2>
            <p 
              className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
              }`}
            >
              O Aqua Vista Monchique oferece comodidades premium para garantir uma estadia memorável, 
              combinando conforto moderno com a beleza natural da serra.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className={`backdrop-blur-sm p-8 rounded-3xl shadow-lg border transition-all duration-500 group relative overflow-hidden hover:scale-105 transform ${
                  isDark 
                    ? 'bg-[#4F3621]/80 border-[#EED5B9]/20 hover:border-[#EED5B9]/40 shadow-[#4F3621]/20' 
                    : 'bg-[#EED5B9]/80 border-[#4F3621]/30 hover:border-[#4F3621]/50 shadow-[#4F3621]/20'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 text-primary">
                  {amenity.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-primary ${
                  isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                }`}>{amenity.title}</h3>
                <p className={`transition-colors duration-300 ${
                  isDark 
                    ? 'text-[#EED5B9]/80 group-hover:text-[#EED5B9]/90' 
                    : 'text-[#4F3621]/80 group-hover:text-[#4F3621]/90'
                }`}>{amenity.description}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Sheet onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
            <Button className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
              Ver Todas as Comodidades
              <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-0 w-full h-[100vh] max-h-[100vh] overflow-hidden border-none sm:max-w-none z-[200]">
                <div className="h-full overflow-y-auto pb-10">
                  <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md p-4 md:p-6 border-b">
                    <div className="flex items-center justify-between">
                      <SheetHeader className="mb-0">
                        <SheetTitle className="text-xl md:text-2xl">Comodidades de: Aqua Vista Monchique Hôtel</SheetTitle>
                        <SheetDescription className="text-sm mt-1">
                          Excelentes comodidades!
                        </SheetDescription>
                      </SheetHeader>
                      <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        <span className="sr-only">Fechar</span>
                      </SheetClose>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Principais comodidades */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Building className="w-5 h-5 text-primary" /> Principais comodidades
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Quartos para não fumadores</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Estacionamento gratuito</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Acesso Wi-Fi gratuito</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Quartos familiares</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Comodidades para fazer chá e café em todos os quartos</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Bar</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Pequeno-almoço</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Comodidades dos quartos */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Bed className="w-5 h-5 text-primary" /> Comodidades dos quartos
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Tomada perto da cama</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Suporte para cabides</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Televisão de ecrã plano</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Canais por cabo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Comodidades para fazer chá e café</span>
                          </li>
                        </ul>
                        
                        <h3 className="flex items-center gap-2 font-semibold text-lg mt-6 mb-4">
                          <Square className="w-5 h-5 text-primary" /> Equipamentos
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Depósito para equipamento de esqui</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Serviços e outros */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <MessageSquare className="w-5 h-5 text-primary" /> Serviços
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Serviço de limpeza diário</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Salão/área de televisão partilhados</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Cacifos</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Acesso ao salão executivo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Fax/fotocopiadora</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Balcão de turismo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Comodidades para reuniões/banquetes</span>
                          </li>
                        </ul>
                      </div>
                    
                      {/* Áreas de Lazer */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Waves className="w-5 h-5 text-primary" /> Atividades
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Atuações/música ao vivo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Excursões de bicicleta</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Excursões a pé</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Stand-up comedy</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Rota dos bares</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Galerias de arte temporárias</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Ciclismo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Caminhadas</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Acessibilidade */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Users className="w-5 h-5 text-primary" /> Serviços familiares
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Barras de segurança para bebés</span>
                          </li>
                        </ul>
                        
                        <h3 className="flex items-center gap-2 font-semibold text-lg mt-6 mb-4">
                          <AlertCircle className="w-5 h-5 text-primary" /> Segurança
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Extintores</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>CCTV no exterior da propriedade</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>CCTV nas áreas comuns</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Detetores de fumo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Alarme</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Chave de acesso</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Comodidades adicionais */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Info className="w-5 h-5 text-primary" /> Geral
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Área específica para fumar</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Quarto antialérgico</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Aquecimento</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Quartos insonorizados</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Quartos familiares</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Quartos para não fumadores</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Ar condicionado</span>
                          </li>
                        </ul>
                      </div>
                    
                      {/* Áreas exteriores */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Mountain className="w-5 h-5 text-primary" /> Exterior
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Área para piquenique</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Mobiliário de exterior</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Terraço para banhos de sol</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Comodidades para churrascos</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Varanda</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Terraço</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Jardim</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Comida e Bebida */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <UtensilsCrossed className="w-5 h-5 text-primary" /> Comida e Bebida
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Café da manhã regional</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Fruta</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Vinho/champanhe</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Buffet adequado para crianças</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Bar</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Comodidades para fazer chá e café</span>
                          </li>
                          <li className="flex items-start gap-2 italic text-muted-foreground">
                            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>Restaurante temporariamente em obras</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Outros */}
                      <div className="bg-accent/30 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Wifi className="w-5 h-5 text-primary" /> Internet
                        </h3>
                        <div className="p-4 bg-primary/10 rounded-lg mb-4">
                          <p className="text-sm">Acesso Wi-Fi disponível nas áreas públicas. Custo: Gratuito</p>
                        </div>
                        
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Car className="w-5 h-5 text-primary" /> Estacionamento
                        </h3>
                        <div className="p-4 bg-primary/10 rounded-lg mb-4">
                          <p className="text-sm">Estacionamento gratuito e público disponível no local (não carece de reserva)</p>
                        </div>
                        
                        <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                          <Globe className="w-5 h-5 text-primary" /> Idiomas falados
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Inglês</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Espanhol</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Francês</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Português</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className={`py-24 relative overflow-hidden ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Depoimentos
            </span>
            <h2
              className={`text-4xl font-bold mt-6 mb-4 ${
                isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
              }`}
            >
              O que Nossos Hóspedes Dizem
            </h2>
            <p
              className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
              }`}
            >
              Experiências reais de quem já desfrutou da tranquilidade e do conforto do Aqua Vista Monchique.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`backdrop-blur-sm p-8 rounded-3xl shadow-lg border transition-all duration-500 group relative overflow-hidden hover:scale-105 transform ${
                  isDark 
                    ? 'bg-[#4F3621]/80 border-[#EED5B9]/20 hover:border-[#EED5B9]/40 shadow-[#4F3621]/20' 
                    : 'bg-[#EED5B9]/80 border-[#4F3621]/30 hover:border-[#4F3621]/50 shadow-[#4F3621]/20'
                }`}
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
                <p className={`mb-8 leading-relaxed italic transition-colors duration-300 ${
                  isDark 
                    ? 'text-[#EED5B9]/90 group-hover:text-[#EED5B9]' 
                    : 'text-[#4F3621] group-hover:text-[#4F3621]'
                }`}>
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
                    <p className={`font-medium transition-colors duration-300 ${
                      isDark 
                        ? 'text-[#EED5B9] group-hover:text-primary' 
                        : 'text-[#4F3621] group-hover:text-primary'
                    }`}>{testimonial.author}</p>
                    <p className={`text-sm ${
                      isDark ? 'text-[#EED5B9]/60' : 'text-[#4F3621]/60'
                    }`}>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className={`py-24 relative overflow-hidden ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span 
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Nossa Galeria
            </span>
            <h2 
              className={`text-4xl font-bold mt-6 mb-4 ${
                isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
              }`}
            >
              Momentos Inesquecíveis
            </h2>
            <p 
              className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
              }`}
            >
              Confira alguns registros de experiências especiais em nosso hotel.
            </p>
          </div>
          
          {isLoadingGallery ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-16">
              <p className={`text-lg mb-6 ${
                isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
              }`}>Ainda não há imagens na galeria.</p>
              <Button 
                className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20" 
                onClick={handleVerGaleria}
              >
                Ver Galeria Completa
                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {galleryImages.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl group"
                >
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img 
                    src={galleryImages[0].image} 
                    alt={galleryImages[0].title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/90 via-[#4F3621]/50 to-transparent'
                  }`}>
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className={`font-medium text-xl ${
                        isDark ? 'text-white' : 'text-[#EED5B9]'
                      }`}>{galleryImages[0].title}</p>
                      <p className={`text-sm mt-2 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isDark ? 'text-white/70' : 'text-[#EED5B9]/70'
                      }`}>
                        {galleryImages[0].description || galleryImages[0].title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {galleryImages.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl group"
                >
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img 
                    src={galleryImages[1].image} 
                    alt={galleryImages[1].title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/90 via-[#4F3621]/50 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {galleryImages[1].title}
                    </p>
                  </div>
                </motion.div>
              )}
              
              {galleryImages.length > 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl group"
                >
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img 
                    src={galleryImages[2].image} 
                    alt={galleryImages[2].title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/90 via-[#4F3621]/50 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {galleryImages[2].title}
                    </p>
                  </div>
                </motion.div>
              )}
              
              {galleryImages.length > 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl group"
                >
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img 
                    src={galleryImages[3].image} 
                    alt={galleryImages[3].title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/90 via-[#4F3621]/50 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {galleryImages[3].title}
                    </p>
                  </div>
                </motion.div>
              )}
              
              {galleryImages.length > 4 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl group"
                >
                  <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isDark 
                      ? 'bg-black/20 group-hover:bg-black/10' 
                      : 'bg-[#4F3621]/20 group-hover:bg-[#4F3621]/10'
                  }`}></div>
                  <img 
                    src={galleryImages[4].image} 
                    alt={galleryImages[4].title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20 ${
                    isDark 
                      ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent' 
                      : 'bg-gradient-to-t from-[#4F3621]/90 via-[#4F3621]/50 to-transparent'
                  }`}>
                    <p className={`font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${
                      isDark ? 'text-white' : 'text-[#EED5B9]'
                    }`}>
                      {galleryImages[4].title}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          <div className="flex justify-center mt-12">
            <Button 
              className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20" 
              onClick={handleVerGaleria}
            >
              Ver Galeria Completa
              <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
