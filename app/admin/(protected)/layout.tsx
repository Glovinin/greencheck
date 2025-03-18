"use client"

import ProtectedRoute from "@/components/auth/protected-route"
import Sidebar from "@/components/admin/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30 flex">
        <Sidebar />
        <div className="flex-1 md:pl-64 pt-16 md:pt-0">
          <main className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 