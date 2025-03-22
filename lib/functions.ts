// Formatar valor para moeda (EUR)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

// Calcular número de dias entre duas datas (para estadias)
export const calcStayDays = (checkIn: string | Date | null, checkOut: string | Date | null): number => {
  if (!checkIn || !checkOut) return 0;
  
  const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  
  // Diferença em milissegundos
  const diffTime = Math.abs(end.getTime() - start.getTime());
  // Converter para dias
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Retornar nome do ícone para uma amenidade (versão simplificada sem JSX)
export const getIconNameForAmenity = (amenity: string): string => {
  const amenities: Record<string, string> = {
    'Wi-Fi': 'wifi',
    'Ar-condicionado': 'fan',
    'TV': 'tv',
    'Frigobar': 'refrigerator',
    'Cofre': 'package-2',
    'Secador de cabelo': 'wind',
    'Banheira': 'bath',
    'Chuveiro': 'shower-head',
    'Varanda': 'columns',
    'Vista para o mar': 'waves',
    'Acesso à piscina': 'waves',
    'Roupão de banho': 'shirt',
    'Serviço de quarto': 'utensils-crossed',
  };
  
  return amenities[amenity] || 'check';
}; 