"use client"

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Navbar } from '@/components/navbar'
import { Calendar } from '@/components/ui/calendar'
import { format, addDays, differenceInDays, isSameDay, isAfter, isBefore, isSameMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { CalendarIcon, Users, Bed, CreditCard, Clock, ArrowRight, Check, Calendar as CalendarIcon2, ArrowLeft, AlertCircle, Loader2, Search, Info, Home, ChevronDown } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { useTheme } from 'next-themes'
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Room } from '@/lib/types'
import { getRooms, getAvailableRooms, createBooking } from '@/lib/firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { toast } from 'sonner'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { getRoomById, getRoomBookings, getDatesInRange } from '@/lib/firebase/firestore'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

// Função para obter datas indisponíveis do Firebase
const getUnavailableDates = async (roomId: string): Promise<Date[]> => {
  try {
    // 1. Buscar o quarto para verificar as datas marcadas como indisponíveis na área administrativa
    const room = await getRoomById(roomId);
    if (!room) {
      console.error(`Quarto com ID ${roomId} não encontrado`);
      return [];
    }

    // 2. Buscar todas as reservas confirmadas para este quarto
    const bookings = await getRoomBookings(roomId);
    
    // 3. Inicializar array de datas indisponíveis
    const datasIndisponiveis: Date[] = [];
    
    // 4. Adicionar datas marcadas como indisponíveis na área administrativa
    if (room.availabilityDates) {
      Object.entries(room.availabilityDates).forEach(([dateStr, isAvailable]) => {
        if (isAvailable === false) {
          // Converter string de data (YYYY-MM-DD) para objeto Date
          const [year, month, day] = dateStr.split('-').map(Number);
          datasIndisponiveis.push(new Date(year, month - 1, day)); // Mês é 0-indexed em JS
        }
      });
    }
    
    // 5. Adicionar datas de reservas existentes
    bookings.forEach(booking => {
      if (booking.status === 'confirmed' || booking.status === 'pending') {
        const checkIn = booking.checkIn.toDate();
        const checkOut = booking.checkOut.toDate();
        
        // Adicionar todas as datas entre checkIn e checkOut
        const dateStrings = getDatesInRange(checkIn, checkOut);
        dateStrings.forEach(dateStr => {
          const [year, month, day] = dateStr.split('-').map(Number);
          datasIndisponiveis.push(new Date(year, month - 1, day));
        });
      }
    });
    
    // 6. Remover duplicatas (pode haver sobreposição entre datas administrativas e reservas)
    const uniqueDates = datasIndisponiveis.filter((date, index, self) => 
      self.findIndex(d => d.getTime() === date.getTime()) === index
    );
    
    console.log(`Datas indisponíveis para o quarto ${roomId}:`, uniqueDates);
    return uniqueDates;
    
  } catch (error) {
    console.error("Erro ao buscar datas indisponíveis:", error);
    
    // Em caso de erro, retornar algumas datas de exemplo para não quebrar a interface
    const mes_marco = 2; // Março (0-indexed)
    return [
      new Date(2025, mes_marco, 19),
      new Date(2025, mes_marco, 20),
      new Date(2025, mes_marco, 21),
      new Date(2025, mes_marco, 26),
      new Date(2025, mes_marco, 27),
      new Date(2025, mes_marco, 28)
    ];
  }
};

// Funções auxiliares para datas
const utilsDatas = {
  // Verifica se uma data específica está indisponível
  isDateUnavailable: (date: Date | undefined, datasIndisponiveis: Date[]) => {
    if (!date) return false;
    return datasIndisponiveis.some(dataIndisponivel => 
      isSameDay(date, dataIndisponivel)
    );
  },
  
  // Verifica se as datas inicial ou final são indisponíveis
  datasLimiteIndisponiveis: (dataInicio: Date | undefined, dataFim: Date | undefined, datasIndisponiveis: Date[]) => {
    if (!dataInicio || !dataFim) return false;
    // Verificamos apenas se a data de check-in está indisponível
    // A data de check-out pode estar indisponível, pois o check-out é de manhã
    // e o check-in é à tarde
    return utilsDatas.isDateUnavailable(dataInicio, datasIndisponiveis);
  },
  
  // Verifica se um intervalo contém datas indisponíveis
  intervaloContemDatasIndisponiveis: (dataInicio: Date | undefined, dataFim: Date | undefined, datasIndisponiveis: Date[]) => {
    if (!dataInicio || !dataFim) return false;
    // Verificamos apenas as datas entre o check-in e o check-out (exclusivo)
    // Excluímos o dia de check-out da verificação, pois é permitido fazer check-out
    // em um dia que está marcado como indisponível (o check-out é de manhã)
    return datasIndisponiveis.some(dataIndisponivel => {
      return isAfter(dataIndisponivel, dataInicio) && 
             isBefore(dataIndisponivel, dataFim) && 
             !isSameDay(dataIndisponivel, dataFim);
    });
  },
  
  // Verifica se existem datas consecutivas indisponíveis
  existemDatasConsecutivasIndisponiveis: (datasIndisponiveis: Date[]) => {
    if (!datasIndisponiveis || datasIndisponiveis.length < 2) return false;
    
    // Ordenar as datas
    const datasOrdenadas = [...datasIndisponiveis].sort((a, b) => a.getTime() - b.getTime());
    
    // Verificar se existem datas consecutivas
    for (let i = 0; i < datasOrdenadas.length - 1; i++) {
      const diferenca = differenceInDays(datasOrdenadas[i + 1], datasOrdenadas[i]);
      if (diferenca === 1) {
        return true;
      }
    }
    
    return false;
  },
  
  // Formata datas indisponíveis para exibição
  obterDatasIndisponiveisFormatadas: (datasIndisponiveis: Date[]) => {
    return datasIndisponiveis
      .sort((a, b) => a.getTime() - b.getTime())
      .slice(0, 5) // Limitar para não ficar muito grande
      .map(data => format(data, "dd/MM", { locale: ptBR }))
      .join(", ");
  }
};

