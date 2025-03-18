import { NextRequest, NextResponse } from 'next/server'
import { getDocument } from '@/lib/firebase/firestore'
import { Admin } from '@/lib/firebase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'UserId é obrigatório' },
        { status: 400 }
      )
    }
    
    // Buscar o documento do administrador no Firestore
    const admin = await getDocument<Admin>('admins', userId)
    
    return NextResponse.json({ isAdmin: !!admin })
  } catch (error) {
    console.error('Erro ao verificar administrador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 