"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Loading LEVE para navegação entre páginas (sem iframe 3D)
// Visual elegante igual ao initial-loading, mas SEM o globo 3D pesado
export default function Loading() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-[9998] w-screen h-screen overflow-hidden bg-[#044050]"
    >
      {/* Fundo azul escuro sólido - sem iframe 3D para performance */}
      <div className="absolute inset-0 bg-[#044050]" />

      {/* Logo e Nome centralizados - mesmo estilo do initial-loading */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo com pulse effect */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                "drop-shadow(0 0 20px rgba(229, 255, 186, 0.3))",
                "drop-shadow(0 0 30px rgba(229, 255, 186, 0.5))",
                "drop-shadow(0 0 20px rgba(229, 255, 186, 0.3))"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/favicon.png"
              alt="GreenCheck Logo"
              width={isMobile ? 100 : 120}
              height={isMobile ? 100 : 120}
              className="drop-shadow-2xl"
              priority
            />
          </motion.div>
          
          {/* Nome GreenCheck */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-light text-white drop-shadow-lg tracking-wide`}>
              <span className="font-extralight">Green</span>
              <span className="font-medium">Check</span>
              <span className="text-lg align-super">™</span>
            </h1>
            
            {/* Loading dots animados */}
            <motion.div
              className="flex items-center justify-center gap-1 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#E5FFBA] rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}