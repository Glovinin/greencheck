import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  uploadBytesResumable
} from 'firebase/storage'
import { storage } from './config'

// Armazenamento temporário para ambiente de desenvolvimento
const localStorageImages: Record<string, string> = {}

// Função para salvar imagens temporárias no localStorage
const saveLocalImages = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('aqua-vista-temp-images', JSON.stringify(localStorageImages));
      console.log('Imagens salvas no localStorage');
    } catch (e) {
      console.error('Erro ao salvar imagens no localStorage:', e);
    }
  }
}

// Função para carregar imagens temporárias do localStorage
const loadLocalImages = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedImages = localStorage.getItem('aqua-vista-temp-images');
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        Object.assign(localStorageImages, parsedImages);
        console.log('Imagens carregadas do localStorage:', Object.keys(parsedImages).length);
      }
    } catch (e) {
      console.error('Erro ao carregar imagens do localStorage:', e);
    }
  }
}

// Carregar imagens salvas quando o módulo é importado
if (typeof window !== 'undefined') {
  // Executar em um setTimeout para garantir que o window esteja disponível
  setTimeout(loadLocalImages, 0);
}

// Função para obter a URL de dados de uma imagem simulada
export const getLocalImageUrl = (path: string): string | null => {
  if (localStorageImages[path]) {
    return localStorageImages[path];
  }
  return null;
}

// Upload de arquivo
export const uploadFile = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    console.log(`Iniciando upload para caminho: ${path}`)
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log(`Upload completo: ${path}`)
    return downloadURL
  } catch (error) {
    console.error('Erro durante uploadFile:', error)
    throw error
  }
}

// Upload de múltiplos arquivos
export const uploadMultipleFiles = async (
  files: File[],
  basePath: string
): Promise<string[]> => {
  try {
    console.log(`Iniciando upload múltiplo para: ${basePath}`)
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`
      return uploadFile(file, path)
    })
    
    return Promise.all(uploadPromises)
  } catch (error) {
    console.error('Erro durante uploadMultipleFiles:', error)
    throw error
  }
}

// Obter URL de download
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path)
    return getDownloadURL(storageRef)
  } catch (error) {
    console.error(`Erro ao obter URL para ${path}:`, error)
    throw error
  }
}

// Deletar arquivo
export const deleteFile = async (path: string): Promise<void> => {
  try {
    console.log(`Deletando arquivo: ${path}`)
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
    console.log(`Arquivo deletado: ${path}`)
  } catch (error) {
    console.error(`Erro ao deletar ${path}:`, error)
    throw error
  }
}

// Listar arquivos em um diretório
export const listFiles = async (path: string): Promise<string[]> => {
  try {
    const storageRef = ref(storage, path)
    const result = await listAll(storageRef)
    
    const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef))
    return Promise.all(urlPromises)
  } catch (error) {
    console.error(`Erro ao listar arquivos em ${path}:`, error)
    throw error
  }
}

// Extrair nome do arquivo de uma URL
export const getFileNameFromUrl = (url: string): string => {
  const decodedUrl = decodeURIComponent(url)
  return decodedUrl.split('/').pop()?.split('?')[0] || ''
}

// Extrair caminho do arquivo de uma URL
export const getPathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)/)
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1])
    }
    return null
  } catch (error) {
    console.error('Erro ao extrair caminho da URL:', error)
    return null
  }
}

/**
 * Cria uma URL de dados a partir de um arquivo
 * @param file Arquivo para criar a URL
 * @returns Promise com URL de dados
 */
const createDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

/**
 * Faz upload de uma imagem para o Firebase Storage
 * @param file Arquivo a ser enviado
 * @param basePath Caminho base onde o arquivo será armazenado
 * @returns URL da imagem enviada
 */
export const uploadImage = async (file: File, basePath: string): Promise<string> => {
  try {
    // Gerar um nome de arquivo único
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomId}.${fileExtension}`;
    
    // Caminho completo para o arquivo
    const fullPath = `${basePath}/${fileName}`;
    console.log(`Iniciando upload de imagem: ${fullPath}`)
    
    // Fazer upload do arquivo
    const storageRef = ref(storage, fullPath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`Imagem enviada com sucesso: ${fullPath}`);
    console.log(`URL de download: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
}

/**
 * Exclui uma imagem do Firebase Storage
 * @param url URL da imagem a ser excluída
 * @returns true se a exclusão foi bem-sucedida
 */
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extrair o caminho da URL
    console.log(`Iniciando exclusão de imagem: ${url}`)
    const decodedUrl = decodeURIComponent(url)
    const startIndex = decodedUrl.indexOf('/o/') + 3
    const endIndex = decodedUrl.indexOf('?')
    
    if (startIndex < 3 || endIndex < 0) {
      console.error('Formato de URL inválido:', url)
      return false
    }
    
    const path = decodedUrl.substring(startIndex, endIndex)
    console.log(`Caminho extraído: ${path}`)
    
    // Criar referência e excluir
    const imageRef = ref(storage, path)
    await deleteObject(imageRef)
    console.log(`Imagem excluída com sucesso: ${path}`)
    return true
  } catch (error) {
    console.error('Erro ao excluir imagem:', error)
    return false
  }
}

/**
 * Faz upload de uma imagem para o Firebase Storage com monitoramento de progresso
 * @param file Arquivo a ser enviado
 * @param basePath Caminho base onde o arquivo será armazenado
 * @param onProgress Callback para monitorar o progresso (0-100)
 * @returns URL da imagem enviada
 */
export const uploadImageWithProgress = async (
  file: File, 
  basePath: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Gerar um nome de arquivo único
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomId}.${fileExtension}`;
    
    // Caminho completo para o arquivo
    const fullPath = `${basePath}/${fileName}`;
    console.log(`Iniciando upload com progresso: ${fullPath}`)
    
    // Criar referência para o arquivo
    const storageRef = ref(storage, fullPath);
    
    // Criar tarefa de upload com monitoramento de progresso
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Retornar uma promessa que resolve quando o upload for concluído
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calcular e reportar o progresso
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`Progresso do upload: ${progress}%`);
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Lidar com erros específicos
          console.error('Erro durante o upload:', error);
          
          // Verificar se é um erro de CORS
          if (error.message?.includes('CORS') || 
              error.message?.includes('cross-origin') ||
              error.code === 'storage/unauthorized') {
            const corsError = new Error('Erro de CORS: O Firebase Storage não está configurado para aceitar uploads do seu domínio. Configure as regras CORS no Firebase Console.');
            corsError.name = 'CORSError';
            reject(corsError);
          } else if (error.code === 'storage/quota-exceeded') {
            const quotaError = new Error('Cota de armazenamento excedida. Verifique o plano do Firebase.');
            quotaError.name = 'QuotaError';
            reject(quotaError);
          } else {
            reject(error);
          }
        },
        async () => {
          try {
            // Upload concluído com sucesso
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`Upload concluído com sucesso! URL: ${downloadURL}`);
            resolve(downloadURL);
          } catch (error) {
            console.error('Erro ao obter URL de download:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    
    // Melhorar mensagens de erro
    if (error instanceof Error) {
      if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
        throw new Error('Erro de CORS: Configure as permissões do Firebase Storage para este domínio.');
      } else if (error.message?.includes('permission') || error.message?.includes('unauthorized')) {
        throw new Error('Erro de permissão: Verifique as regras de segurança do Firebase Storage.');
      }
    }
    
    throw error;
  }
}

