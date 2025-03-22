import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'
import { Room, SeasonalPrice } from '@/lib/types'
import { differenceInDays } from 'date-fns'

// Tipos de dados
export interface Booking {
  id?: string
  userId?: string
  guestName: string
  guestEmail: string
  guestPhone: string
  roomId: string
  roomName: string
  checkIn: Timestamp
  checkOut: Timestamp
  adults: number
  children: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  specialRequests?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Contact {
  id?: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: Timestamp
  updatedAt?: Timestamp
  repliedAt?: Timestamp
  replyContent?: string
  reservationDetails?: {
    checkIn?: Timestamp
    checkOut?: Timestamp
    roomId?: string
    roomName?: string
    totalGuests?: number
    totalPrice?: number
  }
}

// Funções genéricas para CRUD
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return docRef.id
}

export const createDocumentWithId = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> => {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Dados brutos recuperados do Firestore para quarto:", id, data);
    
    if (data?.serviceFeePct !== undefined) {
      console.log("serviceFeePct antes da conversão:", data.serviceFeePct, "tipo:", typeof data.serviceFeePct);
      // Garantir que serviceFeePct seja um número
      data.serviceFeePct = Number(data.serviceFeePct);
      console.log("serviceFeePct após conversão:", data.serviceFeePct, "tipo:", typeof data.serviceFeePct);
    }
    
    return { id: docSnap.id, ...data } as T
  } else {
    return null
  }
}

export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  forceRefresh = false
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    
    // Se forceRefresh for verdadeiro, adicionar opções que forçam uma nova consulta ao Firestore
    const querySnapshot = await getDocs(q)
    
    console.log(`Buscando documentos na coleção ${collectionName} - Força atualização: ${forceRefresh}`);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T)
  } catch (error) {
    console.error(`Erro ao buscar documentos da coleção ${collectionName}:`, error);
    return [];
  }
}

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<boolean> => {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)
  return true
}

// Funções para gerenciar quartos
export const getRooms = async (forceRefresh = false): Promise<Room[]> => {
  try {
    const constraints: QueryConstraint[] = []
    
    constraints.push(orderBy('name', 'asc'))
    
    const rooms = await getDocuments<Room>('rooms', constraints, forceRefresh)
    
    // Garantir que todos os campos necessários estejam presentes
    return rooms.map(room => {
      console.log(`Firebase - Quarto ${room.id} dados brutos:`, room);
      
      // Garantir que serviceFeePct seja um número
      const serviceFeePct = room.serviceFeePct !== undefined 
        ? Number(room.serviceFeePct) 
        : 10;
        
      console.log(`Firebase - Quarto ${room.id} serviceFeePct:`, {
        original: room.serviceFeePct,
        tipo: typeof room.serviceFeePct,
        convertido: serviceFeePct
      });
      
      return {
        id: room.id,
        name: room.name || '',
        type: room.type || 'standard',
        description: room.description || '',
        price: room.price || 0,
        capacity: room.capacity || 2,
        size: room.size || 0,
        available: room.available !== undefined ? room.available : true,
        serviceFeePct: serviceFeePct,
        images: room.images || [],
        amenities: room.amenities || [],
        additionalServices: room.additionalServices || [],
        highlights: room.highlights || [],
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      };
    });
  } catch (error) {
    console.error('Erro ao buscar quartos:', error)
    return []
  }
}

export const getAvailableRooms = async (
  checkIn: Date,
  checkOut: Date
): Promise<Room[]> => {
  try {
    // Buscar todos os quartos que estão marcados como disponíveis em geral
    const constraints: QueryConstraint[] = [
      where('available', '==', true)
    ]
    
    const rooms = await getDocuments<Room>('rooms', constraints);
    
    // Filtrar os quartos que estão disponíveis nas datas específicas
    return filterAvailableRoomsByDate(rooms, checkIn, checkOut);
  } catch (error) {
    console.error('Erro ao buscar quartos disponíveis:', error)
    return []
  }
}

// Função auxiliar para verificar disponibilidade entre datas
export const filterAvailableRoomsByDate = (
  rooms: Room[],
  checkIn: Date,
  checkOut: Date
): Room[] => {
  // Converter checkIn e checkOut para ISO strings
  const dateStrings = getDatesInRange(checkIn, checkOut);
  
  return rooms.filter(room => {
    // Se não tiver controle de disponibilidade específico, considera disponível
    if (!room.availabilityDates) return true;
    
    // Verificar se alguma data no intervalo está indisponível
    return !dateStrings.some(dateStr => 
      room.availabilityDates?.[dateStr] === false
    );
  });
};

