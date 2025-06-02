'use client'

import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  CreditCard,
  XCircle,
  RefreshCw,
  Loader2,
  Building,
  Building2,
  Check,
  ArrowLeft,
  Wallet,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CheckoutButton } from './CheckoutButton'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRoomById, getRoomBookings, getDatesInRange } from '@/lib/firebase/firestore'
import { formatCurrency, calcStayDays } from "@/lib/utils"
import { getIconNameForAmenity } from "@/lib/functions"

// Dicionário para traduzir mensagens de erro comuns do Stripe
const errorMessages: Record<string, string> = {
  'Your card number is incomplete.': 'O número do cartão está incompleto.',
  'Your card number is invalid.': 'O número do cartão é inválido.',
  'Your card\'s expiration date is incomplete.': 'A data de expiração está incompleta.',
  'Your card\'s expiration date is invalid.': 'A data de expiração é inválida.',
  'Your card\'s security code is incomplete.': 'O código de segurança está incompleto.',
  'Your card\'s security code is invalid.': 'O código de segurança é inválido.',
  'Your card was declined.': 'O cartão foi recusado.',
  'Your card has expired.': 'O cartão está expirado.',
  'Je kaartnummer is onvolledig.': 'O número do cartão está incompleto.',
  'Je kaartnummer is ongeldig.': 'O número do cartão é inválido.',
}

// Traduzir mensagens de erro
const translateErrorMessage = (message: string): string => {
  return errorMessages[message] || message;
}

// Tipos de métodos de pagamento
type PaymentMethod = 
  | 'card' 
  | 'wallet' 
  | 'bank_transfer' 
  | 'paypal' 
  | 'klarna' 
  | 'multibanco' 
  | 'ideal' 
  | 'bancontact'
  | 'apple_pay'
  | 'google_pay';

// Definição de opções de pagamento
interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: React.ReactNode;
  description: string;
}

type PaymentFormProps = {
  amount: number
  bookingId: string
  description: string
  customerName: string
  customerEmail: string
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  serviceFee?: number // Taxa de serviço em porcentagem (opcional)
}

