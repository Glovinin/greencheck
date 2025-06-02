"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CTASection } from '@/components/cta-section'
import { Shield, Lock, FileText, CheckCircle, User, Database, Globe, Clock, Mail as MailIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function PrivacyPolicy() {
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
      <main className={`min-h-screen ${isDark ? 'bg-[#4F3621] text-[#EED5B9]' : 'bg-[#EED5B9] text-[#4F3621]'}`}>
        <Navbar />
        
        {/* Header */}
        <section className={`py-20 ${isDark ? 'bg-[#4F3621]/90' : 'bg-[#EED5B9]/90'} border-b ${isDark ? 'border-[#EED5B9]/10' : 'border-[#4F3621]/20'}`}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Política de Privacidade</h1>
              <p className={`text-lg md:text-xl ${isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'}`}>
                Entenda como coletamos, usamos e protegemos suas informações pessoais
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
              <div className={`p-4 rounded-lg ${isDark ? 'bg-[#EED5B9]/5' : 'bg-[#4F3621]/5'} flex items-start gap-3`}>
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium">Última atualização: 22 de Março de 2025</p>
                  <p className={`text-sm ${isDark ? 'text-[#EED5B9]/60' : 'text-[#4F3621]/60'}`}>
                    Esta política pode ser atualizada periodicamente. Recomendamos revisá-la regularmente.
                  </p>
                </div>
              </div>
              
              {/* Introdução */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                  Introdução
                </h2>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  O Aqua Vista Monchique ("nós", "nosso", "hotel") está comprometido em proteger sua privacidade. 
                  Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas 
                  informações pessoais quando você utiliza nossos serviços, seja em nossas instalações físicas ou 
                  em nosso website.
                </p>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política. Recomendamos 
                  que leia este documento na íntegra para entender completamente nossas práticas de privacidade.
                </p>
              </div>
              
              {/* Informações que Coletamos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <User className="h-5 w-5 text-primary" />
                  Informações que Coletamos
                </h2>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Coletamos diversos tipos de informações para proporcionar e melhorar nossos serviços, incluindo:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Informações de identificação pessoal:</span> Nome, endereço de e-mail, 
                    número de telefone, endereço postal, documentos de identificação.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Informações de pagamento:</span> Detalhes de cartão de crédito/débito, 
                    informações bancárias (processadas com segurança através de provedores de pagamento certificados).
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Informações de reserva:</span> Datas de chegada e partida, preferências 
                    de estadia, solicitações especiais.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Informações de utilização do website:</span> Endereço IP, tipo de navegador, 
                    páginas visitadas, tempo de acesso, cookies e tecnologias similares.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Comunicações:</span> Quando você nos contata, podemos manter registro dessas interações.
                  </li>
                </ul>
              </div>
              
              {/* Como Usamos Suas Informações */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Database className="h-5 w-5 text-primary" />
                  Como Usamos Suas Informações
                </h2>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Utilizamos as informações que coletamos para os seguintes propósitos:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      <span className="font-medium">Fornecer nossos serviços:</span> Processar reservas, facilitar seu check-in e check-out, 
                      atender às suas solicitações durante a estadia.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      <span className="font-medium">Comunicação:</span> Enviar confirmações de reserva, alertas de mudanças em serviços, 
                      responder às suas perguntas e solicitações.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      <span className="font-medium">Personalização:</span> Personalizar sua experiência com base em suas preferências e histórico.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      <span className="font-medium">Marketing:</span> Com seu consentimento, enviar informações sobre promoções, 
                      eventos especiais e ofertas que possam ser de seu interesse.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      <span className="font-medium">Melhorias nos serviços:</span> Analisar como nossos serviços são utilizados para 
                      melhorá-los e desenvolver novos recursos.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      <span className="font-medium">Conformidade legal:</span> Cumprir com obrigações legais, incluindo requisitos 
                      fiscais e regulamentos de hospedagem.
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Compartilhamento de Dados */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Globe className="h-5 w-5 text-primary" />
                  Compartilhamento de Dados
                </h2>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Podemos compartilhar suas informações pessoais nas seguintes circunstâncias:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Prestadores de serviços:</span> Empresas que nos auxiliam em operações como 
                    processamento de pagamentos, hospedagem de website, análise de dados, e serviços de email.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Parceiros de negócios:</span> Quando necessário para fornecer serviços solicitados 
                    por você, como empresas de transporte ou organizadores de passeios.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Entidades legais:</span> Quando exigido por lei, processo legal, ou para proteger 
                    nossos direitos e propriedade.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Consentimento:</span> Em outras circunstâncias onde solicitamos e recebemos seu 
                    consentimento explícito.
                  </li>
                </ul>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Não vendemos suas informações pessoais a terceiros nem as compartilhamos para finalidades de marketing 
                  direto sem seu consentimento explícito.
                </p>
              </div>
              
              {/* Segurança de Dados */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Lock className="h-5 w-5 text-primary" />
                  Segurança de Dados
                </h2>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações pessoais 
                  contra acesso não autorizado, perda, uso indevido ou alteração. Estas medidas incluem:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      Criptografia de dados sensíveis
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      Protocolos seguros para transmissão de dados
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      Acesso restrito a informações pessoais
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                      Treinamento de funcionários sobre práticas de privacidade
                    </span>
                  </li>
                </ul>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Embora nos esforcemos para proteger suas informações, nenhum método de transmissão ou armazenamento 
                  eletrônico é 100% seguro. Portanto, não podemos garantir segurança absoluta.
                </p>
              </div>
              
              {/* Seus Direitos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <User className="h-5 w-5 text-primary" />
                  Seus Direitos
                </h2>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  De acordo com as leis de proteção de dados aplicáveis, você pode ter os seguintes direitos:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Acesso:</span> Solicitar acesso às suas informações pessoais que mantemos.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Retificação:</span> Solicitar a correção de informações incorretas ou incompletas.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Exclusão:</span> Solicitar a exclusão de suas informações pessoais em determinadas circunstâncias.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Restrição de processamento:</span> Solicitar a restrição do processamento de suas informações pessoais.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Portabilidade de dados:</span> Receber suas informações pessoais em formato estruturado 
                    e transferi-las para outro controlador.
                  </li>
                  <li className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                    <span className="font-medium">Oposição:</span> Opor-se ao processamento de suas informações pessoais em determinadas circunstâncias.
                  </li>
                </ul>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Para exercer qualquer desses direitos, entre em contato conosco através das informações fornecidas 
                  na seção "Contato" abaixo.
                </p>
              </div>
              
              {/* Contato */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-[#EED5B9]/5' : 'bg-[#4F3621]/5'} space-y-4`}>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <MailIcon className="h-5 w-5 text-primary" />
                  Entre em Contato
                </h2>
                <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>
                  Se você tiver dúvidas sobre esta Política de Privacidade ou sobre nossas práticas de dados,
                  entre em contato conosco:
                </p>
                <div className="space-y-2">
                  <p className={`font-medium ${isDark ? 'text-[#EED5B9]/90' : 'text-[#4F3621]/90'}`}>Aqua Vista Monchique</p>
                  <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>Estrada da Foia, 8550-257 Monchique, Algarve, Portugal</p>
                  <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>Email: privacy@aquavista-monchique.pt</p>
                  <p className={`${isDark ? 'text-[#EED5B9]/80' : 'text-[#4F3621]/80'}`}>Telefone: +351 282 249 728</p>
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