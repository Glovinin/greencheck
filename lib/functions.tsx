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

import React from 'react';

// Retornar o ícone correspondente para uma amenidade como componente React
export const getIconForAmenity = (amenity: string) => {
  const amenities: Record<string, React.ReactNode> = {
    'Wi-Fi': (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="lucide lucide-wifi"
      >
        <path d="M5 13a10 10 0 0 1 14 0"/>
        <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
        <path d="M2 8.82a15 15 0 0 1 20 0"/>
        <line x1="12" x2="12" y1="20" y2="20"/>
      </svg>
    ),
    'Ar-condicionado': (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="lucide lucide-fan"
      >
        <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
        <path d="M12 12v.01"/>
      </svg>
    ),
    'TV': (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="lucide lucide-tv"
      >
        <rect width="20" height="15" x="2" y="7" rx="2" ry="2"/>
        <polyline points="17 2 12 7 7 2"/>
      </svg>
    ),
    'Frigobar': (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="lucide lucide-refrigerator"
      >
        <path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z"/>
        <path d="M5 10h14"/>
        <path d="M15 7v6"/>
      </svg>
    ),
  };
  
  // Ícone padrão para amenidades sem ícone específico
  const defaultIcon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="lucide lucide-check"
    >
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
  
  return amenities[amenity] || defaultIcon;
}; 