// Função para obter disponibilidade de um quarto específico
export const getRoomAvailability = async (
  roomId: string, 
  startDate: Date, 
  endDate: Date
): Promise<{[date: string]: boolean}> => {
  try {
    const room = await getRoomById(roomId);
    if (!room) throw new Error(`Quarto com ID ${roomId} não encontrado`);
    
    // Gerar datas no intervalo
    const dateStrings = getDatesInRange(startDate, endDate);
    
    // Se não tiver configuração de disponibilidade específica, assume tudo disponível
    if (!room.availabilityDates) {
      return dateStrings.reduce((acc, date) => {
        acc[date] = true;
        return acc;
      }, {} as {[date: string]: boolean});
    }
    
    // Preencher com os dados de disponibilidade existentes
    return dateStrings.reduce((acc, date) => {
      acc[date] = room.availabilityDates?.[date] !== false; // disponível por padrão se não estiver explicitamente indisponível
      return acc;
    }, {} as {[date: string]: boolean});
  } catch (error) {
    console.error(`Erro ao verificar disponibilidade do quarto ${roomId}:`, error);
    throw error;
  }
};

// Função para atualizar disponibilidade de um quarto
export const updateRoomAvailability = async (
  roomId: string,
  availabilityDates: {[date: string]: boolean}
): Promise<boolean> => {
  try {
    await updateDocument('rooms', roomId, {
      availabilityDates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar disponibilidade do quarto ${roomId}:`, error);
    return false;
  }
};

// Função auxiliar para gerar array de strings de data entre um intervalo
export const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  
  // Normalizar para meia-noite no fuso horário local
  currentDate.setHours(0, 0, 0, 0);
  const endDateNormalized = new Date(endDate);
  endDateNormalized.setHours(0, 0, 0, 0);
  
  // Adicionar cada data no intervalo EXCETO o dia de checkout
  // Usando < em vez de <= para não incluir o dia de checkout
  while (currentDate < endDateNormalized) {
    dates.push(currentDate.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  try {
    const room = await getDocument<Room>('rooms', id);
    
    if (!room) return null;
    
    console.log(`Firebase - getRoomById ${id} dados brutos:`, room);
    
    // Log específico para serviceFeePct
    console.log(`serviceFeePct no Firestore:`, room.serviceFeePct);
    
    // Garantir que todos os campos necessários estejam presentes
    return {
      ...room,
      name: room.name || '',
      type: room.type || 'standard',
      description: room.description || '',
      price: room.price || 0,
      capacity: room.capacity || 2,
      size: room.size || 0,
      available: room.available !== undefined ? room.available : true,
      serviceFeePct: room.serviceFeePct !== undefined ? room.serviceFeePct : 10,
      images: room.images || [],
      amenities: room.amenities || [],
      additionalServices: room.additionalServices || [],
      highlights: room.highlights || []
    };
  } catch (error) {
    console.error(`Erro ao buscar quarto com ID ${id}:`, error);
    return null;
  }
}

export const createRoom = async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> => {
  try {
    console.log("createRoom - Dados recebidos:", roomData);
    
    const roomWithTimestamps = {
      ...roomData,
      available: roomData.available !== undefined ? roomData.available : true,
      featured: roomData.featured || false,
      amenities: roomData.amenities || [],
      additionalServices: roomData.additionalServices || [],
      highlights: roomData.highlights || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    console.log("createRoom - Dados a serem salvos:", roomWithTimestamps);
    
    const id = await createDocument('rooms', roomWithTimestamps)
    
    return {
      id,
      ...roomData,
      amenities: roomData.amenities || [],
      additionalServices: roomData.additionalServices || [],
      highlights: roomData.highlights || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  } catch (error) {
    console.error('Erro ao criar quarto:', error)
    throw error
  }
}

export const updateRoom = async (id: string, roomData: Partial<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Room> => {
  try {
    console.log(`updateRoom - ID: ${id}, Dados recebidos:`, roomData);
    
    // Garantir que estamos lidando explicitamente com o serviceFeePct se ele for 0
    if (roomData.serviceFeePct === 0) {
      console.log("updateRoom - Detectado serviceFeePct com valor 0, salvando explicitamente.", roomData.serviceFeePct);
    }
    
    // Adicionar timestamp de atualização
    const roomWithTimestamp = {
      ...roomData,
      amenities: roomData.amenities || [],
      additionalServices: roomData.additionalServices || [],
      highlights: roomData.highlights || [],
      updatedAt: serverTimestamp()
    }
    
    console.log(`updateRoom - Dados a serem salvos:`, roomWithTimestamp);
    
    await updateDocument('rooms', id, roomWithTimestamp)
    
    const updatedRoom = await getRoomById(id)
    if (!updatedRoom) {
      throw new Error(`Quarto com ID ${id} não encontrado após atualização`)
    }
    
    return updatedRoom
  } catch (error) {
    console.error('Erro ao atualizar quarto:', error)
    throw error
  }
}

export const deleteRoom = async (id: string): Promise<boolean> => {
  return await deleteDocument('rooms', id)
}

// Funções específicas para reservas
export const createBooking = async (bookingData: any) => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, bookingData);
    
    // CORREÇÃO: Não bloquear a data no momento da criação da reserva
    // O bloqueio será feito apenas quando o pagamento for confirmado
    // através da função updateBookingStatus
    
    return docRef;
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    throw error;
  }
};

// Nova função para atualizar status da reserva e bloquear as datas da estadia
export const updateBookingStatus = async (
  bookingId: string, 
  newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  newPaymentStatus: 'pending' | 'paid' | 'refunded'
): Promise<boolean> => {
  try {
    // Referência ao documento da reserva
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      console.error(`Booking ${bookingId} não existe ao atualizar status`);
      return false;
    }
    
    const bookingData = bookingSnap.data();
    
    // Atualizar o status da reserva
    await updateDoc(bookingRef, {
      status: newStatus,
      paymentStatus: newPaymentStatus,
      updatedAt: serverTimestamp(),
      ...(newStatus === 'confirmed' && { confirmedAt: serverTimestamp() })
    });
    
    // Se a reserva está sendo confirmada, precisamos bloquear as datas
    if (newStatus === 'confirmed') {
      console.log(`Atualizando disponibilidade para reserva confirmada: ${bookingId}`);
      
      // Recuperar datas de check-in e check-out
      const checkIn = bookingData.checkIn.toDate();
      const checkOut = bookingData.checkOut.toDate();
      const roomId = bookingData.roomId;
      
      // Obter todas as datas entre check-in e check-out
      const dates: Date[] = [];
      const currentDate = new Date(checkIn);
      
      while (currentDate < checkOut) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      console.log(`Bloqueando ${dates.length} dias para quarto ${roomId}`);
      
      // Atualizar disponibilidade para cada data
      const availabilityUpdates: {[date: string]: boolean} = {};
      
      dates.forEach(date => {
        const dateString = date.toISOString().split('T')[0]; // formato YYYY-MM-DD
        availabilityUpdates[dateString] = false; // false significa indisponível
      });
      
      // Atualizar disponibilidade do quarto
      if (Object.keys(availabilityUpdates).length > 0) {
        try {
          // Obter o documento do quarto
          const roomRef = doc(db, 'rooms', roomId);
          const roomSnap = await getDoc(roomRef);
          
          if (roomSnap.exists()) {
            const roomData = roomSnap.data();
            const currentAvailability = roomData.availabilityDates || {};
            
            // Mesclar a disponibilidade atual com as novas atualizações
            const updatedAvailability = {
              ...currentAvailability,
              ...availabilityUpdates
            };
            
            // Atualizar o documento do quarto
            await updateDoc(roomRef, {
              availabilityDates: updatedAvailability,
              updatedAt: serverTimestamp()
            });
            
            console.log(`Disponibilidade atualizada com sucesso para quarto ${roomId}`);
            
            // Criar log da reserva
            await addDoc(collection(db, 'bookingLogs'), {
              bookingId,
              roomId,
              action: 'status_updated',
              previousStatus: bookingData.status,
              newStatus,
              previousPaymentStatus: bookingData.paymentStatus,
              newPaymentStatus,
              datesBlocked: Object.keys(availabilityUpdates),
              timestamp: serverTimestamp(),
              userId: bookingData.userId || 'system'
            });
          } else {
            console.error(`Quarto ${roomId} não encontrado ao atualizar disponibilidade`);
          }
        } catch (error) {
          console.error(`Erro ao atualizar disponibilidade do quarto ${roomId}:`, error);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar status da reserva ${bookingId}:`, error);
    return false;
  }
}

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  return getDocuments<Booking>('bookings', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ])
}

