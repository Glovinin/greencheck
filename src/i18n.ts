
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Define os idiomas suportados pela aplicação
export const locales = ['pt-BR', 'en', 'es', 'fr', 'de', 'nl'];
 
export default getRequestConfig(async ({locale}) => {
  // Verifica se o idioma solicitado é suportado
  if (!locales.includes(locale as any)) notFound();
 
  // Carrega as mensagens para o idioma selecionado
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
