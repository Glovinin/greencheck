import { Timestamp } from "firebase/firestore";

export interface Room {
  id?: string;
  name: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  size: number;
  available: boolean;
  featured?: boolean;
  images: string[];
  amenities: string[];
  additionalServices?: string[];
  highlights?: string[];
  availabilityDates?: {
    [date: string]: boolean;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
} 