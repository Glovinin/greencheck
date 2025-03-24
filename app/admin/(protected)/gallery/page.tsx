"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Upload, X, Plus, Image as ImageIcon, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { uploadMultipleImagesWithProgress, deleteImage } from "@/lib/firebase/storage"
import { createDocument, updateDocument, getDocuments, deleteDocument } from "@/lib/firebase/firestore"
import { useTheme } from "next-themes"
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// Categorias de imagens de galeria
const galleryCategories = [
  { id: 'todas', label: 'Todas' },
  { id: 'sobre_nos', label: 'Sobre Nós (Home)' },
  { id: 'quartos', label: 'Quartos' },
  { id: 'restaurante', label: 'Restaurante' },
  { id: 'piscina', label: 'Piscina' },
  { id: 'spa', label: 'Spa & Bem-estar' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'vistas', label: 'Vistas' },
  { id: 'experiencias', label: 'Experiências' }
]

// Posições das imagens na seção Sobre Nós da home
const aboutUsPositions = [
  { id: 1, label: 'Fachada do Hotel (Superior Esquerda)' },
  { id: 2, label: 'Quarto Luxuoso (Inferior Esquerda)' },
  { id: 3, label: 'Área de Eventos (Superior Direita)' },
  { id: 4, label: 'Piscina (Inferior Direita)' }
]

// Interface para o item de galeria
interface GalleryItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  featured: boolean
  displayOrder?: number
  createdAt: number
  isHomeAboutImage?: boolean
  homePosition?: number | null
}

// Interface para estatísticas de otimização
interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

// Função para otimizar imagens
const optimizeImage = async (file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Verificar o tamanho do arquivo (se for menor que 200KB, não precisa otimizar)
    if (file.size < 200 * 1024) {
      console.log('Imagem já é pequena o suficiente, pulando otimização');
      return resolve(file);
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Definir dimensões mantendo a proporção
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        // Criar canvas para redimensionamento
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        if (!ctx) {
          return reject(new Error('Não foi possível criar contexto de canvas'));
        }
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Falha ao gerar blob'));
            }
            
            // Criar arquivo a partir do blob
            const optimizedFile = new File(
              [blob], 
              file.name, 
              { 
                type: 'image/jpeg', 
                lastModified: Date.now() 
              }
            );
            
            console.log(`Imagem otimizada: ${(file.size / 1024).toFixed(2)}KB → ${(optimizedFile.size / 1024).toFixed(2)}KB`);
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem para otimização'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo para otimização'));
    };
  });
};

