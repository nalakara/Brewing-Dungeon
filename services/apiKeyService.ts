const API_KEY_STORAGE_KEY = 'brewing_dungeon_gemini_api_key';

export const getUserApiKey = (): string => {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setUserApiKey = (key: string): void => {
  try {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to save API key to localStorage', err);
  }
};

export const removeUserApiKey = (): void => {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to remove API key from localStorage', err);
  }
};

export const hasUserApiKey = (): boolean => {
  return Boolean(getUserApiKey());
};

export const fetchServerConfig = async (): Promise<{ hasServerKey: boolean }> => {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) {
      return { hasServerKey: false };
    }
    const data = await res.json();
    return { hasServerKey: Boolean(data?.hasServerKey) };
  } catch (err) {
    console.warn('Could not fetch server config:', err);
    return { hasServerKey: false };
  }
};
