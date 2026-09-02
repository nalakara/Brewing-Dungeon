export type Language = 'en' | 'id';

export interface BrewingMethod {
  id: string;
  name_en: string;
  name_id: string;
  category_en: string;
  category_id: string;
  image_url: string;
  recommended_ratio: string;
  description_en: string;
  description_id: string;
  instructions_en: string[];
  instructions_id: string[];
  coffee_characteristics_en: string;
  coffee_characteristics_id: string;
  chemical_reactions_en: string;
  chemical_reactions_id: string;
  physical_principles_en: string;
  physical_principles_id: string;
}

export interface AiRecommendation {
    ratio: string;
    optimal_temperature: string;
    optimal_time: string;
    guide: string[];
    key_principles: string;
    chemical_reactions: string;
    physical_principles: string;
}

export interface MethodDetails {
  recommendedGrind: string[];
  defaultGrind: string;
  recommendedRatios: string[];
  defaultRatio: string;
}

export interface BrewJournalEntry {
  id: string;
  createdAt: string;
  methodName: string;
  clusterKey: string;
  clusterName: string;
  championStyleName: string;
  coffeeAmount: number;
  waterAmount: number;
  ratio: string;
  grindSize: string;
  intensity: string;
  recommendation: AiRecommendation;
  rating?: number; // 1 to 5
  tastingNotes?: string;
  beanOrigin?: string;
}
