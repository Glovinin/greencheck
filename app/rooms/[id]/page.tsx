"use client"

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Star, Square, Users, Check, ArrowRight } from 'lucide-react'

// Dados dos quartos
const quartos = [
  {
    id: 1,
    nome: "Suíte Luxo Vista Montanha",
    descricao: "Uma experiência única com vista panorâmica para as montanhas de Monchique. Decoração sofisticada e ambiente acolhedor.",
    descricaoLonga: "Desfrute de uma experiência verdadeiramente luxuosa em nossa Suíte Vista Montanha. Com uma vista deslumbrante para as montanhas de Monchique, este espaço foi meticulosamente projetado para proporcionar o máximo de conforto e sofisticação. A suíte conta com uma área de estar separada, decoração contemporânea e acabamentos premium em cada detalhe.",
    preco: 780,
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
    preco: 590,
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
    preco: 890,
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

export default function RoomDetails() {
  const params = useParams()
  const router = useRouter()
  const quarto = quartos.find(q => q.id === Number(params.id))

  if (!quarto) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Quarto não encontrado</h1>
          <Button 
            variant="outline" 
            className="rounded-full"
            onClick={() => router.push('/rooms')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Quartos
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <Navbar />
      </div>
      
      {/* Hero Section Melhorada */}
      <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] pt-16">
        <div className="absolute inset-0 top-0">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Imagem Principal */}
            <div className="relative h-full">
              <img
                src={quarto.imagens[0]}
                alt={quarto.nome}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
            </div>
            
            {/* Grid de Imagens Secundárias */}
            <div className="hidden md:grid grid-cols-2 gap-2 p-2 bg-background/5 backdrop-blur-sm">
              {quarto.imagens.slice(1).map((img, i) => (
                <div key={i} className="relative group overflow-hidden rounded-xl">
                  <img
                    src={img}
                    alt={`${quarto.nome} - Imagem ${i + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de Voltar e Título */}
        <div className="absolute top-20 left-0 right-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <Button
              variant="outline"
              className="rounded-full bg-black/70 hover:bg-black/80 text-white border-white/20 shadow-lg backdrop-blur-sm"
              onClick={() => router.push('/rooms')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              Reservar
            </Button>
          </div>
        </div>

        {/* Informações Principais Sobrepostas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{quarto.nome}</h1>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{quarto.avaliacao}</span>
                  </div>
                  <span>•</span>
                  <span>{quarto.numeroAvaliacoes} avaliações</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl md:text-4xl font-bold">{formatarPreco(quarto.preco)}</div>
                <div className="text-white/80">por noite</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Coluna da Esquerda */}
          <div className="space-y-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">{quarto.descricaoLonga}</p>
            </div>

            <div className="flex flex-wrap gap-4 p-6 bg-muted/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-background">
                  <Square className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{quarto.metros}m²</div>
                  <div className="text-sm text-muted-foreground">Área total</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-background">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Até {quarto.capacidade} pessoas</div>
                  <div className="text-sm text-muted-foreground">Capacidade</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Destaques do Quarto</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {quarto.destaques.map((destaque, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{destaque}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Amenidades</h2>
              <div className="grid grid-cols-2 gap-4">
                {quarto.amenidades.map((amenidade, i) => (
                  <Badge 
                    key={i}
                    variant="outline"
                    className="justify-center rounded-xl py-3 text-base bg-background border-primary/20 hover:bg-primary/5"
                  >
                    {amenidade}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Serviços Adicionais</h2>
              <div className="grid gap-3">
                {quarto.servicosAdicionais.map((servico, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-muted/5 transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{servico}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de Reserva Fixo */}
            <div className="sticky top-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">Total por noite</div>
                  <div className="text-2xl font-bold">{formatarPreco(quarto.preco)}</div>
                </div>
                <Button 
                  size="lg"
                  className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 py-6 text-lg font-semibold"
                >
                  Reservar Agora
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Não será feita nenhuma cobrança ainda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 