export const getRecentBookings = async (count = 5): Promise<Booking[]> => {
  return getDocuments<Booking>('bookings', [
    orderBy('createdAt', 'desc'),
    limit(count)
  ])
}

export const getRoomBookings = async (roomId: string): Promise<Booking[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('roomId', '==', roomId),
      orderBy('checkIn', 'asc')
    ];
    
    return await getDocuments<Booking>('bookings', constraints);
  } catch (error) {
    console.error(`Erro ao buscar reservas do quarto ${roomId}:`, error);
    return [];
  }
};

// Funções específicas para contatos
export const createContactMessage = async (contactData: Contact) => {
  try {
    const contactsCollection = collection(db, 'contacts')
    
    // Garantir que o status seja 'new' para novos contatos
    const contactWithDefaults = {
      ...contactData,
      status: contactData.status || 'new',
      createdAt: contactData.createdAt || Timestamp.now()
    }
    
    // Se tiver detalhes de reserva, adicionar metadados
    if (contactWithDefaults.reservationDetails) {
      // Ajustar subject para indicar que é relacionado a reserva
      if (!contactWithDefaults.subject.includes('Reserva')) {
        contactWithDefaults.subject = `Reserva: ${contactWithDefaults.subject}`;
      }
    }
    
    const docRef = await addDoc(contactsCollection, contactWithDefaults)
    return docRef
  } catch (error) {
    console.error('Erro ao criar mensagem de contato:', error)
    throw error
  }
}

