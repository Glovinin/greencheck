"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User } from "firebase/auth"
import { onAuthStateChange, getCurrentUser } from "@/lib/firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se já existe um usuário autenticado
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setLoading(false)
    }

    // Observar mudanças no estado de autenticação
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
} 