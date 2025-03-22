import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/firebase/config'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { getServerStripe } from '@/lib/stripe'
import { updateBookingStatus } from '@/lib/firebase/firestore'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...'

export async function POST(request: Request) {
  try {
    const stripe = getServerStripe()
    const body = await request.text()
    const sig = headers().get('stripe-signature') || ''

    // Verificar se temos uma assinatura válida
    if (!sig) {
      console.error('Webhook sem assinatura Stripe')
      return NextResponse.json(
        { error: 'Webhook sem assinatura Stripe' },
        { status: 400 }
      )
    }

    // Verificar evento
    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Lidar com os diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log(`PaymentIntent bem-sucedido: ${paymentIntent.id}`)
        
        try {
          // Verificar se existe bookingId nos metadados
          const bookingId = paymentIntent.metadata?.bookingId
          
          if (bookingId) {
            const bookingRef = doc(db, 'bookings', bookingId)
            const bookingSnap = await getDoc(bookingRef)
            
            if (bookingSnap.exists()) {
              // Usar nossa função que atualiza o status e bloqueia a data em uma única operação
              await updateBookingStatus(bookingId, 'confirmed', 'paid')
              console.log(`Reserva ${bookingId} confirmada após pagamento bem-sucedido via webhook`)
            } else {
              console.warn(`Reserva ${bookingId} não encontrada para o pagamento ${paymentIntent.id}`)
            }
          }
        } catch (error) {
          console.error('Erro ao processar payment_intent.succeeded:', error)
        }
        break
        
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        const failedPayment = event.data.object
        console.log(`PaymentIntent ${event.type === 'payment_intent.canceled' ? 'cancelado' : 'falhou'}: ${failedPayment.id}`)
        
        try {
          // Verificar se existe bookingId nos metadados
          const bookingId = failedPayment.metadata?.bookingId
          
          if (bookingId) {
            const bookingRef = doc(db, 'bookings', bookingId)
            const bookingSnap = await getDoc(bookingRef)
            
            if (bookingSnap.exists()) {
              // IMPORTANTE: Liberar as datas excluindo a reserva
              await deleteDoc(bookingRef)
              console.log(`Reserva ${bookingId} excluída após ${event.type === 'payment_intent.canceled' ? 'cancelamento' : 'falha'} no pagamento via webhook`)
            }
          }
        } catch (error) {
          console.error(`Erro ao processar ${event.type}:`, error)
        }
        break
        
      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook', details: error.message },
      { status: 500 }
    )
  }
} 