export const getNewContactMessages = async (): Promise<Contact[]> => {
  return getDocuments<Contact>('contacts', [
    where('status', '==', 'new'),
    orderBy('createdAt', 'desc')
  ])
}

// Funções para Dashboard com dados reais

export const getDashboardStats = async () => {
  try {
    const [totalBookings, totalRevenue, occupancyRate, bookingsByPlatform] = await Promise.all([
      getTotalBookings(),
      getMonthlyRevenue(),
      getOccupancyRate(),
      getBookingsByPlatform()
    ]);

    return {
      totalBookings,
      totalRevenue,
      occupancyRate,
      bookingsByPlatform
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas do dashboard:', error);
    throw error;
  }
};

// Obter total de reservas
export const getTotalBookings = async () => {
  try {
    // Obter todas as reservas
    const bookings = await getDocuments<Booking>('bookings');
    
    // Contar reservas por status
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    
    // Calcular crescimento em relação ao mês anterior (simulado por enquanto)
    // Em uma implementação real, você compararia com dados do mês anterior
    const growth = ((confirmed + completed) / (bookings.length || 1) * 100) - 50;
    
    return {
      total: bookings.length,
      confirmed,
      pending,
      cancelled,
      completed,
      growth: Math.round(growth) // Arredonda para número inteiro
    };
  } catch (error) {
    console.error('Erro ao obter total de reservas:', error);
    return {
      total: 0,
      confirmed: 0,
      pending: 0, 
      cancelled: 0,
      completed: 0,
      growth: 0
    };
  }
};

// Obter receita mensal
export const getMonthlyRevenue = async () => {
  try {
    const bookings = await getDocuments<Booking>('bookings');
    
    // Filtrar reservas confirmadas e concluídas
    const validBookings = bookings.filter(b => 
      b.status === 'confirmed' || b.status === 'completed'
    );
    
    // Calcular receita total
    const totalRevenue = validBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
    
    // Agrupar receita por mês
    const revenueByMonth = validBookings.reduce((acc, booking) => {
      const date = booking.checkIn.toDate();
      const month = date.getMonth(); // 0-11
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += booking.totalPrice;
      return acc;
    }, {} as Record<string, number>);
    
    // Converter para formato de array para gráfico
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const revenueData = [];
    
    // Gerar dados dos últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      const key = `${year}-${month}`;
      
      revenueData.unshift({
        month: monthNames[month],
        value: revenueByMonth[key] || 0
      });
    }
    
    // Calcular crescimento em relação ao mês anterior
    const lastMonthRevenue = revenueData[revenueData.length - 2]?.value || 0;
    const currentMonthRevenue = revenueData[revenueData.length - 1]?.value || 0;
    
    const growth = lastMonthRevenue ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    
    return {
      monthly: currentMonthRevenue,
      total: totalRevenue,
      growth: Math.round(growth),
      revenueData
    };
  } catch (error) {
    console.error('Erro ao obter receita mensal:', error);
    return {
      monthly: 0,
      total: 0,
      growth: 0,
      revenueData: []
    };
  }
};

