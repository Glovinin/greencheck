"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Navbar } from '@/components/navbar'
import { Mail, Phone, MapPin, Clock, Send, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function Contato() {
  const [isLoading, setIsLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll() // Checar scroll inicial
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Resetar formulário
    setFormData({ nome: '', email: '', telefone: '', mensagem: '' })
  }

  return (
    <main className="min-h-screen bg-background pb-32 md:pb-0">
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
          : "bg-transparent"
      )}>
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex flex-col items-center justify-center -mt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025"
            alt="Fundo de contato"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        </div>
        
        {/* Conteúdo Principal */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-[800px] mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Entre em Contato
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Estamos aqui para ajudar. Entre em contato conosco para qualquer dúvida ou solicitação.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
                <CardDescription>Preencha o formulário abaixo e entraremos em contato em breve.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    placeholder="Digite seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="Digite seu email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    placeholder="Digite seu telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensagem</label>
                  <Textarea
                    placeholder="Digite sua mensagem"
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    className="rounded-lg min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full"
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
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>Escolha a melhor forma de nos contatar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Endereço</h3>
                    <p className="text-sm text-muted-foreground">
                      Rua das Montanhas, 123<br />
                      Monchique, Portugal
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-sm text-muted-foreground">+351 282 123 456</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">contato@aquavista.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Nossa Localização</CardTitle>
                <CardDescription>Venha nos visitar</CardDescription>
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Pronto para uma Experiência Única?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Reserve agora e desfrute de momentos inesquecíveis no Aqua Vista Hotel.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              Fazer Reserva
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 