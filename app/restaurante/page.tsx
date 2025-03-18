"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, Clock, ChevronDown, UtensilsCrossed, Mail } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Restaurante() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica para salvar o email
    alert('Obrigado pelo seu interesse! Você receberá novidades em breve.')
    setEmail('')
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-black' : 'bg-gray-50'} pb-32 md:pb-0`}>
      <Navbar />
      
      {/* Hero Section */}
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
                src="https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=2940"
                alt="Restaurante Aqua Vista Monchique"
                fill
                priority
                className="object-cover"
              />
            </div>
          </motion.div>
          <motion.div 
            style={{ opacity }}
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
                    ? 'text-primary/90 bg-primary/10 border-primary/20' 
                    : 'text-gray-900 bg-gray-200/80 border-gray-300'
                } px-4 py-2 rounded-full backdrop-blur-sm border`}>
                  Gastronomia de excelência
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Nosso Restaurante
                <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Aqua Vista Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 ${
                isDark ? 'text-white/90' : 'text-gray-800'
              }`}>
                Uma experiência gastronômica única com vista panorâmica para as montanhas
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

      {/* About Restaurant Section - Sempre com estilo escuro independente do tema */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10 inline-block mb-6"
              >
                <div className="flex items-center">
                  <Clock className="mr-2 h-3.5 w-3.5" />
                  <span>Em Construção</span>
                </div>
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-6 tracking-tight text-white"
              >
                Nosso Novo Espaço Gastronômico
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-white/70 mb-6 leading-relaxed"
              >
                Estamos trabalhando para criar uma experiência gastronômica inesquecível no Aqua Vista Monchique. 
                Nosso restaurante está passando por uma transformação completa, sendo cuidadosamente projetado 
                para oferecer o melhor em gastronomia e ambiente.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-white/70 mb-8 leading-relaxed"
              >
                Com uma combinação perfeita de ingredientes locais de alta qualidade e técnicas inovadoras, 
                nosso chef está desenvolvendo um menu que celebra os sabores autênticos do Algarve com um 
                toque contemporâneo e sofisticado.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center text-white/80 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                  <UtensilsCrossed className="h-5 w-5 mr-2 text-primary" />
                  <span>Inauguração prevista: Janeiro 2024</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Card de "Em Construção" - Sem overlay ou texto */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-black/30"
            >
              <div className="h-full">
                <Image 
                  src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2940" 
                  alt="Design conceitual do restaurante" 
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Conceito Gastronômico - Sempre com fundo escuro independente do tema */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Nossa Visão Gastronômica
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mt-6 mb-4 text-white"
            >
              O Que Estamos Preparando
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              Um vislumbre do conceito que irá definir a experiência gastronômica do 
              Aqua Vista Monchique.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.9999V7.9999C21 6.89533 20.1046 5.9999 19 5.9999H5C3.89543 5.9999 3 6.89533 3 7.9999V15.9999C3 17.1046 3.89543 17.9999 5 17.9999H19C20.1046 17.9999 21 17.1046 21 15.9999Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11.01L12.01 10.9989" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">Cozinha de Autor</h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Nossa equipe de chefs está desenvolvendo um menu exclusivo que reflete a riqueza da gastronomia local com técnicas contemporâneas e apresentação impecável.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">Ingredientes Locais</h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Priorizando produtores locais e ingredientes sazonais, estamos construindo uma rede de fornecedores que compartilham nossa visão de qualidade e sustentabilidade.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">Experiência Sensorial</h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Mais que uma refeição, estamos criando momentos memoráveis onde cada detalhe - da música à iluminação, da decoração ao serviço - é cuidadosamente pensado.
              </p>
            </motion.div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-64 overflow-hidden rounded-2xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <Image 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070" 
                alt="Amostra de pratos" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Inspirações Culinárias</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative h-64 overflow-hidden rounded-2xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <Image 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2274" 
                alt="Interior conceitual" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Ambiente Elegante</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-64 overflow-hidden rounded-2xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <Image 
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=2069" 
                alt="Vinhos selecionados" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Carta de Vinhos Premium</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative h-64 overflow-hidden rounded-2xl group"
            >
              <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
              <Image 
                src="https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?q=80&w=1924" 
                alt="Preparação de chefs" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                <p className="text-white font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Equipe de Chefs Especializados</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section id="subscribe" className={`py-24 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden group ${
              isDark
                ? 'bg-gradient-to-br from-black/80 to-black/60 border border-white/10'
                : 'bg-gradient-to-br from-white/90 to-white/80 border border-gray-200'
            }`}
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary"
                >
                  <Mail className="w-7 h-7" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  Fique por dentro de todas as novidades
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-gray-700'}`}
                >
                  Seja o primeiro a receber atualizações sobre a inauguração do nosso restaurante, 
                  eventos exclusivos e ofertas especiais.
                </motion.p>
              </div>
              
              <motion.form 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail" 
                  required
                  className={`flex-grow px-6 py-4 rounded-full focus:outline-none transition-colors duration-300 ${
                    isDark 
                      ? 'border border-white/20 bg-white/5 backdrop-blur-sm focus:border-primary/40 text-white placeholder:text-white/50'
                      : 'border border-gray-300 bg-white/80 backdrop-blur-sm focus:border-primary/40 text-gray-900 placeholder:text-gray-500'
                  }`}
                />
                <Button 
                  type="submit"
                  className={`rounded-full px-8 py-4 h-auto transition-all duration-300 hover:shadow-lg ${
                    isDark
                      ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 text-gray-900'
                      : 'bg-gray-900 hover:bg-gray-800 hover:shadow-gray-300/40 text-white'
                  }`}
                >
                  Inscrever-se
                </Button>
              </motion.form>
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className={`text-sm mt-4 ${isDark ? 'text-white/50' : 'text-gray-500'}`}
              >
                Respeitamos sua privacidade. Você pode cancelar sua inscrição a qualquer momento.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline de Construção */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/10"
            >
              Progresso da Construção
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mt-6 mb-4 text-white"
            >
              Nossa Jornada até a Inauguração
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              Acompanhe as etapas da criação do nosso espaço gastronômico exclusivo.
            </motion.p>
          </div>
          
          <div className="relative">
            {/* Linha Vertical */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-primary/50 via-primary/30 to-primary/5"></div>
            
            {/* Timeline Items */}
            <div className="space-y-24">
              {/* Item 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 text-center md:text-right mb-8 md:mb-0">
                    <div className="bg-black/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 inline-block shadow-lg">
                      <span className="text-primary font-medium text-sm uppercase tracking-wider">Concluído</span>
                      <h3 className="text-white text-2xl font-semibold mt-2 mb-3">Projeto Arquitetônico</h3>
                      <p className="text-white/70">O design do nosso espaço foi cuidadosamente planejado para criar um ambiente elegante e acolhedor, aproveitando a vista panorâmica da serra.</p>
                    </div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-primary/20 border-4 border-black flex items-center justify-center z-10 absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-center md:text-left">
                    <span className="text-white/70 text-lg">Setembro 2023</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Item 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 text-center md:text-right mb-8 md:mb-0">
                    <span className="text-white/70 text-lg">Novembro 2023</span>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-primary/20 border-4 border-black flex items-center justify-center z-10 absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-center md:text-left">
                    <div className="bg-black/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 inline-block shadow-lg">
                      <span className="text-primary font-medium text-sm uppercase tracking-wider">Em Andamento</span>
                      <h3 className="text-white text-2xl font-semibold mt-2 mb-3">Construção do Espaço</h3>
                      <p className="text-white/70">As obras estão avançando conforme o planejado, transformando nossa visão em realidade com atenção meticulosa a cada detalhe.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Item 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 text-center md:text-right mb-8 md:mb-0">
                    <div className="bg-black/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 inline-block shadow-lg">
                      <span className="text-white/50 font-medium text-sm uppercase tracking-wider">Próxima Etapa</span>
                      <h3 className="text-white text-2xl font-semibold mt-2 mb-3">Desenvolvimento do Menu</h3>
                      <p className="text-white/70">Nossa equipe de chefs está finalizando um menu exclusivo que celebrará os sabores locais com técnicas contemporâneas.</p>
                    </div>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/10 border-4 border-black flex items-center justify-center z-10 absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-center md:text-left">
                    <span className="text-white/70 text-lg">Dezembro 2023</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Item 4 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 text-center md:text-right mb-8 md:mb-0">
                    <span className="text-white/70 text-lg">Janeiro 2024</span>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-white/10 border-4 border-black flex items-center justify-center z-10 absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-center md:text-left">
                    <div className="bg-black/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 inline-block shadow-lg">
                      <span className="text-white/50 font-medium text-sm uppercase tracking-wider">Grande Inauguração</span>
                      <h3 className="text-white text-2xl font-semibold mt-2 mb-3">Abertura do Restaurante</h3>
                      <p className="text-white/70">A espera terá valido a pena! Convidamos você a ser um dos primeiros a experimentar nossa gastronomia exclusiva.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 