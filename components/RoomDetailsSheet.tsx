"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Square, Users, Check, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface RoomDetailsSheetProps {
  isOpen: boolean
  onClose: () => void
  quarto: {
    id: number
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
  }
}

const formatarPreco = (preco: number) => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(preco)
}

export function RoomDetailsSheet({ isOpen, onClose, quarto }: RoomDetailsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[100dvh] p-0 overflow-auto">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img
            src={quarto.imagens[0]}
            alt={quarto.nome}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
          
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
              <h1 className="text-3xl md:text-4xl font-bold">{quarto.nome}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{quarto.avaliacao}</span>
                </div>
                <span>•</span>
                <span>{quarto.numeroAvaliacoes} avaliações</span>
              </div>
            </div>
          </div>
        </div>

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
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Destaques do Quarto</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {quarto.destaques.map((destaque, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{destaque}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenidades */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Amenidades</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quarto.amenidades.map((amenidade, i) => (
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

          {/* Serviços Adicionais */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Serviços Adicionais</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {quarto.servicosAdicionais.map((servico, i) => (
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

          {/* Botão de Reserva */}
          <div className="sticky bottom-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-lg max-w-lg mx-auto">
            <Button 
              size="lg"
              className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 py-6 text-lg font-semibold"
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