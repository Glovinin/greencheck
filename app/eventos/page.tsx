"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, Calendar, Heart, CheckCircle2, Mail, MessageSquare, ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'

export default function Eventos() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContactar = () => {
    router.push('/contato')
  }

  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  return (
    <>
      <main className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-black' : 'bg-gray-50'} pb-32 md:pb-0`}>
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative min-h-[100svh] pb-20 md:pb-0">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              style={{ 
                y: 0,
                scale: 1.1
              }}
              className="w-full h-[120%] -mt-10"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://videos.pexels.com/video-files/20203964/20203964-uhd_2560_1440_30fps.mp4" type="video/mp4" />
              </video>
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
                    Espaços para momentos especiais
                  </span>
                </div>
                
                <h1 className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Eventos Inesquecíveis
                  <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                    isDark ? 'text-white/80' : 'text-gray-700'
                  }`}>no Aqua Vista Monchique</span>
                </h1>
                
                <p className={`text-lg sm:text-xl md:text-2xl font-light mb-8 md:mb-12 max-w-4xl mx-auto ${
                  isDark ? 'text-white/90' : 'text-gray-800'
                }`}>
                  Casamentos, festas corporativas e celebrações especiais com vista panorâmica para a Serra de Monchique
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <Button 
                    size="lg" 
                    onClick={handleContactar}
                    className={`w-full sm:w-auto rounded-full transition-all duration-300 min-w-[200px] sm:min-w-[220px] h-12 sm:h-14 text-base sm:text-lg shadow-lg hover:scale-105 ${
                      isDark 
                        ? 'bg-white text-black hover:bg-white/90 shadow-white/10 hover:shadow-white/20' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-300/40 hover:shadow-gray-300/60'
                    }`}
                  >
                    Solicitar Orçamento <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                    className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/10 transition-all duration-300 min-w-[200px] sm:min-w-[220px] h-12 sm:h-14 text-base sm:text-lg backdrop-blur-sm hover:border-white/40 hover:scale-105"
                  >
                    Explorar Espaços
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator - ajustado para corresponder com a homepage */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 md:mt-16 flex flex-col items-center"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              style={{ cursor: 'pointer' }}
            >
              <div className="p-3 sm:p-4 rounded-full border-2 border-white/30 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-white/80 text-sm mt-3 font-medium tracking-wider uppercase">Explorar</span>
            </motion.div>
          </div>
        </section>

        {/* Introdução aos Eventos */}
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
                  Eventos Exclusivos
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold mb-6 tracking-tight text-white"
                >
                  Celebre Momentos Especiais com Vista Panorâmica
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg text-white/70 mb-6 leading-relaxed"
                >
                  No Aqua Vista Monchique, transformamos ocasiões especiais em experiências inesquecíveis. 
                  Nossos espaços versáteis e sofisticados são o cenário perfeito para casamentos, eventos 
                  corporativos, aniversários e celebrações exclusivas.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-lg text-white/70 mb-8 leading-relaxed"
                >
                  Com uma equipe dedicada de profissionais, cuidamos de cada detalhe para garantir que 
                  seu evento seja exatamente como você imaginou, cercado pela beleza natural da Serra de Monchique.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:border-white/40 hover:scale-105 group"
                    onClick={handleContactar}
                  >
                    Fale com Nossa Equipe
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                    <img
                      src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2798"
                      alt="Casamento ao ar livre"
                      className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                      <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Casamento ao Ar Livre</p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                    <img
                      src="https://images.unsplash.com/photo-1617450365226-9bf28c04e130?q=80&w=2870"
                      alt="Evento corporativo"
                      className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                      <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Evento Corporativo</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                    <img
                      src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?q=80&w=2940"
                      alt="Festa de aniversário"
                      className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                      <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Festa de Aniversário</p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                    <img
                      src="https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=2938"
                      alt="Jantar de gala"
                      className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                      <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Jantar de Gala</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tipos de Eventos */}
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
                Nossos Serviços
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mt-6 mb-4 text-white"
              >
                Eventos Para Todas as Ocasiões
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-white/70 max-w-3xl mx-auto"
              >
                O Aqua Vista Monchique oferece infraestrutura completa para diversos tipos de 
                eventos, com flexibilidade para atender suas necessidades específicas.
              </motion.p>
            </div>

            {/* Casamentos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center mb-24"
            >
              <div className="order-2 md:order-1">
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-full">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wider uppercase">Casamentos</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white">Realize o Casamento dos Seus Sonhos</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Nosso espaço oferece o cenário perfeito para o dia mais importante da sua vida. 
                  Com vista panorâmica para a Serra de Monchique, nossos ambientes internos e externos 
                  proporcionam um ambiente romântico e sofisticado para celebrar o seu amor.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Cerimônias ao ar livre com vista para a serra</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Salão de festas para até 200 convidados</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Equipe de gastronomia dedicada com menu personalizado</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Pacotes especiais de hospedagem para noivos e convidados</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Coordenador de eventos exclusivo para o seu casamento</span>
                  </li>
                </ul>
                <Button 
                  className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                  onClick={handleContactar}
                >
                  Solicitar Pacote de Casamento
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <div className="overflow-hidden rounded-3xl shadow-xl shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=2879"
                    alt="Casamento no Aqua Vista Monchique"
                    className="rounded-3xl object-cover w-full h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20">
                    <div>
                      <p className="text-white font-medium text-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Casamentos Inesquecíveis</p>
                      <p className="text-white/70 text-sm mt-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">Momentos eternizados com a beleza da Serra de Monchique como pano de fundo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Eventos Corporativos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center mb-24"
            >
              <div>
                <div className="overflow-hidden rounded-3xl shadow-xl shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2940"
                    alt="Evento corporativo no Aqua Vista Monchique"
                    className="rounded-3xl object-cover w-full h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20">
                    <div>
                      <p className="text-white font-medium text-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Eventos Corporativos</p>
                      <p className="text-white/70 text-sm mt-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">Treinamentos, conferências e celebrações empresariais em um ambiente inspirador.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wider uppercase">Eventos Corporativos</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white">Espaços Versáteis para Sua Empresa</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Reuniões executivas, conferências, treinamentos ou eventos de integração – oferecemos 
                  infraestrutura completa para garantir o sucesso do seu evento corporativo, combinando 
                  tecnologia, conforto e a beleza natural da região.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Salas de reunião equipadas com tecnologia audiovisual</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Auditório com capacidade para 120 pessoas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Internet de alta velocidade e suporte técnico</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Coffee breaks e serviços de catering empresarial</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Atividades de team building em contato com a natureza</span>
                  </li>
                </ul>
                <Button 
                  className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                  onClick={handleContactar}
                >
                  Solicitar Proposta Corporativa
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
            </motion.div>

            {/* Celebrações Especiais */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1">
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-full">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wider uppercase">Celebrações Especiais</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white">Comemore Momentos Importantes</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Aniversários, bodas, formaturas ou encontros de família – cada ocasião merece 
                  ser celebrada com elegância e sofisticação. Nossos espaços adaptáveis 
                  proporcionam o ambiente perfeito para seus momentos especiais.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Diferentes ambientes para festas de todos os tamanhos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Decoração personalizada para cada ocasião</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Gastronomia adaptada ao estilo da sua celebração</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Pacotes de música e entretenimento disponíveis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Serviço atencioso e personalizado para seus convidados</span>
                  </li>
                </ul>
                <Button 
                  className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                  onClick={handleContactar}
                >
                  Planejar Minha Celebração
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <div className="overflow-hidden rounded-3xl shadow-xl shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2940"
                    alt="Celebração especial no Aqua Vista Monchique"
                    className="rounded-3xl object-cover w-full h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20">
                    <div>
                      <p className="text-white font-medium text-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Celebrações Memoráveis</p>
                      <p className="text-white/70 text-sm mt-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">Aniversários, festas temáticas e encontros familiares em um ambiente sofisticado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tipos de Eventos */}
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
                Nossos Serviços
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mt-6 mb-4 text-white"
              >
                Eventos Para Todas as Ocasiões
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-white/70 max-w-3xl mx-auto"
              >
                O Aqua Vista Monchique oferece infraestrutura completa para diversos tipos de 
                eventos, com flexibilidade para atender suas necessidades específicas.
              </motion.p>
            </div>

            {/* Casamentos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center mb-24"
            >
              <div className="order-2 md:order-1">
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-full">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wider uppercase">Casamentos</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white">Realize o Casamento dos Seus Sonhos</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Nosso espaço oferece o cenário perfeito para o dia mais importante da sua vida. 
                  Com vista panorâmica para a Serra de Monchique, nossos ambientes internos e externos 
                  proporcionam um ambiente romântico e sofisticado para celebrar o seu amor.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Cerimônias ao ar livre com vista para a serra</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Salão de festas para até 200 convidados</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Equipe de gastronomia dedicada com menu personalizado</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Pacotes especiais de hospedagem para noivos e convidados</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Coordenador de eventos exclusivo para o seu casamento</span>
                  </li>
                </ul>
                <Button 
                  className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                  onClick={handleContactar}
                >
                  Solicitar Pacote de Casamento
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <div className="overflow-hidden rounded-3xl shadow-xl shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=2879"
                    alt="Casamento no Aqua Vista Monchique"
                    className="rounded-3xl object-cover w-full h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20">
                    <div>
                      <p className="text-white font-medium text-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Casamentos Inesquecíveis</p>
                      <p className="text-white/70 text-sm mt-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">Momentos eternizados com a beleza da Serra de Monchique como pano de fundo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Eventos Corporativos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center mb-24"
            >
              <div>
                <div className="overflow-hidden rounded-3xl shadow-xl shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2940"
                    alt="Evento corporativo no Aqua Vista Monchique"
                    className="rounded-3xl object-cover w-full h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20">
                    <div>
                      <p className="text-white font-medium text-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Eventos Corporativos</p>
                      <p className="text-white/70 text-sm mt-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">Treinamentos, conferências e celebrações empresariais em um ambiente inspirador.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wider uppercase">Eventos Corporativos</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white">Espaços Versáteis para Sua Empresa</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Reuniões executivas, conferências, treinamentos ou eventos de integração – oferecemos 
                  infraestrutura completa para garantir o sucesso do seu evento corporativo, combinando 
                  tecnologia, conforto e a beleza natural da região.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Salas de reunião equipadas com tecnologia audiovisual</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Auditório com capacidade para 120 pessoas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Internet de alta velocidade e suporte técnico</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Coffee breaks e serviços de catering empresarial</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Atividades de team building em contato com a natureza</span>
                  </li>
                </ul>
                <Button 
                  className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                  onClick={handleContactar}
                >
                  Solicitar Proposta Corporativa
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
            </motion.div>

            {/* Celebrações Especiais */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="order-2 md:order-1">
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-full">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wider uppercase">Celebrações Especiais</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white">Comemore Momentos Importantes</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Aniversários, bodas, formaturas ou encontros de família – cada ocasião merece 
                  ser celebrada com elegância e sofisticação. Nossos espaços adaptáveis 
                  proporcionam o ambiente perfeito para seus momentos especiais.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Diferentes ambientes para festas de todos os tamanhos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Decoração personalizada para cada ocasião</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Gastronomia adaptada ao estilo da sua celebração</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Pacotes de música e entretenimento disponíveis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">Serviço atencioso e personalizado para seus convidados</span>
                  </li>
                </ul>
                <Button 
                  className="rounded-full group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                  onClick={handleContactar}
                >
                  Planejar Minha Celebração
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <div className="overflow-hidden rounded-3xl shadow-xl shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2940"
                    alt="Celebração especial no Aqua Vista Monchique"
                    className="rounded-3xl object-cover w-full h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6 z-20">
                    <div>
                      <p className="text-white font-medium text-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Celebrações Memoráveis</p>
                      <p className="text-white/70 text-sm mt-2 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">Aniversários, festas temáticas e encontros familiares em um ambiente sofisticado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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