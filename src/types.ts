export interface Brand {
  id: string;
  name: string;
  basePrice: number;
  popularModels: string[];
}

export interface StyleOption {
  id: string;
  name: string;
  multiplier: number;
}

export interface AgingFactor {
  id: string;
  name: string;
  description: string;
  bonusAmount: number;
  iconName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GasPriceItem {
  brand: string;
  model: string;
  price: number;
}

export interface GasPriceData {
  prices: GasPriceItem[];
  conditions: Record<string, number>;
  adjustments: Record<string, Record<string, number>>;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  subTitle: string;
  storyTitle: string;
  quote: string;
  fullText: string;
  jacketSold: string;
  estimatedPrice: number;
  finalPrice: number;
  bikerType: string;
  avatarUrl: string;
}
