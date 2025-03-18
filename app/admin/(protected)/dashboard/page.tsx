"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Calendar, 
  Users, 
  BedDouble,
  Settings, 
  Loader2,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Star,
  ArrowRight,
  Filter,
  Download,
  Globe,
  Home,
  Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRecentBookings } from "@/lib/firebase/firestore"
import { Booking } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/context/auth-context"
import Header from "@/components/admin/header"

// Dados simulados para o gráfico
const revenueData = [
  { month: "Jan", value: 18500 },
  { month: "Fev", value: 19200 },
  { month: "Mar", value: 21000 },
  { month: "Abr", value: 20300 },
  { month: "Mai", value: 22800 },
  { month: "Jun", value: 25600 },
  { month: "Jul", value: 28900 },
  { month: "Ago", value: 30200 },
  { month: "Set", value: 26700 },
  { month: "Out", value: 24500 },
  { month: "Nov", value: 22100 },
  { month: "Dez", value: 23400 }
]

// Dados simulados para reservas de diferentes plataformas
const bookingsByPlatform = [
  { 
    platform: "Booking.com", 
    color: "#003580", 
    icon: <Globe className="h-4 w-4" />,
    bookings: [
      { id: "B12345", guestName: "Maria Silva", roomName: "Suite Premium", checkIn: "15/11/2023", checkOut: "18/11/2023", status: "confirmed", value: "€750" },
      { id: "B12346", guestName: "João Pereira", roomName: "Quarto Deluxe", checkIn: "20/11/2023", checkOut: "25/11/2023", status: "confirmed", value: "€1250" },
      { id: "B12347", guestName: "Ana Costa", roomName: "Suite Familiar", checkIn: "01/12/2023", checkOut: "05/12/2023", status: "pending", value: "€980" }
    ]
  },
  { 
    platform: "Airbnb", 
    color: "#FF5A5F", 
    icon: <Heart className="h-4 w-4" />,
    bookings: [
      { id: "A78901", guestName: "Pedro Santos", roomName: "Suite Premium", checkIn: "10/11/2023", checkOut: "15/11/2023", status: "completed", value: "€1200" },
      { id: "A78902", guestName: "Sofia Martins", roomName: "Quarto Vista Serra", checkIn: "22/11/2023", checkOut: "26/11/2023", status: "confirmed", value: "€840" }
    ]
  },
  { 
    platform: "Direto", 
    color: "#4CAF50", 
    icon: <Home className="h-4 w-4" />,
    bookings: [
      { id: "D45678", guestName: "Carlos Oliveira", roomName: "Suite Presidencial", checkIn: "05/11/2023", checkOut: "10/11/2023", status: "confirmed", value: "€1800" },
      { id: "D45679", guestName: "Mariana Ferreira", roomName: "Suite Premium", checkIn: "18/11/2023", checkOut: "20/11/2023", status: "cancelled", value: "€500" },
      { id: "D45680", guestName: "Ricardo Almeida", roomName: "Quarto Deluxe", checkIn: "28/11/2023", checkOut: "02/12/2023", status: "pending", value: "€950" }
    ]
  }
]

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [activePlatformTab, setActivePlatformTab] = useState("all")

  useEffect(() => {
    setMounted(true)
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Carregar reservas recentes
      const bookings = await getRecentBookings(4)
      setRecentBookings(bookings)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para renderizar o gráfico de barras
  const renderRevenueChart = () => {
    const maxValue = Math.max(...revenueData.map(item => item.value))
    
    return (
      <div className="mt-6 h-64">
        <div className="flex h-full items-end gap-2">
          {revenueData.map((item, index) => {
            const height = (item.value / maxValue) * 100
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-full bg-primary/80 hover:bg-primary rounded-t-md relative group"
                >
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    €{item.value.toLocaleString()}
                  </div>
                </motion.div>
                <span className="text-xs mt-2 text-muted-foreground">{item.month}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Função para filtrar reservas por plataforma
  const getFilteredBookings = () => {
    if (activePlatformTab === "all") {
      return bookingsByPlatform.flatMap(platform => platform.bookings)
    }
    
    const platformData = bookingsByPlatform.find(p => p.platform.toLowerCase() === activePlatformTab)
    return platformData ? platformData.bookings : []
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="p-6 space-y-8 bg-black/[0.01] min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle={`Bem-vindo de volta, ${user?.email?.split('@')[0] || 'Administrador'}`} 
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total de Reservas</p>
                  <h3 className="text-3xl font-bold">128</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  +12%
                </Badge>
                <span className="ml-2 text-muted-foreground">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Taxa de Ocupação</p>
                  <h3 className="text-3xl font-bold">76%</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  +5%
                </Badge>
                <span className="ml-2 text-muted-foreground">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Receita Mensal</p>
                  <h3 className="text-3xl font-bold">€24.500</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  +18%
                </Badge>
                <span className="ml-2 text-muted-foreground">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Avaliações</p>
                  <h3 className="text-3xl font-bold">4.8/5</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                  +0.2
                </Badge>
                <span className="ml-2 text-muted-foreground">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Faturamento</CardTitle>
              <CardDescription>Análise de receita ao longo do tempo</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="text-xs">Exportar</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderRevenueChart()}
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">Receita</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs text-muted-foreground">Meta</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Total Anual:</span>
                <span className="text-sm font-bold">€283.200</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Bookings by Platform */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Reservas por Plataforma</CardTitle>
                <CardDescription>Gerencie reservas de diferentes canais</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span className="text-xs">Filtrar</span>
              </Button>
            </div>
            <Tabs value={activePlatformTab} onValueChange={setActivePlatformTab} className="mt-4">
              <TabsList className="grid grid-cols-4 h-9">
                <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                {bookingsByPlatform.map((platform, index) => (
                  <TabsTrigger key={index} value={platform.platform.toLowerCase()} className="text-xs flex items-center gap-1">
                    <span className="flex items-center justify-center h-4 w-4" style={{ color: platform.color }}>
                      {platform.icon}
                    </span>
                    <span>{platform.platform}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 mt-2">
              {getFilteredBookings().map((booking, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {booking.guestName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{booking.guestName}</p>
                      <p className="text-xs text-muted-foreground">{booking.roomName}</p>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">{booking.checkIn} - {booking.checkOut}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {booking.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs px-2 py-0 h-5 ${
                      booking.status === 'confirmed' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 
                      booking.status === 'cancelled' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : 
                      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmada' : 
                       booking.status === 'pending' ? 'Pendente' : 
                       booking.status === 'cancelled' ? 'Cancelada' : 'Concluída'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {getFilteredBookings().length} de {bookingsByPlatform.flatMap(p => p.bookings).length} reservas
            </div>
            <Button variant="outline" size="sm" className="gap-1 group">
              <span>Ver Todas</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span>Ações Rápidas</span>
          <div className="h-px flex-1 bg-border ml-4"></div>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: "Nova Reserva", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", href: "/admin/bookings/new" },
            { icon: Users, label: "Adicionar Hóspede", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", href: "/admin/guests/new" },
            { icon: BedDouble, label: "Gerenciar Quartos", color: "bg-green-500/10 text-green-600 dark:text-green-400", href: "/admin/rooms" },
            { icon: Settings, label: "Configurações", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", href: "/admin/settings" },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <Card className="cursor-pointer hover:shadow-md transition-all duration-300 border-none bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/30 group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-full ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <p className="font-medium">{action.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 