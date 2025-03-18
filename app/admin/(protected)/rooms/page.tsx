"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  BedDouble,
  Eye,
  Pencil,
  Check,
  X,
  CalendarRange,
  MoreHorizontal
} from "lucide-react"
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
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getRooms, deleteRoom } from "@/lib/firebase/firestore"
import { Room } from "@/lib/types"
import Header from "@/components/admin/header"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RoomsManagement() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      setLoading(true)
      const roomsData = await getRooms()
      setRooms(roomsData)
    } catch (error) {
      console.error('Erro ao carregar quartos:', error)
      toast.error("Erro ao carregar quartos")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return
    
    try {
      setIsDeleting(true)
      await deleteRoom(roomToDelete.id!)
      setRooms(rooms.filter(room => room.id !== roomToDelete.id))
      toast.success("Quarto excluído com sucesso")
    } catch (error) {
      console.error('Erro ao excluir quarto:', error)
      toast.error("Erro ao excluir quarto")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setRoomToDelete(null)
    }
  }

  const handleEditRoom = (roomId: string) => {
    router.push(`/admin/rooms/edit/${roomId}`)
  }

  const handleViewRoom = (roomId: string) => {
    window.open(`/rooms/${roomId}`, '_blank')
  }

  const confirmDelete = (room: Room) => {
    setRoomToDelete(room)
    setIsDeleteDialogOpen(true)
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(preco)
  }

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Header 
          title="Gerenciamento de Quartos" 
          subtitle="Gerencie os quartos disponíveis no hotel"
          className="mb-0"
        />
        
        <Button onClick={() => router.push('/admin/rooms/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Quarto
        </Button>
      </div>
      
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Visualização em Grid</TabsTrigger>
          <TabsTrigger value="table">Visualização em Tabela</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Carregando quartos...</span>
            </div>
          ) : rooms.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <CalendarRange className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhum quarto cadastrado</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Você ainda não cadastrou nenhum quarto. Clique no botão abaixo para adicionar seu primeiro quarto.
                </p>
                <Button onClick={() => router.push("/admin/rooms/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Quarto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48">
                      <img
                        src={room.images && room.images.length > 0 ? room.images[0] : "https://via.placeholder.com/400x200?text=Sem+Imagem"}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full bg-black/20 hover:bg-black/40 text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/admin/rooms/edit/${room.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => confirmDelete(room)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewRoom(room.id!)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="absolute bottom-2 left-2">
                        <Badge variant={room.available ? "default" : "destructive"} className="text-xs">
                          {room.available ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="flex-grow p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{room.name}</h3>
                        <div className="text-lg font-bold">{formatarPreco(room.price)}</div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {room.description || "Sem descrição"}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {room.capacity} pessoas
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {room.size}m²
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {room.type || "Standard"}
                        </Badge>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => router.push(`/admin/rooms/edit/${room.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewRoom(room.id!)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        onClick={() => confirmDelete(room)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Carregando quartos...</span>
                </div>
              ) : rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <CalendarRange className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum quarto cadastrado</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Você ainda não cadastrou nenhum quarto. Clique no botão abaixo para adicionar seu primeiro quarto.
                  </p>
                  <Button onClick={() => router.push("/admin/rooms/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Quarto
                  </Button>
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                      <TableHead>Capacidade</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>{room.type || "Standard"}</TableCell>
                        <TableCell>{room.capacity} pessoas</TableCell>
                        <TableCell>{formatarPreco(room.price)}</TableCell>
                        <TableCell>
                          <Badge variant={room.available ? "default" : "destructive"}>
                            {room.available ? "Disponível" : "Indisponível"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => router.push(`/admin/rooms/edit/${room.id}`)}
                              className="h-8 px-2 text-xs"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewRoom(room.id!)}
                              className="h-8 px-2 text-xs"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Visualizar
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => confirmDelete(room)}
                              className="h-8 px-2 text-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                              <AlertDialogContent>
                                <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                  <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o quarto 
              <span className="font-semibold"> {roomToDelete?.name}</span> e removerá seus dados do servidor.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteRoom}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {isDeleting ? (
                                      <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Excluindo...
                                      </>
                                    ) : (
                <>Excluir</>
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
    </>
  )
} 