"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Search, 
  Loader2, 
  Mail,
  MessageSquare,
  Eye,
  RefreshCw,
  Filter,
  Clock,
  User,
  Phone,
  Reply,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  Calendar
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Timestamp,
  doc,
  updateDoc
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Contact, getDocuments, updateDocument } from "@/lib/firebase/firestore"
import Header from "@/components/admin/header"
import { toast } from "sonner"

// Configuração para os diferentes status das mensagens
const statusConfig = {
  new: {
    label: "Não lida",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    icon: <AlertTriangle className="h-4 w-4" />
  },
  read: {
    label: "Lida",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: <Eye className="h-4 w-4" />
  },
  replied: {
    label: "Respondida",
    color: "text-green-500 bg-green-500/10 border-green-500/20",
    icon: <CheckCircle className="h-4 w-4" />
  }
}

export default function MessagesManagement() {
  const router = useRouter()
  const [messages, setMessages] = useState<Contact[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [replyMessage, setReplyMessage] = useState("")
  
  // Listener em tempo real para as mensagens
  useEffect(() => {
    const messagesRef = collection(db, "contacts")
    const q = query(messagesRef, orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => {
        const data = doc.data()
        return { 
          id: doc.id, 
          ...data,
        } as Contact
      })
      
      setMessages(messagesData)
      setLoading(false)
    }, (error) => {
      console.error("Erro ao carregar mensagens:", error)
      toast.error("Erro ao carregar mensagens em tempo real")
      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [])
  
  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...messages]
    
    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(message => 
        message.name.toLowerCase().includes(term) ||
        message.email.toLowerCase().includes(term) ||
        (message.phone && message.phone.toLowerCase().includes(term)) ||
        message.subject.toLowerCase().includes(term) ||
        message.message.toLowerCase().includes(term)
      )
    }
    
    // Filtro de status
    if (statusFilter !== "all") {
      result = result.filter(message => message.status === statusFilter)
    }
    
    // Ordenação
    result.sort((a, b) => {
      let valueA, valueB
      
      switch (sortField) {
        case "name":
          valueA = a.name
          valueB = b.name
          break
        case "subject":
          valueA = a.subject
          valueB = b.subject
          break
        case "status":
          valueA = a.status
          valueB = b.status
          break
        case "createdAt":
        default:
          valueA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 0
          valueB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 0
          break
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })
    
    setFilteredMessages(result)
  }, [messages, searchTerm, statusFilter, sortField, sortDirection])
  
  const markAsRead = async (messageId: string) => {
    try {
      setIsUpdating(true)
      await updateDocument('contacts', messageId, {
        status: 'read',
        updatedAt: Timestamp.now()
      })
      toast.success("Mensagem marcada como lida")
      // A atualização real será feita pelo listener
    } catch (error) {
      console.error('Erro ao atualizar status da mensagem:', error)
      toast.error("Erro ao marcar mensagem como lida")
    } finally {
      setIsUpdating(false)
    }
  }
  
  const markAsReplied = async (messageId: string) => {
    try {
      setIsUpdating(true)
      await updateDocument('contacts', messageId, {
        status: 'replied',
        updatedAt: Timestamp.now()
      })
      toast.success("Mensagem marcada como respondida")
      // A atualização real será feita pelo listener
    } catch (error) {
      console.error('Erro ao atualizar status da mensagem:', error)
      toast.error("Erro ao marcar mensagem como respondida")
    } finally {
      setIsUpdating(false)
      setIsReplyDialogOpen(false)
    }
  }
  
  const handleSendReply = async () => {
    if (!selectedMessage?.id || !replyMessage.trim()) return
    
    try {
      setIsUpdating(true)
      
      // Aqui você pode implementar o envio real do e-mail
      // Por enquanto, vamos apenas simular e marcar como respondida
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Atualizar status para respondida
      await markAsReplied(selectedMessage.id)
      
      // Limpar mensagem de resposta
      setReplyMessage("")
      
      toast.success("Resposta enviada com sucesso!")
    } catch (error) {
      console.error('Erro ao enviar resposta:', error)
      toast.error("Erro ao enviar resposta")
    } finally {
      setIsUpdating(false)
      setIsReplyDialogOpen(false)
    }
  }
  
  const viewMessageDetails = (message: Contact) => {
    setSelectedMessage(message)
    setIsDetailsDialogOpen(true)
    
    // Se a mensagem ainda estiver como nova, marcá-la como lida
    if (message.status === 'new' && message.id) {
      markAsRead(message.id)
    }
  }
  
  const handleOpenReplyDialog = (message: Contact) => {
    setSelectedMessage(message)
    setIsReplyDialogOpen(true)
  }
  
  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate()
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const formatTimeAgo = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate()
    return formatDistanceToNow(date, { locale: ptBR, addSuffix: true })
  }
  
  const getStatusColor = (status: string) => {
    const statusKey = status as keyof typeof statusConfig
    return statusConfig[statusKey]?.color || "text-gray-500 bg-gray-500/10"
  }
  
  const getStatusIcon = (status: string) => {
    const statusKey = status as keyof typeof statusConfig
    return statusConfig[statusKey]?.icon || null
  }
  
  const getStatusLabel = (status: string) => {
    const statusKey = status as keyof typeof statusConfig
    return statusConfig[statusKey]?.label || "Desconhecido"
  }
  
  const countByStatus = (status: string) => {
    return messages.filter(message => message.status === status).length
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Header 
          title="Mensagens" 
          subtitle="Gerencie as mensagens recebidas pelo formulário de contato"
          className="mb-0"
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setMessages([...messages])}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className={`overflow-hidden bg-yellow-500/5 border-yellow-500/30`}>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Novas</p>
                <h3 className="text-2xl font-bold">{countByStatus('new')}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`overflow-hidden bg-blue-500/5 border-blue-500/30`}>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Lidas</p>
                <h3 className="text-2xl font-bold">{countByStatus('read')}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`overflow-hidden bg-green-500/5 border-green-500/30`}>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Respondidas</p>
                <h3 className="text-2xl font-bold">{countByStatus('replied')}</h3>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`overflow-hidden`}>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total</p>
                <h3 className="text-2xl font-bold">{messages.length}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, assunto..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 flex items-center">
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    {statusFilter === 'all' ? 'Todos os status' : getStatusLabel(statusFilter)}
                    <ChevronDown className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    Todos os status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('new')}>
                    <Badge variant="outline" className="mr-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Novas
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('read')}>
                    <Badge variant="outline" className="mr-2 bg-blue-500/10 text-blue-500 border-blue-500/30">
                      <Eye className="h-3 w-3 mr-1" />
                      Lidas
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('replied')}>
                    <Badge variant="outline" className="mr-2 bg-green-500/10 text-green-500 border-green-500/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Respondidas
                    </Badge>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="text-sm text-muted-foreground">
                {filteredMessages.length} {filteredMessages.length === 1 ? 'mensagem' : 'mensagens'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-10">
              <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">Nenhuma mensagem encontrada</h3>
              <p className="text-muted-foreground">
                {messages.length > 0 
                  ? 'Tente ajustar os filtros para ver mais resultados.' 
                  : 'Você ainda não recebeu nenhuma mensagem.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Remetente</TableHead>
                    <TableHead className="hidden md:table-cell">Assunto/Mensagem</TableHead>
                    <TableHead className="hidden md:table-cell w-[130px]">Status</TableHead>
                    <TableHead className="hidden md:table-cell w-[180px]">Data</TableHead>
                    <TableHead className="w-[150px] text-right pr-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id} className="cursor-pointer" onClick={() => viewMessageDetails(message)}>
                      <TableCell className="font-medium">
                        <div className="truncate">{message.name}</div>
                        <div className="truncate text-sm text-muted-foreground">
                          {message.email}
                        </div>
                        {/* Status em dispositivos móveis */}
                        <div className="md:hidden mt-1">
                          <Badge variant="outline" className={`${getStatusColor(message.status)}`}>
                            {getStatusIcon(message.status)}
                            {getStatusLabel(message.status)}
                          </Badge>
                          {/* Indicador de reserva em dispositivos móveis */}
                          {message.reservationDetails && (
                            <Badge variant="outline" className="ml-1 bg-blue-500/10 text-blue-500 border-blue-500/30">
                              <Calendar className="h-3 w-3 mr-1" />
                              Reserva
                            </Badge>
                          )}
                        </div>
                        {/* Data em dispositivos móveis */}
                        <div className="text-xs text-muted-foreground md:hidden mt-1">
                          {formatTimeAgo(message.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="font-medium truncate">{message.subject || "Mensagem do site"}</div>
                        <div className="truncate text-sm text-muted-foreground">
                          {message.message.length > 50 
                            ? `${message.message.substring(0, 50)}...` 
                            : message.message}
                        </div>
                        {/* Indicador de mensagem de reserva */}
                        {message.reservationDetails && (
                          <Badge variant="outline" className="mt-1 bg-blue-500/10 text-blue-500 border-blue-500/30">
                            <Calendar className="h-3 w-3 mr-1" />
                            Reserva
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className={`${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          {getStatusLabel(message.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatTimeAgo(message.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation()
                              viewMessageDetails(message)
                            }}
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Ver</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenReplyDialog(message)
                            }}
                            className="flex items-center"
                            disabled={message.status === 'replied'}
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Responder</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modal de detalhes da mensagem */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Mensagem</DialogTitle>
            <DialogDescription>
              Informações completas da mensagem recebida.
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Cabeçalho da mensagem */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className={`${getStatusColor(selectedMessage.status)}`}>
                        {getStatusIcon(selectedMessage.status)}
                        {getStatusLabel(selectedMessage.status)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Recebida em</div>
                      <div className="text-sm">{formatDate(selectedMessage.createdAt)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Informações do Remetente */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Informações do Remetente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Nome</div>
                      <div className="font-medium">{selectedMessage.name}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" /> Email
                      </div>
                      <div className="font-medium">{selectedMessage.email}</div>
                    </div>
                    {selectedMessage.phone && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" /> Telefone
                        </div>
                        <div className="font-medium">{selectedMessage.phone}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Conteúdo da Mensagem */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Mensagem
                  </h3>
                  <div className="space-y-4">
                    {selectedMessage.subject && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Assunto</div>
                        <div className="font-medium">{selectedMessage.subject}</div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Conteúdo</div>
                      <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Detalhes da Reserva (se existir) */}
                {selectedMessage.reservationDetails && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Detalhes da Reserva
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 rounded-lg p-4">
                        {selectedMessage.reservationDetails.roomName && (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Quarto</div>
                            <div className="font-medium">{selectedMessage.reservationDetails.roomName}</div>
                          </div>
                        )}
                        
                        {selectedMessage.reservationDetails.checkIn && (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Check-in</div>
                            <div className="font-medium">{formatDate(selectedMessage.reservationDetails.checkIn)}</div>
                          </div>
                        )}
                        
                        {selectedMessage.reservationDetails.checkOut && (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Check-out</div>
                            <div className="font-medium">{formatDate(selectedMessage.reservationDetails.checkOut)}</div>
                          </div>
                        )}
                        
                        {selectedMessage.reservationDetails.totalGuests !== undefined && (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Total de hóspedes</div>
                            <div className="font-medium">{selectedMessage.reservationDetails.totalGuests}</div>
                          </div>
                        )}
                        
                        {selectedMessage.reservationDetails.totalPrice !== undefined && (
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Valor Total</div>
                            <div className="font-medium">
                              {new Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              }).format(selectedMessage.reservationDetails.totalPrice)}
                            </div>
                          </div>
                        )}
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
                      <div className="font-medium">{formatDate(selectedMessage.createdAt)}</div>
                    </div>
                    {selectedMessage.updatedAt && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Última atualização</div>
                        <div className="font-medium">{formatDate(selectedMessage.updatedAt)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            {selectedMessage && selectedMessage.status !== 'replied' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailsDialogOpen(false)
                  handleOpenReplyDialog(selectedMessage)
                }}
                className="w-full sm:w-auto flex items-center"
              >
                <Reply className="mr-2 h-4 w-4" />
                Responder
              </Button>
            )}
            <Button 
              variant={selectedMessage?.status === 'replied' ? "default" : "secondary"} 
              onClick={() => setIsDetailsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de resposta à mensagem */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Responder à Mensagem</DialogTitle>
            <DialogDescription>
              Envie uma resposta para {selectedMessage?.name} ({selectedMessage?.email})
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Mensagem original:</p>
                <p className="text-muted-foreground">{selectedMessage.message}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sua resposta:</label>
                <Textarea
                  placeholder="Digite sua resposta aqui..."
                  className="min-h-[200px]"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReplyDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSendReply}
              disabled={isUpdating || !replyMessage.trim()}
              className="flex items-center"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Reply className="mr-2 h-4 w-4" />
                  Enviar Resposta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 