import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { updateBookingStatus } from "@/lib/firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
});

// Função para bloquear datas após confirmação de pagamento
async function updateBookingDates(bookingId: string) {
  try {
    // Buscar os detalhes da reserva
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      console.error(`Reserva ${bookingId} não encontrada ao bloquear datas na API payment-success`);
      return false;
    }
    
    const bookingData = bookingSnap.data();
    const roomId = bookingData.roomId;
    const checkIn = bookingData.checkIn.toDate();
    const checkOut = bookingData.checkOut.toDate();
    
    // Gerar datas entre check-in e check-out
    const dates = [];
    const currentDate = new Date(checkIn);
    
    while (currentDate < checkOut) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(`🔒 Bloqueando ${dates.length} dias para o quarto ${roomId} na API payment-success`);
    
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
      const logCollection = collection(db, 'bookingLogs');
      await addDoc(logCollection, {
        bookingId,
        roomId,
        action: 'dates_blocked',
        datesBlocked: Object.keys(availabilityUpdates),
        timestamp: new Date(),
        source: 'payment_success_api'
      });
    } catch (logError) {
      console.error('Erro ao registrar log de bloqueio de datas:', logError);
      // Não falhar o processo principal se apenas o log falhar
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao bloquear datas para reserva ${bookingId}:`, error);
    return false;
  }
}

// Rota GET para verificar status de pagamento
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const paymentIntentId = url.searchParams.get('payment_intent');
  const bookingId = url.searchParams.get('booking_id');
  const sessionId = url.searchParams.get('session_id');
  const manualPayment = url.searchParams.get('manual_payment') === 'true';
  
  console.log(`Verificando pagamento - Payment Intent: ${paymentIntentId}, Session ID: ${sessionId}, Booking ID: ${bookingId}`);
  
  try {
    // Função para processar observações especiais após pagamento confirmado
    const processSpecialRequests = async (confirmedBookingId: string) => {
      try {
        // Buscar os detalhes da reserva
        const bookingRef = doc(db, 'bookings', confirmedBookingId);
        const bookingSnap = await getDoc(bookingRef);
        
        if (!bookingSnap.exists()) {
          console.log(`Reserva ${confirmedBookingId} não encontrada para processar observações`);
          return false;
        }
        
        const bookingData = bookingSnap.data();
        
        // Verificar se há solicitações especiais a serem processadas
        if (bookingData.specialRequests && bookingData.specialRequests.trim() !== '') {
          console.log(`Processando observações especiais da reserva ${confirmedBookingId}`);
          
          // Verificar se já existe uma mensagem com as mesmas informações
          // para evitar duplicação - usando consulta simples e filtragem em código
          const contactsRef = collection(db, 'contacts');
          // Buscar apenas por email para evitar problemas de índice
          const existingContactsQuery = query(
            contactsRef, 
            where('email', '==', bookingData.guestEmail)
          );
          
          const existingContactsSnapshot = await getDocs(existingContactsQuery);
          
          // Filtrar manualmente as mensagens para verificar duplicações
          let hasDuplicateMessage = false;
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          
          existingContactsSnapshot.forEach(doc => {
            const contactData = doc.data();
            // Verificar se a mensagem é similar e recente
            if (contactData.message === bookingData.specialRequests && 
                contactData.createdAt && 
                contactData.createdAt.toDate() > oneDayAgo) {
              hasDuplicateMessage = true;
            }
          });
          
          // Se já existir mensagem similar, não criar outra
          if (hasDuplicateMessage) {
            console.log(`Mensagem similar já existe para a reserva ${confirmedBookingId}. Evitando duplicação.`);
            return false;
          }
          
          // Criar mensagem de contato com as observações especiais
          const contactMessage = {
            name: bookingData.guestName,
            email: bookingData.guestEmail,
            phone: bookingData.guestPhone,
            subject: 'Solicitação Especial de Reserva Confirmada',
            message: bookingData.specialRequests,
            status: 'new', // Marcar como nova para aparecer na interface de admin
            createdAt: serverTimestamp(),
            reservationDetails: {
              checkIn: bookingData.checkIn,
              checkOut: bookingData.checkOut,
              roomId: bookingData.roomId,
              roomName: bookingData.roomName,
              totalGuests: bookingData.adults + (bookingData.children || 0),
              totalPrice: bookingData.totalPrice
            }
          };
          
          // Adicionar a mensagem à coleção de contatos
          const contactsCollection = collection(db, 'contacts');
          await addDoc(contactsCollection, contactMessage);
          
          console.log(`Mensagem de solicitação especial criada para reserva ${confirmedBookingId}`);
          return true;
        } else {
          console.log(`Nenhuma observação especial encontrada para a reserva ${confirmedBookingId}`);
          return false;
        }
      } catch (error) {
        console.error(`Erro ao processar observações especiais da reserva ${confirmedBookingId}:`, error);
        return false;
      }
    };
    
    // Se temos um ID de sessão do Stripe Checkout
    if (sessionId) {
      console.log(`Verificando sessão do Stripe Checkout: ${sessionId}`);
      
      try {
        // Recuperar a sessão do Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (!session) {
          return NextResponse.json({ 
            success: false, 
            message: 'Sessão não encontrada' 
          }, { status: 404 });
        }
        
        // Obter o ID da reserva dos metadados
        const sessionBookingId = session.client_reference_id || '';
        console.log(`ID da reserva obtido da sessão: ${sessionBookingId}`);
        
        if (!sessionBookingId) {
          return NextResponse.json({ 
            success: false, 
            message: 'ID da reserva não encontrado na sessão' 
          }, { status: 400 });
        }
        
        // Verificar o status do pagamento
        if (session.payment_status === 'paid') {
          console.log(`Pagamento confirmado para a sessão ${sessionId}`);
          
          try {
            // Atualizar o status da reserva
            const bookingRef = doc(db, 'bookings', sessionBookingId);
            const bookingSnap = await getDoc(bookingRef);
            
            if (bookingSnap.exists()) {
              const bookingData = bookingSnap.data();
              
              // Atualizar o status da reserva
              await updateDoc(bookingRef, {
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentMethod: session.payment_method_types?.[0] || 'card',
                updatedAt: serverTimestamp()
              });
              
              console.log(`Status da reserva ${sessionBookingId} atualizado para confirmed`);
              
              // Bloquear as datas no calendário
              await updateBookingDates(sessionBookingId);
              
              // Processar observações especiais e criar mensagem no admin
              await processSpecialRequests(sessionBookingId);
              
              // Retornar a reserva atualizada
              const updatedBookingSnap = await getDoc(bookingRef);
              return NextResponse.json({ 
                success: true, 
                message: 'Pagamento confirmado e reserva atualizada',
                session: {
                  id: session.id,
                  paymentStatus: session.payment_status
                },
                booking: {
                  id: sessionBookingId,
                  ...updatedBookingSnap.data()
                }
              });
            } else {
              console.error(`Reserva ${sessionBookingId} não encontrada`);
              return NextResponse.json({ 
                success: false, 
                message: 'Reserva não encontrada',
                session: {
                  id: session.id,
                  paymentStatus: session.payment_status
                }
              }, { status: 404 });
            }
          } catch (err) {
            console.error(`Erro ao atualizar reserva ${sessionBookingId}:`, err);
            return NextResponse.json({ 
              success: false, 
              message: 'Erro ao atualizar reserva',
              error: err
            }, { status: 500 });
          }
        } else if (session.payment_status === 'unpaid') {
          // Pagamento pendente
          try {
            // Buscar a reserva para retornar seus dados
            const bookingRef = doc(db, 'bookings', sessionBookingId);
            const bookingSnap = await getDoc(bookingRef);
            
            if (bookingSnap.exists()) {
              const bookingData = bookingSnap.data();
              
              return NextResponse.json({ 
                success: false, 
                message: 'Pagamento pendente',
                session: {
                  id: session.id,
                  paymentStatus: session.payment_status
                },
                booking: {
                  id: sessionBookingId,
                  ...bookingData
                }
              });
            } else {
              return NextResponse.json({ 
                success: false, 
                message: 'Reserva não encontrada',
                session: {
                  id: session.id,
                  paymentStatus: session.payment_status
                }
              }, { status: 404 });
            }
          } catch (err) {
            console.error(`Erro ao buscar reserva ${sessionBookingId}:`, err);
            return NextResponse.json({ 
              success: false, 
              message: 'Erro ao buscar reserva',
              error: err
            }, { status: 500 });
          }
        } else {
          // Outros status (ex: 'requires_action')
          return NextResponse.json({ 
            success: false, 
            message: `Status de pagamento: ${session.payment_status}`,
            session: {
              id: session.id,
              paymentStatus: session.payment_status
            }
          });
        }
      } catch (err: any) {
        console.error('Erro ao verificar sessão:', err);
        return NextResponse.json({ 
          success: false, 
          message: `Erro ao verificar sessão: ${err.message || 'Erro desconhecido'}` 
        }, { status: 500 });
      }
    }
    
    // Para pagamentos processados pelo Stripe
    if (paymentIntentId) {
      // Buscar o Payment Intent no Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // IMPORTANTE: Para iDEAL e outros métodos assíncronos, bloquear datas mesmo em processamento
      if (paymentIntent.status === 'succeeded') {
        // Pagamento bem-sucedido
        if (bookingId) {
          await updateBookingStatus(bookingId, 'confirmed', 'paid');
          await updateBookingDates(bookingId);
          
          // Processar observações especiais e criar mensagem no admin
          await processSpecialRequests(bookingId);
          
          // Buscar dados atualizados da reserva
          const bookingRef = doc(db, 'bookings', bookingId);
          const bookingSnap = await getDoc(bookingRef);
          const bookingData = bookingSnap.exists() ? bookingSnap.data() : null;
          
          return NextResponse.json({ 
            success: true, 
            booking: {
              ...bookingData,
              id: bookingId,
              status: 'confirmed',
              paymentStatus: 'paid'
            }
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            message: 'ID da reserva não fornecido' 
          }, { status: 400 });
        }
      } else if (paymentIntent.status === 'processing') {
        // Pagamento em processamento (comum para iDEAL e outros métodos assíncronos)
        // IMPORTANTE: Ainda assim, bloquear as datas para prevenir overbooking
        if (bookingId) {
          await updateBookingStatus(bookingId, 'confirmed', 'pending');
          await updateBookingDates(bookingId);
          
          // Processar observações especiais mesmo com pagamento em processamento
          await processSpecialRequests(bookingId);
          
          // Buscar dados atualizados da reserva
          const bookingRef = doc(db, 'bookings', bookingId);
          const bookingSnap = await getDoc(bookingRef);
          const bookingData = bookingSnap.exists() ? bookingSnap.data() : null;
          
          return NextResponse.json({ 
            success: true, 
            booking: {
              ...bookingData,
              id: bookingId,
              status: 'confirmed', // Status principal é confirmado
              paymentStatus: 'pending' // Mas pagamento ainda pendente
            }
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            message: 'ID da reserva não fornecido' 
          }, { status: 400 });
        }
      } else if (paymentIntent.status === 'requires_action') {
        // Requer ação (comum para Multibanco ou situações de autenticação)
        // Para métodos como Multibanco, confirmar e bloquear datas
        
        if (bookingId) {
          // Verificar se o método é Multibanco, iDEAL ou similar
          const requiresActionButValid = ['multibanco', 'ideal', 'sofort'].includes(
            paymentIntent.payment_method_types[0]
          );
          
          if (requiresActionButValid) {
            // Confirmar e bloquear datas mesmo se precisar de ação adicional
            await updateBookingStatus(bookingId, 'confirmed', 'pending');
            await updateBookingDates(bookingId);
            
            // Processar observações especiais
            await processSpecialRequests(bookingId);
            
            // Buscar dados atualizados da reserva
            const bookingRef = doc(db, 'bookings', bookingId);
            const bookingSnap = await getDoc(bookingRef);
            const bookingData = bookingSnap.exists() ? bookingSnap.data() : null;
            
            return NextResponse.json({ 
              success: true, 
              booking: {
                ...bookingData,
                id: bookingId,
                status: 'confirmed',
                paymentStatus: 'pending'
              }
            });
          }
          
          // Buscar dados da reserva para casos não válidos para ação imediata
          const bookingRef = doc(db, 'bookings', bookingId);
          const bookingSnap = await getDoc(bookingRef);
          const bookingData = bookingSnap.exists() ? bookingSnap.data() : {};
          
          return NextResponse.json({ 
            success: false, 
            requires_action: true,
            booking: {
              ...bookingData,
              id: bookingId,
              status: bookingData.status || 'pending'
            }
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            message: 'ID da reserva não fornecido',
            requires_action: true
          }, { status: 400 });
        }
      } else {
        // Outros status (failed, canceled, etc.)
        if (bookingId) {
          // Buscar dados da reserva
          const bookingRef = doc(db, 'bookings', bookingId);
          const bookingSnap = await getDoc(bookingRef);
          const bookingData = bookingSnap.exists() ? bookingSnap.data() : {};
          
          return NextResponse.json({ 
            success: false, 
            status: paymentIntent.status,
            booking: {
              ...bookingData,
              id: bookingId,
              status: bookingData.status || 'pending'
            }
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            status: paymentIntent.status,
            message: 'ID da reserva não fornecido'
          }, { status: 400 });
        }
      }
    } else if (bookingId) {
      // Sem payment_intent_id, mas com booking_id, retorna os dados da reserva
      // Buscar dados da reserva
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      if (bookingSnap.exists()) {
        const bookingData = bookingSnap.data();
        
        // Para pagamentos manuais, processar a atualização de status
        if (manualPayment) {
          await updateBookingStatus(bookingId, 'confirmed', 'pending');
          await updateBookingDates(bookingId);
          await processSpecialRequests(bookingId);
        }
        
        return NextResponse.json({ 
          success: true, 
          warning: 'ID do pagamento não fornecido, retornando apenas dados da reserva',
          booking: {
            ...bookingData,
            id: bookingId
          }
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Reserva não encontrada'
        }, { status: 404 });
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Parâmetros insuficientes: é necessário fornecer payment_intent, session_id ou booking_id'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erro desconhecido ao verificar pagamento'
    }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payment_intent, session_id, booking_id } = body;
    
    if (payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
      
      return NextResponse.json({
        success: true,
        data: paymentIntent
      });
    } else if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      return NextResponse.json({
        success: true,
        data: session
      });
    } else if (booking_id) {
      // Handle booking verification logic here
      
      return NextResponse.json({
        success: true,
        data: { booking_id }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'É necessário fornecer payment_intent, session_id ou booking_id'
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error);
    
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Erro ao verificar o pagamento'
    }, { status: 500 });
  }
}
