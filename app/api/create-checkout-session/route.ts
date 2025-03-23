import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializa o Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, bookingId, email, customerName, paymentMethod } = body;
    const origin = new URL(request.url).origin;

    if (!amount || !bookingId) {
      return NextResponse.json(
        { error: 'Faltam informações (valor ou ID da reserva)' },
        { status: 400 }
      );
    }

    // Log detalhado para solicitação de Checkout Session
    console.log(`API: Solicitando Checkout Session - Método: ${paymentMethod}, Valor: ${amount}, BookingId: ${bookingId}`);

    // Converte para centavos
    const amountInCents = Math.round(amount * 100);

    // Determinar os tipos de pagamento com base no método selecionado
    let payment_method_types: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card'];
    
    if (paymentMethod === 'all' || !paymentMethod) {
      // Se "all" ou não especificado, oferecer todos os métodos suportados
      payment_method_types = ['card', 'ideal', 'klarna', 'paypal', 'multibanco'];
    } else if (paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') {
      // Para Apple Pay e Google Pay, usamos apenas cartão no backend
      // e configuramos no frontend para exibir a interface de pagamento adequada
      payment_method_types = ['card'];
    } else if (paymentMethod !== 'card') {
      // Se for um método específico, oferecer apenas esse e cartão como fallback
      payment_method_types = [paymentMethod as Stripe.Checkout.SessionCreateParams.PaymentMethodType, 'card'];
    }

    // Criar a sessão de checkout
    try {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Reserva Aqua Vista Monchique',
                description: `Reserva #${bookingId}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://aquavista.replit.app/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://aquavista.replit.app/booking?canceled=true`,
        client_reference_id: bookingId,
        customer_email: email,
        metadata: {
          bookingId,
          customerName,
          description,
          // Adicionar informação sobre o método requisitado para carteiras digitais
          ...(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay' 
            ? { requested_payment_method: paymentMethod } 
            : {})
        },
      };
      
      // Adicionar configurações específicas para cartões quando Apple Pay/Google Pay forem solicitados
      if (paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') {
        sessionParams.payment_method_options = {
          card: {
            request_three_d_secure: 'automatic'
          }
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      console.log(`Checkout Session criada com sucesso: ${session.id}`);
      
      return NextResponse.json({
        sessionId: session.id,
        sessionUrl: session.url
      });
    } catch (error: any) {
      console.error('Erro ao criar Checkout Session:', error.message);
      
      return NextResponse.json(
        { error: error.message || 'Erro ao processar pagamento' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erro na API:', error);
    
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 