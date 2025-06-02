'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useStripe, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Loader2, Check, Calendar, MapPin, Users, Clock, CreditCard, ArrowRight, X, Mail, Phone, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'

// Carregue a instância do Stripe fora do componente para evitar recarregamentos desnecessários
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Componente de Confetti
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 150 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{
            top: -20,
            left: `${Math.random() * 100}%`,
            opacity: 1,
            scale: Math.random() * 0.6 + 0.4,
          }}
          animate={{
            top: `${Math.random() * 100 + 100}%`,
            left: `${Math.random() * 150 - 25}%`,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 5 + 6,
            ease: "easeOut",
            delay: Math.random() * 2,
          }}
          style={{
            width: `${Math.random() * 12 + 6}px`,
            height: `${Math.random() * 12 + 6}px`,
            backgroundColor: [
              "#FF5252", "#FF4081", "#E040FB", "#7C4DFF", 
              "#536DFE", "#448AFF", "#40C4FF", "#18FFFF", 
              "#64FFDA", "#69F0AE", "#B2FF59", "#EEFF41", 
              "#FFFF00", "#FFD740", "#FFAB40", "#FF6E40"
            ][Math.floor(Math.random() * 16)],
            borderRadius: Math.random() > 0.5 ? "50%" : `${Math.floor(Math.random() * 4 + 1)}px`,
          }}
        />
      ))}
    </div>
  );
}

// Interface para os dados da reserva
interface BookingDetails {
  id?: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomName: string;
  roomImage?: string;
  checkIn: any; // Timestamp do Firestore
  checkOut: any; // Timestamp do Firestore
  adults: number;
  children: number;
  totalPrice: number;
  totalNights: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  paymentMethod?: string;
}

