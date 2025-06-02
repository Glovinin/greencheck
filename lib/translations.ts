// Traduções simples - sem bibliotecas externas
export const translations = {
  pt: {
    // Navbar
    home: "Início",
    rooms: "Quartos",
    gallery: "Galeria",
    restaurant: "Restaurante",
    events: "Eventos",
    about: "Sobre Nós",
    contact: "Contato",
    reserve: "Reservar",
    
    // Homepage Hero
    welcome: "Bem-vindo ao seu refúgio na serra",
    hotelName: "Aqua Vista",
    location: "Monchique",
    reserveNow: "Reservar Agora",
    seeRooms: "Veja Nossos Quartos",
    explore: "Explorar",
    
    // Slogans
    slogans: [
      "Vista Privilegiada da Serra de Monchique",
      "Aconchego e Natureza em Harmonia",
      "Sua Estadia Perfeita na Montanha",
      "Experiências Únicas na Serra",
      "Conforto com Vista para o Paraíso"
    ],
    
    // About Section
    aboutTitle: "Seu Refúgio nas Montanhas",
    aboutText: "Localizado nas belas montanhas de Monchique, nosso hotel oferece uma experiência única de tranquilidade e conexão com a natureza. Com uma piscina refrescante e uma vista deslumbrante da serra, nossos quartos proporcionam o ambiente perfeito para relaxar e aproveitar momentos especiais longe da agitação da cidade.",
    learnMore: "Saiba Mais",
    
    // Amenities
    amenitiesTitle: "Uma Experiência Exclusiva",
    amenitiesSubtitle: "O Aqua Vista Monchique oferece comodidades premium para garantir uma estadia memorável, combinando conforto moderno com a beleza natural da serra.",
    seeAllAmenities: "Ver Todas as Comodidades",
    
    // Testimonials
    testimonialsTitle: "O que Nossos Hóspedes Dizem",
    testimonialsSubtitle: "Experiências reais de quem já desfrutou da tranquilidade e do conforto do Aqua Vista Monchique.",
    
    // Gallery
    galleryTitle: "Momentos Inesquecíveis",
    gallerySubtitle: "Confira alguns registros de experiências especiais em nosso hotel.",
    seeFullGallery: "Ver Galeria Completa",
    noGalleryImages: "Ainda não há imagens na galeria.",
    
    // Languages
    portuguese: "Português",
    english: "Inglês",
    
    // Common
    loading: "Carregando...",
    close: "Fechar"
  },
  
  en: {
    // Navbar
    home: "Home",
    rooms: "Rooms",
    gallery: "Gallery",
    restaurant: "Restaurant",
    events: "Events",
    about: "About Us",
    contact: "Contact",
    reserve: "Reserve",
    
    // Homepage Hero
    welcome: "Welcome to your mountain retreat",
    hotelName: "Aqua Vista",
    location: "Monchique",
    reserveNow: "Reserve Now",
    seeRooms: "See Our Rooms",
    explore: "Explore",
    
    // Slogans
    slogans: [
      "Privileged View of Serra de Monchique",
      "Comfort and Nature in Harmony",
      "Your Perfect Stay in the Mountains",
      "Unique Experiences in the Mountains",
      "Comfort with a View to Paradise"
    ],
    
    // About Section
    aboutTitle: "Your Mountain Retreat",
    aboutText: "Located in the beautiful mountains of Monchique, our hotel offers a unique experience of tranquility and connection with nature. With a refreshing pool and breathtaking mountain views, our rooms provide the perfect environment to relax and enjoy special moments away from the hustle and bustle of the city.",
    learnMore: "Learn More",
    
    // Amenities
    amenitiesTitle: "An Exclusive Experience",
    amenitiesSubtitle: "Aqua Vista Monchique offers premium amenities to ensure a memorable stay, combining modern comfort with the natural beauty of the mountains.",
    seeAllAmenities: "See All Amenities",
    
    // Testimonials
    testimonialsTitle: "What Our Guests Say",
    testimonialsSubtitle: "Real experiences from those who have already enjoyed the tranquility and comfort of Aqua Vista Monchique.",
    
    // Gallery
    galleryTitle: "Unforgettable Moments",
    gallerySubtitle: "Check out some records of special experiences at our hotel.",
    seeFullGallery: "See Full Gallery",
    noGalleryImages: "There are no images in the gallery yet.",
    
    // Languages
    portuguese: "Portuguese",
    english: "English",
    
    // Common
    loading: "Loading...",
    close: "Close"
  }
} as const

export type Language = keyof typeof translations
export type TranslationKeys = keyof typeof translations.pt 