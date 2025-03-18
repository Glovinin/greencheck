"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  LogOut, 
  Save,
  Loader2,
  Camera,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/context/auth-context"
import Header from "@/components/admin/header"

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("perfil")
  
  // Estados para formulários
  const [profileForm, setProfileForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    bio: ""
  })
  
  const [passwordForm, setPasswordForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailReservas: true,
    emailMarketing: false,
    notificacoesApp: true,
    lembretes: true
  })
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    reducaoMovimento: false,
    altoContraste: false,
    fonteGrande: false
  })

  useEffect(() => {
    setMounted(true)
    
    // Carregar dados do usuário
    if (user) {
      setProfileForm({
        nome: user.displayName || "",
        email: user.email || "",
        telefone: "",
        cargo: "Administrador",
        bio: "Gerente do Hotel Aqua Vista Monchique, responsável pela administração do sistema."
      })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simular atualização de perfil
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive"
      })
      setLoading(false)
      return
    }
    
    try {
      // Simular atualização de senha
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
        variant: "default"
      })
      
      setPasswordForm({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar senha",
        description: "Ocorreu um erro ao atualizar sua senha.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleNotificationSave = async () => {
    setLoading(true)
    
    try {
      // Simular atualização de notificações
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências de notificação foram salvas.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar preferências",
        description: "Ocorreu um erro ao salvar suas preferências.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleAppearanceSave = async () => {
    setLoading(true)
    
    try {
      // Simular atualização de aparência
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Aparência atualizada",
        description: "Suas preferências de aparência foram salvas.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar aparência",
        description: "Ocorreu um erro ao salvar suas preferências.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Header 
        title="Configurações" 
        subtitle="Gerencie sua conta e preferências" 
      />
      
      <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span className="hidden md:inline">Aparência</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Perfil */}
        <TabsContent value="perfil">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {profileForm.nome.split(' ').map(n => n[0]).join('').toUpperCase() || 'AV'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" className="flex items-center gap-1">
                          <Camera className="h-4 w-4" />
                          <span>Alterar</span>
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="flex items-center gap-1 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome completo</Label>
                          <Input 
                            id="nome" 
                            value={profileForm.nome}
                            onChange={(e) => setProfileForm({...profileForm, nome: e.target.value})}
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            placeholder="seu.email@exemplo.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input 
                            id="telefone" 
                            value={profileForm.telefone}
                            onChange={(e) => setProfileForm({...profileForm, telefone: e.target.value})}
                            placeholder="+351 123 456 789"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cargo">Cargo</Label>
                          <Input 
                            id="cargo" 
                            value={profileForm.cargo}
                            onChange={(e) => setProfileForm({...profileForm, cargo: e.target.value})}
                            placeholder="Seu cargo"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea 
                          id="bio" 
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                          placeholder="Uma breve descrição sobre você"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Salvar alterações</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Segurança */}
        <TabsContent value="seguranca">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senhaAtual">Senha atual</Label>
                      <Input 
                        id="senhaAtual" 
                        type="password"
                        value={passwordForm.senhaAtual}
                        onChange={(e) => setPasswordForm({...passwordForm, senhaAtual: e.target.value})}
                        placeholder="Digite sua senha atual"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="novaSenha">Nova senha</Label>
                      <Input 
                        id="novaSenha" 
                        type="password"
                        value={passwordForm.novaSenha}
                        onChange={(e) => setPasswordForm({...passwordForm, novaSenha: e.target.value})}
                        placeholder="Digite sua nova senha"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                      <Input 
                        id="confirmarSenha" 
                        type="password"
                        value={passwordForm.confirmarSenha}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmarSenha: e.target.value})}
                        placeholder="Confirme sua nova senha"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Segurança adicional
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Autenticação de dois fatores</p>
                          <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta</p>
                        </div>
                        <Button variant="outline">Configurar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dispositivos conectados</p>
                          <p className="text-sm text-muted-foreground">Gerencie dispositivos que têm acesso à sua conta</p>
                        </div>
                        <Button variant="outline">Gerenciar</Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair de todos os dispositivos
                </Button>
                <Button 
                  type="submit" 
                  onClick={handlePasswordSubmit}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Atualizando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Atualizar senha</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Notificações */}
        <TabsContent value="notificacoes">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Escolha como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificações por email</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Novas reservas</p>
                        <p className="text-sm text-muted-foreground">Receba emails quando novas reservas forem feitas</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailReservas}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailReservas: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Emails de marketing</p>
                        <p className="text-sm text-muted-foreground">Receba atualizações sobre novidades e promoções</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailMarketing}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailMarketing: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Notificações do aplicativo</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificações no aplicativo</p>
                        <p className="text-sm text-muted-foreground">Receba notificações dentro do sistema</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.notificacoesApp}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notificacoesApp: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Lembretes e alertas</p>
                        <p className="text-sm text-muted-foreground">Receba lembretes sobre tarefas e eventos importantes</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.lembretes}
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lembretes: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleNotificationSave}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Salvar preferências</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Aparência */}
        <TabsContent value="aparencia">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Aparência e Acessibilidade</CardTitle>
                <CardDescription>
                  Personalize a aparência e as configurações de acessibilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tema</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-all ${!appearanceSettings.darkMode ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, darkMode: false})}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sun className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Tema claro</p>
                        <p className="text-sm text-muted-foreground">Interface com fundo claro</p>
                      </div>
                    </div>
                    
                    <div className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition-all ${appearanceSettings.darkMode ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, darkMode: true})}
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Moon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Tema escuro</p>
                        <p className="text-sm text-muted-foreground">Interface com fundo escuro</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Acessibilidade</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Redução de movimento</p>
                        <p className="text-sm text-muted-foreground">Reduz animações e efeitos visuais</p>
                      </div>
                      <Switch 
                        checked={appearanceSettings.reducaoMovimento}
                        onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, reducaoMovimento: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alto contraste</p>
                        <p className="text-sm text-muted-foreground">Aumenta o contraste entre elementos</p>
                      </div>
                      <Switch 
                        checked={appearanceSettings.altoContraste}
                        onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, altoContraste: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Fonte maior</p>
                        <p className="text-sm text-muted-foreground">Aumenta o tamanho do texto em toda a interface</p>
                      </div>
                      <Switch 
                        checked={appearanceSettings.fonteGrande}
                        onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, fonteGrande: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleAppearanceSave}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Salvar preferências</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </>
  )
} 