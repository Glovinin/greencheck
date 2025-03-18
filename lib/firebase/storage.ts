import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  uploadBytesResumable
} from 'firebase/storage'
import { storage } from './config'

// Upload de arquivo
export const uploadFile = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// Upload de múltiplos arquivos
export const uploadMultipleFiles = async (
  files: File[],
  basePath: string
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => {
    const path = `${basePath}/${Date.now()}_${index}_${file.name}`
    return uploadFile(file, path)
  })
  
  return Promise.all(uploadPromises)
}

// Obter URL de download
export const getFileUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

// Deletar arquivo
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

// Listar arquivos em um diretório
export const listFiles = async (path: string): Promise<string[]> => {
  const storageRef = ref(storage, path)
  const result = await listAll(storageRef)
  
  const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef))
  return Promise.all(urlPromises)
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
    
    // Fazer upload do arquivo
    const storageRef = ref(storage, fullPath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`Imagem enviada com sucesso: ${fullPath}`);
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
    const decodedUrl = decodeURIComponent(url)
    const startIndex = decodedUrl.indexOf('/o/') + 3
    const endIndex = decodedUrl.indexOf('?')
    const path = decodedUrl.substring(startIndex, endIndex)
    
    // Criar referência e excluir
    const imageRef = ref(storage, path)
    await deleteObject(imageRef)
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
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Lidar com erros
          console.error('Erro durante o upload:', error);
          reject(error);
        },
        async () => {
          // Upload concluído com sucesso
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`Imagem enviada com sucesso: ${fullPath}`);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
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
  
  const urls: string[] = [];
  let totalProgress = 0;
  
  // Processar cada arquivo sequencialmente para melhor controle
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
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
  }
  
  return urls;
} 