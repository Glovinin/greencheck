"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ArrowRight, Wifi, Coffee, Bath, Tv, Users, Square, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RoomDetailsSheet } from '@/components/RoomDetailsSheet'

const quartos = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

export default function Rooms() {
  const router = useRouter()
  const [filtroPreco, setFiltroPreco] = useState('todos')
  const [currentImageIndex, setCurrentImageIndex] = useState(Array(quartos.length).fill(0))
  const [selectedRoom, setSelectedRoom] = useState<typeof quartos[0] | null>(null)

  const handleNextImage = (roomIndex: number) => {
    setCurrentImageIndex(prev => {
      const newIndexes = [...prev]
      newIndexes[roomIndex] = (newIndexes[roomIndex] + 1) % quartos[roomIndex].imagens.length
      return newIndexes
    })
  }

  const handlePrevImage = (roomIndex: number) => {
    setCurrentImageIndex(prev => {
      const newIndexes = [...prev]
      newIndexes[roomIndex] = (newIndexes[roomIndex] - 1 + quartos[roomIndex].imagens.length) % quartos[roomIndex].imagens.length
      return newIndexes
    })
  }

  const quartosFiltrados = quartos.filter(quarto => {
    if (filtroPreco === 'todos') return true
    if (filtroPreco === 'ate600' && quarto.preco <= 600) return true
    if (filtroPreco === 'mais600' && quarto.preco > 600) return true
    return false
  })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section Melhorado */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461"
            alt="Quartos de Luxo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-bold text-white"
          >
            Nossos Quartos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 font-light"
          >
            Descubra o conforto e luxo que você merece em nossa seleção exclusiva de acomodações
          </motion.p>
        </div>
      </section>

      {/* Filtros Modernizados */}
      <section className="py-12 bg-muted/30 border-t border-b border-primary/10">
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
              variant={filtroPreco === 'ate600' ? 'default' : 'outline'}
              onClick={() => setFiltroPreco('ate600')}
              className="rounded-full hover:scale-105 transition-transform"
            >
              Até €600
            </Button>
            <Button
              variant={filtroPreco === 'mais600' ? 'default' : 'outline'}
              onClick={() => setFiltroPreco('mais600')}
              className="rounded-full hover:scale-105 transition-transform"
            >
              Acima de €600
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
                onClick={() => setSelectedRoom(quarto)}
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

      {/* Sheet de Detalhes */}
      {selectedRoom && (
        <RoomDetailsSheet
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          quarto={selectedRoom}
        />
      )}
    </main>
  )
} 