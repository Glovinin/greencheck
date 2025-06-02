import {getRequestConfig} from 'next-intl/server';
 
// Define os idiomas suportados pela aplicação
export const locales = ['pt-BR', 'en', 'es', 'fr', 'de', 'nl'];
export const defaultLocale = 'pt-BR';

export default getRequestConfig(async ({locale}) => {
  // Verifica se o idioma solicitado é suportado
  const safeLocale = locales.includes(locale as any) ? locale : defaultLocale;
 
  // Carrega as mensagens para o idioma selecionado
  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default
  };
});
