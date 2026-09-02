import { AiRecommendation, Language } from '../types';
import { getUserApiKey } from './apiKeyService';

export const getBrewingRecommendation = async (
  coffeeAmount: number,
  waterAmount: number,
  grindSize: string,
  methodName: string,
  language: Language,
  ratio: string,
  intensity: string,
  championStyleName: string
): Promise<AiRecommendation> => {
  const userApiKey = getUserApiKey();

  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coffeeAmount,
        waterAmount,
        grindSize,
        methodName,
        language,
        ratio,
        intensity,
        championStyleName,
        userApiKey,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || (language === 'id' 
        ? 'Gagal mendapatkan rekomendasi dari server.' 
        : 'Failed to obtain recommendation from server.');
      throw new Error(message);
    }

    if (!data?.data) {
      throw new Error(
        language === 'id'
          ? 'Respons tidak valid dari server AI.'
          : 'Invalid response from AI server.'
      );
    }

    return data.data as AiRecommendation;
  } catch (error: any) {
    console.error('Error fetching recommendation from backend proxy:', error);
    throw error;
  }
};
