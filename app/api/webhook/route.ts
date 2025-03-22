import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { updateBookingStatus } from '@/lib/firebase/firestore';
import { getDoc, doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
});

// Função para bloquear datas na tabela de disponibilidade
async function blockRoomDates(bookingId: string) {
  try {
    // Primeiro, obtenha os detalhes da reserva
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      console.error(`Reserva ${bookingId} não encontrada ao bloquear datas`);
      return false;
    }
    
    const bookingData = bookingSnap.data();
    const roomId = bookingData.roomId;
    const checkIn = bookingData.checkIn.toDate();
    const checkOut = bookingData.checkOut.toDate();
    
    // Gerar um array de datas entre checkIn e checkOut
    const dates: Date[] = [];
    const currentDate = new Date(checkIn);
    
    while (currentDate < checkOut) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`🔒 Bloqueando ${dates.length} dias para o quarto ${roomId} no webhook`);
    
    if (dates.length === 0) {
      console.error(`Nenhuma data para bloquear na reserva ${bookingId}`);
      return false;
    }
    
    // Obter documento do quarto
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      console.error(`Quarto ${roomId} não encontrado ao atualizar disponibilidade`);
      return false;
    }
    
    const roomData = roomSnap.data();
    const currentAvailability = roomData.availabilityDates || {};
    
    // Criar objeto de atualização de disponibilidade
    const availabilityUpdates: {[date: string]: boolean} = {};
    
    dates.forEach(date => {
      const dateString = date.toISOString().split('T')[0]; // formato YYYY-MM-DD
      availabilityUpdates[dateString] = false; // false significa indisponível
    });
    
    // Mesclar a disponibilidade atual com as novas atualizações
    const updatedAvailability = {
      ...currentAvailability,
      ...availabilityUpdates
    };
    
    // Atualizar o documento do quarto diretamente
    await updateDoc(roomRef, {
      availabilityDates: updatedAvailability
    });
    
    console.log(`✅ Bloqueadas ${Object.keys(availabilityUpdates).length} datas para o quarto ${roomId}`);
    
    // Registrar log da operação
    try {
      const collection_ref = collection(db, 'bookingLogs');
      await addDoc(collection_ref, {
        bookingId,
        roomId,
        action: 'dates_blocked',
        datesBlocked: Object.keys(availabilityUpdates),
        timestamp: new Date(),
        source: 'webhook'
      });
    } catch (logError) {
      console.error('Erro ao registrar log de bloqueio de datas:', logError);
      // Não falhar o processo principal se apenas o log falhar
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao bloquear datas da reserva ${bookingId}:`, error);
    return false;
  }
}

// Esta é a rota de webhook que o Stripe chamará quando eventos ocorrerem
export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') || '';
  
  try {
    // Verificar a assinatura do webhook
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Webhook Secret não configurado');
      return NextResponse.json(
        { error: 'Webhook Secret não configurado' },
        { status: 500 }
      );
    }
    
    // Verificar evento
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    
    // Processar o evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`💰 PaymentIntent ${paymentIntent.id} bem-sucedido!`);
        
        // Atualizar status da reserva
        if (paymentIntent.metadata.bookingId) {
          await processSuccessfulPayment(paymentIntent);
        }
        
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ PaymentIntent ${failedPaymentIntent.id} falhou!`);
        
        // Atualizar status da reserva
        if (failedPaymentIntent.metadata.bookingId) {
          await updateBookingStatus(
            failedPaymentIntent.metadata.bookingId,
            'pending',
            'pending'
          );
          console.log(`🔄 Reserva ${failedPaymentIntent.metadata.bookingId} permanece pendente`);
        }
        
        break;
        
      case 'payment_intent.requires_action':
        const actionRequiredIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`⏳ PaymentIntent ${actionRequiredIntent.id} requer ação adicional`);
        
        // Para métodos como Multibanco, iDEAL que têm status "requires_action" mas são considerados válidos,
        // vamos confirmar a reserva e bloquear as datas
        if (actionRequiredIntent.metadata.bookingId) {
          // IMPORTANTE: Sempre confirmar e bloquear datas para pagamentos assíncronos
          const paymentMethod = actionRequiredIntent.payment_method_types[0];
          console.log(`Método de pagamento que requer ação: ${paymentMethod}`);
          
          // Atualizar a reserva e bloquear datas
          await updateBookingStatus(
            actionRequiredIntent.metadata.bookingId,
            'confirmed',  // Consideramos confirmada mesmo aguardando pagamento
            'pending'     // Status de pagamento permanece pendente
          );
          
          // Bloquear datas de maneira explícita
          await blockRoomDates(actionRequiredIntent.metadata.bookingId);
          
          // Enviar email de confirmação com instruções específicas para o método
          await sendEmailConfirmation(actionRequiredIntent.metadata.bookingId, paymentMethod);
          
          console.log(`✅ Reserva ${actionRequiredIntent.metadata.bookingId} confirmada e datas bloqueadas`);
        }
        
        break;
        
      // Evento importante para iDEAL e métodos assíncronos
      case 'payment_intent.processing':
        const processingIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`⏳ PaymentIntent ${processingIntent.id} em processamento`);
        
        // Para métodos que ficam em processamento (iDEAL, etc)
        if (processingIntent.metadata.bookingId) {
          // IMPORTANTE: Garantir que as datas sejam bloqueadas enquanto o pagamento é processado
          await updateBookingStatus(
            processingIntent.metadata.bookingId,
            'confirmed',  // Consideramos confirmada enquanto processa
            'pending'     // Status de pagamento permanece pendente
          );
          
          // Bloquear datas de maneira explícita
          await blockRoomDates(processingIntent.metadata.bookingId);
          
          console.log(`✅ Reserva ${processingIntent.metadata.bookingId} confirmada (processando pagamento)`);
        }
        
        break;
        
      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Erro ao processar webhook: ${error.message}`);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// Função para processar pagamentos bem-sucedidos
async function processSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.bookingId;
    
    // 1. Atualizar o status da reserva
    await updateBookingStatus(
      bookingId,
      'confirmed',
      'paid'
    );
    
    // 2. Bloquear datas explicitamente
    await blockRoomDates(bookingId);
    
    // 3. Enviar email de confirmação
    await sendEmailConfirmation(bookingId, paymentIntent.payment_method_types[0]);
    
    console.log(`✅ Reserva ${bookingId} confirmada, datas bloqueadas e email enviado`);
    
    return true;
  } catch (error) {
    console.error(`Erro ao processar pagamento bem-sucedido:`, error);
    return false;
  }
}

// Função para enviar email de confirmação
async function sendEmailConfirmation(bookingId: string, paymentMethod: string) {
  try {
    // Obtendo os dados da reserva
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      console.error(`Reserva ${bookingId} não encontrada ao enviar email`);
      return false;
    }
    
    const bookingData = bookingSnap.data();
    
    // Aqui você implementaria o código para enviar o email
    // Como não temos o serviço de email implementado, apenas logamos a ação
    console.log(`📧 Enviando email de confirmação para ${bookingData.guestEmail}`);
    console.log(`Detalhes da reserva: Check-in: ${bookingData.checkIn.toDate().toLocaleDateString()}, 
                Check-out: ${bookingData.checkOut.toDate().toLocaleDateString()}`);
    console.log(`Método de pagamento: ${paymentMethod}`);
    
    return true;
  } catch (error) {
    console.error(`Erro ao enviar email de confirmação:`, error);
    return false;
  }
}

// Configurar para aceitar requisições de POST apenas
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  );
} 