"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Settings, Construction, ExternalLink } from 'lucide-react'

export default function UnderConstruction() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-br from-background to-background/80 border border-primary/20 shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="text-primary/80"
                >
                  <Settings size={64} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center text-primary"
                >
                  <Construction size={32} />
                </motion.div>
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Página em Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <p className="text-muted-foreground">
                Esta funcionalidade está sendo desenvolvida pela equipe da Arcadesoft e estará disponível em breve.
              </p>
              <div className="flex items-center justify-center mt-4 pt-2 border-t border-border/30">
                <a 
                  href="https://arcadesoft.webflow.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  <span>arcadesoft.webflow.io</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <Button 
              variant="default" 
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Voltar ao Dashboard
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
} 