/**
 * Faz upload de múltiplas imagens para o Firebase Storage com monitoramento de progresso
 * @param files Array de arquivos a serem enviados
 * @param basePath Caminho base onde os arquivos serão armazenados
 * @param onTotalProgress Callback para monitorar o progresso total (0-100)
 * @param onFileProgress Callback para monitorar o progresso de cada arquivo (0-100)
 * @returns Array com as URLs das imagens enviadas
 */
export const uploadMultipleImagesWithProgress = async (
  files: File[],
  basePath: string,
  onTotalProgress?: (progress: number) => void,
  onFileProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> => {
  // Se não houver arquivos, retornar array vazio
  if (!files.length) return [];
  
  console.log(`Iniciando upload múltiplo com progresso: ${files.length} arquivos para ${basePath}`);
  const urls: string[] = [];
  let totalProgress = 0;
  
  try {
    // Processar cada arquivo sequencialmente para melhor controle
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Processando arquivo ${i+1}/${files.length}: ${file.name}`);
      
      // Fazer upload do arquivo atual com monitoramento de progresso
      const url = await uploadImageWithProgress(
        file,
        basePath,
        (progress) => {
          // Reportar progresso do arquivo atual
          if (onFileProgress) {
            onFileProgress(i, progress);
          }
          
          // Calcular e reportar progresso total
          if (onTotalProgress) {
            // Cada arquivo representa uma fração do progresso total
            const fileWeight = 1 / files.length;
            // Progresso anterior + progresso atual ponderado
            totalProgress = (i / files.length) * 100 + (progress * fileWeight);
            onTotalProgress(Math.round(totalProgress));
          }
        }
      );
      
      urls.push(url);
      console.log(`URL obtida para o arquivo ${i+1}: ${url}`);
    }
    
    console.log(`Upload múltiplo concluído! ${urls.length} arquivos enviados.`);
    return urls;
  } catch (error) {
    console.error('Erro durante upload múltiplo:', error);
    
    // Se alguns arquivos já foram enviados, tentar limpar
    if (urls.length > 0) {
      console.log(`Tentando limpar ${urls.length} arquivos já enviados...`);
      for (const url of urls) {
        try {
          await deleteImage(url);
        } catch (deleteError) {
          console.error('Erro ao limpar arquivo após falha:', deleteError);
        }
      }
    }
    
    // Re-lançar o erro com mais contexto
    if (error instanceof Error && error.name === 'CORSError') {
      throw new Error(`Falha no upload de múltiplas imagens devido a erro de CORS. Arquivo ${urls.length + 1} de ${files.length} falhou. Configure as regras CORS no Firebase Storage.`);
    }
    
    throw error;
  }
} 