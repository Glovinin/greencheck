"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PropertyRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/admin/not-found')
  }, [router])
  
  return null
} 