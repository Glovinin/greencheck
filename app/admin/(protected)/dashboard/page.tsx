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
  Heart,
  Info,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRecentBookings, getDashboardStats } from "@/lib/firebase/firestore"
import { Booking } from "@/lib/firebase/firestore"
import { useAuth } from "@/lib/context/auth-context"
import Header from "@/components/admin/header"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Componente de carregamento para os cards
const StatCardSkeleton = () => (
  <Card className="overflow-hidden border-none shadow-md">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="w-40 h-4 bg-muted rounded mb-2"></div>
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="mt-4 flex items-center">
        <Skeleton className="h-5 w-16 rounded" />
        <div className="ml-2 h-4 w-24 bg-muted rounded"></div>
      </div>
    </CardContent>
  </Card>
);

// Função para renderizar o ícone da plataforma
const renderPlatformIcon = (iconName: string) => {
  switch (iconName) {
    case 'Globe':
      return <Globe className="h-4 w-4" />;
    case 'Heart':
      return <Heart className="h-4 w-4" />;
    case 'Home':
      return <Home className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

// Interface para tipagem de dados
interface RevenueDataItem {
  month: string;
  value: number;
}

interface PlatformData {
  platform: string;
  color: string;
  icon: string;
  bookings: any[];
}

interface DashboardStats {
  totalBookings: { total: number; growth: number };
  occupancyRate: { rate: number; growth: number };
  totalRevenue: { 
    monthly: number; 
    total: number; 
    growth: number; 
    revenueData: RevenueDataItem[] 
  };
  bookingsByPlatform: PlatformData[];
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [activePlatformTab, setActivePlatformTab] = useState("all")
  
  // Estados para as estatísticas
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: { total: 0, growth: 0 },
    occupancyRate: { rate: 0, growth: 0 },
    totalRevenue: { 
      monthly: 0, 
      total: 0,
      growth: 0, 
      revenueData: [] 
    },
    bookingsByPlatform: []
  })

  useEffect(() => {
    setMounted(true)
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Carregar dados para o dashboard
      const dashboardStats = await getDashboardStats()
      
      // Atualizar estados com dados reais
      setStats({
        totalBookings: dashboardStats.totalBookings,
        occupancyRate: dashboardStats.occupancyRate,
        totalRevenue: dashboardStats.totalRevenue,
        bookingsByPlatform: dashboardStats.bookingsByPlatform
      })
      
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
    const revenueData = stats.totalRevenue.revenueData
    
    if (!revenueData || revenueData.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-muted-foreground text-center">Não há dados de receita disponíveis ainda</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={loadDashboardData}
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar dados
          </Button>
        </div>
      )
    }
    
    const maxValue = Math.max(...revenueData.map(item => item.value))
    
    return (
      <div className="mt-6 h-64">
        <div className="flex h-full items-end gap-2">
          {revenueData.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`w-full ${height > 0 ? 'bg-primary/80 hover:bg-primary' : 'bg-muted/30'} rounded-t-md relative group`}
                  style={{ minHeight: height > 0 ? '4px' : '0' }}
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
    if (!stats.bookingsByPlatform || stats.bookingsByPlatform.length === 0) {
      return []
    }
    
    if (activePlatformTab === "all") {
      return stats.bookingsByPlatform.flatMap(platform => platform.bookings)
    }
    
    const platformData = stats.bookingsByPlatform.find(p => 
      p.platform.toLowerCase() === activePlatformTab
    )
    return platformData ? platformData.bookings : []
  }

  // Formatar moeda (EUR)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-black/[0.01] min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle={`Bem-vindo de volta, ${user?.email?.split('@')[0] || 'Administrador'}`} 
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
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
                      <h3 className="text-3xl font-bold">{stats.totalBookings.total}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                    <Badge variant="outline" className={`${
                      stats.totalBookings.growth > 0 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                    }`}>
                      {stats.totalBookings.growth > 0 ? "+" : ""}{stats.totalBookings.growth}%
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
                      <h3 className="text-3xl font-bold">{stats.occupancyRate.rate}%</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                    <Badge variant="outline" className={`${
                      stats.occupancyRate.growth > 0 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                    }`}>
                      {stats.occupancyRate.growth > 0 ? "+" : ""}{stats.occupancyRate.growth}%
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
                      <h3 className="text-3xl font-bold">{formatCurrency(stats.totalRevenue.monthly)}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                    <Badge variant="outline" className={`${
                      stats.totalRevenue.growth > 0 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                    }`}>
                      {stats.totalRevenue.growth > 0 ? "+" : ""}{stats.totalRevenue.growth}%
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
          </>
        )}
      </div>
      
      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Faturamento</CardTitle>
              <CardDescription>Análise de receita ao longo do tempo</CardDescription>
            </div>
            <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
              <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs">
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
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              renderRevenueChart()
            )}
            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
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
                <span className="text-sm font-bold">{formatCurrency(stats.totalRevenue.total)}</span>
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
            
            {/* Aviso de integração sendo desenvolvida */}
            <Alert className="mt-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-sm font-medium">Integração em desenvolvimento</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground mt-1">
                A ArcadeSoft está desenvolvendo um sistema de integração com Booking.com e Airbnb para o Aqua Vista, evitando overbooking e proporcionando uma gestão centralizada de reservas.
              </AlertDescription>
            </Alert>
            
            <Tabs value={activePlatformTab} onValueChange={setActivePlatformTab} className="mt-4">
              <TabsList className="grid grid-cols-4 h-9">
                <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                {stats.bookingsByPlatform && stats.bookingsByPlatform.map((platform, index) => (
                  <TabsTrigger key={index} value={platform.platform.toLowerCase()} className="text-xs flex items-center gap-1">
                    <span className="flex items-center justify-center h-4 w-4" style={{ color: platform.color }}>
                      {renderPlatformIcon(platform.icon)}
                    </span>
                    <span className="hidden md:inline">{platform.platform}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4 mt-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            ) : (
            <div className="space-y-1 mt-2">
                {getFilteredBookings().length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhuma reserva encontrada para esta plataforma
                  </div>
                ) : (
                  getFilteredBookings().map((booking, index) => (
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
                            {booking.guestName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{booking.guestName}</p>
                      <p className="text-xs text-muted-foreground">{booking.roomName}</p>
                    </div>
                  </div>
                      <div className="text-xs hidden sm:block">
                    <span className="text-muted-foreground">{booking.checkIn} - {booking.checkOut}</span>
                  </div>
                      <div className="text-sm font-medium hidden md:block">
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
                  ))
                )}
            </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between flex-col sm:flex-row gap-4">
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <span>Mostrando {getFilteredBookings().length} de {
                  stats.bookingsByPlatform && 
                  stats.bookingsByPlatform.flatMap(p => p.bookings).length
                } reservas</span>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 group w-full sm:w-auto"
              onClick={() => router.push('/admin/bookings')}
            >
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