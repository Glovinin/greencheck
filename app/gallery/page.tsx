"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, ChevronDown, Image as ImageIcon } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { getDocuments } from '@/lib/firebase/firestore'

// Categorias de fotos
const categories = [
  { id: 'todas', label: 'Todas' },
  { id: 'quartos', label: 'Quartos' },
  { id: 'restaurante', label: 'Restaurante' },
  { id: 'piscina', label: 'Piscina' },
  { id: 'spa', label: 'Spa & Bem-estar' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'vistas', label: 'Vistas' },
  { id: 'experiencias', label: 'Experiências' }
]

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
  homePosition?: number | null;
  isHomeAboutImage?: boolean;
}

// Componente de imagem da galeria
const GalleryImage = ({ src, alt }: { src: string, alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Carregar imagem
    const imgElement = new window.Image();
    imgElement.src = src;
    imgElement.onload = () => {
      setIsLoading(false);
    };
    imgElement.onerror = () => {
      console.error('Erro ao carregar imagem:', src);
      setError(true);
      setIsLoading(false);
    };
  }, [src]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
        <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
        <div className="text-center">
          <ImageIcon className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Imagem não disponível</p>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
    />
  );
};

export default function Gallery() {
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  
  // Variáveis para animações de scroll
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0])  // Fade out do cabeçalho
  const headerY = useTransform(scrollY, [0, 200], [0, -50])      // Movimento para cima do cabeçalho
  const imageY = useTransform(scrollY, [0, 500], [0, 150])       // Efeito parallax na imagem de fundo
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0]) // Controle de opacidade com base no scroll
  
  // Carregar dados da galeria do Firebase
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setIsLoading(true)
      try {
        console.log('Buscando itens da galeria...');
        const items = await getDocuments<GalleryItem>('gallery')
        console.log('Itens recebidos:', items?.length || 0);
        
        if (items && items.length > 0) {
          // Ordenar por destaque e depois por ordem de criação
          const sortedItems = items.sort((a: GalleryItem, b: GalleryItem) => {
            // Primeiro por destaque
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            
            // Depois por ordem personalizada (se existir)
            if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
              return a.displayOrder - b.displayOrder
            }
            
            // Por fim, por data de criação (mais recente primeiro)
            return b.createdAt - a.createdAt
          })
          
          setGalleryItems(sortedItems)
        } else {
          // Não usar dados de fallback
          setGalleryItems([])
        }
      } catch (error) {
        console.error('Erro ao carregar itens da galeria:', error)
        // Não usar fallback em caso de erro
        setGalleryItems([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGalleryItems()
  }, [])
  
  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter gallery items when category changes
  useEffect(() => {
    if (selectedCategory === 'todas') {
      setFilteredItems(galleryItems)
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, galleryItems])

  // Avoid hydration mismatch
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <>
      <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative min-h-[100svh] pb-20 md:pb-0">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              style={{ 
                y: imageY,
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
                    Nossa Galeria
                  </span>
                </div>
                
                <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Momentos Inesquecíveis
                  <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                    isDark ? 'text-white/80' : 'text-gray-700'
                  }`}>Aqua Vista Monchique</span>
                </h1>
                
                <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 ${
                  isDark ? 'text-white/90' : 'text-gray-800'
                }`}>
                  Conheça um pouco mais do Aqua Vista Monchique através das nossas imagens
                </p>
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

        {/* Category Filter */}
        <section className="py-8 md:py-12 sticky top-0 z-30 backdrop-blur-lg border-b transition-all duration-300 shadow-sm">
          <div className={`${
            isDark 
              ? 'bg-black border-white/10' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
                      selectedCategory === category.id
                        ? isDark
                          ? 'bg-white text-black font-medium shadow-md'
                          : 'bg-gray-900 text-white font-medium shadow-lg shadow-gray-900/20'
                        : isDark
                          ? 'bg-black text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className={`py-12 md:py-20 ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-lg ${
                      isDark ? 'bg-gray-900' : 'bg-gray-200'
                    } animate-pulse`}
                  />
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`group overflow-hidden rounded-lg ${
                      item.featured 
                        ? 'md:col-span-2 md:row-span-2' 
                        : ''
                    } shadow-lg hover:shadow-xl transition-all duration-300 relative`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <GalleryImage src={item.image} alt={item.title} />
                    </div>
                    <div className={`absolute inset-0 flex flex-col justify-end p-6 
                      transition-all duration-500 ${
                        isDark 
                          ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 hover:opacity-100' 
                          : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 hover:opacity-90'
                      }`}>
                      <h3 className="text-xl md:text-2xl font-bold text-white">{item.title}</h3>
                      {item.description && (
                        <p className="text-white/90 mt-2 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-20 rounded-lg border-2 ${
                isDark 
                  ? 'border-gray-800 bg-gray-900/30' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <ImageIcon className={`w-16 h-16 mx-auto ${
                  isDark ? 'text-gray-700' : 'text-gray-400'
                }`} />
                <h3 className={`mt-4 text-xl font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Nenhuma imagem encontrada
                </h3>
                <p className={`mt-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Não encontramos imagens na categoria selecionada.
                </p>
                {selectedCategory !== 'todas' && (
                  <Button
                    onClick={() => setSelectedCategory('todas')}
                    className="mt-6"
                    variant={isDark ? 'outline' : 'default'}
                  >
                    Ver todas as imagens
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <CTASection 
          title="Reserve sua Experiência" 
          subtitle="Venha viver momentos inesquecíveis no Aqua Vista Monchique"
          buttonText="Reservar Agora"
          buttonLink="/booking"
        />
      </main>

      <Footer />
    </>
  )
} 