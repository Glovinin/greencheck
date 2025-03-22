import { Timestamp } from "firebase/firestore";

export interface SeasonalPrice {
  id: string;
  name: string;
  startDate: string; // ISO format: "YYYY-MM-DD"
  endDate: string;   // ISO format: "YYYY-MM-DD"
  price: number;
  description?: string;
}

export interface Room {
  id?: string;
  name: string;
  type: string;
  description: string;
  price: number; // Preço base/padrão
  capacity: number;
  size: number;
  available: boolean;
  featured?: boolean;
  serviceFeePct?: number;
  images: string[];
  amenities: string[];
  additionalServices?: string[];
  highlights?: string[];
  availabilityDates?: {
    [date: string]: boolean;
  };
  seasonalPrices?: SeasonalPrice[]; // Preços para períodos específicos
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
} 