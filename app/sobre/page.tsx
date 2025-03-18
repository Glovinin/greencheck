"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, Users, Award, Clock, MapPin, Building, ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Sobre() {
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

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
                src="https://images.unsplash.com/photo-1603822199623-d8b014c2e315?q=80&w=2940"
                alt="Aqua Vista Monchique - Sobre Nós"
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
                  Nossa História
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Sobre Nós
                <span className={`block text-xl sm:text-2xl md:text-3xl mt-3 font-light ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>Aqua Vista Monchique</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-3xl font-light mb-8 md:mb-12 ${
                isDark ? 'text-white/90' : 'text-gray-800'
              }`}>
                Conheça a história e os valores que fazem do Aqua Vista uma experiência única
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

      {/* Nossa História Section */}
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
                  <span>Nossa Jornada</span>
                </div>
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-6 tracking-tight text-white"
              >
                A História do Aqua Vista
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-white/70 mb-6 leading-relaxed"
              >
                Fundado em 2010, o Aqua Vista nasceu da paixão de seus proprietários pela Serra de Monchique e seu desejo de criar uma experiência de hospedagem única que celebrasse as belezas naturais da região. 
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-white/70 mb-8 leading-relaxed"
              >
                O que começou como uma pequena pousada familiar evoluiu para um hotel boutique premiado, mantendo sempre seu compromisso com a hospitalidade autêntica, o conforto excepcional e o respeito ao meio ambiente natural que nos cerca.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center text-white/80 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  <span>Premiado por 5 anos consecutivos</span>
                </div>
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
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                    alt="Fachada do Aqua Vista Monchique"
                    className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Fachada do Hotel</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025"
                    alt="Equipe do Hotel"
                    className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Nossa Equipe</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070"
                    alt="Vista da Serra"
                    className="rounded-3xl object-cover h-40 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Vista da Serra</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg shadow-black/20 group relative">
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500"></div>
                  <img
                    src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049"
                    alt="Interior do Hotel"
                    className="rounded-3xl object-cover h-64 w-full transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4 z-20">
                    <p className="text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Interior do Hotel</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nossos Valores Section */}
      <section className="py-24 bg-gradient-to-b from-black to-black/95 relative overflow-hidden">
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
              Nossos Princípios
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mt-6 mb-4 text-white"
            >
              Valores que nos Guiam
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              Nosso compromisso com a excelência é guiado por valores que norteiam cada aspecto da experiência Aqua Vista.
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
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">Excelência</h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Buscamos constantemente superar expectativas, elevando o padrão de qualidade em todos os aspectos da experiência do hóspede.
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
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">Hospitalidade Genuína</h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Acreditamos no poder do acolhimento autêntico, tratando cada hóspede com atenção personalizada e calor humano.
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
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-300">Sustentabilidade</h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Comprometemo-nos a preservar e celebrar a beleza natural de Monchique, adotando práticas sustentáveis em todas as nossas operações.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipe Section */}
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
              Nossa Equipe
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mt-6 mb-4 text-white"
            >
              As Pessoas por Trás da Experiência
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-lg text-white/70 max-w-3xl mx-auto"
            >
              Conheça alguns membros da nossa equipe dedicada que trabalha para tornar sua estadia inesquecível.
            </motion.p>
          </div>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-lg group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2049" 
                  alt="Diretor do Hotel" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">Ricardo Almeida</h3>
                <p className="text-primary/80 text-sm mb-3">Diretor Geral</p>
                <p className="text-white/60 text-sm">Com mais de 20 anos de experiência em hotelaria de luxo, Ricardo lidera nossa equipe com paixão e dedicação.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-lg group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076" 
                  alt="Gerente de Hospitalidade" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">Maria Santos</h3>
                <p className="text-primary/80 text-sm mb-3">Gerente de Hospitalidade</p>
                <p className="text-white/60 text-sm">Maria é responsável por garantir que cada hóspede receba um atendimento excepcional e personalizado.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-lg group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=2080" 
                  alt="Chef Executivo" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">António Ferreira</h3>
                <p className="text-primary/80 text-sm mb-3">Chef Executivo</p>
                <p className="text-white/60 text-sm">Com formação internacional, António cria experiências gastronômicas únicas inspiradas nos sabores locais.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-lg group"
            >
              <div className="h-64 relative overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?q=80&w=2070" 
                  alt="Gerente Ambiental" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">Carla Oliveira</h3>
                <p className="text-primary/80 text-sm mb-3">Gerente de Sustentabilidade</p>
                <p className="text-white/60 text-sm">Carla lidera nossas iniciativas ambientais, garantindo práticas sustentáveis em todo o hotel.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-t from-black to-black/95 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-5xl mx-auto px-4 text-center relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-white/20 to-primary/20 rounded-[2rem] blur-xl opacity-70"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-white/20 shadow-2xl relative z-10"
          >
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 text-white"
            >
              Venha Conhecer o Aqua Vista
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
            >
              Estamos ansiosos para recebê-lo em nosso refúgio nas montanhas e proporcionar momentos inesquecíveis.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                onClick={() => router.push('/booking')}
                className="rounded-full bg-white hover:bg-white/90 text-black px-8 py-6 h-auto transition-all duration-300 hover:shadow-lg shadow-white/10 hover:shadow-white/30 hover:scale-105 font-medium"
              >
                Reservar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/contato')}
                className="rounded-full border-white/30 text-white hover:bg-white/10 transition-all duration-300 px-8 py-6 h-auto backdrop-blur-sm hover:border-white/60 hover:scale-105"
              >
                Entre em Contato
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 