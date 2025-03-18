import { registerUser } from './auth'
import { createDocumentWithId } from './firestore'

// Tipo para o administrador
export interface Admin {
  id: string
  email: string
  role: 'master' | 'admin' | 'editor'
  name: string
  createdAt?: any
  updatedAt?: any
}

// Tipo para o resultado da criação do administrador
export interface AdminCreationResult {
  success: boolean
  admin?: Admin
  error?: string
}

// Criar administrador mestre
export const createMasterAdmin = async (
  email: string,
  password: string,
  name: string
): Promise<AdminCreationResult> => {
  try {
    // Registrar o usuário no Firebase Auth
    const userCredential = await registerUser(email, password)
    const userId = userCredential.user.uid
    
    // Criar documento do administrador no Firestore
    const adminData: Admin = {
      id: userId,
      email,
      role: 'master',
      name
    }
    
    await createDocumentWithId('admins', userId, adminData)
    
    console.log('Administrador mestre criado com sucesso!')
    return {
      success: true,
      admin: adminData
    }
  } catch (error) {
    console.error('Erro ao criar administrador mestre:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Verificar se um usuário é administrador
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Verificar se o usuário existe na coleção de admins
    const adminDoc = await fetch(`/api/admin/check?userId=${userId}`)
    const data = await adminDoc.json()
    return data.isAdmin
  } catch (error) {
    console.error('Erro ao verificar se o usuário é administrador:', error)
    return false
  }
} 