"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CTASection } from '@/components/cta-section'
import { FileText, Scale, CreditCard, Clock, AlertTriangle, BookOpen, CheckCircle, Users } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function TermsOfUse() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

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
    <>
      <main className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
        <Navbar />
        
        {/* Header */}
        <section className={`py-20 ${isDark ? 'bg-black/80' : 'bg-gray-50'} border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Termos de Uso</h1>
              <p className={`text-lg md:text-xl ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Por favor, leia atentamente os termos e condições que regem o uso dos nossos serviços
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Conteúdo */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-12"
            >
              {/* Última Atualização */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} flex items-start gap-3`}>
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium">Última atualização: 22 de Março de 2025</p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    Estes termos podem ser atualizados periodicamente. Recomendamos revisá-los antes de cada reserva.
                  </p>
                </div>
              </div>
              
              {/* Introdução */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                  Introdução
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Bem-vindo ao Aqua Vista Monchique. Estes Termos de Uso estabelecem as regras e regulamentos 
                  para a utilização dos serviços oferecidos pelo Aqua Vista Monchique, seja em nossas instalações 
                  físicas ou através do nosso website.
                </p>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Ao acessar nosso site ou utilizar nossos serviços, você concorda em ficar vinculado a estes 
                  termos e condições. Se você não concordar com qualquer parte destes termos, solicitamos que 
                  não utilize nossos serviços ou acesse nosso website.
                </p>
              </div>
              
              {/* Reservas */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Reservas e Estadias
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  As seguintes condições se aplicam a todas as reservas feitas através do nosso site ou diretamente 
                  com o hotel:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Confirmação:</span> Sua reserva só é garantida após a confirmação 
                      por escrito do hotel e o processamento do pagamento ou pré-autorização.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Check-in e Check-out:</span> O check-in inicia às 14:00h e o 
                      check-out deve ser realizado até às 11:00h. Check-in antecipado ou check-out tardio estão 
                      sujeitos à disponibilidade e podem incorrer em taxas adicionais.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Idade Mínima:</span> Para realizar reservas e se hospedar em nosso 
                      hotel, é necessário ter pelo menos 18 anos de idade.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Ocupação máxima:</span> Para garantir conforto e segurança, 
                      cada quarto tem uma capacidade máxima de ocupação que deve ser respeitada.
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Política de Pagamento */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Política de Pagamento
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Nossos termos de pagamento são os seguintes:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Depósito:</span> Para garantir sua reserva, podemos exigir um 
                    depósito ou pré-autorização no cartão de crédito.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Taxas extras:</span> Serviços adicionais utilizados durante a estadia 
                    serão cobrados no momento do check-out, a menos que especificado de outra forma.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Moeda:</span> Todos os preços são cotados em Euros (€). Pagamentos em 
                    outras moedas podem estar sujeitos a taxas de conversão.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Impostos:</span> Os preços podem incluir ou não impostos e taxas locais, 
                    dependendo da oferta. Os detalhes serão especificados no momento da reserva.
                  </li>
                </ul>
              </div>
              
              {/* Política de Cancelamento */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Política de Cancelamento
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Nossa política de cancelamento é a seguinte:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Cancelamento gratuito:</span> Cancelamentos realizados até 72 horas 
                    antes da data de check-in têm direito a reembolso total.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Cancelamento tardio:</span> Cancelamentos com menos de 72 horas de 
                    antecedência estão sujeitos a uma taxa equivalente a uma noite de hospedagem.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">No-show:</span> Em caso de não comparecimento sem aviso prévio, será 
                    cobrado o valor total da reserva ou conforme especificado nos termos da tarifa específica.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Tarifas não reembolsáveis:</span> Algumas tarifas especiais podem ser 
                    não reembolsáveis, independentemente da data de cancelamento. Nestes casos, as condições específicas 
                    serão claramente informadas no momento da reserva.
                  </li>
                </ul>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Por favor, note que condições específicas podem variar de acordo com o tipo de reserva, temporada e 
                  promoções. As condições exatas aplicáveis à sua reserva serão apresentadas no momento da confirmação.
                </p>
              </div>
              
              {/* Conduta na Propriedade */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                  Conduta na Propriedade
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Para garantir a segurança e conforto de todos os hóspedes, pedimos que observe as seguintes regras:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Respeito ao silêncio:</span> Entre as 22:00h e 8:00h, solicitamos que 
                    ruídos sejam mantidos a um nível mínimo para não perturbar outros hóspedes.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Política de não fumar:</span> Não é permitido fumar dentro das 
                    instalações do hotel, exceto em áreas designadas. Violações podem resultar em taxas de limpeza adicionais.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Animais de estimação:</span> Animais de estimação são permitidos em 
                    áreas selecionadas mediante aviso prévio e podem estar sujeitos a taxa adicional.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Danos à propriedade:</span> Os hóspedes serão responsabilizados por 
                    quaisquer danos causados às instalações do hotel durante sua estadia.
                  </li>
                </ul>
              </div>
              
              {/* Limitação de Responsabilidade */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Limitação de Responsabilidade
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  O Aqua Vista Monchique não assume responsabilidade por:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Perda, roubo ou dano a bens pessoais em qualquer área do hotel, incluindo quartos, áreas comuns e estacionamento.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Ferimentos ou acidentes durante o uso de instalações recreativas e de fitness, incluindo piscina e spa.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Interrupções em serviços essenciais como água, eletricidade e internet devido a circunstâncias fora do nosso controle.
                  </li>
                </ul>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Recomendamos que os hóspedes providenciem seus próprios seguros de viagem adequados para cobrir eventuais perdas ou acidentes.
                </p>
              </div>
              
              {/* Leis Aplicáveis */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Scale className="h-5 w-5 text-primary" />
                  Leis Aplicáveis
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Estes Termos de Uso serão regidos e interpretados de acordo com as leis de Portugal. 
                  Qualquer disputa decorrente destes termos será sujeita à jurisdição exclusiva dos tribunais 
                  portugueses.
                </p>
              </div>
              
              {/* Alterações aos Termos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                  Alterações aos Termos
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  O Aqua Vista Monchique reserva-se o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor assim que forem publicadas em nosso website. 
                  Recomendamos que você verifique regularmente estes termos para estar a par de quaisquer alterações.
                </p>
              </div>
              
              {/* Contato */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} space-y-4`}>
                <h2 className="text-2xl font-semibold">Entre em Contato</h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <div className="space-y-2">
                  <p className={`font-medium ${isDark ? 'text-white/90' : 'text-gray-800'}`}>Aqua Vista Monchique</p>
                  <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>Estrada da Foia, 8550-257 Monchique, Algarve, Portugal</p>
                  <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>Email: info@aquavista-monchique.pt</p>
                  <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>Telefone: +351 282 249 728</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        <CTASection />
      </main>
      <Footer />
    </>
  )
} 