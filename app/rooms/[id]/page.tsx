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
import { useTheme } from 'next-themes'

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
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const { theme } = useTheme()

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  if (loading) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className={`${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
            Carregando informações do quarto...
          </p>
        </div>
      </main>
    )
  }

  if (!quarto) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <div className="text-center space-y-4">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
            Quarto não encontrado
          </h1>
          <Button 
            variant="outline" 
            className={`rounded-full ${
              isDark 
                ? 'border-[#EED5B9]/20 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/40' 
                : 'border-[#4F3621]/40 text-[#4F3621] hover:bg-[#4F3621]/10 hover:border-[#4F3621]/60'
            }`}
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
      <main className={`min-h-screen relative overflow-x-hidden pb-32 md:pb-0 ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        {/* Efeitos decorativos */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        
        <Navbar />
        
        {/* Botão de Voltar */}
        <div className="pt-20 px-4 max-w-7xl mx-auto relative z-10">
          <Button
            variant="outline"
            className={`mb-4 rounded-full ${
              isDark 
                ? 'border-[#EED5B9]/20 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/40' 
                : 'border-[#4F3621]/20 text-[#4F3621] hover:bg-[#4F3621]/10 hover:border-[#4F3621]/40'
            }`}
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
                <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                  {quarto.nome}
                </h1>
                <div className={`flex items-center gap-2 ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
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
              <div className={`relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md ${
                isDark ? 'bg-[#4F3621]/60' : 'bg-white/50'
              }`}>
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
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                  Sobre o Quarto
                </h2>
                <p className={`leading-relaxed ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                  {quarto.descricaoLonga}
                </p>
              </div>
              
              {/* Características */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl backdrop-blur-sm ${
                  isDark 
                    ? 'bg-[#EED5B9]/5 border border-[#EED5B9]/10' 
                    : 'bg-white/50 border border-[#4F3621]/10'
                }`}>
                  <Square className="h-6 w-6 text-primary mb-2" />
                  <span className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                    {quarto.metros}m²
                  </span>
                  <span className={`text-xs ${isDark ? 'text-[#EED5B9]/60' : 'text-[#4F3621]/60'}`}>
                    Área
                  </span>
                </div>
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl backdrop-blur-sm ${
                  isDark 
                    ? 'bg-[#EED5B9]/5 border border-[#EED5B9]/10' 
                    : 'bg-white/50 border border-[#4F3621]/10'
                }`}>
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <span className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                    {quarto.capacidade}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-[#EED5B9]/60' : 'text-[#4F3621]/60'}`}>
                    Pessoas
                  </span>
                </div>
                {quarto.destaques.slice(0, 2).map((destaque, i) => {
                  const IconComponent = amenidadeIcons[destaque] || Check;
                  return (
                    <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-xl backdrop-blur-sm ${
                      isDark 
                        ? 'bg-[#EED5B9]/5 border border-[#EED5B9]/10' 
                        : 'bg-white/50 border border-[#4F3621]/10'
                    }`}>
                      <IconComponent className="h-6 w-6 text-primary mb-2" />
                      <span className={`font-medium text-center ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                        {destaque}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-[#EED5B9]/60' : 'text-[#4F3621]/60'}`}>
                        Incluído
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Amenidades */}
              <div className="space-y-4">
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                  Amenidades
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {quarto.amenidades.map((amenidade, i) => {
                    const IconComponent = amenidadeIcons[amenidade] || Check;
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm transition-colors ${
                        isDark 
                          ? 'bg-[#EED5B9]/5 hover:bg-[#EED5B9]/10 border border-[#EED5B9]/10' 
                          : 'bg-white/50 hover:bg-[#4F3621]/5 border border-[#4F3621]/10'
                      }`}>
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                          {amenidade}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Serviços Adicionais */}
              <div className="space-y-4">
                <h2 className={`text-2xl font-semibold ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                  Serviços Adicionais
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {quarto.servicosAdicionais.map((servico, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all cursor-pointer ${
                        isDark 
                          ? 'border-[#EED5B9]/10 hover:border-primary/20 hover:bg-[#EED5B9]/5' 
                          : 'border-[#4F3621]/10 hover:border-primary/30 hover:bg-[#4F3621]/5'
                      }`}
                    >
                      <div className="flex-1">
                        <span className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                          {servico}
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Coluna da Direita - Reserva */}
            <div className="lg:sticky lg:top-32 self-start">
              <div className={`rounded-3xl overflow-hidden border shadow-lg p-6 backdrop-blur-sm relative ${
                isDark 
                  ? 'bg-[#4F3621]/60 border-[#EED5B9]/10 shadow-black/20' 
                  : 'bg-white/90 border-[#4F3621]/20 shadow-[#4F3621]/10'
              }`}>
                {/* Efeitos decorativos para o card */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full blur-3xl opacity-70 bg-primary/10" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full blur-3xl opacity-70 bg-primary/10" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`text-3xl font-bold ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                        {formatarPreco(quarto.preco)}
                      </div>
                      <div className={`${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                        por noite
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Disponível
                    </Badge>
                  </div>
                  
                  {/* Características Rápidas */}
                  <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl backdrop-blur-sm relative ${
                    isDark ? 'bg-[#EED5B9]/5' : 'bg-[#4F3621]/5'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        isDark ? 'bg-[#EED5B9]/10' : 'bg-white'
                      }`}>
                        <Square className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                          {quarto.metros}m²
                        </div>
                        <div className={`text-xs ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                          Área total
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        isDark ? 'bg-[#EED5B9]/10' : 'bg-white'
                      }`}>
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                          Até {quarto.capacidade} pessoas
                        </div>
                        <div className={`text-xs ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                          Capacidade
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-t pt-4 ${
                    isDark ? 'border-[#EED5B9]/10' : 'border-[#4F3621]/10'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${isDark ? 'text-[#EED5B9]/90' : 'text-[#4F3621]/90'}`}>
                        Preço por noite
                      </span>
                      <span className={`${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                        {formatarPreco(quarto.preco)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-medium ${isDark ? 'text-[#EED5B9]/90' : 'text-[#4F3621]/90'}`}>
                        Taxa de serviço
                      </span>
                      <span className={`${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                        {formatarPreco(quarto.preco * 0.1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span className={`${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                        Total
                      </span>
                      <span className={`${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                        {formatarPreco(quarto.preco * 1.1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center w-full space-y-2">
                    <Button 
                      className={`w-full rounded-full transition-all duration-300 shadow-lg hover:scale-105 font-semibold py-3 flex items-center justify-center gap-2 ${
                        isDark
                          ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 shadow-[#EED5B9]/10 hover:shadow-[#EED5B9]/20' 
                          : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 shadow-[#4F3621]/20 hover:shadow-[#4F3621]/30'
                      }`}
                      onClick={handleReservar}
                      aria-label="Ver disponibilidade deste quarto"
                    >
                      Ver Disponibilidade
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                    
                    <p className={`text-xs text-center ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                      Não será feita nenhuma cobrança ainda. Você confirmará os detalhes na próxima etapa.
                    </p>
                  </div>
                  
                  <p className={`text-sm text-center mt-2 border-t pt-2 ${
                    isDark 
                      ? 'text-[#EED5B9]/70 border-[#EED5B9]/10' 
                      : 'text-[#4F3621]/70 border-[#4F3621]/10'
                  }`}>
                    <span className="inline-flex items-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>
                        {quarto.avaliacao}
                      </span>
                    </span>
                    <span className="mx-1">•</span>
                    <span>{quarto.numeroAvaliacoes} avaliações</span>
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