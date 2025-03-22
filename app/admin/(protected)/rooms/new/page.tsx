"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Upload, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createRoom } from "@/lib/firebase/firestore"
import { uploadMultipleImagesWithProgress } from "@/lib/firebase/storage"
import Header from "@/components/admin/header"
import { Badge } from "@/components/ui/badge"
import { compressImages } from "@/lib/utils"
import { toast } from "sonner"

export default function NewRoom() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [amenities, setAmenities] = useState<string[]>([
    "Wi-Fi Grátis", 
    "Ar Condicionado", 
    "TV de Tela Plana"
  ])
  const [newAmenity, setNewAmenity] = useState("")
  const [additionalServices, setAdditionalServices] = useState<string[]>([
    "Serviço de quarto",
    "Café da manhã",
    "Transfer",
    "Massagem"
  ])
  const [newService, setNewService] = useState("")
  const [highlights, setHighlights] = useState<string[]>([
    "Vista panorâmica",
    "Cama king-size",
    "Área de estar"
  ])
  const [newHighlight, setNewHighlight] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    type: "standard",
    description: "",
    price: 0,
    capacity: 2,
    size: 0,
    available: true,
    serviceFeePct: 10,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Tratamento especial para o campo serviceFeePct para garantir que o valor 0 seja tratado corretamente
    if (name === "serviceFeePct") {
      const parsedValue = parseFloat(value)
      // Verificação específica para serviceFeePct, permitindo explicitamente o valor 0
      setFormData({
        ...formData,
        [name]: isNaN(parsedValue) ? 0 : parsedValue
      })
    } else {
      // Tratamento normal para outros campos
      setFormData({
        ...formData,
        [name]: name === "price" || name === "capacity" || name === "size" 
          ? parseFloat(value) 
          : value
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      available: checked
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const remainingSlots = 10 - imageFiles.length;
      
      if (remainingSlots <= 0) {
        toast.error("Você já atingiu o limite máximo de 10 imagens.");
        return;
      }
      
      const newFiles = Array.from(e.target.files).slice(0, remainingSlots);
      
      // Calcular tamanho total antes da compressão
      const originalSize = newFiles.reduce((total, file) => total + file.size, 0);
      const originalSizeMB = (originalSize / (1024 * 1024)).toFixed(2);
      
      // Mostrar indicador de carregamento
      const loadingToast = toast.loading("Processando imagens... 0%");
      
      try {
        // Comprimir as imagens com monitoramento de progresso
        const compressedFiles = await compressImages(
          newFiles, 
          1920, 
          0.8,
          (progress) => {
            toast.loading(`Processando imagens... ${progress}%`, {
              id: loadingToast
            });
          }
        );
        
        // Calcular tamanho total após a compressão
        const compressedSize = compressedFiles.reduce((total, file) => total + file.size, 0);
        const compressedSizeMB = (compressedSize / (1024 * 1024)).toFixed(2);
        const reductionPercentage = ((1 - compressedSize / originalSize) * 100).toFixed(0);
        
        // Criar URLs de preview
        const newPreviewUrls = compressedFiles.map(file => URL.createObjectURL(file));
        
        // Atualizar o estado
        setImageFiles([...imageFiles, ...compressedFiles]);
        setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
        
        // Mostrar mensagem de sucesso
        toast.success(
          `Imagens processadas com sucesso! Tamanho reduzido de ${originalSizeMB}MB para ${compressedSizeMB}MB (${reductionPercentage}% menor)`,
          {
            id: loadingToast
          }
        );
        
        if (newFiles.length < e.target.files.length) {
          toast.warning(`Apenas ${newFiles.length} imagens foram adicionadas. O limite máximo é de 10 imagens.`);
        }
      } catch (error) {
        console.error("Erro ao processar imagens:", error);
        toast.error("Erro ao processar imagens. Tente novamente.", {
          id: loadingToast
        });
      }
    }
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])
    
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const addService = () => {
    if (newService.trim() && !additionalServices.includes(newService.trim())) {
      setAdditionalServices([...additionalServices, newService.trim()])
      setNewService("")
    }
  }

  const removeService = (index: number) => {
    setAdditionalServices(additionalServices.filter((_, i) => i !== index))
  }

  const addHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()])
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.price <= 0 || imageFiles.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios e adicione pelo menos uma imagem.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload das imagens com progresso
      let imageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        const loadingToast = toast.loading(`Enviando ${imageFiles.length} imagens... 0%`);
        
        imageUrls = await uploadMultipleImagesWithProgress(
          imageFiles,
          `rooms/${Date.now()}`,
          (totalProgress) => {
            // Atualizar o toast com o progresso total
            toast.loading(`Enviando ${imageFiles.length} imagens... ${totalProgress}%`, {
              id: loadingToast
            });
          }
        );
        
        toast.success(`${imageFiles.length} imagens enviadas com sucesso!`, {
          id: loadingToast
        });
      }
      
      // Criar o quarto com todas as imagens
      toast.loading("Criando novo quarto...");
      
      const roomData = {
        ...formData,
        images: imageUrls,
        amenities,
        additionalServices,
        highlights,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await createRoom(roomData);
      
      toast.success("Quarto criado com sucesso!");
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Erro ao criar quarto:", error);
      toast.error("Erro ao criar quarto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header 
        title="Adicionar Novo Quarto" 
        subtitle="Preencha os detalhes para criar um novo quarto"
      />
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Detalhes principais do quarto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Quarto *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Ex: Suíte Deluxe com Vista para o Mar" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Quarto</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suíte</SelectItem>
                    <SelectItem value="family">Familiar</SelectItem>
                    <SelectItem value="presidential">Presidencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Descreva o quarto em detalhes..." 
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhes e Preço</CardTitle>
              <CardDescription>Especificações e valores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço por Noite (€) *</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  placeholder="0.00" 
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceFeePct">Taxa de Serviço (%)</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Aplicar taxa de serviço</span>
                    <Switch 
                      checked={formData.serviceFeePct > 0}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          serviceFeePct: checked ? 10 : 0
                        })
                      }}
                    />
                  </div>
                  
                  {formData.serviceFeePct > 0 && (
                    <Input 
                      id="serviceFeePct" 
                      name="serviceFeePct" 
                      type="number" 
                      min="0.1" 
                      max="100"
                      step="0.1"
                      placeholder="10" 
                      value={formData.serviceFeePct || ""}
                      onChange={handleInputChange}
                    />
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {formData.serviceFeePct > 0 
                      ? `Taxa de ${formData.serviceFeePct}% sobre o valor da diária.` 
                      : "Nenhuma taxa de serviço será aplicada."}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidade (pessoas)</Label>
                  <Input 
                    id="capacity" 
                    name="capacity" 
                    type="number" 
                    min="1" 
                    max="10"
                    value={formData.capacity || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Tamanho (m²)</Label>
                  <Input 
                    id="size" 
                    name="size" 
                    type="number" 
                    min="0"
                    value={formData.size || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="available">Disponível para Reservas</Label>
                <Switch 
                  id="available" 
                  checked={formData.available}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comodidades</CardTitle>
            <CardDescription>Adicione as comodidades disponíveis no quarto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {amenities.map((amenity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{amenity}</span>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 rounded-full"
                    onClick={() => removeAmenity(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Adicionar comodidade..." 
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button 
                type="button"
                variant="outline" 
                onClick={addAmenity}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Sugestões rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {["Wi-Fi Grátis", "Ar Condicionado", "TV de Tela Plana", "Frigobar", "Cofre", "Secador de Cabelo", "Vista para o Mar", "Varanda", "Banheira"].map((suggestion) => (
                  !amenities.includes(suggestion) && (
                    <Badge 
                      key={suggestion}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => {
                        if (!amenities.includes(suggestion)) {
                          setAmenities([...amenities, suggestion])
                        }
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Serviços Adicionais</CardTitle>
            <CardDescription>Adicione serviços adicionais disponíveis no quarto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {additionalServices.map((service, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{service}</span>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 rounded-full"
                    onClick={() => removeService(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Adicionar serviço..." 
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
              />
              <Button 
                type="button"
                variant="outline" 
                onClick={addService}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Sugestões rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {["Serviço de quarto", "Café da manhã", "Transfer", "Massagem", "Decoração romântica", "Jantar privativo", "Champanhe de boas-vindas", "Passeios guiados", "Babysitter"].map((suggestion) => (
                  !additionalServices.includes(suggestion) && (
                    <Badge 
                      key={suggestion}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => {
                        if (!additionalServices.includes(suggestion)) {
                          setAdditionalServices([...additionalServices, suggestion])
                        }
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Destaques do Quarto</CardTitle>
            <CardDescription>Adicione os principais destaques que serão exibidos em destaque na página do quarto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {highlights.map((highlight, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{highlight}</span>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 rounded-full"
                    onClick={() => removeHighlight(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Adicionar destaque..." 
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              />
              <Button 
                type="button"
                variant="outline" 
                onClick={addHighlight}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Sugestões rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {["Vista panorâmica", "Cama king-size", "Banheira de hidromassagem", "Varanda privativa", "Decoração exclusiva", "Área de estar", "Acesso direto à piscina", "Tecnologia smart"].map((suggestion) => (
                  !highlights.includes(suggestion) && (
                    <Badge 
                      key={suggestion}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => {
                        if (!highlights.includes(suggestion)) {
                          setHighlights([...highlights, suggestion])
                        }
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
            <CardDescription>Adicione fotos do quarto (mínimo 1 imagem, máximo 10) *</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {imageFiles.length} de 10 imagens
              </p>
              <Badge variant={imageFiles.length >= 10 ? "destructive" : "outline"}>
                {imageFiles.length >= 10 
                  ? "Limite máximo atingido" 
                  : `Você pode adicionar mais ${10 - imageFiles.length} imagens`}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {imageFiles.length < 10 && (
                <label className="flex flex-col items-center justify-center border border-dashed rounded-md aspect-square cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Clique para adicionar</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP</p>
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                    multiple
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => router.push('/admin/rooms')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Quarto"
            )}
          </Button>
        </div>
      </form>
    </>
  )
} 