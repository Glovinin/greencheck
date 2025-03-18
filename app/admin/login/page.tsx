"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, ArrowLeft, LogIn, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { loginUser, resetPassword, getCurrentUser, onAuthStateChange } from "@/lib/firebase/auth"

export default function AdminLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  useEffect(() => {
    setMounted(true)
    
    // Verificar se há um usuário já logado
    const currentUser = getCurrentUser()
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || "",
        rememberMe: true
      }))
    } else if (typeof window !== 'undefined') {
      // Recuperar email salvo no localStorage (apenas no cliente)
      const savedEmail = localStorage.getItem('aquavista_admin_email')
      if (savedEmail) {
        setFormData(prev => ({
          ...prev,
          email: savedEmail,
          rememberMe: true
        }))
      }
    }
    
    // Configurar listener para mudanças no estado de autenticação
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // Se o usuário já estiver autenticado, redirecionar para o dashboard
        router.push('/admin/dashboard')
      }
    })
    
    return () => unsubscribe()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Salvar email no localStorage se "Lembrar-me" estiver marcado (apenas no cliente)
      if (typeof window !== 'undefined') {
        if (formData.rememberMe) {
          localStorage.setItem('aquavista_admin_email', formData.email)
        } else {
          localStorage.removeItem('aquavista_admin_email')
        }
      }
      
      await loginUser(formData.email, formData.password, formData.rememberMe)
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)
      
      // Tratamento de erros específicos do Firebase
      const errorCode = error.code
      switch (errorCode) {
        case 'auth/invalid-email':
          setError('Email inválido.')
          break
        case 'auth/user-disabled':
          setError('Esta conta foi desativada.')
          break
        case 'auth/user-not-found':
          setError('Usuário não encontrado.')
          break
        case 'auth/wrong-password':
          setError('Senha incorreta.')
          break
        default:
          setError('Ocorreu um erro ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetEmail(formData.email)
    }
    
    try {
      setLoading(true)
      await resetPassword(resetEmail || formData.email)
      setResetSent(true)
      setError(null)
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error)
      
      // Tratamento de erros específicos do Firebase
      const errorCode = error.code
      switch (errorCode) {
        case 'auth/invalid-email':
          setError('Email inválido.')
          break
        case 'auth/user-not-found':
          setError('Usuário não encontrado.')
          break
        default:
          setError('Ocorreu um erro ao enviar o email de recuperação.')
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Botão de voltar */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link href="/">
          <Button 
            variant="outline" 
            size="sm" 
            className="group flex items-center gap-2 rounded-full border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Voltar ao site</span>
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 px-4"
      >
        <Card className="border-border shadow-xl bg-card text-card-foreground">
          <CardHeader className="space-y-1 text-center pb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
            >
              <LogIn className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Área Administrativa
            </CardTitle>
            <CardDescription>
              Acesse o painel de controle do Aqua Vista Monchique
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {resetSent && (
              <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                <AlertDescription>
                  Email de recuperação enviado. Verifique sua caixa de entrada.
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu.email@aquavista.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Ocultar senha" : "Mostrar senha"}
                    </span>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={formData.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Lembrar-me
                  </Label>
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Esqueceu a senha?
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Button 
                  type="submit" 
                  className="w-full rounded-full flex items-center justify-center gap-2 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Entrar</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Acesso restrito a funcionários do Aqua Vista Monchique
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
} 