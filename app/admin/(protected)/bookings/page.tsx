"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Search, 
  Loader2, 
  CalendarRange,
  Eye,
  RefreshCw,
  Filter,
  ArrowDown,
  ArrowUp,
  ArrowDownUp,
  UserCircle,
  Phone,
  Mail,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  CircleDashed,
  MoreHorizontal
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { getDocuments, Booking, updateBookingStatus } from "@/lib/firebase/firestore"
import Header from "@/components/admin/header"
import { toast } from "sonner"

// Tipos de status com cores
const statusConfig = {
  pending: {
    label: "Pendente",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    icon: <CircleDashed className="h-4 w-4" />
  },
  confirmed: {
    label: "Confirmado",
    color: "text-green-500 bg-green-500/10 border-green-500/20",
    icon: <CheckCircle className="h-4 w-4" />
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-500 bg-red-500/10 border-red-500/20",
    icon: <XCircle className="h-4 w-4" />
  },
  completed: {
    label: "Concluído",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: <CheckCircle className="h-4 w-4" />
  }
}

const paymentStatusConfig = {
  pending: {
    label: "Pendente",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
  },
  paid: {
    label: "Pago",
    color: "text-green-500 bg-green-500/10 border-green-500/20"
  },
  refunded: {
    label: "Reembolsado",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  }
}