export default function Booking() {
  // Obter parâmetros da URL
  const searchParams = useSearchParams()
  const roomIdFromUrl = searchParams.get('roomId')
  
  // Hook de scroll para efeito de parallax
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 150])
  const opacityTransform = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])
  
  // Theme support
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Novo fluxo: 1. Escolher quarto, 2. Escolher datas disponíveis, 3. Informações, 4. Confirmação
  const [step, setStep] = useState(1)
  
  // Estados principais
  const [quartos, setQuartos] = useState<Room[]>([])
  const [quartoSelecionado, setQuartoSelecionado] = useState<Room | null>(null)
  const [datasIndisponiveis, setDatasIndisponiveis] = useState<Date[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingDatas, setLoadingDatas] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [precoTotal, setPrecoTotal] = useState<number>(0)
  
  // Data selecionada pelo usuário
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  })
  
  // Filtros para quartos
  const [filtros, setFiltros] = useState({
    capacidade: 'any',
    tipo: 'todos',
    precoMaximo: 'any'
  })
  
  // Informações do cliente
  const [formData, setFormData] = useState({
    adultos: '2',
    criancas: '0',
    nome: '',
    email: '',
    telefone: '',
    observacoes: ''
  })

  // Estado adicional para o hover
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  
  // Verificar se uma data está no intervalo entre from e hoverDate
  const isDateInHoverRange = (day: Date) => {
    if (!date.from || !hoverDate) return false;
    
    return (
      isAfter(day, date.from) && 
      isBefore(day, hoverDate)
    );
  };
  
  // Carregar todos os quartos quando o componente montar
  useEffect(() => {
    const fetchQuartos = async () => {
      setLoading(true)
      try {
        const rooms = await getRooms()
        setQuartos(rooms)
        
        // Se temos um roomId na URL, selecionar automaticamente esse quarto
        if (roomIdFromUrl) {
          const quartoEncontrado = rooms.find(room => room.id === roomIdFromUrl)
          if (quartoEncontrado) {
            setQuartoSelecionado(quartoEncontrado)
            setStep(2) // Avançar para seleção de datas
          } else {
            toast.error('Quarto não encontrado', {
              icon: <AlertCircle className="h-5 w-5 text-red-500" />
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar quartos:', error)
        toast.error('Não foi possível carregar os quartos')
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuartos()
  }, [roomIdFromUrl])
  
  // Carregar datas indisponíveis quando um quarto for selecionado
  useEffect(() => {
    const fetchDatasIndisponiveis = async () => {
      if (!quartoSelecionado) return
      
      setLoadingDatas(true)
      try {
        // Buscar datas indisponíveis do Firebase
        const datas = await getUnavailableDates(quartoSelecionado.id!)
        setDatasIndisponiveis(datas)
        
        // Reset das datas selecionadas para evitar conflitos
        setDate({ 
          from: new Date(), 
          to: undefined 
        })
        
        // Mostrar mensagem informativa sobre datas indisponíveis
        if (datas.length > 0) {
          toast.info(`Este quarto possui ${datas.length} datas indisponíveis. Por favor, verifique o calendário.`, {
            duration: 5000,
            icon: <Info className="h-5 w-5 text-blue-500" />
          })
        } else {
          toast.success(`Todas as datas estão disponíveis para este quarto!`, {
            icon: <Check className="h-5 w-5 text-green-500" />
          })
        }
      } catch (error) {
        console.error('Erro ao carregar datas indisponíveis:', error)
        toast.error('Não foi possível verificar a disponibilidade deste quarto', {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        })
      } finally {
        setLoadingDatas(false)
      }
    }
    
    if (quartoSelecionado) {
      fetchDatasIndisponiveis()
    }
  }, [quartoSelecionado])

  // Calcular preço total quando quarto e datas mudarem
  useEffect(() => {
    if (date.from && date.to && quartoSelecionado) {
      calcularPrecoTotal()
    }
  }, [date, quartoSelecionado])

  // Função segura para atualizar as datas
  const handleDateChange = (range: DateRange | undefined) => {
    // Se não houver range, limpa a seleção
    if (!range) {
      setDate({
        from: undefined,
        to: undefined
      });
      return;
    }
    
    // Se o usuário clicar na mesma data duas vezes, limpa a seleção
    if (date.from && range.from && isSameDay(date.from, range.from) && !range.to) {
      setDate({
        from: undefined,
        to: undefined
      });
      return;
    }
    
    // Se já temos um intervalo completo e o usuário clica em uma nova data,
    // começamos um novo intervalo com essa data
    if (date.from && date.to && range.from && !range.to) {
      setDate({
        from: range.from,
        to: undefined
      });
      return;
    }
    
    // Se o usuário selecionou apenas uma data (check-in), automaticamente definimos
    // o check-out para o dia seguinte, mesmo que o dia seguinte esteja marcado como indisponível
    // já que o check-out ocorre pela manhã e o check-in à tarde
    if (range.from && !range.to) {
      const nextDay = new Date(range.from);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Sempre definimos o check-out para o dia seguinte, independente de disponibilidade
      // porque o check-out é de manhã e o check-in é à tarde
      range.to = nextDay;
    }
    
    // Se o usuário selecionou check-in e check-out no mesmo dia, ajustamos para o dia seguinte
    // mesmo que o dia seguinte esteja marcado como indisponível
    if (range.from && range.to && isSameDay(range.from, range.to)) {
      const nextDay = new Date(range.from);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Sempre definimos o check-out para o dia seguinte, independente de disponibilidade
      range.to = nextDay;
    }
    
    // Sempre atualiza o estado com a seleção do usuário
    setDate(range);
    
    // Se temos data de início e fim, verificamos se há datas indisponíveis no intervalo
    if (range.from && range.to) {
      // Verificar se a data de check-in está indisponível
      if (utilsDatas.isDateUnavailable(range.from, datasIndisponiveis)) {
        toast.error("A data de check-in selecionada está indisponível. Por favor, escolha outra data.", {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        
        // Resetar a seleção
        setDate({
          from: undefined,
          to: undefined
        });
        return;
      }
      
      // Verificar se existem datas indisponíveis no intervalo selecionado
      // Excluindo o dia de check-out da verificação, já que é permitido fazer check-out
      // em um dia que está marcado como indisponível (o check-out é de manhã)
      const temDatasIndisponiveisNoIntervalo = datasIndisponiveis.some(dataIndisponivel => {
        return isAfter(dataIndisponivel, range.from!) && 
               isBefore(dataIndisponivel, range.to!) && 
               !isSameDay(dataIndisponivel, range.to!);
      });
      
      if (temDatasIndisponiveisNoIntervalo) {
        toast.error("Não é possível reservar períodos que incluam datas indisponíveis no meio do intervalo. Por favor, escolha outro período.", {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        
        // Resetar a seleção para apenas a data inicial
        setDate({
          from: range.from,
          to: undefined
        });
        return;
      }
      
      // Calcular o preço total
      if (quartoSelecionado) {
        calcularPrecoTotal();
      }
      
      // Se chegou até aqui, o período é válido
      toast.success("Período selecionado com sucesso!", {
        icon: <Check className="h-5 w-5 text-green-500" />
      });
    }
  };

  // Calcular preço total
  const calcularPrecoTotal = () => {
    if (!date.from || !date.to || !quartoSelecionado) return
    
    // Calcular a diferença em dias entre check-in e check-out
    const dias = differenceInDays(date.to, date.from);
    
    // Se a diferença for 0 (mesmo dia), consideramos como 1 noite
    // Se a diferença for 1 (dia seguinte), consideramos como 1 noite
    // Se a diferença for maior que 1, consideramos como o número exato de dias
    const noites = dias === 0 ? 1 : dias;
    
    const precoBase = quartoSelecionado.price * noites;
    const taxaServico = precoBase * 0.1;
    
    setPrecoTotal(precoBase + taxaServico);
  }
  
  // Função para selecionar um quarto
  const selecionarQuarto = (quarto: Room) => {
    setQuartoSelecionado(quarto)
    setStep(2) // Avançar para seleção de datas
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handler para inputs de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handler para selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Avançar para o próximo passo
  const handleNextStep = () => {
    if (step === 2) {
      if (!date.from || !date.to) {
        toast.error('Selecione as datas de check-in e check-out', {
          icon: <CalendarIcon className="h-5 w-5 text-red-500" />
        });
        return;
      }
      
      // Verificar se a data de check-in está indisponível
      if (utilsDatas.isDateUnavailable(date.from, datasIndisponiveis)) {
        toast.error("A data de check-in selecionada está indisponível. Por favor, escolha outra data.", {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        return;
      }
      
      // Verificar se existem datas indisponíveis no intervalo selecionado
      // Excluindo o dia de check-out da verificação
      const temDatasIndisponiveisNoIntervalo = datasIndisponiveis.some(dataIndisponivel => {
        return isAfter(dataIndisponivel, date.from!) && 
               isBefore(dataIndisponivel, date.to!) && 
               !isSameDay(dataIndisponivel, date.to!);
      });
      
      if (temDatasIndisponiveisNoIntervalo) {
        toast.error("Não é possível reservar períodos que incluam datas indisponíveis no meio do intervalo. Por favor, escolha outro período.", {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        return;
      }
      
      // Verificar se o período é de pelo menos uma noite
      const dias = differenceInDays(date.to, date.from);
      if (dias < 1 && !isSameDay(date.from, date.to)) {
        toast.error("O período mínimo de reserva é de uma noite. Por favor, selecione datas diferentes.", {
          icon: <Clock className="h-5 w-5 text-red-500" />
        });
        return;
      }
      
      // Se chegou até aqui, as datas são válidas
      toast.success("Datas confirmadas com sucesso!", {
        icon: <Check className="h-5 w-5 text-green-500" />
      });
    } 
    else if (step === 3) {
      if (!formData.nome || !formData.email || !formData.telefone) {
        toast.error('Preencha todos os campos obrigatórios', {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        return;
      }
      
      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Por favor, insira um email válido', {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        return;
      }
      
      // Validação básica de telefone (pelo menos 9 dígitos)
      const phoneDigits = formData.telefone.replace(/\D/g, '');
      if (phoneDigits.length < 9) {
        toast.error('Por favor, insira um número de telefone válido', {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        return;
      }
      
      // Se chegou até aqui, os dados são válidos
      toast.success("Dados confirmados com sucesso!", {
        icon: <Check className="h-5 w-5 text-green-500" />
      });
    }
    
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Voltar para o passo anterior
  const handlePrevStep = () => {
    setStep(step - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Finalizar reserva
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date.from || !date.to || !quartoSelecionado) {
      toast.error('Informações de reserva incompletas', {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Verificar novamente se as datas estão disponíveis
      // (pode ter havido alterações desde que o usuário selecionou)
      const datasAtualizadas = await getUnavailableDates(quartoSelecionado.id!);
      
      // Verificar se a data de check-in está indisponível
      if (utilsDatas.isDateUnavailable(date.from, datasAtualizadas)) {
        toast.error("A data de check-in selecionada não está mais disponível. Por favor, escolha outra data.", {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        setStep(2); // Voltar para a seleção de datas
        setIsSubmitting(false);
        return;
      }
      
      // Verificar se existem datas indisponíveis no intervalo selecionado
      // Excluindo o dia de check-out da verificação
      const temDatasIndisponiveisNoIntervalo = datasAtualizadas.some(dataIndisponivel => {
        return isAfter(dataIndisponivel, date.from!) && 
               isBefore(dataIndisponivel, date.to!) && 
               !isSameDay(dataIndisponivel, date.to!);
      });
      
      if (temDatasIndisponiveisNoIntervalo) {
        toast.error("O período selecionado não está mais disponível. Por favor, escolha outro período.", {
          duration: 5000,
          icon: <AlertCircle className="h-5 w-5 text-red-500" />
        });
        setStep(2); // Voltar para a seleção de datas
        setIsSubmitting(false);
        return;
      }
      
      // Criar objeto de reserva
      const booking = {
        guestName: formData.nome,
        guestEmail: formData.email,
        guestPhone: formData.telefone,
        roomId: quartoSelecionado.id!,
        roomName: quartoSelecionado.name,
        checkIn: date.from ? Timestamp.fromDate(date.from) : Timestamp.now(),
        checkOut: date.to ? Timestamp.fromDate(date.to) : Timestamp.fromDate(addDays(new Date(), 1)),
        adults: parseInt(formData.adultos, 10),
        children: parseInt(formData.criancas, 10),
        totalPrice: precoTotal,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
        specialRequests: formData.observacoes,
        createdAt: Timestamp.now()
      }
      
      // Enviar para o Firebase
      await createBooking(booking)
      
      // Mostrar mensagem de sucesso
      toast.success('Reserva realizada com sucesso!', {
        duration: 5000,
        icon: <Check className="h-5 w-5 text-green-500" />
      })
      
      // Avançar para o último passo
      setStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
    } catch (error) {
      console.error('Erro ao enviar reserva:', error)
      toast.error('Erro ao processar sua reserva. Tente novamente.', {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Função para formatar preço em EUR
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(preco)
  }
  
  // Filtrar quartos com base nos filtros selecionados
  const quartosFiltrados = quartos.filter(quarto => {
    let atendeFiltros = true;
    
    if (filtros.capacidade && filtros.capacidade !== 'any') {
      atendeFiltros = atendeFiltros && quarto.capacity >= parseInt(filtros.capacidade);
    }
    
    if (filtros.tipo && filtros.tipo !== 'todos') {
      atendeFiltros = atendeFiltros && quarto.type.toLowerCase().includes(filtros.tipo.toLowerCase());
    }
    
    if (filtros.precoMaximo && filtros.precoMaximo !== 'any') {
      atendeFiltros = atendeFiltros && quarto.price <= parseInt(filtros.precoMaximo);
    }
    
    return atendeFiltros;
  })

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }
  
  const isDark = theme === 'dark'
  
  return (
    <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-black' : 'bg-gray-50'} pb-32 md:pb-0`}>
      <Navbar />
      
      {/* Hero Section Atualizado para seguir o mesmo padrão das outras páginas */}
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
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                alt="Reserva Aqua Vista Monchique"
                fill
                priority
                className="object-cover"
              />
            </div>
          </motion.div>
          <motion.div 
            style={{ opacity: opacityTransform }}
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
            style={{ opacity: opacityTransform }}
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
                  Reserve sua experiência única
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Faça sua Reserva
                <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Aqua Vista Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 ${
                isDark ? 'text-white/90' : 'text-gray-800'
              }`}>
                Escolha seu quarto ideal, verifique a disponibilidade e prepare-se para momentos extraordinários.
              </p>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator - Consistente com outras páginas */}
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

      {/* Formulário de Reserva com Design Elevado */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Progress Steps Modernizado - Ajustado para mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 bg-background/60 backdrop-blur-lg p-4 rounded-2xl shadow-lg border border-white/10 max-w-full overflow-x-auto">
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "min-w-[3rem] h-12 rounded-full flex items-center justify-center transition-all duration-500 transform cursor-pointer",
                    step >= 1 ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => step > 1 && setStep(1)}
                >
                  <Bed className="h-5 w-5" />
                </motion.div>
                <div className={cn(
                  "h-1 w-8 transition-all duration-500 mx-1",
                  step >= 2 ? "bg-primary scale-x-100" : "bg-muted scale-x-90"
                )} />
              </div>
              
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "min-w-[3rem] h-12 rounded-full flex items-center justify-center transition-all duration-500 transform cursor-pointer",
                    step >= 2 ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => step > 2 && setStep(2)}
                >
                  <CalendarIcon2 className="h-5 w-5" />
                </motion.div>
                <div className={cn(
                  "h-1 w-8 transition-all duration-500 mx-1",
                  step >= 3 ? "bg-primary scale-x-100" : "bg-muted scale-x-90"
                )} />
              </div>
              
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "min-w-[3rem] h-12 rounded-full flex items-center justify-center transition-all duration-500 transform cursor-pointer",
                    step >= 3 ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => step > 3 && setStep(3)}
                >
                  <Users className="h-5 w-5" />
                </motion.div>
                <div className={cn(
                  "h-1 w-8 transition-all duration-500 mx-1",
                  step >= 4 ? "bg-primary scale-x-100" : "bg-muted scale-x-90"
                )} />
              </div>
              
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "min-w-[3rem] h-12 rounded-full flex items-center justify-center transition-all duration-500 transform cursor-pointer",
                    step >= 4 ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
                  )}
                >
                  <CreditCard className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Step 1: Seleção de Quarto */}
          {step === 1 && (
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

              {/* Filtros de Busca */}
              <Card className="overflow-hidden border-none shadow-xl bg-background/70 backdrop-blur-lg mb-10">
                <CardHeader className="border-b border-border/10 pb-4">
                  <CardTitle className="text-xl flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Filtrar Quartos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Capacidade</label>
                      <Select 
                        value={filtros.capacidade} 
                        onValueChange={(value) => setFiltros(prev => ({ ...prev, capacidade: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Qualquer capacidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Qualquer capacidade</SelectItem>
                          <SelectItem value="1">Mínimo 1 pessoa</SelectItem>
                          <SelectItem value="2">Mínimo 2 pessoas</SelectItem>
                          <SelectItem value="3">Mínimo 3 pessoas</SelectItem>
                          <SelectItem value="4">Mínimo 4 pessoas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipo de Quarto</label>
                      <Select 
                        value={filtros.tipo} 
                        onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os tipos</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Preço Máximo</label>
                      <Select 
                        value={filtros.precoMaximo} 
                        onValueChange={(value) => setFiltros(prev => ({ ...prev, precoMaximo: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sem limite de preço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Sem limite de preço</SelectItem>
                          <SelectItem value="100">Até €100</SelectItem>
                          <SelectItem value="200">Até €200</SelectItem>
                          <SelectItem value="300">Até €300</SelectItem>
                          <SelectItem value="500">Até €500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grid de Quartos */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando quartos disponíveis...</span>
                  </div>
                ) : quartosFiltrados.length === 0 ? (
                  <div className="col-span-full">
                    <Alert className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Nenhum quarto encontrado</AlertTitle>
                      <AlertDescription>
                        Não encontramos quartos que correspondam aos seus filtros. 
                        Por favor, tente outros critérios de busca.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  quartosFiltrados.map((quarto) => (
                    <Card 
                      key={quarto.id}
                      className="overflow-hidden transition-all cursor-pointer hover:shadow-xl hover:translate-y-[-5px]"
                      onClick={() => selecionarQuarto(quarto)}
                    >
                      <div className="aspect-video w-full relative overflow-hidden">
                        <img 
                          src={quarto.images[0]} 
                          alt={quarto.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/90 hover:bg-primary">
                            {formatarPreco(quarto.price)}/noite
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          {quarto.name}
                          <Badge variant="outline" className="bg-primary/5">
                            {quarto.type}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Até {quarto.capacity} pessoas</span>
                          <span className="mx-1">•</span>
                          <span>{quarto.size} m²</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm line-clamp-3">{quarto.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {quarto.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="outline" className="bg-primary/5">
                              {amenity}
                            </Badge>
                          ))}
                          {quarto.amenities.length > 3 && (
                            <Badge variant="outline" className="bg-primary/5">
                              +{quarto.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="default"
                          className="w-full group"
                        >
                          <span className="mr-2">Ver disponibilidade</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Verificação de Disponibilidade para o Quarto Selecionado */}
          {step === 2 && quartoSelecionado && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Cabeçalho da Seção */}
              <div className="text-center max-w-3xl mx-auto mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Selecione suas Datas</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Escolha quando deseja se hospedar no {quartoSelecionado.name}
                </p>
              </div>
              
              <div className="grid md:grid-cols-5 gap-8">
                {/* Coluna 1: Detalhes do Quarto */}
                <div className="md:col-span-2">
                  <Card className="overflow-hidden border-none shadow-xl bg-background/70 backdrop-blur-lg sticky top-24">
                    <div className="aspect-[4/3] w-full relative overflow-hidden">
                      <img 
                        src={quartoSelecionado.images[0]} 
                        alt={quartoSelecionado.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white text-xl font-bold">{quartoSelecionado.name}</h3>
                        <p className="text-white/90 text-sm">{quartoSelecionado.type}</p>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">{formatarPreco(quartoSelecionado.price)}</span>
                        <span className="text-muted-foreground">por noite</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>Até {quartoSelecionado.capacity} pessoas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          <span>{quartoSelecionado.size} m²</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Comodidades</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {quartoSelecionado.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-primary" />
                              <span className="text-sm">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border/10">
                        <h4 className="font-medium mb-2">Descrição</h4>
                        <p className="text-sm text-muted-foreground">{quartoSelecionado.description}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Escolher outro quarto
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Coluna 2: Calendário e Formulário */}
                <div className="md:col-span-3">
                  <Card className="overflow-hidden border-none shadow-2xl bg-background/70 backdrop-blur-lg mb-8">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center">
                        <CalendarIcon2 className="h-5 w-5 mr-2 text-primary" />
                        Selecione as datas da sua estadia
                      </CardTitle>
                      <CardDescription>
                        Escolha a data de check-in e check-out para sua reserva
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {loadingDatas ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Verificando disponibilidade...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-full mb-6 p-4 bg-card border border-border rounded-lg shadow-sm">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-foreground text-sm">Horários</h4>
                                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                                  <li>• Check-in: 14:00 às 20:00</li>
                                  <li>• Check-out: 08:00 às 12:00</li>
                                  <li>• Check-ins após 20:00 devem ser agendados</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-full mb-6 p-4 bg-card border border-border rounded-lg shadow-sm">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-foreground text-sm">Instruções</h4>
                                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                                  <li>• Clique uma vez para selecionar o check-in</li>
                                  <li>• Clique novamente para selecionar o check-out</li>
                                  <li>• Para limpar a seleção, clique na mesma data novamente</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-foreground">
                              {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
                            </h3>
                            
                            {quartoSelecionado && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs"
                                onClick={async () => {
                                  setLoadingDatas(true);
                                  try {
                                    const datas = await getUnavailableDates(quartoSelecionado.id!);
                                    setDatasIndisponiveis(datas);
                                    toast.success("Disponibilidade atualizada com sucesso!", {
                                      icon: <Check className="h-5 w-5 text-green-500" />
                                    });
                                  } catch (error) {
                                    console.error('Erro ao atualizar disponibilidade:', error);
                                    toast.error('Não foi possível atualizar a disponibilidade', {
                                      icon: <AlertCircle className="h-5 w-5 text-red-500" />
                                    });
                                  } finally {
                                    setLoadingDatas(false);
                                  }
                                }}
                                disabled={loadingDatas}
                              >
                                {loadingDatas ? (
                                  <>
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                    Atualizando...
                                  </>
                                ) : (
                                  <>
                                    <CalendarIcon2 className="h-3 w-3 mr-1" />
                                    Atualizar disponibilidade
                                  </>
                                )}
                              </Button>
                            )}
                          </div>

                          <Calendar
                            mode="range"
                            selected={date}
                            onSelect={handleDateChange}
                            locale={ptBR}
                            disabled={(date) => isBefore(date, new Date()) && !isSameDay(date, new Date())}
                            className="rounded-lg w-full max-w-full border border-border p-6 shadow-lg bg-card"
                            modifiersStyles={{
                              disabled: { 
                                color: "#888888",
                                backgroundColor: "rgba(229, 231, 235, 0.2)",
                                fontWeight: "normal",
                                textDecoration: "line-through",
                                opacity: "0.7"
                              },
                              today: { 
                                fontWeight: "bold", 
                                borderWidth: "2px", 
                                borderColor: "hsl(var(--primary))",
                                backgroundColor: "hsl(var(--primary))",
                                color: "hsl(var(--primary-foreground))"
                              },
                              outside: {
                                opacity: "0.5",
                                color: "hsl(var(--muted-foreground))"
                              },
                              unavailable: {
                                color: "#FFFFFF",
                                backgroundColor: "#EF4444",
                                fontWeight: "bold",
                                textDecoration: "line-through",
                                opacity: "0.9",
                                borderRadius: "4px",
                                transform: "scale(0.95)",
                                boxShadow: "0 2px 4px rgba(239, 68, 68, 0.4)"
                              }
                            }}
                            numberOfMonths={1}
                            classNames={{
                              months: "flex flex-col space-y-6",
                              month: "space-y-6 w-full",
                              caption: "flex justify-center pt-2 relative items-center gap-1 pb-6",
                              caption_label: "text-2xl font-bold",
                              nav: "flex items-center gap-1",
                              nav_button: "h-12 w-12 bg-accent hover:bg-accent/80 p-0 opacity-80 hover:opacity-100 rounded-full transition-all flex items-center justify-center",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse",
                              head_row: "grid grid-cols-7 gap-2 mb-4",
                              head_cell: "text-muted-foreground rounded-md w-full font-semibold text-base uppercase text-center py-3 bg-accent/50 border border-border",
                              row: "grid grid-cols-7 gap-2 mt-4",
                              cell: "relative p-0 text-center text-base focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50 [&:has([aria-selected].day-outside)]:bg-accent/25 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                              day: "h-16 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:z-10 text-lg font-medium flex items-center justify-center",
                              day_range_start: "day-range-start bg-primary text-primary-foreground font-bold scale-110",
                              day_range_end: "day-range-end bg-primary text-primary-foreground font-bold scale-110",
                              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold",
                              day_today: "bg-primary/90 text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground",
                              day_outside: "text-muted-foreground opacity-60 hover:opacity-80",
                              day_disabled: "text-muted-foreground bg-muted/50 opacity-60 hover:bg-muted hover:text-muted-foreground hover:scale-100 cursor-not-allowed",
                              day_range_middle: "aria-selected:bg-accent/50 aria-selected:text-accent-foreground",
                              day_hidden: "invisible",
                            }}
                            onDayMouseEnter={(day) => setHoverDate(day)}
                            onDayMouseLeave={() => setHoverDate(null)}
                            modifiers={{
                              hoverRange: (day) => isDateInHoverRange(day),
                              unavailable: (day) => utilsDatas.isDateUnavailable(day, datasIndisponiveis)
                            }}
                            modifiersClassNames={{
                              hoverRange: "bg-accent text-accent-foreground",
                              unavailable: "bg-destructive text-destructive-foreground font-bold hover:bg-destructive/90 hover:text-destructive-foreground cursor-not-allowed line-through"
                            }}
                            pagedNavigation
                            fromDate={new Date()}
                            showOutsideDays={true}
                            fixedWeeks={true}
                            weekStartsOn={0}
                          />

                          {/* Botões de navegação rápida e limpar seleção */}
                          <div className="mt-6 space-y-4">
                            {/* Botão para limpar seleção */}
                            {(date.from || date.to) && (
                              <Button 
                                variant="outline" 
                                className="w-full border-dashed border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
                                onClick={() => {
                                  setDate({
                                    from: undefined,
                                    to: undefined
                                  });
                                  toast.success("Seleção de datas limpa", {
                                    icon: <Check className="h-5 w-5 text-green-500" />
                                  });
                                }}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Limpar seleção de datas
                              </Button>
                            )}

                            {/* Navegação rápida */}
                            <div className="grid grid-cols-3 gap-2">
                              <Button 
                                variant="outline" 
                                className="h-10 px-3 text-xs bg-accent/30 hover:bg-accent/50 border-border"
                                onClick={() => {
                                  const currentDate = new Date();
                                  setDate({
                                    from: currentDate,
                                    to: undefined
                                  });
                                }}
                              >
                                <CalendarIcon2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                <span className="sm:block">Mês Atual</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                className="h-10 px-3 text-xs bg-accent/30 hover:bg-accent/50 border-border"
                                onClick={() => {
                                  const nextMonth = new Date();
                                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                                  nextMonth.setDate(1);
                                  setDate({
                                    from: nextMonth,
                                    to: undefined
                                  });
                                }}
                              >
                                <CalendarIcon2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                <span className="sm:block">Próximo Mês</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                className="h-10 px-3 text-xs bg-accent/30 hover:bg-accent/50 border-border"
                                onClick={() => {
                                  const twoMonthsAhead = new Date();
                                  twoMonthsAhead.setMonth(twoMonthsAhead.getMonth() + 2);
                                  twoMonthsAhead.setDate(1);
                                  setDate({
                                    from: twoMonthsAhead,
                                    to: undefined
                                  });
                                }}
                              >
                                <CalendarIcon2 className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                <span className="sm:block">Daqui a 2 Meses</span>
                              </Button>
                            </div>
                          </div>

                          <div className="w-full mt-8 p-6 bg-card rounded-lg border border-border shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Resumo da Reserva</h3>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon2 className="h-4 w-4 text-primary" />
                                  <span className="text-sm">Check-in</span>
                                </div>
                                <span className="font-medium">
                                  {date.from ? format(date.from, "dd/MM/yyyy", { locale: ptBR }) : "-"}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon2 className="h-4 w-4 text-primary" />
                                  <span className="text-sm">Check-out</span>
                                </div>
                                <span className="font-medium">
                                  {date.to ? format(date.to, "dd/MM/yyyy", { locale: ptBR }) : "-"}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span className="text-sm">Duração</span>
                                </div>
                                <span className="font-medium">
                                  {date.from && date.to ? 
                                    `${differenceInDays(date.to, date.from) === 0 ? 1 : differenceInDays(date.to, date.from)} noites` 
                                    : "-"}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center pb-3 border-b border-border/30">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-primary" />
                                  <span className="text-sm">Valor por noite</span>
                                </div>
                                <span className="font-medium">{formatarPreco(quartoSelecionado.price)}</span>
                              </div>
                              
                              <div className="flex justify-between items-center pt-2">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-5 w-5 text-primary" />
                                  <span className="font-semibold">Total</span>
                                </div>
                                <span className="font-bold text-lg text-primary">
                                  {date.from && date.to ? 
                                    formatarPreco(quartoSelecionado.price * (differenceInDays(date.to, date.from) === 0 ? 1 : differenceInDays(date.to, date.from)))
                                    : formatarPreco(quartoSelecionado.price)}
                                </span>
                              </div>
                            </div>

                            <Button 
                              className="w-full mt-6 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:scale-[1.02]"
                              onClick={handleNextStep}
                              disabled={!date.from || !date.to}
                            >
                              <span className="flex items-center">
                                <Check className="mr-2 h-5 w-5" />
                                Continuar com estas datas
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-6 flex justify-end">
                      {/* Removido o botão duplicado */}
                    </CardFooter>
                  </Card>
                  
                  {/* Legenda e Informações adicionais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card p-4 rounded-lg border border-border shadow-md">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CalendarIcon2 className="h-4 w-4 text-primary" />
                        Legenda do Calendário
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-muted/70 border border-border"></div>
                          <span>Datas passadas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">✓</div>
                          <span>Datas selecionadas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center text-xs font-bold">✓</div>
                          <span>Hoje</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-transparent text-muted-foreground flex items-center justify-center text-xs opacity-50">23</div>
                          <span>Mês anterior/posterior</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold line-through">15</div>
                          <span className="text-xs">Indisponível/Reservado</span>
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-card border-border">
                      <Info className="h-4 w-4 text-primary" />
                      <AlertTitle>Política de cancelamento</AlertTitle>
                      <AlertDescription className="text-sm text-muted-foreground">
                        Cancelamento gratuito até 48 horas antes do check-in. Após esse período, será cobrada uma taxa de uma diária.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Dados do Hóspede */}
          {step === 3 && quartoSelecionado && date.from && date.to && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              {/* Cabeçalho da Seção */}
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Informações de Reserva</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Preencha seus dados para finalizar a reserva
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
                              {date?.from && date?.to ? (
                                <>
                                  {format(date.from, "dd 'de' MMMM", { locale: ptBR })} - {format(date.to, "dd 'de' MMMM", { locale: ptBR })}
                                </>
                              ) : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Duração</p>
                            <p className="font-medium">
                              {date.from && date.to ? 
                                `${differenceInDays(date.to, date.from) === 0 ? 1 : differenceInDays(date.to, date.from)} noites` 
                                : "-"}
                            </p>
                          </div>
                        </div>

                        {/* Linha Divisória */}
                        <div className="h-px bg-border/10" />

                        {/* Quarto Selecionado */}
                        {quartoSelecionado && (
                          <div className="space-y-4">
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <img
                                src={quartoSelecionado.images[0]}
                                alt="Quarto selecionado"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold">{quartoSelecionado.name}</h4>
                              <p className="text-sm text-muted-foreground">{quartoSelecionado.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {quartoSelecionado.amenities.slice(0, 3).map((amenidade, index) => (
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
                      </div>
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