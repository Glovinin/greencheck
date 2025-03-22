"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CTASection } from '@/components/cta-section'
import { Cookie, Clock, Check, Info, Settings, AlarmClock, ToggleLeft, Shield } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function CookiePolicy() {
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
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Política de Cookies</h1>
              <p className={`text-lg md:text-xl ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Entenda como utilizamos cookies para melhorar sua experiência no nosso site
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
                    Esta política pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável.
                  </p>
                </div>
              </div>
              
              {/* O que são Cookies */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Cookie className="h-5 w-5 text-primary" />
                  O que são Cookies
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) 
                  quando você visita websites. Eles são amplamente utilizados para fazer os sites funcionarem de maneira 
                  mais eficiente e fornecerem informações aos proprietários do site.
                </p>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Os cookies permitem que um site reconheça seu dispositivo e lembre-se de determinadas informações sobre 
                  sua visita, como suas preferências de idioma, tamanho da fonte, e outras configurações de exibição. 
                  Isso pode tornar sua próxima visita mais fácil e o site mais útil para você.
                </p>
              </div>
              
              {/* Como Utilizamos os Cookies */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Info className="h-5 w-5 text-primary" />
                  Como Utilizamos os Cookies
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  O Aqua Vista Monchique utiliza cookies para diversos propósitos, incluindo:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Funcionamento essencial:</span> Cookies necessários para o funcionamento 
                      básico do website, como autenticação, segurança e gestão de sessão.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Preferências e funcionalidades:</span> Cookies que permitem ao site lembrar 
                      suas preferências, como idioma, tema (claro/escuro) e outras configurações personalizadas.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Desempenho e análise:</span> Cookies que coletam informações sobre como os visitantes 
                      utilizam nosso site, quais páginas são mais populares e como o tráfego flui pelo site.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      <span className="font-medium">Marketing e publicidade:</span> Cookies utilizados para exibir anúncios mais relevantes 
                      para você e seus interesses, limitar o número de vezes que você vê um anúncio e ajudar a medir a eficácia das 
                      campanhas publicitárias.
                    </span>
                  </li>
                </ul>
              </div>
              
              {/* Tipos de Cookies que Utilizamos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Settings className="h-5 w-5 text-primary" />
                  Tipos de Cookies que Utilizamos
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Os cookies podem ser classificados de acordo com sua duração e fonte:
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium flex items-center gap-2">
                      <AlarmClock className="h-4 w-4 text-primary" />
                      Por Duração
                    </h3>
                    <ul className="space-y-3 pl-6 list-disc">
                      <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                        <span className="font-medium">Cookies de Sessão:</span> Estes são temporários e expiram quando você 
                        fecha o navegador. Eles são utilizados para lembrar suas ações durante uma única sessão de navegação.
                      </li>
                      <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                        <span className="font-medium">Cookies Persistentes:</span> Permanecem no seu dispositivo por um período 
                        determinado ou até serem excluídos manualmente. Eles são utilizados para lembrar suas preferências ou ações em vários sites.
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Por Origem
                    </h3>
                    <ul className="space-y-3 pl-6 list-disc">
                      <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                        <span className="font-medium">Cookies Primários:</span> Definidos por nós e utilizados apenas pelo nosso website.
                      </li>
                      <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                        <span className="font-medium">Cookies de Terceiros:</span> Definidos por terceiros, como parceiros de análise e 
                        publicidade. Eles podem rastrear sua navegação em diferentes websites e são utilizados para personalizar anúncios e conteúdo.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Cookies Específicos */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Cookie className="h-5 w-5 text-primary" />
                  Cookies Específicos
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Abaixo está uma lista dos principais cookies utilizados em nosso site:
                </p>
                
                <div className={`rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} overflow-hidden`}>
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className={`${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Propósito</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Duração</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      <tr>
                        <td className="px-4 py-3 text-sm">session_id</td>
                        <td className="px-4 py-3 text-sm">Gerencia a sessão do usuário e autenticação</td>
                        <td className="px-4 py-3 text-sm">Sessão</td>
                      </tr>
                      <tr className={`${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 text-sm">theme_preference</td>
                        <td className="px-4 py-3 text-sm">Armazena a preferência de tema (claro/escuro)</td>
                        <td className="px-4 py-3 text-sm">1 ano</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">language</td>
                        <td className="px-4 py-3 text-sm">Armazena a preferência de idioma</td>
                        <td className="px-4 py-3 text-sm">1 ano</td>
                      </tr>
                      <tr className={`${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 text-sm">_ga (Google Analytics)</td>
                        <td className="px-4 py-3 text-sm">Utilizado para distinguir usuários</td>
                        <td className="px-4 py-3 text-sm">2 anos</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">_gid (Google Analytics)</td>
                        <td className="px-4 py-3 text-sm">Utilizado para distinguir usuários</td>
                        <td className="px-4 py-3 text-sm">24 horas</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'} mt-2`}>
                  Esta não é uma lista exaustiva e pode ser atualizada periodicamente conforme nosso site evolui e 
                  novos recursos são adicionados.
                </p>
              </div>
              
              {/* Gerenciamento de Cookies */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <ToggleLeft className="h-5 w-5 text-primary" />
                  Gerenciamento de Cookies
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Você pode controlar e gerenciar cookies de várias maneiras:
                </p>
                <ul className="space-y-3 pl-6 list-disc">
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Configurações do navegador:</span> A maioria dos navegadores permite 
                    que você gerencie suas preferências de cookies. Você pode configurar seu navegador para recusar 
                    cookies, excluir cookies específicos ou notificá-lo quando um site tenta armazenar um cookie.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Ferramentas de gestão de cookies:</span> Nosso site pode oferecer 
                    uma ferramenta de gestão de cookies que permite a você escolher quais categorias de cookies deseja aceitar.
                  </li>
                  <li className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    <span className="font-medium">Opções de terceiros:</span> Você pode desativar cookies de análise 
                    e publicidade de terceiros através de suas respectivas ferramentas de opt-out, como as oferecidas 
                    pelo Google Analytics.
                  </li>
                </ul>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Observe que restringir cookies pode impactar a funcionalidade do nosso site e sua experiência 
                  como usuário. Cookies estritamente necessários, que são essenciais para o funcionamento do site, 
                  não podem ser desativados.
                </p>
              </div>
              
              {/* Consentimento */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Check className="h-5 w-5 text-primary" />
                  Consentimento
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Ao utilizar nosso site, você consente com o uso de cookies de acordo com esta política. Na sua 
                  primeira visita ao nosso site, você verá um banner informando sobre o uso de cookies e oferecendo 
                  opções para aceitá-los ou personalizá-los.
                </p>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Você pode alterar suas preferências a qualquer momento através da nossa ferramenta de gerenciamento 
                  de cookies ou das configurações do seu navegador.
                </p>
              </div>
              
              {/* Alterações à Política */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2 border-b pb-2 border-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                  Alterações à Política de Cookies
                </h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em nossas práticas 
                  ou por outros motivos operacionais, legais ou regulatórios. Incentivamos você a revisar esta 
                  política regularmente para estar informado sobre como utilizamos cookies.
                </p>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  A data no topo desta página indica quando esta política foi atualizada pela última vez.
                </p>
              </div>
              
              {/* Contato */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'} space-y-4`}>
                <h2 className="text-2xl font-semibold">Entre em Contato</h2>
                <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                  Se você tiver dúvidas sobre esta Política de Cookies ou sobre como gerenciamos informações coletadas 
                  por cookies, entre em contato conosco:
                </p>
                <div className="space-y-2">
                  <p className={`font-medium ${isDark ? 'text-white/90' : 'text-gray-800'}`}>Aqua Vista Monchique</p>
                  <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>Estrada da Foia, 8550-257 Monchique, Algarve, Portugal</p>
                  <p className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>Email: privacy@aquavista-monchique.pt</p>
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