// Componente interno que usa hooks do Stripe
function PaymentStatusChecker() {
  const stripe = useStripe()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const [isLoading, setIsLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'processing' | 'error'>('processing')
  const [error, setError] = useState<string | null>(null)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [reservationNumber, setReservationNumber] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [showConfetti, setShowConfetti] = useState(false)

  // Fix viewport height for mobile to prevent browser UI from hiding
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the viewport height and multiply by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial viewport height
    setViewportHeight();

    // Listen for resize events (orientation change, etc.)
    const handleResize = () => {
      setViewportHeight();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Formatar data
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    }).format(date);
  }
  
  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
  
  // Evita flash de conteúdo não hidratado
  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'
  
  useEffect(() => {
    if (!stripe) {
      return
    }
    
    const clientSecret = searchParams.get('payment_intent_client_secret')
    const bookingId = searchParams.get('booking_id')
    const paymentType = searchParams.get('payment_type') // Identificar o tipo de pagamento
    const sessionId = searchParams.get('session_id') // ID da sessão do Stripe Checkout
    
    // Armazenar o bookingId no localStorage para recuperação futura se necessário
    if (bookingId) {
      localStorage.setItem('last_booking_id', bookingId)
    }
    
    // Se temos um session_id do Stripe Checkout
    if (sessionId) {
      const verifyCheckoutSession = async () => {
        try {
          // Chamada à API para verificar o status da sessão
          const response = await fetch(`/api/payment-success?session_id=${sessionId}`);
          const data = await response.json();
          
          if (data.success) {
            setPaymentStatus('success');
            setShowConfetti(true);
            
            // Se temos detalhes da reserva na resposta
            if (data.booking) {
              setBookingDetails(data.booking);
              setReservationNumber(data.booking.id?.slice(-8).toUpperCase() || '');
              setPaymentMethod(data.booking.paymentMethod || 'card');
            }
          } else if (data.booking) {
            // Se o pagamento ainda está pendente
            setBookingDetails(data.booking);
            setReservationNumber(data.booking.id?.slice(-8).toUpperCase() || '');
            setPaymentMethod(data.booking.paymentMethod || 'card');
            
            // Verificar o status correto do pagamento
            if (data.booking.paymentStatus === 'paid' || data.booking.status === 'confirmed') {
              setPaymentStatus('success');
              setShowConfetti(true);
            } else {
              setPaymentStatus('processing');
            }
          } else {
            setPaymentStatus('error');
            setError(data.message || 'Erro ao verificar pagamento');
          }
        } catch (err) {
          console.error('Erro ao verificar sessão de checkout:', err);
          setPaymentStatus('error');
          setError('Não foi possível verificar o status do pagamento');
        } finally {
          setIsLoading(false);
        }
      };
      
      verifyCheckoutSession();
      return;
    }
    
    if (!clientSecret && !bookingId) {
      // Tentar recuperar o último bookingId do localStorage
      const lastBookingId = localStorage.getItem('last_booking_id')
      
      if (lastBookingId) {
        // Se temos um ID armazenado, carregamos os detalhes diretamente do Firestore
        const fetchBookingDetailsDirectly = async () => {
          try {
            const bookingRef = doc(db, 'bookings', lastBookingId);
            const bookingSnap = await getDoc(bookingRef);
            
            if (bookingSnap.exists()) {
              const bookingData = bookingSnap.data() as BookingDetails;
              
              // Verificar status e definir método de pagamento
              setPaymentMethod(bookingData.paymentMethod || 'card');
              
              // Se o pagamento foi confirmado
              if (bookingData.status === 'confirmed') {
                setPaymentStatus(bookingData.paymentStatus === 'paid' ? 'success' : 'processing')
                setShowConfetti(true)
                setReservationNumber(lastBookingId.slice(-8).toUpperCase());
                setBookingDetails({
                  ...bookingData,
                  id: lastBookingId
                });
              }
            }
          } catch (err) {
            console.error('Erro ao recuperar último booking:', err);
          } finally {
            setIsLoading(false);
          }
        }
        
        fetchBookingDetailsDirectly();
        return;
      }
      
      setError('Parâmetros de pagamento não encontrados')
      setIsLoading(false)
      setPaymentStatus('error')
      return
    }
    
    // Caso não tenhamos o clientSecret (comum em redirecionamentos como iDEAL)
    // mas temos o bookingId, tentamos buscar os detalhes diretamente
    if ((!clientSecret && bookingId) || paymentType) {
      const fetchBookingDetails = async () => {
        try {
          // Garantir que bookingId não é null
          if (!bookingId) {
            throw new Error('ID da reserva não encontrado');
          }
          
          const bookingRef = doc(db, 'bookings', bookingId);
          const bookingSnap = await getDoc(bookingRef);
          
          if (bookingSnap.exists()) {
            const bookingData = bookingSnap.data() as BookingDetails;
            
            setReservationNumber(bookingId.slice(-8).toUpperCase());
            
            // Definir o método de pagamento (garantir que não é null)
            const paymentMethodToSet = bookingData.paymentMethod || 
                                      (paymentType ? String(paymentType) : 'card');
            setPaymentMethod(paymentMethodToSet);
            
            // Para métodos que requerem ação adicional (multibanco, transferência, etc.)
            // consideramos como "processing" mesmo que esteja confirmado
            if (paymentType === 'multibanco' || paymentType === 'bank_transfer' || 
                bookingData.paymentMethod === 'multibanco' || bookingData.paymentMethod === 'bank_transfer') {
              
              // O status está confirmado (bloqueamos as datas), mas pagamento pode estar pendente
              setPaymentStatus(bookingData.paymentStatus === 'paid' ? 'success' : 'processing');
              setShowConfetti(bookingData.status === 'confirmed');
            } 
            // Para outros métodos verificamos normalmente
            else {
              // Verificar status do pagamento no Firestore
              if (bookingData.status === 'confirmed') {
                setPaymentStatus('success')
                setShowConfetti(true)
              } else {
                // Verificar novamente com uma chamada à API
                try {
                  const response = await fetch(`/api/payment-success?booking_id=${bookingId}`);
                  const data = await response.json();
                  
                  if (data.success || (data.booking && data.booking.status === 'confirmed')) {
                    setPaymentStatus('success')
                    setShowConfetti(true)
                  } else {
                    setPaymentStatus('processing')
                  }
                } catch (apiErr) {
                  console.error('Erro ao verificar pagamento via API:', apiErr);
                  // Continuar com os dados do Firestore mesmo que a API falhe
                }
              }
            }
            
            // Definir detalhes da reserva
            setBookingDetails({
              ...bookingData,
              id: bookingId
            });
          } else {
            setPaymentStatus('error')
            setError('Reserva não encontrada')
          }
        } catch (err) {
          console.error('Erro ao buscar detalhes da reserva:', err);
          setPaymentStatus('error')
          setError('Erro ao recuperar dados da reserva')
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchBookingDetails();
      return;
    }
    
    // Se temos o clientSecret, procedemos normalmente com a verificação do Stripe
    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent }) => {
        if (!paymentIntent) {
          setError('Não foi possível recuperar informações do pagamento')
          setIsLoading(false)
          setPaymentStatus('error')
          return
        }
        
        // Definir o método de pagamento utilizado
        if (paymentIntent.payment_method_types && paymentIntent.payment_method_types.length > 0) {
          setPaymentMethod(paymentIntent.payment_method_types[0]);
        }
        
        // Usar os últimos 8 caracteres do ID como número da reserva
        if (bookingId) {
          setReservationNumber(bookingId.slice(-8).toUpperCase());
        }
        
        // Verificar status do pagamento
        switch (paymentIntent.status) {
          case 'succeeded':
            setPaymentStatus('success')
            // Ativar confetti apenas no pagamento com sucesso
            setShowConfetti(true)
            break
          case 'processing':
            setPaymentStatus('processing')
            break
          case 'requires_payment_method':
            setError('O pagamento falhou, por favor tente novamente')
            setPaymentStatus('error')
            break
          default:
            setError('Ocorreu um erro desconhecido')
            setPaymentStatus('error')
            break
        }
        
        // Buscar detalhes da reserva se bookingId estiver disponível
        if (bookingId) {
          try {
            const bookingRef = doc(db, 'bookings', bookingId);
            const bookingSnap = await getDoc(bookingRef);
            
            if (bookingSnap.exists()) {
              const bookingData = bookingSnap.data() as BookingDetails;
              setBookingDetails({
                ...bookingData,
                id: bookingId
              });
            }
          } catch (err) {
            console.error('Erro ao buscar detalhes da reserva:', err);
          }
        }
        
        setIsLoading(false);
      }).catch(err => {
        console.error('Erro ao verificar pagamento:', err);
        setPaymentStatus('error');
        setError('Não foi possível verificar o status do pagamento');
        setIsLoading(false);
      })
    }
  }, [stripe, searchParams])
  
  // Hook para verificar e evitar duplicação de mensagens
  useEffect(() => {
    // Função para verificar se uma mensagem especial precisa ser processada
    const checkForSpecialRequests = async () => {
      if (!bookingDetails || !bookingDetails.id) return;
      
      try {
        const messageKey = `msg_sent_${bookingDetails.id}`;
        const alreadySent = localStorage.getItem(messageKey);
        
        // Se a mensagem já foi enviada, não fazemos nada
        if (alreadySent) {
          console.log('Mensagem já foi enviada anteriormente, ignorando');
          return;
        }
        
        // Se a reserva tem mensagens especiais que precisam ser enviadas
        if (
          bookingDetails.specialRequests && 
          bookingDetails.specialRequests.trim() !== '' &&
          (paymentStatus === 'success' || bookingDetails.status === 'confirmed')
        ) {
          console.log('Reserva tem observações especiais e está confirmada, verificando se já foram enviadas');
          
          // Verificar primeiro se já existe uma mensagem com o mesmo conteúdo
          // Usando apenas o email para evitar problemas de índice
          const messagesQuery = query(
            collection(db, 'contacts'),
            where('email', '==', bookingDetails.guestEmail)
          );
          
          const existingMessages = await getDocs(messagesQuery);
          
          // Verificar manualmente se existe mensagem similar nas últimas 24 horas
          let hasDuplicateMessage = false;
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          
          existingMessages.forEach(doc => {
            const contactData = doc.data();
            // Verificar se a mensagem é similar e recente
            if (contactData.message === bookingDetails.specialRequests && 
                contactData.createdAt && 
                contactData.createdAt.toDate() > oneDayAgo) {
              hasDuplicateMessage = true;
            }
          });
          
          // Se a mensagem não existe ainda, criamos
          if (!hasDuplicateMessage) {
            console.log('Nenhuma mensagem encontrada, criando nova mensagem');
            
            const contactMessage = {
              name: bookingDetails.guestName,
              email: bookingDetails.guestEmail,
              phone: bookingDetails.guestPhone,
              subject: 'Solicitação Especial de Reserva Confirmada',
              message: bookingDetails.specialRequests,
              status: 'new',
              createdAt: serverTimestamp(),
              reservationDetails: {
                checkIn: bookingDetails.checkIn,
                checkOut: bookingDetails.checkOut,
                roomId: bookingDetails.roomId,
                roomName: bookingDetails.roomName,
                totalGuests: bookingDetails.adults + (bookingDetails.children || 0),
                totalPrice: bookingDetails.totalPrice
              }
            };
            
            // Adicionar à coleção contacts
            await addDoc(collection(db, 'contacts'), contactMessage);
            
            // Marcar como enviada no localStorage
            localStorage.setItem(messageKey, 'true');
            console.log('Mensagem de solicitação especial criada na página de sucesso');
          } else {
            console.log('Mensagem já existe na coleção contacts, evitando duplicação');
            localStorage.setItem(messageKey, 'true');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar/processar mensagens especiais:', error);
      }
    };
    
    // Executar a verificação apenas quando os detalhes da reserva estiverem disponíveis
    if (bookingDetails && !isLoading) {
      checkForSpecialRequests();
    }
  }, [bookingDetails, isLoading, paymentStatus]);
  
  // Renderizar informações específicas para cada método de pagamento
  const renderPaymentMethodInfo = () => {
    if (!paymentMethod) return null;
    
    switch (paymentMethod) {
      case 'multibanco':
        // Recuperar dados do Multibanco do localStorage
        const multibancoData = localStorage.getItem('multibancoDetails');
        if (!multibancoData) return null;
        
        try {
          const { entity, reference, amount } = JSON.parse(multibancoData);
          
          return (
            <div className={`my-6 p-4 sm:p-6 rounded-xl shadow-sm border transition-all duration-300 ${
              isDark 
                ? 'bg-[#4F3621]/80 border-[#EED5B9]/20 text-[#EED5B9]' 
                : 'bg-white border-[#4F3621]/20 text-[#4F3621]'
            }`}>
              <h4 className="text-center font-medium mb-4 text-lg">Detalhes do Pagamento Multibanco</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className={`text-sm mb-1 ${
                    isDark 
                      ? 'text-[#EED5B9]/70' 
                      : 'text-[#4F3621]/70'
                  }`}>Entidade:</p>
                  <p className="text-lg font-medium">{entity}</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm mb-1 ${
                    isDark 
                      ? 'text-[#EED5B9]/70' 
                      : 'text-[#4F3621]/70'
                  }`}>Referência:</p>
                  <p className="text-lg font-medium">{reference}</p>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <p className={`text-sm mb-1 ${
                  isDark 
                    ? 'text-[#EED5B9]/70' 
                    : 'text-[#4F3621]/70'
                }`}>Valor:</p>
                <p className="text-xl font-semibold">€{amount?.toFixed(2)}</p>
              </div>
              
              <div className={`pt-4 border-t ${
                isDark 
                  ? 'border-[#EED5B9]/20' 
                  : 'border-[#4F3621]/20'
              }`}>
                <p className={`text-sm text-center ${
                  isDark 
                    ? 'text-[#EED5B9]/70' 
                    : 'text-[#4F3621]/70'
                }`}>
                  Por favor, efetue o pagamento no prazo de 48 horas para garantir sua reserva. 
                  Você pode utilizar qualquer terminal Multibanco ou serviço de homebanking.
                </p>
              </div>
            </div>
          );
        } catch (e) {
          return null;
        }
        
      case 'bank_transfer':
        return (
          <div className={`my-6 p-4 sm:p-6 rounded-xl shadow-sm border transition-all duration-300 ${
            isDark 
              ? 'bg-[#4F3621]/80 border-[#EED5B9]/20 text-[#EED5B9]' 
              : 'bg-white border-[#4F3621]/20 text-[#4F3621]'
          }`}>
            <h4 className="text-center font-medium mb-4 text-lg">Detalhes da Transferência Bancária</h4>
            
            <div className="space-y-3 mb-4">
              <div>
                <p className={`text-sm ${
                  isDark 
                    ? 'text-[#EED5B9]/70' 
                    : 'text-[#4F3621]/70'
                }`}>IBAN:</p>
                <p className="font-medium">PT50XXXX XXXX XXXX XXXX XXXX X</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDark 
                    ? 'text-[#EED5B9]/70' 
                    : 'text-[#4F3621]/70'
                }`}>BIC/SWIFT:</p>
                <p className="font-medium">XXXXXXXX</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDark 
                    ? 'text-[#EED5B9]/70' 
                    : 'text-[#4F3621]/70'
                }`}>Beneficiário:</p>
                <p className="font-medium">Aqua Vista Monchique</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDark 
                    ? 'text-[#EED5B9]/70' 
                    : 'text-[#4F3621]/70'
                }`}>Referência:</p>
                <p className="font-medium">{reservationNumber}</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDark 
                    ? 'text-[#EED5B9]/70' 
                    : 'text-[#4F3621]/70'
                }`}>Valor:</p>
                <p className="text-xl font-semibold">{bookingDetails && 
                  formatPrice(bookingDetails.totalPrice)}</p>
              </div>
            </div>
            
            <div className={`pt-4 border-t ${
              isDark 
                ? 'border-[#EED5B9]/20' 
                : 'border-[#4F3621]/20'
            }`}>
              <p className={`text-sm text-center ${
                isDark 
                  ? 'text-[#EED5B9]/70' 
                  : 'text-[#4F3621]/70'
              }`}>
                Por favor, efetue a transferência no prazo de 48 horas para garantir sua reserva.
                Não se esqueça de incluir o código de referência na descrição da transferência.
              </p>
            </div>
          </div>
        );
        
      case 'ideal':
      case 'paypal':
      case 'klarna':
        if (paymentStatus === 'processing') {
          return (
            <div className={`my-6 p-4 sm:p-6 rounded-xl shadow-sm border transition-all duration-300 ${
              isDark 
                ? 'bg-amber-900/30 border-amber-600/30 text-amber-200' 
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 mr-2" />
                <h4 className="font-medium">Pagamento em Processamento</h4>
              </div>
              <p className="text-sm text-center">
                Seu pagamento via {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} 
                está sendo processado. Isso pode levar alguns instantes.
                Você receberá a confirmação por email quando for concluído.
              </p>
            </div>
          );
        }
        return null;
        
      default:
        return null;
    }
  };
  
  // Versão simplificada
  if (isLoading) {
    return (
      <div className={`min-h-screen-fixed flex items-center justify-center p-4 ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
              isDark 
                ? 'bg-[#EED5B9]/10 border border-[#EED5B9]/20' 
                : 'bg-[#4F3621]/10 border border-[#4F3621]/20'
            }`}>
              <Loader2 className={`h-8 w-8 sm:h-10 sm:w-10 animate-spin ${
                isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
              }`} />
            </div>
          </div>
          <h2 className={`text-xl sm:text-2xl font-semibold mb-2 ${
            isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
          }`}>Verificando Pagamento...</h2>
          <p className={`text-sm sm:text-base ${
            isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
          }`}>Aguarde enquanto confirmamos seu pagamento</p>
        </div>
      </div>
    );
  }
  
  if (paymentStatus === 'error') {
    return (
      <div className={`min-h-screen-fixed flex items-center justify-center p-4 ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <Card className={`w-full max-w-md border-none shadow-xl overflow-hidden ${
          isDark 
            ? 'bg-[#4F3621]/90 text-[#EED5B9] shadow-black/20' 
            : 'bg-white text-[#4F3621] shadow-[#4F3621]/20'
        }`}>
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark 
                  ? 'bg-red-900/30 border border-red-600/30' 
                  : 'bg-red-100 border border-red-200'
              }`}>
                <X className={`h-8 w-8 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`} />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl">Problema no Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-2 pb-6">
            <p className={`mb-6 text-sm sm:text-base ${
              isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
            }`}>
              {error || 'Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button 
              onClick={() => router.push('/booking')}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto ${
                isDark 
                  ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 border-[#EED5B9]/20' 
                  : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 border-[#4F3621]/20'
              }`}
            >
              Tentar Novamente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (paymentStatus === 'processing') {
    return (
      <div className={`min-h-screen-fixed flex items-center justify-center p-4 ${
        isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
      }`}>
        <Card className={`w-full max-w-md border-none shadow-xl overflow-hidden ${
          isDark 
            ? 'bg-[#4F3621]/90 text-[#EED5B9] shadow-black/20' 
            : 'bg-white text-[#4F3621] shadow-[#4F3621]/20'
        }`}>
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark 
                  ? 'bg-amber-900/30 border border-amber-600/30' 
                  : 'bg-amber-100 border border-amber-200'
              }`}>
                <Loader2 className={`h-8 w-8 animate-spin ${
                  isDark ? 'text-amber-400' : 'text-amber-600'
                }`} />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl">Processando Pagamento...</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-2 pb-6">
            <p className={`mb-6 text-sm sm:text-base ${
              isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
            }`}>
              Seu pagamento está sendo processado. Isso pode levar alguns minutos.
              Você receberá um email quando for confirmado.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button 
              onClick={() => router.push('/')}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto ${
                isDark 
                  ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 border-[#EED5B9]/20'
                  : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 border-[#4F3621]/20'
              }`}
            >
              Voltar para a Página Inicial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen-fixed flex items-center justify-center p-4 ${
      isDark ? 'bg-[#4F3621]' : 'bg-[#EED5B9]'
    }`}>
      {showConfetti && <Confetti />}
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className={`border-none shadow-xl overflow-hidden ${
            isDark 
              ? 'bg-[#4F3621]/90 text-[#EED5B9] shadow-black/20' 
              : 'bg-white text-[#4F3621] shadow-[#4F3621]/20'
          }`}>
            <div className="flex flex-col items-center pt-8 sm:pt-10 pb-5">
              <motion.div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-6 sm:mb-8 ${
                  isDark 
                    ? 'bg-[#EED5B9]/10 border border-[#EED5B9]/20' 
                    : 'bg-[#4F3621]/10 border border-[#4F3621]/20'
                }`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Check className={`h-8 w-8 sm:h-10 sm:w-10 ${
                  isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                }`} />
              </motion.div>
              
              <CardTitle className="text-center text-2xl sm:text-3xl mb-4 px-4">
                Reserva Confirmada!
              </CardTitle>
              
              <p className={`text-center max-w-md mx-auto px-4 text-sm sm:text-base ${
                isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
              }`}>
                {paymentStatus === 'success' 
                  ? 'Seu pagamento foi processado com sucesso e sua reserva está garantida.'
                  : 'Sua reserva foi confirmada e os dias de estadia foram bloqueados. Por favor complete o pagamento conforme as instruções abaixo.'}
              </p>
            </div>
            
            <div className={`px-4 sm:px-6 py-6 sm:py-8 ${
              isDark 
                ? 'bg-[#4F3621]/60' 
                : 'bg-[#EED5B9]/30'
            }`}>
              <h3 className="text-center text-lg sm:text-xl font-medium mb-5">Detalhes da Reserva</h3>
              
              <div className="flex flex-col items-center mb-6">
                <div className={`py-3 px-4 sm:px-6 rounded-xl mb-6 shadow-sm border ${
                  isDark 
                    ? 'bg-[#4F3621]/80 border-[#EED5B9]/20' 
                    : 'bg-white border-[#4F3621]/20'
                }`}>
                  <p className={`text-center text-sm mb-1 ${
                    isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                  }`}>Código da Reserva:</p>
                  <p className="text-center text-lg sm:text-xl font-semibold">{reservationNumber}</p>
                </div>
                
                {/* Adicionar informações específicas do método de pagamento */}
                {renderPaymentMethodInfo()}
                
                <div className={`flex items-center justify-center text-xs sm:text-sm mb-6 px-4 text-center ${
                  isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                }`}>
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Um email de confirmação foi enviado para: <span className={`${
                    isDark ? 'text-[#EED5B9]' : 'text-[#4F3621] font-medium'
                  }`}>{bookingDetails?.guestEmail || 'seu email cadastrado'}</span></span>
                </div>
              </div>
              
              <h3 className="text-center text-lg sm:text-xl font-medium mb-5">Próximos Passos</h3>
              
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                    isDark 
                      ? 'bg-[#EED5B9]/10 border border-[#EED5B9]/20' 
                      : 'bg-[#4F3621]/10 border border-[#4F3621]/20'
                  }`}>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                    }`}>1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-sm sm:text-base">Prepare-se para sua estadia</h4>
                    <p className={`text-xs sm:text-sm ${
                      isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                    }`}>Lembre-se de trazer um documento com foto para o check-in</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                    isDark 
                      ? 'bg-[#EED5B9]/10 border border-[#EED5B9]/20' 
                      : 'bg-[#4F3621]/10 border border-[#4F3621]/20'
                  }`}>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                    }`}>2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-sm sm:text-base">Check-in entre 14:00 e 20:00</h4>
                    <p className={`text-xs sm:text-sm ${
                      isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                    }`}>Nossa equipe estará aguardando sua chegada</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                    isDark 
                      ? 'bg-[#EED5B9]/10 border border-[#EED5B9]/20' 
                      : 'bg-[#4F3621]/10 border border-[#4F3621]/20'
                  }`}>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-[#EED5B9]' : 'text-[#4F3621]'
                    }`}>3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 text-sm sm:text-base">Aproveite sua experiência</h4>
                    <p className={`text-xs sm:text-sm ${
                      isDark ? 'text-[#EED5B9]/70' : 'text-[#4F3621]/70'
                    }`}>Desfrute de todos os nossos serviços exclusivos</p>
                  </div>
                </div>
              </div>
            </div>
            
            <CardFooter className={`flex justify-center py-4 sm:py-6 ${
              isDark 
                ? 'bg-[#4F3621]/90' 
                : 'bg-white'
            }`}>
              <Button 
                onClick={() => router.push('/')}
                className={`w-full mx-4 sm:mx-6 py-2 sm:py-3 text-sm sm:text-base font-medium border shadow-md rounded-full transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? 'bg-[#EED5B9] text-[#4F3621] hover:bg-[#EED5B9]/90 border-[#EED5B9]/20'
                    : 'bg-[#4F3621] text-[#EED5B9] hover:bg-[#4F3621]/90 border-[#4F3621]/20'
                }`}
              >
                Retornar à Página Inicial
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Componente principal que envolve o componente interno com o provedor Elements
export default function PaymentSuccessPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStatusChecker />
    </Elements>
  )
} 