export default function BookingsManagement() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("checkIn")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Listener em tempo real para as reservas
  useEffect(() => {
    const bookingsRef = collection(db, "bookings")
    const q = query(bookingsRef, orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => {
        const data = doc.data()
        return { 
          id: doc.id, 
          ...data,
        } as Booking
      })
      
      setBookings(bookingsData)
      setLoading(false)
    }, (error) => {
      console.error("Erro ao carregar reservas:", error)
      toast.error("Erro ao carregar reservas em tempo real")
      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [])
  
  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...bookings]
    
    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(booking => 
        booking.guestName.toLowerCase().includes(term) ||
        booking.guestEmail.toLowerCase().includes(term) ||
        booking.guestPhone.toLowerCase().includes(term) ||
        booking.roomName.toLowerCase().includes(term) ||
        booking.id?.toLowerCase().includes(term)
      )
    }
    
    // Filtro de status
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter)
    }
    
    // Filtro de status de pagamento
    if (paymentStatusFilter !== "all") {
      result = result.filter(booking => booking.paymentStatus === paymentStatusFilter)
    }
    
    // Ordenação
    result.sort((a, b) => {
      let valueA, valueB
      
      switch (sortField) {
        case "guestName":
          valueA = a.guestName
          valueB = b.guestName
          break
        case "checkIn":
          valueA = a.checkIn instanceof Timestamp ? a.checkIn.toDate().getTime() : 0
          valueB = b.checkIn instanceof Timestamp ? b.checkIn.toDate().getTime() : 0
          break
        case "totalPrice":
          valueA = a.totalPrice
          valueB = b.totalPrice
          break
        case "createdAt":
          valueA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0
          valueB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0
          break
        default:
          valueA = a.checkIn instanceof Timestamp ? a.checkIn.toDate().getTime() : 0
          valueB = b.checkIn instanceof Timestamp ? b.checkIn.toDate().getTime() : 0
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
    
    setFilteredBookings(result)
  }, [bookings, searchTerm, statusFilter, paymentStatusFilter, sortField, sortDirection])
  
  const handleUpdateStatus = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (!selectedBooking) return
    
    try {
      setIsUpdating(true)
      
      const currentPaymentStatus = selectedBooking.paymentStatus
      await updateBookingStatus(bookingId, newStatus, currentPaymentStatus)
      
      toast.success(`Status atualizado para ${statusConfig[newStatus].label}`)
      
      // Atualizar na interface (será atualizado pelo listener, mas isso dá feedback imediato)
      setSelectedBooking({
        ...selectedBooking,
        status: newStatus
      })
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error("Erro ao atualizar status da reserva")
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleUpdatePaymentStatus = async (bookingId: string, newPaymentStatus: 'pending' | 'paid' | 'refunded') => {
    if (!selectedBooking) return
    
    try {
      setIsUpdating(true)
      
      const currentStatus = selectedBooking.status
      await updateBookingStatus(bookingId, currentStatus, newPaymentStatus)
      
      toast.success(`Status de pagamento atualizado para ${paymentStatusConfig[newPaymentStatus].label}`)
      
      // Atualizar na interface
      setSelectedBooking({
        ...selectedBooking,
        paymentStatus: newPaymentStatus
      })
    } catch (error) {
      console.error('Erro ao atualizar status de pagamento:', error)
      toast.error("Erro ao atualizar status de pagamento")
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Mudar a direção se o mesmo campo for clicado
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Novo campo, começar com asc
      setSortField(field)
      setSortDirection("asc")
    }
  }
  
  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate()
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }
  
  const formatDateTime = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate()
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowDownUp className="h-4 w-4 ml-1 opacity-50" />
    return sortDirection === "asc" 
      ? <ArrowDown className="h-4 w-4 ml-1 text-primary" />
      : <ArrowUp className="h-4 w-4 ml-1 text-primary" />
  }
  
  // Calcular dias de estadia
  const calculateStayDays = (checkIn: Timestamp, checkOut: Timestamp) => {
    const inDate = checkIn.toDate()
    const outDate = checkOut.toDate()
    const diffTime = Math.abs(outDate.getTime() - inDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const getStatusColor = (status: string) => {
    const statusKey = status as keyof typeof statusConfig
    return statusConfig[statusKey]?.color || "text-gray-500 bg-gray-500/10"
  }
  
  const getPaymentStatusColor = (status: string) => {
    const statusKey = status as keyof typeof paymentStatusConfig
    return paymentStatusConfig[statusKey]?.color || "text-gray-500 bg-gray-500/10"
  }
  
  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Header 
          title="Gerenciamento de Reservas" 
          subtitle="Visualize e gerencie todas as reservas do hotel"
          className="mb-0"
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setBookings([...bookings])}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, quarto..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline" className="flex gap-1 items-center bg-muted">
                <Filter className="h-3 w-3" />
                <span className="font-normal text-xs">{filteredBookings.length} reservas</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <CalendarRange className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchTerm || statusFilter !== "all" || paymentStatusFilter !== "all" 
                  ? "Tente ajustar os filtros para ver mais resultados." 
                  : "Não existem reservas registradas no sistema."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] cursor-pointer" onClick={() => handleSort("guestName")}>
                      <div className="flex items-center">
                        Hóspede {getSortIcon("guestName")}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("checkIn")}>
                      <div className="flex items-center">
                        Check-in/out {getSortIcon("checkIn")}
                      </div>
                    </TableHead>
                    <TableHead>Quarto</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("totalPrice")}>
                      <div className="flex items-center">
                        Valor {getSortIcon("totalPrice")}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center">
                        Criado em {getSortIcon("createdAt")}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {booking.guestName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium truncate max-w-[160px]">{booking.guestName}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[160px]">{booking.guestEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatDate(booking.checkIn)}</div>
                        <div className="text-sm text-muted-foreground">até {formatDate(booking.checkOut)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.roomName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.adults} adulto{booking.adults !== 1 ? 's' : ''} 
                          {booking.children > 0 ? `, ${booking.children} criança${booking.children !== 1 ? 's' : ''}` : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(booking.totalPrice)}</div>
                        <div className="text-xs text-muted-foreground">
                          {calculateStayDays(booking.checkIn, booking.checkOut)} {calculateStayDays(booking.checkIn, booking.checkOut) === 1 ? 'dia' : 'dias'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(booking.status)} flex gap-1 items-center`}>
                          {statusConfig[booking.status as keyof typeof statusConfig]?.icon}
                          {statusConfig[booking.status as keyof typeof statusConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                          {paymentStatusConfig[booking.paymentStatus as keyof typeof paymentStatusConfig]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewBookingDetails(booking)}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modal de detalhes da reserva */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
            <DialogDescription>
              Informações completas e opções de gerenciamento da reserva.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Resumo da Reserva */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className={`${getStatusColor(selectedBooking.status)}`}>
                        {statusConfig[selectedBooking.status as keyof typeof statusConfig]?.label}
                      </Badge>
                      <Badge variant="outline" className={`ml-2 ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                        {paymentStatusConfig[selectedBooking.paymentStatus as keyof typeof paymentStatusConfig]?.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">ID da reserva</div>
                      <div className="font-mono text-xs">{selectedBooking.id}</div>
                    </div>
                  </div>
                </div>
                
                {/* Informações do Hóspede */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <UserCircle className="h-5 w-5 mr-2 text-primary" />
                    Informações do Hóspede
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Nome</div>
                      <div className="font-medium">{selectedBooking.guestName}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" /> Email
                      </div>
                      <div className="font-medium">{selectedBooking.guestEmail}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> Telefone
                      </div>
                      <div className="font-medium">{selectedBooking.guestPhone}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">ID do Usuário</div>
                      <div className="font-medium">{selectedBooking.userId || 'Não vinculado'}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Detalhes da Estadia */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CalendarRange className="h-5 w-5 mr-2 text-primary" />
                    Detalhes da Estadia
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Check-in</div>
                      <div className="font-medium">{formatDate(selectedBooking.checkIn)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Check-out</div>
                      <div className="font-medium">{formatDate(selectedBooking.checkOut)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Duração</div>
                      <div className="font-medium">
                        {calculateStayDays(selectedBooking.checkIn, selectedBooking.checkOut)} {calculateStayDays(selectedBooking.checkIn, selectedBooking.checkOut) === 1 ? 'dia' : 'dias'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Ocupação</div>
                      <div className="font-medium">
                        {selectedBooking.adults} adulto{selectedBooking.adults !== 1 ? 's' : ''}
                        {selectedBooking.children > 0 ? `, ${selectedBooking.children} criança${selectedBooking.children !== 1 ? 's' : ''}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Detalhes do Quarto */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quarto Reservado</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Nome do quarto</div>
                      <div className="font-medium">{selectedBooking.roomName}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">ID do quarto</div>
                      <div className="font-medium font-mono text-xs">{selectedBooking.roomId}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Informações Financeiras */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Informações Financeiras
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">Valor total</div>
                      <div className="text-lg font-bold">{formatCurrency(selectedBooking.totalPrice)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Status do pagamento</div>
                      <Badge variant="outline" className={getPaymentStatusColor(selectedBooking.paymentStatus)}>
                        {paymentStatusConfig[selectedBooking.paymentStatus as keyof typeof paymentStatusConfig]?.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Solicitações Especiais */}
                {selectedBooking.specialRequests && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Solicitações Especiais</h3>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm">{selectedBooking.specialRequests}</p>
                      </div>
                    </div>
                  </>
                )}
                
                <Separator />
                
                {/* Datas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Informações Temporais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Criado em</div>
                      <div className="font-medium">{formatDateTime(selectedBooking.createdAt)}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Última atualização</div>
                      <div className="font-medium">{selectedBooking.updatedAt ? formatDateTime(selectedBooking.updatedAt) : "N/A"}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Ações */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Gerenciar Status</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Status da Reserva</div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={selectedBooking.status === "pending" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateStatus(selectedBooking.id!, "pending")}
                          disabled={isUpdating || selectedBooking.status === "pending"}
                          className="flex items-center"
                        >
                          <CircleDashed className="h-4 w-4 mr-1" />
                          Pendente
                        </Button>
                        <Button 
                          variant={selectedBooking.status === "confirmed" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateStatus(selectedBooking.id!, "confirmed")}
                          disabled={isUpdating || selectedBooking.status === "confirmed"}
                          className="flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmado
                        </Button>
                        <Button 
                          variant={selectedBooking.status === "cancelled" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateStatus(selectedBooking.id!, "cancelled")}
                          disabled={isUpdating || selectedBooking.status === "cancelled"}
                          className="flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancelado
                        </Button>
                        <Button 
                          variant={selectedBooking.status === "completed" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateStatus(selectedBooking.id!, "completed")}
                          disabled={isUpdating || selectedBooking.status === "completed"}
                          className="flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Concluído
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Status do Pagamento</div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={selectedBooking.paymentStatus === "pending" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdatePaymentStatus(selectedBooking.id!, "pending")}
                          disabled={isUpdating || selectedBooking.paymentStatus === "pending"}
                        >
                          Pendente
                        </Button>
                        <Button 
                          variant={selectedBooking.paymentStatus === "paid" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdatePaymentStatus(selectedBooking.id!, "paid")}
                          disabled={isUpdating || selectedBooking.paymentStatus === "paid"}
                        >
                          Pago
                        </Button>
                        <Button 
                          variant={selectedBooking.paymentStatus === "refunded" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpdatePaymentStatus(selectedBooking.id!, "refunded")}
                          disabled={isUpdating || selectedBooking.paymentStatus === "refunded"}
                        >
                          Reembolsado
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 