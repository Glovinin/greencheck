import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateBookingStatus } from '@/lib/firebase/firestore';

// Inicializa o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, bookingId, email, paymentMethod = 'card' } = body;

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: 'Faltam informações (valor ou ID da reserva)' },
        { status: 400 }
      );
    }

    // Log detalhado para solicitação de PaymentIntent
    console.log(`API: Solicitando PaymentIntent - Método: ${paymentMethod}, Valor: ${amount}, BookingId: ${bookingId}`);

    // Converte para centavos
    const amountInCents = Math.round(amount * 100);

    console.log(`Criando Payment Intent: ${amountInCents} cents, método: ${paymentMethod}`);

    // Lista de métodos de pagamento baseada no método selecionado
    let payment_method_types: string[] = [];
    let payment_method_options: any = {};
    
    // Configurar os métodos de pagamento e opções específicas
    switch (paymentMethod) {
      case 'card':
        payment_method_types = ['card'];
        payment_method_options = {
          card: {
            request_three_d_secure: 'automatic',
          },
        };
        break;
        
      case 'wallet':
        payment_method_types = ['card'];
        break;
        
      case 'apple_pay':
        payment_method_types = ['card'];
        // Apple Pay é tratado no frontend usando os elementos do Stripe
        break;
        
      case 'google_pay':
        payment_method_types = ['card'];
        // Google Pay é tratado no frontend usando os elementos do Stripe
        break;
        
      case 'paypal':
        payment_method_types = ['paypal'];
        payment_method_options = {
          paypal: {
            // Preferir experiência em tela cheia para PayPal
            preference: 'immediate',
          },
        };
        break;
        
      case 'klarna':
        payment_method_types = ['klarna'];
        payment_method_options = {
          klarna: {
            // Ativar parcelamento
            preferred_locale: 'pt-PT',
          },
        };
        break;
        
      case 'multibanco':
        // O Multibanco requer ser o único método de pagamento no PaymentIntent
        payment_method_types = ['multibanco'];
        // Remova quaisquer opções extras para o Multibanco para manter simples
        payment_method_options = {};
        break;
        
      case 'ideal':
        payment_method_types = ['ideal'];
        payment_method_options = {
          ideal: {
            setup_future_usage: 'off_session', // Para habilitar SEPA como método recorrente após primeira cobrança
          },
        };
        break;
        
      case 'bancontact':
        payment_method_types = ['bancontact'];
        payment_method_options = {
          bancontact: {
            preferred_language: 'pt', // 'en', 'de', 'fr', ou 'nl'
          },
        };
        break;
        
      case 'bank_transfer':
        payment_method_types = ['sepa_debit', 'sofort'];
        payment_method_options = {
          sepa_debit: {
            mandate_options: {
              // Opções para o mandato SEPA
            },
          },
          sofort: {
            preferred_language: 'en', // Valores válidos: 'en', 'de', 'fr', ou 'nl' (não inclui 'pt')
            setup_future_usage: 'off_session', // Para habilitar SEPA como método recorrente
          },
        };
        break;
        
      default:
        payment_method_types = ['card']; // Padrão para cartão
        payment_method_options = {
          card: {
            request_three_d_secure: 'automatic',
          },
        };
    }

    // Criar o PaymentIntent com as configurações específicas para o método selecionado
    console.log(`API: Criando PaymentIntent para ${paymentMethod} com tipos: ${payment_method_types.join(', ')}`);
    
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        description,
        metadata: {
          bookingId,
          paymentMethod // Armazenar o método de pagamento nos metadados
        },
        receipt_email: email,
        payment_method_types,
        payment_method_options,
        // Configuração para redirecionamento após pagamento bem-sucedido
        // Importante para métodos de redirecionamento como PayPal, iDEAL, etc.
        confirm: false, // Não confirmar automaticamente, pois isso será feito pelo cliente
      });

      console.log(`Payment Intent criado com sucesso: ${paymentIntent.id}, tipos: ${paymentIntent.payment_method_types.join(', ')}`);
      
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentMethodTypes: paymentIntent.payment_method_types
      });
    } catch (error: any) {
      console.error('Erro ao criar Payment Intent:', error.message);
      
      return NextResponse.json(
        { error: error.message || 'Erro ao processar pagamento' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erro ao criar Payment Intent:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
} 