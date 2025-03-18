"use client"

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ArrowRight, Wifi, Coffee, Bath, Tv, Users, Square, Star, ChevronLeft, ChevronRight, Check, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RoomDetailsSheet } from '@/components/RoomDetailsSheet'
import { getRooms } from '@/lib/firebase/firestore'
import { Room } from '@/lib/types'
import Image from 'next/image'
import { useTheme } from 'next-themes'

// Dados de exemplo (serão substituídos pelos dados do Firebase)
const quartosPadrao: QuartoUI[] = [
  {
    id: "1",
    nome: "Suíte Luxo Vista Montanha",
    descricao: "Uma experiência única com vista panorâmica para as montanhas de Monchique. Decoração sofisticada e ambiente acolhedor.",
    descricaoLonga: "Desfrute de uma experiência verdadeiramente luxuosa em nossa Suíte Vista Montanha. Com uma vista deslumbrante para as montanhas de Monchique, este espaço foi meticulosamente projetado para proporcionar o máximo de conforto e sofisticação. A suíte conta com uma área de estar separada, decoração contemporânea e acabamentos premium em cada detalhe.",
    preco: 780, // em euros
    metros: 45,
    capacidade: 2,
    avaliacao: 4.9,
    numeroAvaliacoes: 128,
    imagens: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
    ],
    amenidades: ["Wi-Fi", "Café da manhã", "Banheira de hidromassagem", "Smart TV 55\"", "Vista para montanha"],
    destaques: ["Check-in premium", "Serviço de quarto 24h", "Vista panorâmica"],
    servicosAdicionais: [
      "Massagem no quarto",
      "Decoração romântica",
      "Transfer aeroporto",
      "Jantar privativo"
    ]
  },
  {
    id: "2",
    nome: "Suíte Premium",
    descricao: "Espaço amplo com área de estar separada, ideal para casais que buscam conforto e privacidade.",
    descricaoLonga: "Nossa Suíte Premium oferece um refúgio elegante e confortável para casais. Com uma área de estar separada e varanda privativa, este espaço foi projetado para proporcionar momentos de relaxamento e privacidade. A decoração contemporânea e os acabamentos refinados criam um ambiente sofisticado e acolhedor.",
    preco: 590, // em euros
    metros: 35,
    capacidade: 2,
    avaliacao: 4.7,
    numeroAvaliacoes: 96,
    imagens: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
    ],
    amenidades: ["Wi-Fi", "Café da manhã", "Chuveiro premium", "Smart TV 50\"", "Varanda privativa"],
    destaques: ["Varanda mobiliada", "Área de trabalho", "Mini bar premium"],
    servicosAdicionais: [
      "Café da manhã no quarto",
      "Decoração especial",
      "Serviço de lavanderia",
      "Room service 24h"
    ]
  },
  {
    id: "3",
    nome: "Suíte Família",
    descricao: "Perfeita para famílias, com espaço adicional e todas as comodidades necessárias para uma estadia confortável.",
    descricaoLonga: "A Suíte Família foi especialmente projetada para proporcionar o máximo conforto para toda a família. Com amplo espaço e configuração versátil, oferece área de estar separada, dois banheiros e todas as comodidades necessárias para uma estadia memorável. Ideal para famílias que buscam conforto e praticidade.",
    preco: 890, // em euros
    metros: 55,
    capacidade: 4,
    avaliacao: 4.8,
    numeroAvaliacoes: 84,
    imagens: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
    ],
    amenidades: ["Wi-Fi", "Café da manhã", "2 Banheiros", "Smart TV 65\"", "Sala de estar"],
    destaques: ["Área de jantar", "Berço disponível", "Kit família"],
    servicosAdicionais: [
      "Menu infantil",
      "Babysitter (sob consulta)",
      "Kit diversão infantil",
      "Passeios em família"
    ]
  }
]

const formatarPreco = (preco: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(preco)
}

// Interface para o formato de quarto usado na interface
interface QuartoUI {
  id: string;
  nome: string;
  descricao: string;
  descricaoLonga: string;
  preco: number;
  metros: number;
  capacidade: number;
  avaliacao: number;
  numeroAvaliacoes: number;
  imagens: string[];
  amenidades: string[];
  destaques: string[];
  servicosAdicionais: string[];
}

