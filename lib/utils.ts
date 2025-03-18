import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Redimensiona e comprime uma imagem para reduzir seu tamanho
 * @param file Arquivo de imagem original
 * @param maxWidth Largura máxima da imagem redimensionada (padrão: 1920px)
 * @param quality Qualidade da compressão (0-1, padrão: 0.8)
 * @returns Promise com o arquivo comprimido
 */
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo proporção
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Criar canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível obter contexto do canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determinar o tipo de saída (manter PNG para PNGs, JPEG para outros)
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        
        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao comprimir imagem'));
              return;
            }
            
            // Criar novo arquivo
            const compressedFile = new File(
              [blob], 
              file.name, 
              { type: outputType }
            );
            
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Comprime múltiplas imagens em paralelo
 * @param files Array de arquivos de imagem
 * @param maxWidth Largura máxima das imagens
 * @param quality Qualidade da compressão (0-1)
 * @param onProgress Callback para monitorar o progresso (0-100)
 * @returns Array de arquivos comprimidos
 */
export const compressImages = async (
  files: File[], 
  maxWidth: number = 1920, 
  quality: number = 0.8,
  onProgress?: (progress: number) => void
): Promise<File[]> => {
  if (!files.length) return [];
  
  const compressedFiles: File[] = [];
  let completed = 0;
  
  // Processar cada arquivo sequencialmente para melhor controle
  for (const file of files) {
    const compressedFile = await compressImage(file, maxWidth, quality);
    compressedFiles.push(compressedFile);
    
    // Atualizar progresso
    completed++;
    if (onProgress) {
      const progress = Math.round((completed / files.length) * 100);
      onProgress(progress);
    }
  }
  
  return compressedFiles;
};
