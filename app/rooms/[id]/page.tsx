"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Star, Square, Users, Check, ArrowRight, Loader2, Wifi, Wind, Coffee, Utensils, ChevronLeft, ChevronRight } from 'lucide-react'
import { getRoomById } from '@/lib/firebase/firestore'
import { Room } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

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
    if (!quarto) return;
    
    // Redirecionar para a página de booking com o ID do quarto
    router.push(`/booking?roomId=${quarto.id}`)
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
    <>
      <main className="min-h-screen bg-background dark:bg-black relative">
        {/* Efeitos decorativos para o modo escuro */}
        <div className="absolute inset-0 dark:bg-[url('/noise.png')] dark:opacity-[0.03] dark:mix-blend-overlay" />
        <div className="absolute inset-0 dark:bg-gradient-radial dark:from-primary/5 dark:via-transparent dark:to-transparent dark:opacity-70" />
        <div className="absolute top-0 right-0 dark:w-96 dark:h-96 dark:bg-primary/5 dark:rounded-full dark:blur-[100px] dark:opacity-50" />
        <div className="absolute bottom-0 left-0 dark:w-96 dark:h-96 dark:bg-primary/5 dark:rounded-full dark:blur-[100px] dark:opacity-50" />
        
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 dark:bg-black/95 backdrop-blur-lg border-b border-border/40 dark:border-white/10">
          <Navbar />
        </div>
        
        {/* Botão de Voltar */}
        <div className="pt-20 px-4 max-w-7xl mx-auto relative z-10">
          <Button
            variant="outline"
            className="mb-4 hover:bg-background dark:hover:bg-white/5 rounded-full dark:border-white/20 dark:text-white"
            onClick={() => router.push('/rooms')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-4 pb-16 relative z-10">
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
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-muted shadow-md">
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
                
                {/* Botões de navegação da galeria */}
                {quarto.imagens.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                      onClick={() => setImagemAtiva((prev) => (prev - 1 + quarto.imagens.length) % quarto.imagens.length)}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                      onClick={() => setImagemAtiva((prev) => (prev + 1) % quarto.imagens.length)}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
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
                <h2 className="text-2xl font-semibold dark:text-white">Sobre o Quarto</h2>
                <p className="text-muted-foreground dark:text-white/70 leading-relaxed">{quarto.descricaoLonga}</p>
              </div>
              
              {/* Características */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-muted/30 dark:bg-white/5 rounded-xl dark:backdrop-blur-sm">
                  <Square className="h-6 w-6 text-primary mb-2" />
                  <span className="font-medium dark:text-white">{quarto.metros}m²</span>
                  <span className="text-xs text-muted-foreground dark:text-white/60">Área</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted/30 dark:bg-white/5 rounded-xl dark:backdrop-blur-sm">
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <span className="font-medium dark:text-white">{quarto.capacidade}</span>
                  <span className="text-xs text-muted-foreground dark:text-white/60">Pessoas</span>
                </div>
                {quarto.destaques.slice(0, 2).map((destaque, i) => {
                  const IconComponent = amenidadeIcons[destaque] || Check;
                  return (
                    <div key={i} className="flex flex-col items-center justify-center p-4 bg-muted/30 dark:bg-white/5 rounded-xl dark:backdrop-blur-sm">
                      <IconComponent className="h-6 w-6 text-primary mb-2" />
                      <span className="font-medium text-center dark:text-white">{destaque}</span>
                      <span className="text-xs text-muted-foreground dark:text-white/60">Incluído</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Amenidades */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold dark:text-white">Amenidades</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {quarto.amenidades.map((amenidade, i) => {
                    const IconComponent = amenidadeIcons[amenidade] || Check;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 dark:bg-white/5 hover:bg-muted/30 dark:hover:bg-white/10 transition-colors dark:backdrop-blur-sm">
                        <div className="p-1.5 rounded-full bg-primary/10 dark:bg-primary/20">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium dark:text-white">{amenidade}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Serviços Adicionais */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold dark:text-white">Serviços Adicionais</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {quarto.servicosAdicionais.map((servico, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 p-4 rounded-xl border border-border/50 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/20 hover:bg-muted/5 dark:hover:bg-white/5 transition-all cursor-pointer dark:backdrop-blur-sm"
                    >
                      <div className="flex-1">
                        <span className="font-medium dark:text-white">{servico}</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Coluna da Direita - Reserva */}
            <div className="lg:sticky lg:top-32 self-start">
              <div className="bg-card dark:bg-black/50 rounded-3xl overflow-hidden border border-border/50 dark:border-white/10 shadow-lg p-6 dark:backdrop-blur-sm relative dark:shadow-xl">
                {/* Efeitos decorativos para o card no modo escuro */}
                <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-black/80 dark:to-black/60 dark:z-0" />
                <div className="absolute top-0 right-0 dark:-mt-10 dark:-mr-10 dark:w-40 dark:h-40 dark:rounded-full dark:blur-3xl dark:opacity-70 dark:bg-primary/10" />
                <div className="absolute bottom-0 left-0 dark:-mb-10 dark:-ml-10 dark:w-40 dark:h-40 dark:rounded-full dark:blur-3xl dark:opacity-70 dark:bg-primary/10" />
                
                <div className="space-y-6 relative dark:z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-3xl font-bold dark:text-white">{formatarPreco(quarto.preco)}</div>
                      <div className="text-muted-foreground dark:text-white/70">por noite</div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30">
                      Disponível
                    </Badge>
                  </div>
                  
                  {/* Características Rápidas */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 dark:bg-white/5 rounded-xl dark:backdrop-blur-sm relative">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-background dark:bg-white/10">
                        <Square className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium dark:text-white">{quarto.metros}m²</div>
                        <div className="text-xs text-muted-foreground dark:text-white/70">Área total</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-background dark:bg-white/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium dark:text-white">Até {quarto.capacidade} pessoas</div>
                        <div className="text-xs text-muted-foreground dark:text-white/70">Capacidade</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 dark:border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium dark:text-white/90">Preço por noite</span>
                      <span className="dark:text-white">{formatarPreco(quarto.preco)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium dark:text-white/90">Taxa de serviço</span>
                      <span className="dark:text-white">{formatarPreco(quarto.preco * 0.1)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span className="dark:text-white">Total</span>
                      <span className="dark:text-white">{formatarPreco(quarto.preco * 1.1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center w-full space-y-2">
                    <Button 
                      className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-white dark:hover:bg-white/90 dark:text-black transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 font-semibold py-3 flex items-center justify-center gap-2"
                      onClick={handleReservar}
                      aria-label="Ver disponibilidade deste quarto"
                    >
                      Ver Disponibilidade
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground dark:text-white/70">
                      Não será feita nenhuma cobrança ainda. Você confirmará os detalhes na próxima etapa.
                    </p>
                  </div>
                  
                  <p className="text-sm text-center text-muted-foreground dark:text-white/70 mt-2 border-t border-border/20 dark:border-white/10 pt-2">
                    <span className="inline-flex items-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium dark:text-white">{quarto.avaliacao}</span>
                    </span>
                    <span className="mx-1 dark:text-white/70">•</span>
                    <span className="dark:text-white/70">{quarto.numeroAvaliacoes} avaliações</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer com padding extra para dispositivos móveis */}
      <div className="lg:pb-0 pb-24 md:pb-20">
        <Footer />
      </div>
    </>
  )
} 