// Calcular taxa de ocupação
export const getOccupancyRate = async () => {
  try {
    // Obter todos os quartos
    const rooms = await getDocuments<Room>('rooms');
    const totalRooms = rooms.length;
    
    if (totalRooms === 0) {
      return { rate: 0, growth: 0 };
    }
    
    // Obter todas as reservas
    const bookings = await getDocuments<Booking>('bookings');
    
    // Filtrar reservas confirmadas e concluídas para o mês atual
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const currentMonthBookings = bookings.filter(booking => {
      const checkInDate = booking.checkIn.toDate();
      return (
        (booking.status === 'confirmed' || booking.status === 'completed') &&
        checkInDate.getMonth() === currentMonth &&
        checkInDate.getFullYear() === currentYear
      );
    });
    
    // Calcular dias ocupados por quarto
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalPossibleRoomDays = totalRooms * daysInMonth;
    
    // Contar dias ocupados (simplificado - em produção seria mais complexo)
    let occupiedDays = 0;
    
    currentMonthBookings.forEach(booking => {
      const checkIn = booking.checkIn.toDate();
      const checkOut = booking.checkOut.toDate();
      
      // Ajustar datas para considerar apenas o mês atual
      const startDate = new Date(Math.max(
        checkIn.getTime(),
        new Date(currentYear, currentMonth, 1).getTime()
      ));
      const endDate = new Date(Math.min(
        checkOut.getTime(),
        new Date(currentYear, currentMonth + 1, 0).getTime()
      ));
      
      // Calcular dias entre datas (incluindo check-in, excluindo check-out)
      const days = Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      occupiedDays += days;
    });
    
    const occupancyRate = (occupiedDays / totalPossibleRoomDays) * 100;
    
    // Simulação de crescimento (em produção, compararia com mês anterior)
    const growth = occupancyRate > 50 ? 5 : -3;
    
    return {
      rate: Math.round(occupancyRate),
      growth: Math.round(growth)
    };
  } catch (error) {
    console.error('Erro ao calcular taxa de ocupação:', error);
    return { rate: 0, growth: 0 };
  }
};

// Obter reservas agrupadas por plataforma
export const getBookingsByPlatform = async () => {
  try {
    const bookings = await getDocuments<Booking>('bookings');
    
    // Categorizar reservas por origem
    const platforms = [
      { 
        platform: "Booking.com", 
        color: "#003580", 
        icon: "Globe",
        bookings: []
      },
      { 
        platform: "Airbnb", 
        color: "#FF5A5F", 
        icon: "Heart",
        bookings: []
      },
      { 
        platform: "Direto", 
        color: "#4CAF50", 
        icon: "Home",
        bookings: []
      }
    ];
    
    // Para fins de demonstração, colocar todas as reservas como "Direto" por enquanto
    // Em produção, usaria um campo "platformOrigin" ou similar na tabela de reservas
    const platformIndex = 2; // Índice da plataforma "Direto"
    
    bookings.forEach(booking => {
      // Transformar para o formato esperado pelo componente
      const transformedBooking = {
        id: booking.id || '',
        guestName: booking.guestName,
        roomName: booking.roomName,
        checkIn: booking.checkIn.toDate().toLocaleDateString('pt-PT'),
        checkOut: booking.checkOut.toDate().toLocaleDateString('pt-PT'),
        status: booking.status,
        value: new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR'
        }).format(booking.totalPrice)
      };
      
      // Adicionar à plataforma "Direto"
      (platforms[platformIndex] as any).bookings.push(transformedBooking);
    });
    
    return platforms;
  } catch (error) {
    console.error('Erro ao obter reservas por plataforma:', error);
    return [];
  }
};

