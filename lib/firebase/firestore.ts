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
import { Room } from '@/lib/types'

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
  createdAt?: Timestamp
  updatedAt?: Timestamp
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
    return { id: docSnap.id, ...docSnap.data() } as T
  } else {
    return null
  }
}

export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, ...constraints)
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T)
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
export const getRooms = async (featuredOnly = false): Promise<Room[]> => {
  try {
    const constraints: QueryConstraint[] = []
    
    if (featuredOnly) {
      constraints.push(where('featured', '==', true))
    }
    
    constraints.push(orderBy('name', 'asc'))
    
    const rooms = await getDocuments<Room>('rooms', constraints)
    
    // Garantir que todos os campos necessários estejam presentes
    return rooms.map(room => {
      console.log(`Firebase - Quarto ${room.id} dados brutos:`, room);
      
      return {
        id: room.id,
        name: room.name || '',
        type: room.type || 'standard',
        description: room.description || '',
        price: room.price || 0,
        capacity: room.capacity || 2,
        size: room.size || 0,
        available: room.available !== undefined ? room.available : true,
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
  
  // Adicionar cada data no intervalo
  while (currentDate <= endDateNormalized) {
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
export const createBooking = async (booking: Booking): Promise<string> => {
  try {
    // Primeiro, criar a reserva
    const bookingId = await createDocument<Booking>('bookings', booking);
    
    // Depois, atualizar a disponibilidade do quarto
    const room = await getRoomById(booking.roomId);
    if (room) {
      // Criar array de datas do intervalo da reserva
      const checkInDate = booking.checkIn.toDate();
      const checkOutDate = booking.checkOut.toDate();
      const dateStrings = getDatesInRange(checkInDate, checkOutDate);
      
      // Inicializar ou obter o objeto de disponibilidade existente
      const availabilityDates = room.availabilityDates || {};
      
      // Marcar as datas como indisponíveis
      dateStrings.forEach(dateStr => {
        availabilityDates[dateStr] = false;
      });
      
      // Atualizar o quarto com as novas datas indisponíveis
      await updateRoomAvailability(booking.roomId, availabilityDates);
    }
    
    return bookingId;
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    throw error;
  }
};

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
export const createContactMessage = async (contact: Contact): Promise<string> => {
  return createDocument<Contact>('contacts', contact)
}

export const getNewContactMessages = async (): Promise<Contact[]> => {
  return getDocuments<Contact>('contacts', [
    where('status', '==', 'new'),
    orderBy('createdAt', 'desc')
  ])
} 