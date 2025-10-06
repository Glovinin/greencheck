"use client"

import { ReactNode } from 'react'
import { useLoading } from '../contexts/loading-context'

interface MainContentProps {
  children: ReactNode
}

export default function MainContent({ children }: MainContentProps) {
  const { isInitialLoading } = useLoading()

  // Durante o loading inicial, não renderizar o conteúdo principal
  if (isInitialLoading) {
    return null
  }

  return <>{children}</>
}
