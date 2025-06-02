"use client"

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { 
  ArrowRight, 
  Wifi, 
  Coffee, 
  Bath, 
  Tv, 
  Users, 
  Square, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ChevronDown, 
  Search,
  RefreshCw
} from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { getRooms } from '@/lib/firebase/firestore'
import { Room } from '@/lib/types'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

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
  const [filtroCapacidade, setFiltroCapacidade] = useState('any')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroPrecoMaximo, setFiltroPrecoMaximo] = useState('any')
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

  // Função para filtrar os quartos
  const handleFilterChange = (field: 'capacidade' | 'tipo' | 'precoMaximo', value: string) => {
    if (field === 'capacidade') {
      setFiltroCapacidade(value);
    } else if (field === 'tipo') {
      setFiltroTipo(value);
    } else if (field === 'precoMaximo') {
      setFiltroPrecoMaximo(value);
    }
  };

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
    if (roomIndex < 0 || roomIndex >= quartos.length) return;
    if (!quartos[roomIndex].imagens || quartos[roomIndex].imagens.length <= 1) return;
    
    setCurrentImageIndex(prev => {
      const newIndexes = [...prev];
      newIndexes[roomIndex] = (newIndexes[roomIndex] + 1) % quartos[roomIndex].imagens.length;
      return newIndexes;
    });
  }

  const handlePrevImage = (roomIndex: number) => {
    if (roomIndex < 0 || roomIndex >= quartos.length) return;
    if (!quartos[roomIndex].imagens || quartos[roomIndex].imagens.length <= 1) return;
    
    setCurrentImageIndex(prev => {
      const newIndexes = [...prev];
      newIndexes[roomIndex] = (newIndexes[roomIndex] - 1 + quartos[roomIndex].imagens.length) % quartos[roomIndex].imagens.length;
      return newIndexes;
    });
  }

  const handleVerDetalhes = (id: string) => {
    router.push(`/rooms/${id}`);
  }

  // Filtrar quartos com base nos filtros selecionados
  const quartosFiltrados = quartos.filter(quarto => {
    let atendeFiltros = true;
    
    // Filtro por capacidade
    if (filtroCapacidade && filtroCapacidade !== 'any') {
      atendeFiltros = atendeFiltros && quarto.capacidade >= parseInt(filtroCapacidade);
    }
    
    // Filtro por tipo de quarto
    if (filtroTipo && filtroTipo !== 'todos') {
      const tipoNormalizado = filtroTipo.toLowerCase();
      const quartoNome = quarto.nome.toLowerCase();
      
      // Adaptado para verificar os tipos específicos
      switch(tipoNormalizado) {
        case 'standard':
          atendeFiltros = atendeFiltros && quartoNome.includes('standard');
          break;
        case 'deluxe':
          atendeFiltros = atendeFiltros && quartoNome.includes('deluxe');
          break;
        case 'suite':
          // Verifica ambas as grafias: suite e suíte
          atendeFiltros = atendeFiltros && (quartoNome.includes('suite') || quartoNome.includes('suíte'));
          break;
        case 'familiar':
          // Verifica ambos os termos: familiar e família
          atendeFiltros = atendeFiltros && (quartoNome.includes('familiar') || quartoNome.includes('família') || quartoNome.includes('familia'));
          break;
        case 'presidencial':
          atendeFiltros = atendeFiltros && quartoNome.includes('presidencial');
          break;
        default:
          // Caso padrão, busca pelo termo no nome
          atendeFiltros = atendeFiltros && quartoNome.includes(tipoNormalizado);
      }
    }
    
    // Filtro por preço máximo
    if (filtroPrecoMaximo && filtroPrecoMaximo !== 'any') {
      const precoMaximo = parseInt(filtroPrecoMaximo);
      atendeFiltros = atendeFiltros && (quarto.preco <= precoMaximo);
    }
    
    return atendeFiltros;
  });

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <>
    <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'} pb-32 md:pb-0`}>
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
                  Conforto e elegância
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
              }`}>
                Nossos Quartos
                <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                  isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'
                }`}>Aqua Vista Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 ${
                isDark ? 'text-[#EED5B9]/90' : 'text-[#4F3621]/90'
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

      {/* Filtros Modernizados */}
      <section className={`py-12 ${
          isDark ? 'bg-[#4F3621]/60' : 'bg-[#EED5B9]/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${
                isDark 
                ? 'bg-[#4F3621]/40 border-[#EED5B9]/10' 
                : 'bg-white/90 border-[#4F3621]/20'
              } backdrop-blur-xl rounded-3xl border p-6 md:p-8 shadow-xl`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="mr-3 p-2 rounded-full bg-primary/10">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                      Filtrar Quartos
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-[#EED5B9]/60' : 'text-[#4F3621]/60'}`}>
                      Encontre o quarto perfeito para sua estadia
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="outline" 
                  onClick={() => {
                    setFiltroCapacidade('any');
                    setFiltroTipo('todos');
                    setFiltroPrecoMaximo('any');
                  }}
                  className={`${
                    isDark 
                      ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 hover:bg-[#EED5B9]/10 text-[#EED5B9] shadow-inner' 
                      : 'bg-[#4F3621]/10 border-[#4F3621]/20 hover:bg-[#4F3621]/20 text-[#4F3621]'
                    } rounded-full transition-all duration-300 group`}
                >
                  <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  Limpar filtros
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Filtro de Capacidade */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="capacidade" 
                    className={`block text-sm font-medium ${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}
                  >
                    Capacidade
                  </Label>
                  <Select 
                    value={filtroCapacidade} 
                    onValueChange={(value) => handleFilterChange('capacidade', value)}
                  >
                    <SelectTrigger className={`w-full transition-all duration-300 rounded-xl h-12 ${
                      isDark 
                      ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/20' 
                      : 'bg-white border-[#4F3621]/20 text-[#4F3621] hover:border-[#4F3621]/30 hover:bg-[#4F3621]/5'
                    }`}>
                      <SelectValue placeholder="Qualquer capacidade" />
                    </SelectTrigger>
                    <SelectContent className={`rounded-xl ${isDark ? 'bg-[#4F3621] border-[#EED5B9]/10' : ''}`}>
                      <SelectItem value="any">Qualquer capacidade</SelectItem>
                      <SelectItem value="1">1 pessoa</SelectItem>
                      <SelectItem value="2">2 pessoas</SelectItem>
                      <SelectItem value="3">3+ pessoas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  
                {/* Filtro de Tipo */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="tipo" 
                    className={`block text-sm font-medium ${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}
                  >
                    Tipo de Quarto
                  </Label>
                  <Select 
                    value={filtroTipo} 
                    onValueChange={(value) => handleFilterChange('tipo', value)}
                  >
                    <SelectTrigger className={`w-full transition-all duration-300 rounded-xl h-12 ${
                      isDark 
                      ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/20' 
                      : 'bg-white border-[#4F3621]/20 text-[#4F3621] hover:border-[#4F3621]/30 hover:bg-[#4F3621]/5'
                    }`}>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent className={`rounded-xl ${isDark ? 'bg-[#4F3621] border-[#EED5B9]/10' : ''}`}>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="familiar">Familiar</SelectItem>
                      <SelectItem value="presidencial">Presidencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  
                {/* Filtro de Preço */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="preco" 
                    className={`block text-sm font-medium ${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}
                  >
                    Preço Máximo
                  </Label>
                  <Select 
                    value={filtroPrecoMaximo} 
                    onValueChange={(value) => handleFilterChange('precoMaximo', value)}
                  >
                    <SelectTrigger className={`w-full transition-all duration-300 rounded-xl h-12 ${
                      isDark 
                      ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/20' 
                      : 'bg-white border-[#4F3621]/20 text-[#4F3621] hover:border-[#4F3621]/30 hover:bg-[#4F3621]/5'
                    }`}>
                      <SelectValue placeholder="Sem limite de preço" />
                    </SelectTrigger>
                    <SelectContent className={`rounded-xl ${isDark ? 'bg-[#4F3621] border-[#EED5B9]/10' : ''}`}>
                      <SelectItem value="any">Sem limite de preço</SelectItem>
                      <SelectItem value="200">Até €200</SelectItem>
                      <SelectItem value="300">Até €300</SelectItem>
                      <SelectItem value="500">Até €500</SelectItem>
                      <SelectItem value="1000">Até €1000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Lista de Quartos Melhorada */}
      <section className={`py-16 ${isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
              Nossos Quartos <span className="text-primary">& Suítes</span>
            </h2>
            <p className={`text-sm md:text-base mt-2 md:mt-0 ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
              Mostrando {quartosFiltrados.length} {quartosFiltrados.length === 1 ? 'opção' : 'opções'} disponíveis
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : quartosFiltrados.length === 0 ? (
            <div className={`text-center py-16 rounded-3xl border ${
              isDark ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10' : 'bg-white/50 border-[#4F3621]/10'
            }`}>
              <div className="max-w-md mx-auto">
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                  Nenhum quarto encontrado
                </h3>
                <p className={`mb-6 ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                  Tente ajustar seus filtros para encontrar opções disponíveis
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFiltroCapacidade('any');
                    setFiltroTipo('todos');
                    setFiltroPrecoMaximo('any');
                  }}
                  className={`rounded-full ${
                    isDark 
                      ? 'bg-[#EED5B9]/5 border-[#EED5B9]/20 hover:bg-[#EED5B9]/10 text-[#EED5B9]' 
                      : 'bg-white border-[#4F3621]/20 hover:bg-[#4F3621]/5 text-[#4F3621]'
                  }`}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Limpar filtros
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quartosFiltrados.map((quarto, index) => (
                <motion.div
                  key={quarto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="transition-all duration-500 transform hover:-translate-y-1"
                >
                  <Card 
                    className={`overflow-hidden group border-0 shadow-lg ${
                      isDark 
                        ? 'bg-[#4F3621]/60 backdrop-blur-sm ring-1 ring-[#EED5B9]/10 hover:ring-primary/20' 
                        : 'bg-white hover:shadow-xl'
                    } rounded-2xl cursor-pointer transition-all duration-300`}
                  >
                    <div className="relative h-60">
                      <img
                        src={quarto.imagens[currentImageIndex[index]]}
                        alt={quarto.nome}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Gradiente overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>

                      {/* Botões de navegação */}
                      {quarto.imagens.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevImage(index);
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Imagem anterior"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextImage(index);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Próxima imagem"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {/* Contador de imagens */}
                      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${
                        isDark
                          ? 'bg-black/60 text-white backdrop-blur-sm'
                          : 'bg-white/90 text-gray-900 backdrop-blur-sm border border-gray-200 shadow-sm'
                      }`}>
                        {currentImageIndex[index] + 1}/{quarto.imagens.length}
                      </div>

                      {/* Badge de Preço */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="default" className="text-sm font-semibold px-3 py-1.5 bg-primary/90 hover:bg-primary backdrop-blur-sm shadow-lg">
                          {formatarPreco(quarto.preco)}
                          <span className="text-xs opacity-90 ml-1">/noite</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className={`p-6 space-y-4 ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">{quarto.nome}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{quarto.avaliacao}</span>
                          </div>
                          <span className={`text-xs ${isDark ? 'text-[#EED5B9]/50' : 'text-[#4F3621]/50'}`}>•</span>
                          <span className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                            {quarto.numeroAvaliacoes} avaliações
                          </span>
                        </div>
                      </div>

                      <p className={`text-sm line-clamp-2 ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                        {quarto.descricao}
                      </p>

                      <div className={`flex items-center gap-4 p-3 rounded-xl ${
                        isDark ? 'bg-[#EED5B9]/5' : 'bg-[#4F3621]/5'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${isDark ? 'bg-[#EED5B9]/10' : 'bg-[#4F3621]/10'}`}>
                            <Square className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{quarto.metros}m²</span>
                        </div>
                        <div className={`h-4 w-px ${isDark ? 'bg-[#EED5B9]/10' : 'bg-[#4F3621]/10'}`}></div>
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-full ${isDark ? 'bg-[#EED5B9]/10' : 'bg-[#4F3621]/10'}`}>
                            <Users className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Até {quarto.capacidade} pessoas</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {quarto.amenidades.slice(0, 3).map((amenidade, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className={`rounded-full text-xs ${
                              isDark 
                                ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 text-[#EED5B9]' 
                                : 'bg-[#4F3621]/5 border-[#4F3621]/20 text-[#4F3621]'
                            }`}
                          >
                            {amenidade}
                          </Badge>
                        ))}
                        {quarto.amenidades.length > 3 && (
                          <Badge 
                            variant="outline" 
                            className={`rounded-full text-xs ${
                              isDark 
                                ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 text-[#EED5B9]' 
                                : 'bg-[#4F3621]/5 border-[#4F3621]/20 text-[#4F3621]'
                            }`}
                          >
                            +{quarto.amenidades.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Button 
                        className={`w-full rounded-full transition-all duration-300 group ${
                          isDark
                            ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 shadow-[#EED5B9]/10 hover:shadow-[#EED5B9]/20' 
                            : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 shadow-[#4F3621]/20 hover:shadow-[#4F3621]/30'
                        } hover:scale-105 shadow-lg py-3 text-sm font-semibold`}
                        onClick={() => handleVerDetalhes(quarto.id)}
                      >
                        Ver Detalhes
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Informações Adicionais Melhoradas */}
      <section className={`py-16 border-t border-primary/10 ${
        isDark ? 'bg-gradient-to-b from-[#4F3621]/30 to-[#4F3621]' : 'bg-gradient-to-b from-[#EED5B9]/30 to-[#EED5B9]'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-center space-y-3 p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 hover:border-[#EED5B9]/30 hover:shadow-lg' 
                  : 'bg-white/50 border-[#4F3621]/10 hover:border-[#4F3621]/30 hover:shadow-lg'
              }`}
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className={`font-semibold text-lg ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Wi-Fi Gratuito</h3>
              <p className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>Internet de alta velocidade em todos os quartos</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-center space-y-3 p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 hover:border-[#EED5B9]/30 hover:shadow-lg' 
                  : 'bg-white/50 border-[#4F3621]/10 hover:border-[#4F3621]/30 hover:shadow-lg'
              }`}
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Coffee className="h-8 w-8 text-primary" />
              </div>
              <h3 className={`font-semibold text-lg ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Café da Manhã</h3>
              <p className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>Buffet completo incluso em todas as diárias</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-center space-y-3 p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 hover:border-[#EED5B9]/30 hover:shadow-lg' 
                  : 'bg-white/50 border-[#4F3621]/10 hover:border-[#4F3621]/30 hover:shadow-lg'
              }`}
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Bath className="h-8 w-8 text-primary" />
              </div>
              <h3 className={`font-semibold text-lg ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Amenidades Premium</h3>
              <p className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>Produtos de banho de alta qualidade</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`text-center space-y-3 p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#EED5B9]/5 border-[#EED5B9]/10 hover:border-[#EED5B9]/30 hover:shadow-lg' 
                  : 'bg-white/50 border-[#4F3621]/10 hover:border-[#4F3621]/30 hover:shadow-lg'
              }`}
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Tv className="h-8 w-8 text-primary" />
              </div>
              <h3 className={`font-semibold text-lg ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Entretenimento</h3>
              <p className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>Smart TVs com streaming incluso</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
      
      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </>
  )
} 