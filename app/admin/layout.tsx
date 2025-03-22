"use client"

import { AuthProvider } from "@/lib/context/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {/* Não protegemos a página de login */}
      {children}
    </AuthProvider>
  )
} 