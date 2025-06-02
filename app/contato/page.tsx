"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Navbar } from '@/components/navbar'
import { Mail, Phone, MapPin, ArrowRight, Loader2, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Contact, createContactMessage } from '@/lib/firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { toast, Toaster } from 'sonner'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function Contato() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  })

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.nome.trim() || !formData.email.trim() || !formData.mensagem.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Criar objeto de contato
      const contactMessage: Contact = {
        name: formData.nome,
        email: formData.email,
        phone: formData.telefone || undefined,
        subject: "Mensagem do site",
        message: formData.mensagem,
        status: 'new',
        createdAt: Timestamp.now()
      }
      
      // Enviar para o Firestore
      await createContactMessage(contactMessage)
      
      // Feedback positivo
      toast.success("Mensagem enviada com sucesso!")
      
      // Resetar formulário
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' })
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      toast.error("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <>
      <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'} pb-32 md:pb-0`}>
        <Navbar />
        <Toaster position="top-right" richColors />
        
        {/* Hero Section */}
        <section className="relative min-h-[100svh] pb-20 md:pb-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-[120%] -mt-10">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://videos.pexels.com/video-files/3119296/3119296-uhd_2560_1440_24fps.mp4" type="video/mp4" />
              </video>
            </div>
            <motion.div 
              style={{ opacity }}
              className={`absolute inset-0 backdrop-blur-[2px] ${
                isDark 
                  ? 'bg-gradient-to-b from-[#4F3621]/70 via-[#4F3621]/50 to-[#4F3621]/80' 
                  : 'bg-gradient-to-b from-[#EED5B9]/80 via-[#EED5B9]/60 to-[#EED5B9]/90'
              }`} 
            />
            
            {/* Elementos Decorativos */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            <div className={`absolute inset-x-0 top-0 h-32 ${
              isDark 
                ? 'bg-gradient-to-b from-[#4F3621]/60 to-transparent' 
                : 'bg-gradient-to-b from-[#EED5B9]/60 to-transparent'
            }`} />
            <div className={`absolute inset-x-0 bottom-0 h-32 ${
              isDark 
                ? 'bg-gradient-to-t from-[#4F3621]/60 to-transparent' 
                : 'bg-gradient-to-t from-[#EED5B9]/60 to-transparent'
            }`} />
          </div>
          
          <div className="relative min-h-[100svh] flex flex-col justify-center items-center pt-16 md:pt-0">
            <motion.div 
              style={{ opacity }}
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
                      ? 'text-[#EED5B9]/90 bg-[#EED5B9]/10 border-[#EED5B9]/20' 
                      : 'text-[#4F3621] bg-[#4F3621]/10 border-[#4F3621]/30'
                  } px-4 py-2 rounded-full backdrop-blur-sm border`}>
                    Estamos à sua disposição
                  </span>
                </div>
                
                <h1 className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-none ${
                  isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                }`}>
                  Entre em Contato
                  <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                    isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'
                  }`}>com o Aqua Vista Monchique</span>
                </h1>
                
                <p className={`text-lg sm:text-xl md:text-2xl font-light mb-8 md:mb-12 max-w-4xl mx-auto ${
                  isDark ? 'text-[#EED5B9]/90' : 'text-[#4F3621]/90'
                }`}>
                  Estamos aqui para ajudar. Entre em contato conosco para qualquer dúvida ou solicitação.
                </p>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 md:mt-16 flex flex-col items-center"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              style={{ cursor: 'pointer' }}
            >
              <div className={`p-3 sm:p-4 rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer group ${
                isDark 
                  ? 'border-2 border-[#EED5B9]/30 bg-[#EED5B9]/10 hover:bg-[#EED5B9]/20' 
                  : 'border-2 border-[#4F3621]/60 bg-[#4F3621]/10 hover:bg-[#4F3621]/20'
              }`}>
                <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                  isDark ? 'text-[#EED5B9]/80 group-hover:text-[#EED5B9]' : 'text-[#4F3621]/80 group-hover:text-[#4F3621]'
                }`} />
              </div>
              <span className={`text-sm mt-3 font-medium tracking-wider uppercase ${
                isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'
              }`}>Explorar</span>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className={`py-24 relative overflow-hidden ${isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'}`}>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
          
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className={`p-6 shadow-xl backdrop-blur-sm ${
              isDark 
                ? 'bg-[#4F3621]/80 border-[#EED5B9]/20' 
                : 'bg-[#EED5B9]/80 border-[#4F3621]/30'
            }`}>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}>Envie sua Mensagem</CardTitle>
                  <CardDescription className={isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}>Preencha o formulário abaixo e entraremos em contato em breve.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Nome Completo</label>
                    <Input
                      name="nome"
                      placeholder="Digite seu nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Digite seu email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Telefone</label>
                    <Input
                      name="telefone"
                      placeholder="Digite seu telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Mensagem</label>
                    <Textarea
                      name="mensagem"
                      placeholder="Digite sua mensagem"
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      className="rounded-lg min-h-[150px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensagem
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className={`p-6 shadow-xl backdrop-blur-sm ${
                isDark 
                  ? 'bg-[#4F3621]/80 border-[#EED5B9]/20' 
                  : 'bg-[#EED5B9]/80 border-[#4F3621]/30'
              }`}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}>Informações de Contato</CardTitle>
                  <CardDescription className={isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}>Escolha a melhor forma de nos contatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Endereço</h3>
                      <p className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                        Estrada da Foia, 8550-257<br />
                        Monchique, Portugal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Telefone</h3>
                      <p className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>+351 282 249 728</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}`}>Email</h3>
                      <p className={`text-sm ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>contato@aquavista.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className={`p-6 shadow-xl backdrop-blur-sm ${
                isDark 
                  ? 'bg-[#4F3621]/80 border-[#EED5B9]/20' 
                  : 'bg-[#EED5B9]/80 border-[#4F3621]/30'
              }`}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'}>Nossa Localização</CardTitle>
                  <CardDescription className={isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}>Venha nos visitar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12614.865603257537!2d-8.555277!3d37.316944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b1f2455555555%3A0x5555555555555555!2sMonchique%2C+Portugal!5e0!3m2!1spt-BR!2sbr!4v1555555555555"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-24 relative overflow-hidden ${isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'}`}>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className={`backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl border ${
              isDark 
                ? 'bg-[#4F3621]/80 border-[#EED5B9]/20' 
                : 'bg-[#EED5B9]/80 border-[#4F3621]/30'
            }`}>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                }`}
              >
                Pronto para uma Experiência Única?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className={`text-lg max-w-2xl mx-auto mb-8 ${
                  isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                }`}
              >
                Reserve agora e desfrute de momentos inesquecíveis no Aqua Vista Hotel.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Button 
                  size="lg"
                  onClick={() => router.push('/booking')}
                  className={`rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${
                    isDark
                      ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90'
                      : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90'
                  }`}
                >
                  Fazer Reserva
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </>
  )
} 