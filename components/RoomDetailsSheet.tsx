"use client"

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Square, Users, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface RoomDetailsSheetProps {
  isOpen: boolean
  onClose: () => void
  quarto: {
    id: string
    nome: string
    descricao: string
    descricaoLonga: string
    preco: number
    metros: number
    capacidade: number
    avaliacao: number
    numeroAvaliacoes: number
    imagens: string[]
    amenidades: string[]
    destaques: string[]
    servicosAdicionais: string[]
  } | null
}

const formatarPreco = (preco: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(preco)
}

export function RoomDetailsSheet({ isOpen, onClose, quarto }: RoomDetailsSheetProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  
  if (!quarto) return null
  
  // Garantir que os arrays existam
  const amenidades = Array.isArray(quarto.amenidades) ? quarto.amenidades : [];
  const destaques = Array.isArray(quarto.destaques) ? quarto.destaques : [];
  const servicosAdicionais = Array.isArray(quarto.servicosAdicionais) ? quarto.servicosAdicionais : [];
  
  // Garantir que o array de imagens exista
  const imagens = Array.isArray(quarto.imagens) ? quarto.imagens : [];
  
  console.log("RoomDetailsSheet - Dados recebidos:", {
    id: quarto.id,
    nome: quarto.nome,
    amenidades_original: quarto.amenidades,
    destaques_original: quarto.destaques,
    servicosAdicionais_original: quarto.servicosAdicionais,
    imagens_original: quarto.imagens,
    amenidades_processados: amenidades,
    destaques_processados: destaques,
    servicosAdicionais_processados: servicosAdicionais,
    imagens_processados: imagens
  });
  
  // Verificar se há imagens antes de tentar acessá-las
  if (imagens.length === 0) {
    // Adicionar uma imagem padrão se não houver imagens
    imagens.push("https://images.unsplash.com/photo-1590490360182-c33d57733427");
  }
  
  const nextImage = () => {
    if (imagens.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % imagens.length)
  }
  
  const prevImage = () => {
    if (imagens.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + imagens.length) % imagens.length)
  }
  
  const goToImage = (index: number) => {
    if (index >= 0 && index < imagens.length) {
      setCurrentImageIndex(index)
    }
  }
  
  const handleReservar = () => {
    // Fechar o sheet
    onClose()
    
    // Redirecionar para a página de booking com o ID do quarto
    router.push(`/booking?roomId=${quarto.id}`)
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[100dvh] p-0 overflow-auto">
        {/* Hero Section com Carrossel */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img
            src={imagens[currentImageIndex]}
            alt={`${quarto.nome || 'Quarto'} - Imagem ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
          
          {/* Controles do Carrossel */}
          {imagens.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Indicadores de imagem */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imagens.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      currentImageIndex === index ? "w-6 bg-white" : "w-2 bg-white/60"
                    }`}
                    onClick={() => goToImage(index)}
                    aria-label={`Ver imagem ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Botão Voltar */}
          <div className="absolute top-4 left-4">
            <Button
              variant="outline"
              className="rounded-full bg-black/70 hover:bg-black/80 text-white border-white/20"
              onClick={onClose}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          {/* Informações Principais */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="space-y-2 text-white max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold">{quarto.nome || 'Quarto'}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{quarto.avaliacao || 4.5}</span>
                </div>
                <span>•</span>
                <span>{quarto.numeroAvaliacoes || 0} avaliações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Galeria de Miniaturas */}
        {imagens.length > 1 && (
          <div className="px-4 md:px-8 py-4 bg-muted/10">
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
              {imagens.map((img, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => goToImage(index)}
                >
                  <img
                    src={img}
                    alt={`${quarto.nome || 'Quarto'} - Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="px-4 md:px-8 py-8 space-y-8 max-w-5xl mx-auto">
          {/* Preço e Características Básicas */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              {formatarPreco(quarto.preco)}
              <span className="text-base font-normal text-muted-foreground ml-2">por noite</span>
            </div>
          </div>

          {/* Características do Quarto */}
          <div className="grid grid-cols-2 gap-4 p-6 bg-muted/50 rounded-2xl">
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

          {/* Descrição */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Sobre o Quarto</h2>
            <p className="text-muted-foreground leading-relaxed">
              {quarto.descricaoLonga}
            </p>
          </div>

          {/* Destaques */}
          {destaques && destaques.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Destaques do Quarto</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {destaques.map((destaque, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{destaque}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenidades */}
          {amenidades && amenidades.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenidades.map((amenidade, i) => (
                  <Badge 
                    key={i}
                    variant="outline"
                    className="justify-center rounded-xl py-3 text-base bg-background border-primary/20"
                  >
                    {amenidade}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Serviços Adicionais */}
          {servicosAdicionais && servicosAdicionais.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Serviços Adicionais</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {servicosAdicionais.map((servico, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-4 rounded-xl border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{servico}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão de Reserva */}
          <div className="sticky bottom-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg max-w-lg mx-auto">
            <Button 
              size="lg"
              className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 py-6 text-lg font-semibold"
              onClick={handleReservar}
            >
              Reservar Agora
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Não será feita nenhuma cobrança ainda
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 