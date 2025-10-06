export type Language = 'pt' | 'en' | 'es' | 'fr'

export type TranslationKeys = keyof typeof translations.pt

export const translations = {
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.about': 'Sobre',
    'nav.services': 'Serviços',
    'nav.contact': 'Contato',
    'nav.login': 'Entrar',
    'nav.dashboard': 'Dashboard',
    
    // Homepage
    'home.hero.title': 'Certificação ESG Automatizada',
    'home.hero.subtitle': 'Validação científica e blockchain',
    'home.hero.cta': 'Iniciar Upload',
    'home.hero.description': 'Sistema inteligente de certificação de sustentabilidade corporativa com IA, validação científica e tecnologia blockchain.',
    
    // Features
    'features.ai.title': 'Inteligência Artificial',
    'features.ai.description': 'Extração automática de dados ESG com 98.5% de precisão',
    'features.validation.title': 'Validação Científica',
    'features.validation.description': 'Certificação por instituições reconhecidas',
    'features.blockchain.title': 'Blockchain NFT',
    'features.blockchain.description': 'Certificados imutáveis e verificáveis',
    'features.marketplace.title': 'Marketplace de Carbono',
    'features.marketplace.description': 'Compensação de carbono integrada',
    
    // Upload
    'upload.title': 'Upload de Documentos ESG',
    'upload.description': 'Faça upload dos seus documentos de sustentabilidade',
    'upload.dropzone': 'Arraste arquivos PDF aqui ou clique para selecionar',
    'upload.button': 'Processar Documentos',
    'upload.processing': 'Processando...',
    
    // Processing
    'processing.title': 'Processando Documentos',
    'processing.ocr': 'Lendo documentos com OCR...',
    'processing.extraction': 'Extraindo dados com BERT...',
    'processing.satellite': 'Validando com satélite...',
    'processing.validation': 'Confirmando com instituições...',
    'processing.minting': 'Gerando NFT na blockchain...',
    
    // Results
    'results.title': 'Certificação Concluída',
    'results.download': 'Baixar Certificado',
    'results.marketplace': 'Vender no Marketplace',
    'results.co2': 'CO₂ Compensado',
    'results.method': 'Método',
    'results.validation': 'Validação',
    'results.nft': 'NFT',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.back': 'Voltar',
    'common.next': 'Próximo',
    'common.close': 'Fechar',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    
    // Homepage
    'home.hero.title': 'Automated ESG Certification',
    'home.hero.subtitle': 'Scientific validation and blockchain',
    'home.hero.cta': 'Start Upload',
    'home.hero.description': 'Intelligent corporate sustainability certification system with AI, scientific validation and blockchain technology.',
    
    // Features
    'features.ai.title': 'Artificial Intelligence',
    'features.ai.description': 'Automatic ESG data extraction with 98.5% accuracy',
    'features.validation.title': 'Scientific Validation',
    'features.validation.description': 'Certification by recognized institutions',
    'features.blockchain.title': 'Blockchain NFT',
    'features.blockchain.description': 'Immutable and verifiable certificates',
    'features.marketplace.title': 'Carbon Marketplace',
    'features.marketplace.description': 'Integrated carbon offsetting',
    
    // Upload
    'upload.title': 'ESG Documents Upload',
    'upload.description': 'Upload your sustainability documents',
    'upload.dropzone': 'Drag PDF files here or click to select',
    'upload.button': 'Process Documents',
    'upload.processing': 'Processing...',
    
    // Processing
    'processing.title': 'Processing Documents',
    'processing.ocr': 'Reading documents with OCR...',
    'processing.extraction': 'Extracting data with BERT...',
    'processing.satellite': 'Validating with satellite...',
    'processing.validation': 'Confirming with institutions...',
    'processing.minting': 'Minting NFT on blockchain...',
    
    // Results
    'results.title': 'Certification Complete',
    'results.download': 'Download Certificate',
    'results.marketplace': 'Sell on Marketplace',
    'results.co2': 'CO₂ Offset',
    'results.method': 'Method',
    'results.validation': 'Validation',
    'results.nft': 'NFT',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.close': 'Close',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca',
    'nav.services': 'Servicios',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar sesión',
    'nav.dashboard': 'Panel',
    
    // Homepage
    'home.hero.title': 'Certificación ESG Automatizada',
    'home.hero.subtitle': 'Validación científica y blockchain',
    'home.hero.cta': 'Iniciar Carga',
    'home.hero.description': 'Sistema inteligente de certificación de sostenibilidad corporativa con IA, validación científica y tecnología blockchain.',
    
    // Features
    'features.ai.title': 'Inteligencia Artificial',
    'features.ai.description': 'Extracción automática de datos ESG con 98.5% de precisión',
    'features.validation.title': 'Validación Científica',
    'features.validation.description': 'Certificación por instituciones reconocidas',
    'features.blockchain.title': 'Blockchain NFT',
    'features.blockchain.description': 'Certificados inmutables y verificables',
    'features.marketplace.title': 'Mercado de Carbono',
    'features.marketplace.description': 'Compensación de carbono integrada',
    
    // Upload
    'upload.title': 'Carga de Documentos ESG',
    'upload.description': 'Cargue sus documentos de sostenibilidad',
    'upload.dropzone': 'Arrastre archivos PDF aquí o haga clic para seleccionar',
    'upload.button': 'Procesar Documentos',
    'upload.processing': 'Procesando...',
    
    // Processing
    'processing.title': 'Procesando Documentos',
    'processing.ocr': 'Leyendo documentos con OCR...',
    'processing.extraction': 'Extrayendo datos con BERT...',
    'processing.satellite': 'Validando con satélite...',
    'processing.validation': 'Confirmando con instituciones...',
    'processing.minting': 'Generando NFT en blockchain...',
    
    // Results
    'results.title': 'Certificación Completa',
    'results.download': 'Descargar Certificado',
    'results.marketplace': 'Vender en Mercado',
    'results.co2': 'CO₂ Compensado',
    'results.method': 'Método',
    'results.validation': 'Validación',
    'results.nft': 'NFT',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.close': 'Cerrar',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.dashboard': 'Tableau de bord',
    
    // Homepage
    'home.hero.title': 'Certification ESG Automatisée',
    'home.hero.subtitle': 'Validation scientifique et blockchain',
    'home.hero.cta': 'Commencer le téléchargement',
    'home.hero.description': 'Système intelligent de certification de durabilité d\'entreprise avec IA, validation scientifique et technologie blockchain.',
    
    // Features
    'features.ai.title': 'Intelligence Artificielle',
    'features.ai.description': 'Extraction automatique de données ESG avec 98.5% de précision',
    'features.validation.title': 'Validation Scientifique',
    'features.validation.description': 'Certification par des institutions reconnues',
    'features.blockchain.title': 'Blockchain NFT',
    'features.blockchain.description': 'Certificats immuables et vérifiables',
    'features.marketplace.title': 'Marché du Carbone',
    'features.marketplace.description': 'Compensation carbone intégrée',
    
    // Upload
    'upload.title': 'Téléchargement de Documents ESG',
    'upload.description': 'Téléchargez vos documents de durabilité',
    'upload.dropzone': 'Glissez les fichiers PDF ici ou cliquez pour sélectionner',
    'upload.button': 'Traiter les Documents',
    'upload.processing': 'Traitement...',
    
    // Processing
    'processing.title': 'Traitement des Documents',
    'processing.ocr': 'Lecture des documents avec OCR...',
    'processing.extraction': 'Extraction de données avec BERT...',
    'processing.satellite': 'Validation avec satellite...',
    'processing.validation': 'Confirmation avec les institutions...',
    'processing.minting': 'Génération du NFT sur blockchain...',
    
    // Results
    'results.title': 'Certification Terminée',
    'results.download': 'Télécharger le Certificat',
    'results.marketplace': 'Vendre sur le Marché',
    'results.co2': 'CO₂ Compensé',
    'results.method': 'Méthode',
    'results.validation': 'Validation',
    'results.nft': 'NFT',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.close': 'Fermer',
  },
}

