import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import { auth } from './config'

// Registrar um novo usuário
export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

// Login de usuário
export const loginUser = async (email: string, password: string, rememberMe: boolean = false): Promise<UserCredential> => {
  // Define o tipo de persistência com base na opção "Lembrar-me"
  // LOCAL: mantém o usuário logado mesmo após fechar o navegador
  // SESSION: mantém o usuário logado apenas na sessão atual (até fechar o navegador)
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence
  
  // Configura a persistência antes de fazer login
  await setPersistence(auth, persistence)
  
  // Realiza o login
  return await signInWithEmailAndPassword(auth, email, password)
}

// Logout de usuário
export const signOut = async (): Promise<void> => {
  return await firebaseSignOut(auth)
}

// Observar mudanças no estado de autenticação
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Recuperação de senha
export const resetPassword = async (email: string): Promise<void> => {
  return await sendPasswordResetEmail(auth, email)
}

// Obter usuário atual
export const getCurrentUser = (): User | null => {
  return auth.currentUser
} 