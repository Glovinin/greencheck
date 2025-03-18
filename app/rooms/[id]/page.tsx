"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Star, Square, Users, Check, ArrowRight, Loader2, Wifi, Wind, Coffee, Utensils } from 'lucide-react'
import { getRoomById } from '@/lib/firebase/firestore'
import { Room } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

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

const formatarPreco = (preco: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(preco)
}

// Mapeamento de ícones para amenidades comuns
const amenidadeIcons: Record<string, any> = {
  "Wi-Fi Grátis": Wifi,
  "Ar Condicionado": Wind,
  "Café da manhã": Coffee,
  "Serviço de quarto": Utensils,
}

export default function RoomDetails() {
  const params = useParams()
  const router = useRouter()
  const [quarto, setQuarto] = useState<QuartoUI | null>(null)
  const [loading, setLoading] = useState(true)
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    loadRoom()
  }, [params.id])

  const loadRoom = async () => {
    try {
      setLoading(true)
      const roomData = await getRoomById(params.id as string)
      
      if (!roomData) {
        setLoading(false)
        return
      }
      
      // Converter o formato do Firebase para o formato usado na interface
      const quartoFormatado: QuartoUI = {
        id: roomData.id || '0',
        nome: roomData.name,
        descricao: roomData.description,
        descricaoLonga: roomData.description, // Usando a mesma descrição como descrição longa
        preco: roomData.price,
        metros: roomData.size,
        capacidade: roomData.capacity,
        avaliacao: 4.8, // Valor padrão
        numeroAvaliacoes: 50, // Valor padrão
        imagens: roomData.images,
        amenidades: roomData.amenities,
        destaques: roomData.amenities.slice(0, 3), // Usando as primeiras 3 amenidades como destaques
        servicosAdicionais: roomData.additionalServices || ["Serviço de quarto", "Café da manhã", "Transfer", "Massagem"] // Valores padrão se não houver serviços adicionais
      }
      
      setQuarto(quartoFormatado)
    } catch (error) {
      console.error("Erro ao carregar quarto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as informações do quarto",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReservar = () => {
    router.push(`/booking?room=${params.id}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando informações do quarto...</p>
        </div>
      </main>
    )
  }

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
      
      {/* Botão de Voltar */}
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 hover:bg-background"
          onClick={() => router.push('/rooms')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Informações do Quarto */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cabeçalho */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{quarto.nome}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{quarto.avaliacao}</span>
                </div>
                <span>•</span>
                <span>{quarto.numeroAvaliacoes} avaliações</span>
                <span>•</span>
                <span>{quarto.metros}m²</span>
                <span>•</span>
                <span>Até {quarto.capacidade} pessoas</span>
              </div>
            </div>
            
            {/* Galeria de Imagens */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-muted">
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={imagemAtiva}
              >
                <img
                  src={quarto.imagens[imagemAtiva]}
                  alt={`${quarto.nome} - Imagem ${imagemAtiva + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Controles da Galeria */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {quarto.imagens.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setImagemAtiva(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === imagemAtiva 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Ver imagem ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Miniaturas */}
            <div className="grid grid-cols-5 gap-2">
              {quarto.imagens.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  className={`relative rounded-lg overflow-hidden aspect-square ${
                    i === imagemAtiva ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  onClick={() => setImagemAtiva(i)}
                >
                  <img
                    src={img}
                    alt={`${quarto.nome} - Miniatura ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Descrição */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Sobre o Quarto</h2>
              <p className="text-muted-foreground leading-relaxed">{quarto.descricaoLonga}</p>
            </div>
            
            {/* Características */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl">
                <Square className="h-6 w-6 text-primary mb-2" />
                <span className="font-medium">{quarto.metros}m²</span>
                <span className="text-xs text-muted-foreground">Área</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl">
                <Users className="h-6 w-6 text-primary mb-2" />
                <span className="font-medium">{quarto.capacidade}</span>
                <span className="text-xs text-muted-foreground">Pessoas</span>
              </div>
              {quarto.destaques.slice(0, 2).map((destaque, i) => {
                const IconComponent = amenidadeIcons[destaque] || Check;
                return (
                  <div key={i} className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-xl">
                    <IconComponent className="h-6 w-6 text-primary mb-2" />
                    <span className="font-medium text-center">{destaque}</span>
                    <span className="text-xs text-muted-foreground">Incluído</span>
                  </div>
                );
              })}
            </div>
            
            {/* Amenidades */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Amenidades</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {quarto.amenidades.map((amenidade, i) => {
                  const IconComponent = amenidadeIcons[amenidade] || Check;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="p-1.5 rounded-full bg-primary/10">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{amenidade}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Serviços Adicionais */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Serviços Adicionais</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {quarto.servicosAdicionais.map((servico, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/5 transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{servico}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Coluna da Direita - Card de Reserva */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl p-6 border shadow-lg">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-3xl font-bold">{formatarPreco(quarto.preco)}</div>
                    <div className="text-muted-foreground">por noite</div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Disponível
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Check-in</label>
                      <div className="p-3 rounded-lg border bg-muted/20">
                        Selecionar
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Check-out</label>
                      <div className="p-3 rounded-lg border bg-muted/20">
                        Selecionar
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Hóspedes</label>
                    <div className="p-3 rounded-lg border bg-muted/20 flex justify-between items-center">
                      <span>2 adultos, 0 crianças</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Preço por noite</span>
                    <span>{formatarPreco(quarto.preco)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Taxa de serviço</span>
                    <span>{formatarPreco(quarto.preco * 0.1)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>{formatarPreco(quarto.preco * 1.1)}</span>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="w-full rounded-xl bg-white hover:bg-white/90 text-black shadow-md hover:shadow-lg transition-all py-6 text-base font-semibold"
                  onClick={handleReservar}
                >
                  Reservar Agora
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Não será feita nenhuma cobrança ainda. Você confirmará os detalhes na próxima etapa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 