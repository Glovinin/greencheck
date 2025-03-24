
import createMiddleware from 'next-intl/middleware';
import {locales} from './src/i18n';
 
export default createMiddleware({
  // Lista de idiomas suportados
  locales,
  // Idioma padrão a ser usado
  defaultLocale: 'pt-BR',
  // Detecta o idioma preferido do usuário pelo cabeçalho do navegador
  localeDetection: true
});
 
export const config = {
  // Aplica o middleware a todas as rotas exceto às que começam com
  // /api/, /_next/, /admin/ ou contêm arquivos com extensão (.jpg, .png, etc.)
  matcher: ['/((?!api|_next|admin|.*\\..*).*)']
};