export default function GalleryManagement() {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  // Estados para gerenciamento de imagens
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [isLoading, setIsLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("gallery")
  const [aboutUsImages, setAboutUsImages] = useState<GalleryItem[]>([])
  
  // Estados para o formulário de adição/edição
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [featured, setFeatured] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isHomeAboutImage, setIsHomeAboutImage] = useState(false)
  const [homePosition, setHomePosition] = useState<number | null>(null)
  
  // Estados para otimização de imagem
  const [imageQuality, setImageQuality] = useState(0.8)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [optimizationStats, setOptimizationStats] = useState<OptimizationStats | null>(null)
  
  // Carregar dados da galeria do Firebase
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setIsLoading(true)
      try {
        const items = await getDocuments<GalleryItem>('gallery')
        // Ordenar por destaque e depois por ordem de criação (mais recente primeiro)
        const sortedItems = items.sort((a: GalleryItem, b: GalleryItem) => {
          // Primeiro por destaque
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          
          // Depois por ordem personalizada (se existir)
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder
          }
          
          // Por fim, por data de criação (mais recente primeiro)
          return b.createdAt - a.createdAt
        })
        
        setGalleryItems(sortedItems)
        
        // Identificar imagens da seção "Sobre Nós"
        const aboutImages = sortedItems.filter(item => item.isHomeAboutImage)
        setAboutUsImages(aboutImages)
      } catch (error) {
        console.error('Erro ao carregar itens da galeria:', error)
        toast.error('Erro ao carregar a galeria')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGalleryItems()
  }, [])
  
  // Filtrar itens quando a categoria selecionada mudar
  useEffect(() => {
    if (selectedCategory === 'todas') {
      setFilteredItems(galleryItems)
    } else if (selectedCategory === 'sobre_nos') {
      setFilteredItems(galleryItems.filter(item => item.isHomeAboutImage))
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === selectedCategory))
    }
  }, [selectedCategory, galleryItems])
  
  // Gerar preview da imagem selecionada
  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0]
      const reader = new FileReader()
      
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      
      reader.readAsDataURL(file)
    } else if (!isEditMode) {
      setPreviewUrl(null)
    }
  }, [selectedFiles, isEditMode])
  
  // Otimizar imagem quando selecionada
  useEffect(() => {
    const optimizeSelectedImage = async () => {
      if (selectedFiles && selectedFiles.length > 0) {
        const file = selectedFiles[0]
        
        // Se a imagem for muito grande, mostrar toast informando que será otimizada
        if (file.size > 1024 * 1024) { // Maior que 1MB
          toast.info(`Imagem grande detectada (${(file.size / (1024 * 1024)).toFixed(2)}MB). Será otimizada automaticamente.`)
        }
        
        // Exibir preview normal, mas preparar estatísticas de otimização
        try {
          const optimizedFile = await optimizeImage(file, maxWidth, imageQuality)
          
          // Calcular estatísticas
          const originalSizeKB = file.size / 1024
          const optimizedSizeKB = optimizedFile.size / 1024
          const compressionRatio = (1 - (optimizedFile.size / file.size)) * 100
          
          setOptimizationStats({
            originalSize: originalSizeKB,
            optimizedSize: optimizedSizeKB,
            compressionRatio
          })
        } catch (error) {
          console.error('Erro ao calcular estatísticas de otimização:', error)
          setOptimizationStats(null)
        }
      } else {
        setOptimizationStats(null)
      }
    }
    
    optimizeSelectedImage()
  }, [selectedFiles, maxWidth, imageQuality])
  
  // Resetar o formulário
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCategory("")
    setFeatured(false)
    setSelectedFiles(null)
    setPreviewUrl(null)
    setCurrentItem(null)
    setIsEditMode(false)
    setIsPanelOpen(false)
    setIsHomeAboutImage(false)
    setHomePosition(null)
  }
  
  // Abrir o painel para adicionar novo item
  const openAddPanel = () => {
    resetForm()
    setIsPanelOpen(true)
  }
  
  // Abrir o painel para adicionar imagem para a seção Sobre Nós
  const openAddAboutUsPanel = (position?: number) => {
    resetForm()
    setIsHomeAboutImage(true)
    if (position) {
      setHomePosition(position)
    }
    setIsPanelOpen(true)
  }
  
  // Abrir o painel para editar um item existente
  const openEditPanel = (item: GalleryItem) => {
    setIsEditMode(true)
    setIsPanelOpen(true)
    setCurrentItem(item)
    
    // Preencher o formulário com os dados do item
    setTitle(item.title)
    setDescription(item.description)
    setCategory(item.category)
    setFeatured(item.featured)
    setPreviewUrl(item.image)
    setIsHomeAboutImage(item.isHomeAboutImage || false)
    setHomePosition(item.homePosition || null)
  }
  
  // Lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('O título é obrigatório')
      return
    }
    
    if (!category && !isHomeAboutImage) {
      toast.error('Selecione uma categoria')
      return
    }
    
    if (isHomeAboutImage && !homePosition) {
      toast.error('Selecione a posição da imagem na seção Sobre Nós')
      return
    }
    
    if (!isEditMode && (!selectedFiles || selectedFiles.length === 0)) {
      toast.error('Selecione uma imagem')
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Se estiver em modo de edição e não houver nova imagem, apenas atualize os metadados
      if (isEditMode && (!selectedFiles || selectedFiles.length === 0)) {
        if (currentItem) {
          try {
            await updateDocument('gallery', currentItem.id, {
              title,
              description,
              category: isHomeAboutImage ? 'sobre_nos' : category,
              featured,
              isHomeAboutImage,
              homePosition: isHomeAboutImage ? homePosition : null,
              updatedAt: Date.now()
            })
            
            // Atualizar a lista localmente
            setGalleryItems(prev => prev.map(item => 
              item.id === currentItem.id 
                ? {
                    ...item,
                    title,
                    description,
                    category: isHomeAboutImage ? 'sobre_nos' : category,
                    featured,
                    isHomeAboutImage,
                    homePosition: isHomeAboutImage ? homePosition : null,
                    updatedAt: Date.now()
                  }
                : item
            ))
            
            // Se for uma imagem do Sobre Nós, verificar se há outra imagem na mesma posição
            if (isHomeAboutImage && homePosition) {
              const existingItemInSamePosition = galleryItems.find(
                item => item.isHomeAboutImage && item.homePosition === homePosition && item.id !== currentItem.id
              )
              
              if (existingItemInSamePosition) {
                await updateDocument('gallery', existingItemInSamePosition.id, {
                  isHomeAboutImage: false,
                  homePosition: null
                })
                
                // Atualizar a lista localmente
                setGalleryItems(prev => prev.map(item => 
                  item.id === existingItemInSamePosition.id 
                    ? {
                        ...item,
                        isHomeAboutImage: false,
                        homePosition: null
                      }
                    : item
                ))
                
                toast.info(`A imagem "${existingItemInSamePosition.title}" foi removida da posição ${homePosition} da seção Sobre Nós`)
              }
            }
            
            toast.success('Item atualizado com sucesso')
          } catch (error) {
            console.error('Erro ao atualizar metadados:', error)
            toast.error('Erro ao atualizar dados. Tente novamente.')
          }
        }
      } else {
        // Caso contrário, faça upload da imagem
        if (!selectedFiles || selectedFiles.length === 0) return
        
        // Converter FileList para Array
        const filesArray = Array.from(selectedFiles)
        
        // Otimizar as imagens antes do upload
        toast.info('Otimizando imagens...')
        
        // Mostrar progresso de otimização 
        let currentFileIndex = 0
        const totalFiles = filesArray.length
        
        console.log("Iniciando otimização de", filesArray.length, "arquivos")
        
        const optimizedFiles = await Promise.all(
          filesArray.map(async (file) => {
            try {
              currentFileIndex++
              setUploadProgress((currentFileIndex / totalFiles) * 50) // Primeira metade do progresso é para otimização
              console.log(`Otimizando arquivo ${currentFileIndex}/${totalFiles}: ${file.name}`)
              
              return await optimizeImage(file, maxWidth, imageQuality)
            } catch (error) {
              console.error('Erro ao otimizar imagem, usando original:', error)
              return file
            }
          })
        )
        
        // Toast com informações sobre a otimização
        const originalSize = filesArray.reduce((acc, file) => acc + file.size, 0) / 1024
        const optimizedSize = optimizedFiles.reduce((acc, file) => acc + file.size, 0) / 1024
        const reduction = Math.round((1 - (optimizedSize / originalSize)) * 100)
        
        if (reduction > 0) {
          toast.success(`Imagens otimizadas: ${originalSize.toFixed(0)}KB → ${optimizedSize.toFixed(0)}KB (${reduction}% menor)`)
        }
        
        console.log(`Iniciando upload de ${optimizedFiles.length} arquivos otimizados`)
        
        try {
          // Upload da imagem com monitoramento de progresso
          const imageUrls = await uploadMultipleImagesWithProgress(
            optimizedFiles,
            'gallery',
            (progress) => {
              // Segunda metade do progresso é para upload
              setUploadProgress(50 + (progress / 2))
              console.log(`Progresso do upload: ${progress}%`)
            }
          )
          
          console.log("Upload completo. URLs geradas:", imageUrls)
          
          // Se estiver editando, exclua a imagem antiga primeiro
          if (isEditMode && currentItem) {
            try {
              // Extrair o caminho da URL para excluir
              const imageUrlPath = new URL(currentItem.image).pathname
              const imagePath = decodeURIComponent(imageUrlPath.split('/o/')[1].split('?')[0])
              
              console.log(`Excluindo imagem antiga: ${imagePath}`)
              await deleteImage(currentItem.image)
            } catch (error) {
              console.error('Erro ao excluir imagem antiga:', error)
            }
            
            // Se for uma imagem do Sobre Nós, verificar se há outra imagem na mesma posição
            if (isHomeAboutImage && homePosition) {
              const existingItemInSamePosition = galleryItems.find(
                item => item.isHomeAboutImage && item.homePosition === homePosition && item.id !== currentItem.id
              )
              
              if (existingItemInSamePosition) {
                await updateDocument('gallery', existingItemInSamePosition.id, {
                  isHomeAboutImage: false,
                  homePosition: null
                })
                
                // Atualizar a lista localmente
                setGalleryItems(prev => prev.map(item => 
                  item.id === existingItemInSamePosition.id 
                    ? {
                        ...item,
                        isHomeAboutImage: false,
                        homePosition: null
                      }
                    : item
                ))
                
                toast.info(`A imagem "${existingItemInSamePosition.title}" foi removida da posição ${homePosition} da seção Sobre Nós`)
              }
            }
            
            // Atualizar o documento
            await updateDocument('gallery', currentItem.id, {
              title,
              description,
              image: imageUrls[0],
              category: isHomeAboutImage ? 'sobre_nos' : category,
              featured,
              isHomeAboutImage,
              homePosition: isHomeAboutImage ? homePosition : null,
              updatedAt: Date.now()
            })
            
            // Atualizar a lista localmente
            setGalleryItems(prev => prev.map(item => 
              item.id === currentItem.id 
                ? {
                    ...item,
                    title,
                    description,
                    image: imageUrls[0],
                    category: isHomeAboutImage ? 'sobre_nos' : category,
                    featured,
                    isHomeAboutImage,
                    homePosition: isHomeAboutImage ? homePosition : null,
                    updatedAt: Date.now()
                  }
                : item
            ))
            
            toast.success('Item atualizado com sucesso')
          } else {
            // Adicionar novo documento
            
            // Se for uma imagem do Sobre Nós, verificar se há outra imagem na mesma posição
            if (isHomeAboutImage && homePosition) {
              const existingItemInSamePosition = galleryItems.find(
                item => item.isHomeAboutImage && item.homePosition === homePosition
              )
              
              if (existingItemInSamePosition) {
                await updateDocument('gallery', existingItemInSamePosition.id, {
                  isHomeAboutImage: false,
                  homePosition: null
                })
                
                // Atualizar a lista localmente
                setGalleryItems(prev => prev.map(item => 
                  item.id === existingItemInSamePosition.id 
                    ? {
                        ...item,
                        isHomeAboutImage: false,
                        homePosition: null
                      }
                    : item
                ))
                
                toast.info(`A imagem "${existingItemInSamePosition.title}" foi removida da posição ${homePosition} da seção Sobre Nós`)
              }
            }
            
            const newItem: Omit<GalleryItem, 'id'> = {
              title,
              description,
              image: imageUrls[0],
              category: isHomeAboutImage ? 'sobre_nos' : category,
              featured,
              isHomeAboutImage,
              homePosition: isHomeAboutImage ? homePosition : null,
              createdAt: Date.now(),
              displayOrder: galleryItems.length + 1
            }
            
            const docId = await createDocument('gallery', newItem)
            
            // Adicionar à lista local
            if (docId) {
              setGalleryItems(prev => [
                { ...newItem, id: docId },
                ...prev
              ])
            }
            
            toast.success('Item adicionado com sucesso')
          }
        } catch (uploadError) {
          console.error('Erro durante o upload de imagem:', uploadError)
          let errorMessage = 'Erro ao fazer upload da imagem'
          
          if (uploadError instanceof Error) {
            errorMessage += ': ' + uploadError.message
          }
          
          if (window.location.hostname === 'localhost') {
            errorMessage += '. Está usando a versão de desenvolvimento que contorna problemas de CORS.'
          }
          
          toast.error(errorMessage)
          return
        }
      }
      
      // Atualizar lista de imagens da seção "Sobre Nós"
      if (isHomeAboutImage) {
        setAboutUsImages(prev => {
          const updated = [...galleryItems.filter(item => item.isHomeAboutImage)]
          return updated
        })
      }
      
      resetForm()
    } catch (error) {
      console.error('Erro geral no processo de upload:', error)
      let errorMessage = 'Ocorreu um erro ao salvar o item'
      
      if (error instanceof Error) {
        errorMessage += ': ' + error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }
  
  // Excluir um item
  const handleDeleteItem = async (item: GalleryItem) => {
    try {
      // Excluir do Firestore
      await deleteDocument('gallery', item.id)
      
      // Excluir a imagem do Storage
      try {
        const imageUrlPath = new URL(item.image).pathname
        const imagePath = decodeURIComponent(imageUrlPath.split('/o/')[1].split('?')[0])
        await deleteImage(imagePath)
      } catch (error) {
        console.error('Erro ao excluir imagem:', error)
      }
      
      // Atualizar a lista local
      setGalleryItems(prev => prev.filter(i => i.id !== item.id))
      
      toast.success('Item excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      toast.error('Erro ao excluir o item')
    }
  }
  
  // Navegar de volta
  const handleBack = () => {
    router.push('/admin');
  };

  // Exibir mensagem para adicionar nova imagem
  const handleAddImage = () => {
    toast.info('Funcionalidade sendo implementada. Volte em breve!');
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Gerenciamento da Galeria</h1>
          </div>
          
          <Button onClick={handleAddImage}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Imagem
          </Button>
        </div>
        
        {/* Filtro de categorias */}
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map(category => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="text-sm"
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        {/* Lista de imagens */}
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhuma imagem encontrada</h3>
            <p className="text-muted-foreground mt-1">
              {selectedCategory === 'todas' 
                ? 'Nenhuma imagem foi adicionada à galeria ainda.'
                : `Nenhuma imagem na categoria "${galleryCategories.find(c => c.id === selectedCategory)?.label}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 