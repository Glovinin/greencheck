"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Navbar } from '@/components/navbar'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { CalendarIcon, Users, Bed, CreditCard, Clock, ArrowRight, Check, Calendar as CalendarIcon2, ArrowLeft } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import Header from '@/components/header'

export default function Booking() {
  const [date, setDate] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  })
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    adultos: '2',
    criancas: '0',
    quarto: '',
    nome: '',
    email: '',
    telefone: '',
    observacoes: ''
  })

  const quartos = [
    {
      id: 'luxo',
      nome: 'Suíte Luxo Vista Montanha',
      descricao: 'Uma experiência única com vista panorâmica para as montanhas de Monchique.',
      preco: 780,
      imagem: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      amenidades: ['Wi-Fi', 'Café da manhã', 'Banheira de hidromassagem']
    },
    {
      id: 'premium',
      nome: 'Suíte Premium Vista Mar',
      descricao: 'Luxuoso quarto com vista deslumbrante para o oceano.',
      preco: 980,
      imagem: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      amenidades: ['Wi-Fi', 'Café da manhã', 'Varanda privativa']
    },
    {
      id: 'standard',
      nome: 'Quarto Standard',
      descricao: 'Confortável e acolhedor, perfeito para sua estadia.',
      preco: 480,
      imagem: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      amenidades: ['Wi-Fi', 'Café da manhã', 'Smart TV']
    },
  ]

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(preco)
  }

  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />

      {/* Hero Section com Design Moderno */}
      <section className="relative h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070"
            alt="Fundo do hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
          
          {/* Padrão de Design Moderno */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
          </div>
        </div>
        
        {/* Conteúdo Principal com Animação */}
        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-[900px] mx-auto space-y-8"
          >
            <div className="inline-block">
              <Badge 
                variant="outline" 
                className="rounded-full px-6 py-2 text-white border-white/20 backdrop-blur-sm"
              >
                Reserve sua experiência única
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
              Uma Estadia Inesquecível <br /> no Aqua Vista
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Escolha as datas, selecione seu quarto e prepare-se para momentos extraordinários em um dos hotéis mais exclusivos de Portugal.
            </p>
          </motion.div>
        </div>

        {/* Indicador de Scroll Moderno */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 space-y-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-white/60 text-sm font-medium tracking-wider uppercase">Role para baixo</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <motion.div
                animate={{ 
                  y: [0, 12, 0],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Overlay de Decoração */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Formulário de Reserva com Design Elevado */}
      <section className="relative -mt-32 z-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Progress Steps Modernizado */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-16"
          >
            <div className="flex items-center space-x-4 bg-background/60 backdrop-blur-lg p-4 rounded-full shadow-lg border border-white/10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 transform cursor-pointer",
                  step >= 1 ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                )}
                onClick={() => step > 1 && setStep(1)}
              >
                <CalendarIcon2 className="h-6 w-6" />
              </motion.div>
              <div className={cn(
                "h-1 w-20 transition-all duration-500",
                step >= 2 ? "bg-primary scale-x-100" : "bg-muted scale-x-90"
              )} />
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 transform cursor-pointer",
                  step >= 2 ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                )}
                onClick={() => step > 2 && setStep(2)}
              >
                <Bed className="h-6 w-6" />
              </motion.div>
              <div className={cn(
                "h-1 w-20 transition-all duration-500",
                step >= 3 ? "bg-primary scale-x-100" : "bg-muted scale-x-90"
              )} />
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 transform cursor-pointer",
                  step >= 3 ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                )}
              >
                <CreditCard className="h-6 w-6" />
              </motion.div>
            </div>
          </motion.div>

          {/* Step 1: Datas e Ocupação */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Cabeçalho da Seção */}
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Selecione as Datas</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Escolha o período da sua estadia e número de hóspedes
                </p>
              </div>

              <Card className="overflow-hidden border-none shadow-2xl bg-background/70 backdrop-blur-lg">
                <CardContent className="flex flex-col md:flex-row gap-8 p-8">
                  {/* Calendário */}
                  <div className="flex-1 space-y-6">
                    <div className="bg-background/50 rounded-xl p-6 shadow-inner">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Datas da Estadia</h3>
                          <p className="text-sm text-muted-foreground">Selecione o check-in e check-out</p>
                        </div>
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                          {date?.from && date?.to ? (
                            <span className="flex items-center gap-2">
                              <Check className="h-4 w-4" />
                              Datas Selecionadas
                            </span>
                          ) : "Selecione as Datas"}
                        </Badge>
                      </div>
                      <Calendar
                        mode="range"
                        selected={date}
                        onSelect={(value: any) => setDate(value)}
                        locale={ptBR}
                        className="rounded-lg border-none"
                        classNames={{
                          months: "space-y-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center gap-1 pb-4",
                          caption_label: "text-base font-semibold",
                          nav: "flex items-center gap-1",
                          nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-full transition-all",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse",
                          head_row: "flex w-full gap-1",
                          head_cell: "text-muted-foreground rounded-md w-10 sm:w-16 font-medium text-[0.8rem] sm:text-sm",
                          row: "flex w-full mt-2 gap-1",
                          cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50 [&:has([aria-selected].day-outside)]:bg-accent/25 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                          day: "h-10 w-10 sm:h-16 sm:w-16 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-all hover:scale-110",
                          day_range_start: "day-range-start",
                          day_range_end: "day-range-end",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "day-outside text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent/50 aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>

                    {/* Datas Selecionadas */}
                    {date.from && date.to && (
                      <div className="bg-primary/5 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <CalendarIcon2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Check-in</p>
                              <p className="font-medium">{format(date.from, "dd 'de' MMMM", { locale: ptBR })}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <CalendarIcon2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Check-out</p>
                              <p className="font-medium">{format(date.to, "dd 'de' MMMM", { locale: ptBR })}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seleção de Hóspedes */}
                  <div className="md:w-80 space-y-6">
                    <div className="bg-background/50 rounded-xl p-6 shadow-inner">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-1">Hóspedes</h3>
                        <p className="text-sm text-muted-foreground">Selecione o número de pessoas</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium block">Adultos</label>
                              <span className="text-xs text-muted-foreground">13+ anos</span>
                            </div>
                            <Select value={formData.adultos} onValueChange={(value) => setFormData({ ...formData, adultos: value })}>
                              <SelectTrigger className="w-[120px] h-10 rounded-lg border-border/50 bg-background/70">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1,2,3,4].map((num) => (
                                  <SelectItem key={num} value={num.toString()} className="cursor-pointer">
                                    {num} {num === 1 ? 'adulto' : 'adultos'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium block">Crianças</label>
                              <span className="text-xs text-muted-foreground">0-12 anos</span>
                            </div>
                            <Select value={formData.criancas} onValueChange={(value) => setFormData({ ...formData, criancas: value })}>
                              <SelectTrigger className="w-[120px] h-10 rounded-lg border-border/50 bg-background/70">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {[0,1,2,3].map((num) => (
                                  <SelectItem key={num} value={num.toString()} className="cursor-pointer">
                                    {num} {num === 1 ? 'criança' : 'crianças'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total de Hóspedes */}
                    <div className="bg-primary/5 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total de Hóspedes</p>
                          <p className="font-medium">
                            {Number(formData.adultos) + Number(formData.criancas)} pessoas
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end p-8 bg-background/40 border-t border-border/5">
                  <Button 
                    onClick={() => setStep(2)}
                    className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                    disabled={!date.from || !date.to}
                  >
                    Escolher Quarto
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Seleção do Quarto */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Cabeçalho da Seção */}
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Escolha seu Quarto</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Selecione o quarto que melhor atende às suas necessidades
                </p>
              </div>

              {/* Grid de Quartos */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quartos.map((quarto) => (
                  <Card 
                    key={quarto.id}
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl group border-none bg-background/70 backdrop-blur-lg",
                      formData.quarto === quarto.id ? "ring-2 ring-primary shadow-xl scale-[1.02]" : "hover:scale-[1.02]"
                    )}
                    onClick={() => setFormData({ ...formData, quarto: quarto.id })}
                  >
                    {/* Imagem do Quarto */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={quarto.imagem}
                        alt={quarto.nome}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Badge de Selecionado */}
                      {formData.quarto === quarto.id && (
                        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium animate-fade-in">
                          Selecionado
                        </div>
                      )}

                      {/* Preço */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white font-semibold text-3xl">{formatarPreco(quarto.preco)}</div>
                        <div className="text-white/80 text-sm font-medium">por noite</div>
                      </div>
                    </div>

                    {/* Informações do Quarto */}
                    <div className="p-6 space-y-6">
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-2">{quarto.nome}</h3>
                        <p className="text-muted-foreground text-base">{quarto.descricao}</p>
                      </div>

                      {/* Amenidades */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Amenidades Incluídas</h4>
                        <div className="flex flex-wrap gap-2">
                          {quarto.amenidades.map((amenidade, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="rounded-full px-4 py-1.5 bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
                            >
                              {amenidade}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Botão de Seleção */}
                    <div className="p-6 bg-background/40 border-t border-border/5">
                      <Button 
                        variant={formData.quarto === quarto.id ? "default" : "outline"}
                        className={cn(
                          "rounded-full w-full h-12 text-base font-medium transition-all duration-300",
                          formData.quarto === quarto.id 
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                            : "hover:bg-primary/10"
                        )}
                      >
                        {formData.quarto === quarto.id ? (
                          <span className="flex items-center">
                            Selecionado
                            <Check className="ml-2 h-5 w-5" />
                          </span>
                        ) : "Selecionar"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Navegação */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-border/10">
                <Button 
                  variant="outline"
                  className="rounded-full h-12 px-8 hover:bg-background/80 transition-all duration-300"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Voltar para Datas
                </Button>
                <Button 
                  className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  onClick={() => setStep(3)}
                  disabled={!formData.quarto}
                >
                  Próximo Passo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Dados para Reserva */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {/* Cabeçalho da Seção */}
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Confirme sua Reserva</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Revise os detalhes e preencha seus dados para finalizar
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Coluna da Esquerda: Resumo e Quarto */}
                <div className="space-y-8">
                  {/* Resumo da Reserva */}
                  <Card className="overflow-hidden border-none shadow-xl bg-primary/5 backdrop-blur-lg">
                    <CardHeader className="border-b border-border/5 pb-6">
                      <CardTitle className="text-lg font-semibold">Resumo da Reserva</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Datas */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarIcon2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Período da Estadia</p>
                            <p className="font-medium">
                              {date.from && date.to ? (
                                <>
                                  {format(date.from, "dd 'de' MMMM", { locale: ptBR })} - {format(date.to, "dd 'de' MMMM", { locale: ptBR })}
                                </>
                              ) : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Hóspedes</p>
                            <p className="font-medium">
                              {formData.adultos} {Number(formData.adultos) === 1 ? 'adulto' : 'adultos'}
                              {Number(formData.criancas) > 0 && `, ${formData.criancas} ${Number(formData.criancas) === 1 ? 'criança' : 'crianças'}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Linha Divisória */}
                      <div className="h-px bg-border/10" />

                      {/* Quarto Selecionado */}
                      {quartos.find(q => q.id === formData.quarto) && (
                        <div className="space-y-4">
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <img
                              src={quartos.find(q => q.id === formData.quarto)?.imagem}
                              alt="Quarto selecionado"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold">{quartos.find(q => q.id === formData.quarto)?.nome}</h4>
                            <p className="text-sm text-muted-foreground">{quartos.find(q => q.id === formData.quarto)?.descricao}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {quartos.find(q => q.id === formData.quarto)?.amenidades.map((amenidade, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="rounded-full px-3 py-1 bg-primary/10"
                              >
                                {amenidade}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Coluna da Direita: Formulário */}
                <div className="space-y-8">
                  <Card className="overflow-hidden border-none shadow-2xl bg-background/70 backdrop-blur-lg">
                    <CardHeader className="border-b border-border/5 pb-6">
                      <CardTitle className="text-lg font-semibold">Dados Pessoais</CardTitle>
                      <CardDescription>Preencha seus dados de contato</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nome Completo</label>
                          <Input
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            className="h-12 rounded-lg border-border/50 bg-background/70 backdrop-blur transition-all focus:bg-background/90"
                            placeholder="Digite seu nome completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12 rounded-lg border-border/50 bg-background/70 backdrop-blur transition-all focus:bg-background/90"
                            placeholder="seu@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Telefone</label>
                          <Input
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            className="h-12 rounded-lg border-border/50 bg-background/70 backdrop-blur transition-all focus:bg-background/90"
                            placeholder="+55 (00) 00000-0000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Observações</label>
                        <Textarea
                          value={formData.observacoes}
                          onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                          className="min-h-[120px] rounded-lg border-border/50 bg-background/70 backdrop-blur transition-all focus:bg-background/90"
                          placeholder="Tem alguma solicitação especial? (opcional)"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Botões de Navegação */}
                  <div className="flex flex-col gap-4">
                    <Button 
                      className="w-full rounded-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:scale-105"
                    >
                      Confirmar Reserva
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full rounded-full h-12 hover:bg-background/80 transition-all duration-300"
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Voltar para Quartos
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
} 