// Função para obter o preço de um quarto para uma data específica
export const getRoomPriceForDate = async (roomId: string, date: Date): Promise<number> => {
  try {
    const roomDoc = await getDoc(doc(db, "rooms", roomId));
    
    if (!roomDoc.exists()) {
      throw new Error("Quarto não encontrado");
    }
    
    const roomData = roomDoc.data() as Room;
    const basePrice = roomData.price;
    
    if (!roomData.seasonalPrices || roomData.seasonalPrices.length === 0) {
      return basePrice;
    }
    
    // Verificar se a data está dentro de algum período sazonal
    for (const seasonalPrice of roomData.seasonalPrices) {
      const startDate = new Date(seasonalPrice.startDate);
      const endDate = new Date(seasonalPrice.endDate);
      
      if (date >= startDate && date <= endDate) {
        return seasonalPrice.price;
      }
    }
    
    // Se não cair em nenhum período sazonal, retorna o preço base
    return basePrice;
  } catch (error) {
    console.error("Erro ao obter preço do quarto:", error);
    throw error;
  }
}

// Função para calcular o preço total de uma estadia
export const calculateStayPrice = async (
  roomId: string, 
  checkIn: Date, 
  checkOut: Date
): Promise<{
  totalPrice: number;
  nightlyPrices: { date: string; price: number }[];
  serviceFee: number;
  totalWithFee: number;
}> => {
  try {
    console.log(`🔍 Iniciando cálculo de preço para estadia: ${checkIn.toISOString().split('T')[0]} até ${checkOut.toISOString().split('T')[0]}`);
    
    const roomDoc = await getDoc(doc(db, "rooms", roomId));
    
    if (!roomDoc.exists()) {
      throw new Error("Quarto não encontrado");
    }
    
    const roomData = roomDoc.data() as Room;
    console.log(`📝 Dados do quarto ${roomId}:`, {
      nome: roomData.name,
      precoBase: roomData.price,
      taxaServico: roomData.serviceFeePct || 0,
      temPrecosSazonais: !!roomData.seasonalPrices?.length
    });
    
    const nightlyPrices: { date: string; price: number }[] = [];
    let totalPrice = 0;
    
    // Calcular o número de noites - corrigido para usar o método correto de cálculo
    // O número de noites é a diferença em dias (estadia = checkout - checkin)
    const noites = differenceInDays(checkOut, checkIn);
    console.log(`🗓️ Número de noites calculado: ${noites}`);
    
    if (noites <= 0) {
      console.error(`⚠️ Erro: número de noites inválido (${noites})`);
      throw new Error("Data de check-out deve ser posterior à data de check-in");
    }
    
    // Para cada noite, verificar o preço aplicável (preço base ou sazonal)
    // Começamos exatamente do dia de check-in
    const currentDate = new Date(checkIn);
    currentDate.setHours(0, 0, 0, 0); // Normalizar para meia-noite
    
    // Processamos cada dia de estadia (noite)
    console.log(`📊 Calculando preços por noite:`);
    for (let i = 0; i < noites; i++) {
      // Obtemos o preço para esta data
      const dateCopy = new Date(currentDate);
      const priceForDate = await getRoomPriceForDate(roomId, dateCopy);
      const dateString = dateCopy.toISOString().split('T')[0]; // YYYY-MM-DD
      
      console.log(`   - ${dateString}: €${priceForDate}`);
      
      nightlyPrices.push({
        date: dateString,
        price: priceForDate
      });
      
      totalPrice += priceForDate;
      
      // Avançamos para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Verificação de segurança para o cálculo do totalPrice
    const manualTotal = nightlyPrices.reduce((sum, night) => sum + night.price, 0);
    if (Math.abs(totalPrice - manualTotal) > 1) {
      console.error(`⚠️ Discrepância detectada no cálculo do preço total!`);
      console.error(`   - Total calculado iterativamente: €${totalPrice}`);
      console.error(`   - Total calculado via reduce: €${manualTotal}`);
      console.error(`   - Usando o valor recalculado para segurança!`);
      totalPrice = manualTotal;
    }
    
    // Calcular taxa de serviço
    const serviceFee = (totalPrice * (roomData.serviceFeePct || 0)) / 100;
    const totalWithFee = totalPrice + serviceFee;
    
    console.log(`💰 Resumo do cálculo:`);
    console.log(`   - Total das diárias: €${totalPrice}`);
    console.log(`   - Taxa de serviço (${roomData.serviceFeePct || 0}%): €${serviceFee}`);
    console.log(`   - Total com taxas: €${totalWithFee}`);
    
    return {
      totalPrice,
      nightlyPrices,
      serviceFee,
      totalWithFee
    };
  } catch (error) {
    console.error("❌ Erro ao calcular preço da estadia:", error);
    throw error;
  }
} 