export default function Rooms() {
  const router = useRouter()
  const [filtroPreco, setFiltroPreco] = useState('todos')
  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>([])
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [quartos, setQuartos] = useState<QuartoUI[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    carregarQuartos()
  }, [])

  // Função para carregar quartos do Firebase
  const carregarQuartos = async () => {
    try {
      setLoading(true)
      const quartosFirebase = await getRooms()
      
      console.log("Quartos recebidos do Firebase (dados brutos):", quartosFirebase)
      
      if (quartosFirebase.length > 0) {
        // Converter o formato do Firebase para o formato usado na interface
        const quartosFormatados: QuartoUI[] = quartosFirebase.map(quarto => {
          // Garantir que os arrays existam
          const amenities = Array.isArray(quarto.amenities) ? quarto.amenities : [];
          const additionalServices = Array.isArray(quarto.additionalServices) ? quarto.additionalServices : [];
          const highlights = Array.isArray(quarto.highlights) ? quarto.highlights : [];
          
          console.log(`Quarto ${quarto.id} - Dados originais:`, {
            name: quarto.name,
            amenities: quarto.amenities,
            additionalServices: quarto.additionalServices,
            highlights: quarto.highlights
          });
          
          console.log(`Quarto ${quarto.id} - Dados processados:`, {
            amenities,
            additionalServices,
            highlights
          });
          
          const quartoFormatado = {
            id: quarto.id || '0',
            nome: quarto.name,
            descricao: quarto.description,
            descricaoLonga: quarto.description, // Usando a mesma descrição como descrição longa
            preco: quarto.price,
            metros: quarto.size,
            capacidade: quarto.capacity,
            avaliacao: 4.8, // Valor padrão
            numeroAvaliacoes: 50, // Valor padrão
            imagens: quarto.images,
            // Mapear corretamente os campos
            amenidades: amenities,
            destaques: highlights && highlights.length > 0 ? highlights : [],
            servicosAdicionais: additionalServices && additionalServices.length > 0 ? additionalServices : []
          };
          
          console.log(`Quarto ${quarto.id} - Dados formatados para UI:`, {
            nome: quartoFormatado.nome,
            amenidades: quartoFormatado.amenidades,
            destaques: quartoFormatado.destaques,
            servicosAdicionais: quartoFormatado.servicosAdicionais
          });
          
          return quartoFormatado;
        })
        
        setQuartos(quartosFormatados)
        setCurrentImageIndex(Array(quartosFormatados.length).fill(0))
      } else {
        // Usar dados de exemplo se não houver quartos no Firebase
        setQuartos(quartosPadrao)
        setCurrentImageIndex(Array(quartosPadrao.length).fill(0))
      }
    } catch (error) {
      console.error("Erro ao carregar quartos:", error)
      // Usar dados de exemplo em caso de erro
      setQuartos(quartosPadrao)
      setCurrentImageIndex(Array(quartosPadrao.length).fill(0))
    } finally {
      setLoading(false)
    }
  }

  const handleNextImage = (roomIndex: number) => {
    setCurrentImageIndex(prevState => {
      const newState = [...prevState]
      const room = quartos[roomIndex]
      newState[roomIndex] = (newState[roomIndex] + 1) % room.imagens.length
      return newState
    })
  }

  const handlePrevImage = (roomIndex: number) => {
    setCurrentImageIndex(prevState => {
      const newState = [...prevState]
      const room = quartos[roomIndex]
      newState[roomIndex] = (newState[roomIndex] - 1 + room.imagens.length) % room.imagens.length
      return newState
    })
  }

  const openRoomDetails = (room: QuartoUI) => {
    console.log("Abrindo detalhes do quarto:", room);
    
    // Garantir que todos os campos necessários existam
    setSelectedRoom({
      id: room.id,
      nome: room.nome,
      descricao: room.descricao,
      descricaoLonga: room.descricaoLonga,
      preco: room.preco,
      metros: room.metros,
      capacidade: room.capacidade,
      avaliacao: room.avaliacao,
      numeroAvaliacoes: room.numeroAvaliacoes,
      imagens: Array.isArray(room.imagens) ? room.imagens : [],
      amenidades: Array.isArray(room.amenidades) ? room.amenidades : [],
      destaques: Array.isArray(room.destaques) ? room.destaques : [],
      servicosAdicionais: Array.isArray(room.servicosAdicionais) ? room.servicosAdicionais : []
    });
    
    setIsDetailsOpen(true);
  }

  // Filtrar quartos por preço
  const quartosFiltrados = quartos.filter(quarto => {
    if (filtroPreco === 'todos') return true
    if (filtroPreco === 'economico' && quarto.preco < 600) return true
    if (filtroPreco === 'medio' && quarto.preco >= 600 && quarto.preco < 800) return true
    if (filtroPreco === 'premium' && quarto.preco >= 800) return true
    return false
  })

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-black' : 'bg-gray-50'} pb-32 md:pb-0`}>
      <Navbar />
      
      {/* Hero Section - Atualizado para corresponder à homepage */}
      <section className="relative min-h-[100svh] pb-20 md:pb-0">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{ 
              y: imageY,
              scale: 1.1
            }}
            className="w-full h-[120%] -mt-10"
          >
            <div className="w-full h-full relative">
              <Image
                src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
                alt="Quartos de Luxo"
                fill
                priority
                className="object-cover"
              />
            </div>
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
                  Conforto e elegância
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Nossos Quartos
                <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Aqua Vista Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 ${
                isDark ? 'text-white/90' : 'text-gray-800'
              }`}>
                Descubra o conforto e luxo que você merece em nossa seleção exclusiva de acomodações
              </p>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
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

      {/* Filtros Modernizados */}
      <section className={`py-12 border-t border-b ${
        isDark ? 'bg-muted/30 border-primary/10' : 'bg-gray-100 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={filtroPreco === 'todos' ? 'default' : 'outline'}
              onClick={() => setFiltroPreco('todos')}
              className="rounded-full hover:scale-105 transition-transform"
            >
              Todos os Quartos
            </Button>
            <Button
              variant={filtroPreco === 'economico' ? 'default' : 'outline'}
              onClick={() => setFiltroPreco('economico')}
              className="rounded-full hover:scale-105 transition-transform"
            >
              Até €600
            </Button>
            <Button
              variant={filtroPreco === 'medio' ? 'default' : 'outline'}
              onClick={() => setFiltroPreco('medio')}
              className="rounded-full hover:scale-105 transition-transform"
            >
              Entre €600 e €800
            </Button>
            <Button
              variant={filtroPreco === 'premium' ? 'default' : 'outline'}
              onClick={() => setFiltroPreco('premium')}
              className="rounded-full hover:scale-105 transition-transform"
            >
              Acima de €800
            </Button>
          </div>
        </div>
      </section>

      {/* Lista de Quartos Melhorada */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quartosFiltrados.map((quarto, index) => (
            <motion.div
              key={quarto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10 cursor-pointer" 
                onClick={() => openRoomDetails(quarto)}
              >
                <div className="relative h-60">
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={quarto.imagens[currentImageIndex[index]]}
                      alt={quarto.nome}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
                  </div>
                  
                  {/* Controles do Carrossel */}
                  <div className="absolute inset-x-0 bottom-0 h-full flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrevImage(index)
                      }}
                    >
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNextImage(index)
                      }}
                    >
                      <ChevronRight className="h-6 w-6 text-white" />
                    </Button>
                  </div>

                  {/* Indicador de Imagens */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                    {currentImageIndex[index] + 1}/{quarto.imagens.length}
                  </div>

                  {/* Badge de Preço */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="text-lg font-semibold px-4 py-2 bg-primary/90 hover:bg-primary backdrop-blur-sm shadow-lg">
                      {formatarPreco(quarto.preco)}
                      <span className="text-xs ml-1 opacity-80">/noite</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">{quarto.nome}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{quarto.avaliacao}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{quarto.numeroAvaliacoes} avaliações</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2">{quarto.descricao}</p>

                  <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-background">
                        <Square className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{quarto.metros}m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-background">
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Até {quarto.capacidade} pessoas</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {quarto.amenidades.slice(0, 3).map((amenidade, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="rounded-full px-2.5 py-0.5 text-xs bg-background border-primary/20"
                      >
                        {amenidade}
                      </Badge>
                    ))}
                    {quarto.amenidades.length > 3 && (
                      <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs">
                        +{quarto.amenidades.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-10 text-sm font-semibold"
                  >
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Informações Adicionais Melhoradas */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-3 p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Wi-Fi Gratuito</h3>
              <p className="text-sm text-muted-foreground">Internet de alta velocidade em todos os quartos</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center space-y-3 p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Coffee className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Café da Manhã</h3>
              <p className="text-sm text-muted-foreground">Buffet completo incluso em todas as diárias</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center space-y-3 p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Bath className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Amenidades Premium</h3>
              <p className="text-sm text-muted-foreground">Produtos de banho de alta qualidade</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center space-y-3 p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Tv className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Entretenimento</h3>
              <p className="text-sm text-muted-foreground">Smart TVs com streaming incluso</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sheet de Detalhes do Quarto */}
      <RoomDetailsSheet 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        quarto={selectedRoom}
      />
    </main>
  )
} 