export default function PaymentForm({ 
  amount, 
  bookingId, 
  description, 
  customerName, 
  customerEmail,
  onPaymentSuccess,
  onPaymentError,
  serviceFee
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')
  const [paymentRequest, setPaymentRequest] = useState(null)
  
  // Opções de pagamento disponíveis
  const paymentOptions: PaymentOption[] = [
    {
      id: 'card',
      name: 'Cartão de Crédito/Débito',
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      description: 'Pague com Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <div className="h-5 w-5 flex items-center justify-center text-primary font-bold">P</div>,
      description: 'Pague com sua conta PayPal'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: <div className="h-5 w-5 flex items-center justify-center text-primary font-bold">A</div>,
      description: 'Pagamento rápido e seguro via Apple Pay'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: <div className="h-5 w-5 flex items-center justify-center text-primary font-bold">G</div>,
      description: 'Pagamento rápido e seguro via Google Pay'
    },
    {
      id: 'bank_transfer',
      name: 'Transferência Bancária',
      icon: <Building className="h-5 w-5 text-primary" />,
      description: 'Transferência entre contas bancárias'
    },
    {
      id: 'klarna',
      name: 'Klarna',
      icon: <div className="h-5 w-5 flex items-center justify-center text-primary font-bold">K</div>,
      description: 'Pague agora, depois ou parcelado'
    },
    {
      id: 'multibanco',
      name: 'Multibanco',
      icon: <Building2 className="h-5 w-5 text-primary" />,
      description: 'Referência para pagamento em Portugal'
    },
    {
      id: 'ideal',
      name: 'iDEAL',
      icon: <div className="h-5 w-5 flex items-center justify-center text-primary font-bold">i</div>,
      description: 'Pagamento online direto via banco (Holanda)'
    }
  ];
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Função para criar o payment intent com o método de pagamento selecionado
  const createPaymentIntent = async () => {
    // Limitar número de tentativas para evitar spam de requisições
    if (retryCount > 3) {
      setErrorMessage('Número máximo de tentativas excedido. Por favor, volte e tente uma nova reserva.');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Log detalhado para debug
      console.log(`Criando PaymentIntent para método: ${selectedMethod}, valor: ${amount}€, bookingId: ${bookingId}`);
      
      // Verificar se temos todos os dados necessários
      if (!amount || amount <= 0 || !bookingId) {
        const errorMsg = 'Dados incompletos para criação do PaymentIntent';
        console.error(`${errorMsg} - amount: ${amount}, bookingId: ${bookingId}`);
        setErrorMessage(errorMsg);
        onPaymentError(errorMsg);
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          bookingId,
          email: customerEmail,
          paymentMethod: selectedMethod // Garantir que estamos usando o método atual
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.clientSecret) {
        console.log(`PaymentIntent criado com sucesso para o método: ${selectedMethod}, clientSecret obtido`);
        setClientSecret(data.clientSecret);
      } else {
        const errorMsg = data.error || 'Erro ao iniciar o pagamento';
        console.error(`Erro ao criar PaymentIntent: ${errorMsg}`);
        setErrorMessage(errorMsg);
        onPaymentError(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = 'Erro ao conectar com servidor de pagamento. Tente novamente.';
      console.error(`Erro ao criar PaymentIntent: ${error?.message || 'Erro desconhecido'}`);
      setErrorMessage(errorMsg);
      onPaymentError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Criar payment intent quando o componente montar
  useEffect(() => {
    if (amount > 0 && bookingId && mounted) {
      console.log(`Iniciando criação de PaymentIntent inicial: ${selectedMethod}, amount: ${amount}, bookingId: ${bookingId}`);
      createPaymentIntent();
    }
  }, [amount, bookingId, mounted]);
  
  // Função para tentar novamente
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    // Voltar para a página de reserva ao invés de tentar criar um novo payment intent,
    // já que o bookingId provavelmente foi removido no backend após a falha
    if (retryCount >= 1) {
      window.history.back();
    } else {
      createPaymentIntent();
    }
  };
  
  // Handler de alteração de método de pagamento
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    if (method !== selectedMethod) {
      console.log(`Alterando método de pagamento: ${selectedMethod} -> ${method}`);
      
      // Limpar o client secret existente imediatamente para evitar uso incorreto
      setClientSecret(null);
      
      // Limpar quaisquer mensagens de erro
      setErrorMessage(null);
      
      // Atualizar o método
      setSelectedMethod(method);
      
      // Forçar a recriação do Payment Intent para o novo método
      if (amount > 0 && bookingId) {
        console.log(`Solicitando novo PaymentIntent para ${method} com valor ${amount} e bookingId ${bookingId}`);
        
        // Permitir que o estado seja atualizado primeiro
        setTimeout(() => {
          // Para métodos que precisam de PaymentIntent específico
          // vamos deixar as funções de handler específicas lidarem com a criação
          const specialMethods = ['ideal', 'klarna', 'paypal', 'multibanco'];
          
          if (!specialMethods.includes(method)) {
            createPaymentIntent();
          }
        }, 100);
      } else {
        console.error(`Erro: não é possível criar PaymentIntent - amount: ${amount}, bookingId: ${bookingId}`);
        toast.error("Erro ao configurar pagamento. Tente novamente.");
      }
      
      // Informar o usuário
      toast.info(`Alterando para pagamento via ${method}`);
    }
  }
  
  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!stripe) {
      console.error("Stripe não foi inicializado");
      toast.error("Erro ao inicializar o sistema de pagamento. Tente novamente mais tarde.");
      return;
    }
    
    console.log(`Iniciando pagamento com método: ${selectedMethod}`);
    setIsProcessing(true);

    try {
      // Redirecionamos todos os métodos de pagamento para o Stripe Checkout
      const methodsToCheckout = ['card', 'multibanco', 'wallet', 'apple_pay', 'google_pay', 'ideal', 'paypal', 'klarna'];
      
      if (methodsToCheckout.includes(selectedMethod)) {
        await handleStripeCheckout(selectedMethod);
      } 
      else if (selectedMethod === 'bank_transfer') {
        try {
          // Para transferência bancária, vamos criar uma chamada direta para atualizar o status
          // já que não há um fluxo padrão do Stripe para este método
          
          try {
            // Chamar API para atualizar o status da reserva mesmo sem confirmação pelo Stripe
            const updateResponse = await fetch(`/api/payment-success?booking_id=${bookingId}&manual_payment=true`);
            const updateResult = await updateResponse.json();
            
            if (updateResult.success) {
              console.log("Atualização do status de reserva (Transferência Bancária):", updateResult);
              
              // Notificar o componente pai
              onPaymentSuccess(bookingId);
              
              // Log detalhado
              console.log(`Datas de estadia agora bloqueadas para a reserva ${bookingId}`);
              
              // Redirecionar para a página de confirmação
              window.location.href = `${window.location.origin}/booking/success?payment_type=bank_transfer`;
            } else {
              console.error("Erro na resposta da API de atualização:", updateResult);
              toast.error("Houve um problema ao confirmar sua reserva. Por favor, contate o suporte.");
            }
          } catch (err) {
            console.error("Erro ao atualizar status da reserva (Transferência Bancária):", err);
            toast.error("Não foi possível atualizar o status da sua reserva. Entre em contato com o suporte.");
          }
        } catch (err: any) {
          console.error("Erro ao processar pagamento por transferência bancária:", err);
          toast.error(`Erro no pagamento: ${err.message || "Ocorreu um erro ao processar o pagamento."}`);
          onPaymentError(err.message || "Ocorreu um erro ao processar o pagamento por transferência bancária.");
        }
      } else {
        toast.error("Método de pagamento não suportado");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Erro ao processar pagamento:", err);
      toast.error(`Erro no pagamento: ${err.message || "Ocorreu um erro ao processar o pagamento."}`);
      onPaymentError(err.message || "Ocorreu um erro ao processar o pagamento.");
      setIsProcessing(false);
    }
  };
  
  // Função especial para pagamentos Klarna
  const handleKlarnaPayment = async () => {
    if (!stripe) {
      toast.error("Sistema de pagamento não inicializado. Tente novamente.");
      return;
    }
    
    setIsProcessing(true);
    console.log("Tentando iniciar pagamento Klarna especial");
    
    try {
      // Forçar recriação do PaymentIntent específico para Klarna
      setClientSecret(null);
      
      // Chamar API diretamente para criar PaymentIntent específico para Klarna
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          bookingId,
          email: customerEmail,
          paymentMethod: 'klarna'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.clientSecret) {
        console.log("PaymentIntent específico para Klarna criado com sucesso!");
        
        // Iniciar redirecionamento
        const result = await stripe.confirmKlarnaPayment(data.clientSecret, {
          return_url: `${window.location.origin}/booking/success`,
        });
        
        // Se chegou aqui, não houve redirecionamento automático
        if (result.error) {
          console.error("Erro ao confirmar pagamento Klarna:", result.error);
          toast.error(`Erro: ${result.error.message || "Falha ao iniciar pagamento Klarna."}`);
        }
      } else {
        console.error("Erro ao criar PaymentIntent para Klarna:", data.error);
        toast.error("Não foi possível iniciar o pagamento Klarna. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Erro ao processar pagamento Klarna:", err);
      toast.error(`Erro: ${err.message || "Ocorreu um erro ao processar o pagamento."}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Função especial para pagamentos iDEAL
  const handleIdealPayment = async () => {
    if (!stripe) {
      toast.error("Sistema de pagamento não inicializado. Tente novamente.");
      return;
    }
    
    setIsProcessing(true);
    console.log("Tentando iniciar pagamento iDEAL especial");
    
    try {
      // Forçar recriação do PaymentIntent específico para iDEAL
      setClientSecret(null);
      
      // Chamar API diretamente para criar PaymentIntent específico para iDEAL
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          bookingId,
          email: customerEmail,
          paymentMethod: 'ideal'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.clientSecret) {
        console.log("PaymentIntent específico para iDEAL criado com sucesso!");
        
        // Iniciar redirecionamento
        const result = await stripe.confirmIdealPayment(data.clientSecret, {
          payment_method: {
            ideal: { bank: 'ing' },
            billing_details: {
              name: customerName,
              email: customerEmail,
            }
          },
          return_url: `${window.location.origin}/booking/success`,
        });
        
        // Se chegou aqui, não houve redirecionamento automático
        if (result.error) {
          console.error("Erro ao confirmar pagamento iDEAL:", result.error);
          toast.error(`Erro: ${result.error.message || "Falha ao iniciar pagamento iDEAL."}`);
        }
      } else {
        console.error("Erro ao criar PaymentIntent para iDEAL:", data.error);
        toast.error("Não foi possível iniciar o pagamento iDEAL. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Erro ao processar pagamento iDEAL:", err);
      toast.error(`Erro: ${err.message || "Ocorreu um erro ao processar o pagamento."}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Função especial para pagamentos PayPal
  const handlePayPalPayment = async () => {
    if (!stripe) {
      toast.error("Sistema de pagamento não inicializado. Tente novamente.");
      return;
    }
    
    setIsProcessing(true);
    console.log("Tentando iniciar pagamento PayPal especial");
    
    try {
      // Forçar recriação do PaymentIntent específico para PayPal
      setClientSecret(null);
      
      // Chamar API diretamente para criar PaymentIntent específico para PayPal
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          bookingId,
          email: customerEmail,
          paymentMethod: 'paypal'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.clientSecret) {
        console.log("PaymentIntent específico para PayPal criado com sucesso!");
        
        // Iniciar redirecionamento
        const result = await stripe.confirmPayPalPayment(data.clientSecret, {
          return_url: `${window.location.origin}/booking/success`,
        });
        
        // Se chegou aqui, não houve redirecionamento automático
        if (result.error) {
          console.error("Erro ao confirmar pagamento PayPal:", result.error);
          toast.error(`Erro: ${result.error.message || "Falha ao iniciar pagamento PayPal."}`);
        }
      } else {
        console.error("Erro ao criar PaymentIntent para PayPal:", data.error);
        toast.error("Não foi possível iniciar o pagamento PayPal. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Erro ao processar pagamento PayPal:", err);
      toast.error(`Erro: ${err.message || "Ocorreu um erro ao processar o pagamento."}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Função especial para pagamentos Multibanco
  const handleMultibancoPayment = async () => {
    if (!stripe) {
      toast.error("Sistema de pagamento não inicializado. Tente novamente.");
      return;
    }
    
    setIsProcessing(true);
    console.log("Tentando iniciar pagamento Multibanco especial");
    
    try {
      // Forçar recriação do PaymentIntent específico para Multibanco
      setClientSecret(null);
      
      // Chamar API diretamente para criar PaymentIntent específico para Multibanco
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          bookingId,
          email: customerEmail,
          paymentMethod: 'multibanco'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.clientSecret) {
        console.log("PaymentIntent específico para Multibanco criado com sucesso!");
        
        // Confirmar o pagamento Multibanco
        const { error, paymentIntent } = await stripe.confirmMultibancoPayment(data.clientSecret, {
          payment_method: {
            billing_details: {
              name: customerName,
              email: customerEmail,
            },
          },
          return_url: `${window.location.origin}/booking/success`,
        });

        if (error) {
          console.error("Erro ao confirmar pagamento Multibanco:", error);
          toast.error(`Erro: ${error.message || "Falha ao gerar referência Multibanco."}`);
        } else if (paymentIntent) {
          // Exibe as informações do Multibanco
          const nextAction = paymentIntent.next_action as any;
          const multibancoDetails = nextAction?.multibanco_display_details;
          
          if (multibancoDetails) {
            try {
              // Chamar API para atualizar o status da reserva
              const updateResponse = await fetch(`/api/payment-success?payment_intent=${paymentIntent.id}&booking_id=${bookingId}`);
              const updateResult = await updateResponse.json();
              
              if (updateResult.success) {
                console.log("Atualização do status de reserva (Multibanco):", updateResult);
                
                // Notificar o componente pai
                onPaymentSuccess(paymentIntent.id);
                
                // Armazenar detalhes para exibição
                localStorage.setItem('multibancoDetails', JSON.stringify({
                  reference: multibancoDetails.reference,
                  entity: multibancoDetails.entity,
                  amount: paymentIntent.amount / 100,
                  createdAt: new Date().toISOString(),
                }));
                
                // Redirecionar para página de sucesso
                window.location.href = `${window.location.origin}/booking/success?payment_type=multibanco`;
              } else {
                console.error("Erro na resposta da API de atualização:", updateResult);
                toast.error("Houve um problema ao confirmar sua reserva. Por favor, contate o suporte.");
              }
            } catch (err) {
              console.error("Erro ao atualizar status da reserva (Multibanco):", err);
              toast.error("Não foi possível atualizar o status da sua reserva. Entre em contato com o suporte.");
            }
          } else {
            toast.error("Não foi possível obter os detalhes do Multibanco.");
          }
        }
      } else {
        console.error("Erro ao criar PaymentIntent para Multibanco:", data.error);
        toast.error("Não foi possível iniciar o pagamento Multibanco. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Erro ao processar pagamento Multibanco:", err);
      toast.error(`Erro: ${err.message || "Ocorreu um erro ao processar o pagamento."}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Adicionar uma nova função para redirecionamento para o Stripe Checkout
  const handleStripeCheckout = async (selectedPaymentMethod: PaymentMethod) => {
    try {
      setIsProcessing(true);
      console.log(`Redirecionando para Stripe Checkout com método: ${selectedPaymentMethod}`);
      
      // Armazenar informações sobre o último método selecionado para referência futura
      localStorage.setItem('last_payment_method', selectedPaymentMethod);
      
      // Se temos um bookingId, armazená-lo para recuperação na página de sucesso
      if (bookingId) {
        localStorage.setItem('last_booking_id', bookingId);
        localStorage.setItem('payment_timestamp', new Date().toISOString());
      }
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          bookingId,
          email: customerEmail,
          customerName,
          paymentMethod: selectedPaymentMethod
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.sessionUrl) {
        console.log("Checkout Session criada com sucesso, redirecionando...");
        // Armazenar o ID da sessão para recuperação na página de sucesso
        if (data.sessionId) {
          localStorage.setItem('last_session_id', data.sessionId);
        }
        
        // Redirecionar para o Checkout do Stripe
        window.location.href = data.sessionUrl;
      } else {
        const errorMsg = data.error || 'Erro ao iniciar o checkout';
        console.error(`Erro ao criar Checkout Session: ${errorMsg}`);
        setErrorMessage(errorMsg);
        onPaymentError(errorMsg);
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Erro ao redirecionar para Stripe Checkout:", error);
      toast.error("Erro ao iniciar o checkout. Tente novamente.");
      setIsProcessing(false);
    }
  };
  
  const renderPaymentMethodForm = () => {
    const isDark = theme === 'dark';
    
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-6">
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5 flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image src="/assets/payment-icons/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                <Image src="/assets/payment-icons/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                <Image src="/assets/payment-icons/amex.svg" alt="American Express" width={40} height={25} className="h-6 w-auto" />
                <Image src="/assets/payment-icons/maestro.svg" alt="Maestro" width={40} height={25} className="h-6 w-auto" />
              </div>
              <p className="text-sm">
                Você será redirecionado para uma página segura do Stripe para inserir os dados do seu cartão de crédito/débito.
              </p>
            </div>

            {/* Botão de pagamento */}
            <CheckoutButton 
              onCheckout={() => handleStripeCheckout('card')}
              isProcessing={isProcessing}
              label="Pagar com Cartão de Crédito"
              processingLabel="Processando pagamento..."
              disabled={!stripe}
              className="mt-4"
            />
          </div>
        );
      case 'wallet':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Escolha uma carteira digital para pagamento.</p>
            <div className="space-y-4">
              <div 
                className="p-4 rounded-md border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedMethod('apple_pay')}
              >
                <div className="flex items-center justify-center gap-4 mb-2">
                  <Image src="/assets/payment-icons/applepay.svg" alt="Apple Pay" width={60} height={40} className="h-8 w-auto" />
                </div>
                <p className="text-sm">
                  Pague de forma rápida e segura usando dispositivos Apple
                </p>
              </div>
              
              <div 
                className="p-4 rounded-md border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => setSelectedMethod('google_pay')}
              >
                <div className="flex items-center justify-center gap-4 mb-2">
                  <Image src="/assets/payment-icons/googlepay.svg" alt="Google Pay" width={60} height={40} className="h-8 w-auto" />
                </div>
                <p className="text-sm">
                  Pague de forma rápida e segura usando sua conta Google
                </p>
              </div>
            </div>
          </div>
        );
      case 'paypal':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Você será redirecionado para o PayPal para concluir seu pagamento.</p>
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5 flex flex-col items-center">
              <Image src="/assets/payment-icons/paypal.svg" alt="PayPal" width={100} height={40} className="h-10 w-auto mb-3" />
              <p className="text-sm">
                O PayPal é uma forma segura e rápida de pagar online sem compartilhar seus dados financeiros.
              </p>
            </div>
            <CheckoutButton 
              onCheckout={() => handleStripeCheckout('paypal')}
              isProcessing={isProcessing}
              label="Continuar para PayPal"
              processingLabel="Redirecionando..."
              className="mt-2 w-full"
            />
          </div>
        );
      case 'klarna':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Você será redirecionado para o Klarna para concluir seu pagamento.</p>
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5 flex flex-col items-center">
              <Image src="/assets/payment-icons/klarna.svg" alt="Klarna" width={100} height={40} className="h-10 w-auto mb-3" />
              <p className="text-sm">
                Com o Klarna você pode pagar agora, pagar depois ou parcelar sua compra.
              </p>
            </div>
            <CheckoutButton 
              onCheckout={() => handleStripeCheckout('klarna')}
              isProcessing={isProcessing}
              label="Continuar para Klarna"
              processingLabel="Redirecionando..."
              className="mt-2 w-full"
            />
          </div>
        );
      case 'multibanco':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Você receberá uma referência Multibanco para pagamento.</p>
            
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5">
              <div className="flex items-center justify-center mb-4">
                <Image src="/assets/payment-icons/multibanco.svg" alt="Multibanco" width={100} height={40} className="h-10 w-auto" />
              </div>
              <p className="text-sm">
                O pagamento por Multibanco permite que você pague usando uma referência em qualquer terminal Multibanco em Portugal ou através do seu home banking.
              </p>
            </div>
            
            <CheckoutButton 
              onCheckout={() => handleStripeCheckout('multibanco')}
              isProcessing={isProcessing}
              label="Continuar para Multibanco"
              processingLabel="Redirecionando..."
              className="mt-4 w-full"
            />
          </div>
        );
      case 'ideal':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Você será redirecionado para o iDEAL para concluir seu pagamento.</p>
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5 flex flex-col items-center">
              <Image src="/assets/payment-icons/ideal.svg" alt="iDEAL" width={100} height={40} className="h-10 w-auto mb-3" />
              <p className="text-sm">
                O iDEAL é um método de pagamento online popular na Holanda que permite transferências bancárias diretas.
              </p>
            </div>
            <CheckoutButton 
              onCheckout={() => handleStripeCheckout('ideal')}
              isProcessing={isProcessing}
              label="Continuar para iDEAL"
              processingLabel="Redirecionando..."
              className="mt-2 w-full"
            />
          </div>
        );
      case 'apple_pay':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Você será redirecionado para finalizar seu pagamento com Apple Pay.</p>
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5 flex flex-col items-center">
              <Image src="/assets/payment-icons/applepay.svg" alt="Apple Pay" width={100} height={40} className="h-10 w-auto mb-3" />
              <p className="text-sm">
                Apple Pay permite que você faça pagamentos de forma rápida e segura usando dispositivos Apple.
              </p>
            </div>
            <CheckoutButton 
              onCheckout={() => handleStripeCheckout('apple_pay')}
              isProcessing={isProcessing}
              label="Continuar para Apple Pay"
              processingLabel="Redirecionando..."
              className="mt-2 w-full"
            />
          </div>
        );
      case 'google_pay':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Você será redirecionado para finalizar seu pagamento com Google Pay.</p>
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5 flex flex-col items-center">
              <Image src="/assets/payment-icons/googlepay.svg" alt="Google Pay" width={100} height={40} className="h-10 w-auto mb-3" />
              <p className="text-sm">
                Google Pay permite que você faça pagamentos de forma rápida e segura usando sua conta Google.
              </p>
            </div>
            <CheckoutButton 
              onCheckout={() => handleStripeCheckout('google_pay')}
              isProcessing={isProcessing}
              label="Continuar para Google Pay"
              processingLabel="Redirecionando..."
              className="mt-2 w-full"
            />
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="text-center p-4">
            <p className="mb-4">Confirme a reserva para receber os dados de transferência bancária.</p>
            
            <div className="p-4 mb-4 rounded-md border border-primary/20 bg-primary/5">
              <div className="flex items-center justify-center mb-4">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <p className="text-md font-medium mb-2">Transferência Bancária</p>
              <p className="text-sm">
                Após confirmar, você receberá os dados bancários para completar a transferência.
                A reserva será confirmada após a verificação do pagamento.
              </p>
            </div>
            
            <Button 
              onClick={() => handleSubmit()} 
              disabled={isProcessing}
              className="w-full mt-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Reserva'
              )}
            </Button>
          </div>
        );
      default:
        return <p>Método de pagamento não disponível</p>;
    }
  };
  
  if (!mounted) return null;
  
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className={`overflow-hidden shadow-2xl border-none ${
        isDark 
          ? 'bg-black/60' 
          : 'bg-white/80'
        } backdrop-blur-lg relative`}
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-70 pointer-events-none" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] opacity-50 pointer-events-none" />
        
        <CardHeader className={`border-b ${isDark ? 'border-white/5' : 'border-gray-200/50'} pb-6 relative z-10`}>
          <CardTitle className="flex items-center text-xl md:text-2xl">
            <CreditCard className="mr-2 h-5 w-5 md:h-6 md:w-6 text-primary" />
            Informações de Pagamento
          </CardTitle>
          
          {/* Banner de métodos de pagamento disponíveis */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Image src="/assets/payment-icons/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
            <Image src="/assets/payment-icons/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
            <Image src="/assets/payment-icons/amex.svg" alt="American Express" width={40} height={25} className="h-6 w-auto" />
            <Image src="/assets/payment-icons/paypal.svg" alt="PayPal" width={40} height={25} className="h-6 w-auto" />
            <Image src="/assets/payment-icons/multibanco.svg" alt="Multibanco" width={40} height={25} className="h-6 w-auto" />
            <Image src="/assets/payment-icons/ideal.svg" alt="iDEAL" width={40} height={25} className="h-6 w-auto" />
            <Image src="/assets/payment-icons/applepay.svg" alt="Apple Pay" width={40} height={25} className="h-6 w-auto" />
            <Image src="/assets/payment-icons/googlepay.svg" alt="Google Pay" width={40} height={25} className="h-6 w-auto" />
          </div>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6 relative z-10">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className={isDark ? 'text-white/80' : 'text-gray-700'}>
                Preparando seu pagamento...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-4">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Falha no Pagamento</h3>
              </div>
              
              <Alert variant="destructive" className={`${
                isDark 
                  ? 'bg-red-950/30 border-red-900/50' 
                  : 'bg-red-50 border-red-200'
                } border text-foreground`}
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle>Erro no pagamento</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {retryCount < 2 ? (
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className={`flex items-center ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                        : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-800'
                      }`}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tentar novamente
                  </Button>
                ) : null}
                
                <Button 
                  variant="secondary" 
                  onClick={() => window.history.back()}
                  className={`flex items-center ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para reserva
                </Button>
              </div>
            </div>
          ) : paymentSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/20 mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pagamento Confirmado!</h3>
              <p className={`${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                Sua reserva foi confirmada e você receberá um email com os detalhes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>Valor Total</h3>
                  <div className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(amount)}
                  </div>
                  
                  {/* Exibir a taxa de serviço se disponível */}
                  {serviceFee !== undefined && serviceFee > 0 && (
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <span className="text-muted-foreground">
                        Inclui taxa de serviço de
                      </span>
                      <span className="font-medium text-primary">{serviceFee}%</span>
                    </div>
                  )}
                </div>
                
                {/* Seletor de métodos de pagamento */}
                <div className="space-y-4">
                  <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Escolha o método de pagamento
                  </h3>
                  
                  <RadioGroup 
                    defaultValue="card" 
                    value={selectedMethod}
                    onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {paymentOptions.map((option) => (
                      <div key={option.id} className="relative">
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.id}
                          className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all
                            ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-50'}
                            ${selectedMethod === option.id
                              ? isDark 
                                ? 'border-primary bg-primary/10' 
                                : 'border-primary/50 bg-primary/5'
                              : isDark
                                ? 'border-white/10 bg-white/5'
                                : 'border-gray-200 bg-white'
                            }
                          `}
                        >
                          <div className="pr-3 pt-1">
                            {option.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{option.name}</div>
                            <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                              {option.description}
                            </div>
                          </div>
                          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                            selectedMethod === option.id
                              ? 'bg-primary'
                              : isDark ? 'bg-white/20' : 'bg-gray-200'
                          }`} />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {/* Formulário específico do método de pagamento */}
                <div className="mt-6">
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                    Detalhes do pagamento
                  </h3>
                  {renderPaymentMethodForm()}
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}