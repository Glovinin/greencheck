"use client"

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function CTASection({
  title = "Pronto para relaxar nas alturas?",
  subtitle = "Reserve sua estadia agora e garanta momentos inesquecíveis com tarifas especiais em nosso refúgio na serra.",
  buttonText = "Reservar Agora",
  buttonLink = "/booking",
  secondaryButtonText = "Ver Disponibilidade",
  secondaryButtonLink = "/rooms"
}: CTASectionProps) {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const handlePrimaryAction = () => {
    router.push(buttonLink)
  }
  
  const handleSecondaryAction = () => {
    router.push(secondaryButtonLink)
  }
  
  return (
    <section className={`py-24 relative overflow-hidden ${
      isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
    }`}>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          className={`backdrop-blur-sm rounded-3xl p-10 md:p-16 border shadow-2xl overflow-hidden group hover:scale-[1.02] transform transition-all duration-500 ${
            isDark 
              ? 'bg-gradient-to-br from-[#4F3621]/80 to-[#4F3621]/60 border-[#EED5B9]/10' 
              : 'bg-gradient-to-br from-white/90 to-white/70 border-[#4F3621]/20'
          }`}
        >
          <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 ${
            isDark ? 'bg-primary/10' : 'bg-primary/5'
          }`} />
          <div className={`absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 ${
            isDark ? 'bg-primary/10' : 'bg-primary/5'
          }`} />
          
          <div className="relative z-10 text-center md:text-left md:flex items-center justify-between">
            <div className="md:max-w-xl mb-8 md:mb-0">
              <h2 
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                }`}
              >
                {title}
              </h2>
              <p 
                className={`text-lg mb-6 ${
                  isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                }`}
              >
                {subtitle}
              </p>
              <ul 
                className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8"
              >
                <li className={`flex items-center text-sm ${
                  isDark ? 'text-[#EED5B9]/80 group/item' : 'text-[#4F3621]/80 group/item'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-primary/20 group-hover/item:bg-primary/30' 
                      : 'bg-primary/10 group-hover/item:bg-primary/20'
                  }`}>
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'group-hover/item:text-[#EED5B9]' : 'group-hover/item:text-[#4F3621]'
                  }`}>Cancelamento gratuito</span>
                </li>
                <li className={`flex items-center text-sm ${
                  isDark ? 'text-[#EED5B9]/80 group/item' : 'text-[#4F3621]/80 group/item'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-primary/20 group-hover/item:bg-primary/30' 
                      : 'bg-primary/10 group-hover/item:bg-primary/20'
                  }`}>
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'group-hover/item:text-[#EED5B9]' : 'group-hover/item:text-[#4F3621]'
                  }`}>Café da manhã incluso</span>
                </li>
                <li className={`flex items-center text-sm ${
                  isDark ? 'text-[#EED5B9]/80 group/item' : 'text-[#4F3621]/80 group/item'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-primary/20 group-hover/item:bg-primary/30' 
                      : 'bg-primary/10 group-hover/item:bg-primary/20'
                  }`}>
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'group-hover/item:text-[#EED5B9]' : 'group-hover/item:text-[#4F3621]'
                  }`}>Experiências exclusivas</span>
                </li>
              </ul>
            </div>
            
            <div 
              className="flex flex-col sm:flex-row md:flex-col gap-4"
            >
              <Button 
                size="lg" 
                onClick={handlePrimaryAction}
                className={`rounded-full transition-all duration-300 h-14 min-w-[200px] shadow-lg hover:scale-105 ${
                  isDark
                    ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 shadow-[#EED5B9]/20 hover:shadow-[#EED5B9]/30' 
                    : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 shadow-[#4F3621]/20 hover:shadow-[#4F3621]/30'
                }`}
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleSecondaryAction}
                className={`rounded-full transition-all duration-300 h-14 min-w-[200px] hover:scale-105 ${
                  isDark 
                    ? 'border-[#EED5B9]/20 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/40' 
                    : 'border-[#4F3621]/30 text-[#4F3621] hover:bg-[#4F3621]/10 hover:border-[#4F3621]/50'
                }`}
              >
                {secondaryButtonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CTABookingSection() {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const handleContato = () => {
    router.push('/contato')
  }
  
  const handleVerGaleria = () => {
    router.push('/gallery')
  }
  
  return (
    <section className={`py-24 relative overflow-hidden ${
      isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
    }`}>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          className={`backdrop-blur-sm rounded-3xl p-10 md:p-16 border shadow-2xl overflow-hidden group hover:scale-[1.02] transform transition-all duration-500 ${
            isDark 
              ? 'bg-gradient-to-br from-[#4F3621]/80 to-[#4F3621]/60 border-[#EED5B9]/10' 
              : 'bg-gradient-to-br from-white/90 to-white/70 border-[#4F3621]/20'
          }`}
        >
          <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 ${
            isDark ? 'bg-primary/10' : 'bg-primary/5'
          }`} />
          <div className={`absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 ${
            isDark ? 'bg-primary/10' : 'bg-primary/5'
          }`} />
          
          <div className="relative z-10 text-center md:text-left md:flex items-center justify-between">
            <div className="md:max-w-xl mb-8 md:mb-0">
              <h2 
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                }`}
              >
                Precisa de mais informações?
              </h2>
              <p 
                className={`text-lg mb-6 ${
                  isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                }`}
              >
                Entre em contato com nossa equipe para esclarecer dúvidas ou solicitar serviços adicionais para sua estadia.
              </p>
              <ul 
                className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8"
              >
                <li className={`flex items-center text-sm ${
                  isDark ? 'text-[#EED5B9]/80 group/item' : 'text-[#4F3621]/80 group/item'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-primary/20 group-hover/item:bg-primary/30' 
                      : 'bg-primary/10 group-hover/item:bg-primary/20'
                  }`}>
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'group-hover/item:text-[#EED5B9]' : 'group-hover/item:text-[#4F3621]'
                  }`}>Suporte personalizado</span>
                </li>
                <li className={`flex items-center text-sm ${
                  isDark ? 'text-[#EED5B9]/80 group/item' : 'text-[#4F3621]/80 group/item'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-primary/20 group-hover/item:bg-primary/30' 
                      : 'bg-primary/10 group-hover/item:bg-primary/20'
                  }`}>
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'group-hover/item:text-[#EED5B9]' : 'group-hover/item:text-[#4F3621]'
                  }`}>Serviços exclusivos</span>
                </li>
                <li className={`flex items-center text-sm ${
                  isDark ? 'text-[#EED5B9]/80 group/item' : 'text-[#4F3621]/80 group/item'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-primary/20 group-hover/item:bg-primary/30' 
                      : 'bg-primary/10 group-hover/item:bg-primary/20'
                  }`}>
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'group-hover/item:text-[#EED5B9]' : 'group-hover/item:text-[#4F3621]'
                  }`}>Atendimento rápido</span>
                </li>
              </ul>
            </div>
            
            <div 
              className="flex flex-col sm:flex-row md:flex-col gap-4"
            >
              <Button 
                size="lg" 
                onClick={handleContato}
                className={`rounded-full transition-all duration-300 h-14 min-w-[200px] shadow-lg hover:scale-105 ${
                  isDark
                    ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 shadow-[#EED5B9]/20 hover:shadow-[#EED5B9]/30' 
                    : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 shadow-[#4F3621]/20 hover:shadow-[#4F3621]/30'
                }`}
              >
                Fale Conosco
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleVerGaleria}
                className={`rounded-full transition-all duration-300 h-14 min-w-[200px] hover:scale-105 ${
                  isDark 
                    ? 'border-[#EED5B9]/20 text-[#EED5B9] hover:bg-[#EED5B9]/10 hover:border-[#EED5B9]/40' 
                    : 'border-[#4F3621]/30 text-[#4F3621] hover:bg-[#4F3621]/10 hover:border-[#4F3621]/50'
                }`}
              >
                Ver Galeria
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 