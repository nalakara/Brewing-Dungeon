import { BrewJournalEntry } from '../types';

const JOURNAL_STORAGE_KEY = 'brewing_dungeon_journal_v1';

export const getJournalEntries = (): BrewJournalEntry[] => {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load journal entries from localStorage', err);
    return [];
  }
};

export const saveJournalEntry = (
  entryData: Omit<BrewJournalEntry, 'id' | 'createdAt'>
): BrewJournalEntry => {
  const current = getJournalEntries();
  const newEntry: BrewJournalEntry = {
    ...entryData,
    id: `brew_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newEntry, ...current];
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save journal entry to localStorage', err);
  }

  return newEntry;
};

export const updateJournalEntry = (
  id: string,
  updates: Partial<Pick<BrewJournalEntry, 'rating' | 'tastingNotes' | 'beanOrigin'>>
): BrewJournalEntry[] => {
  const current = getJournalEntries();
  const updated = current.map(entry => {
    if (entry.id === id) {
      return { ...entry, ...updates };
    }
    return entry;
  });

  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update journal entry in localStorage', err);
  }

  return updated;
};

export const deleteJournalEntry = (id: string): BrewJournalEntry[] => {
  const current = getJournalEntries();
  const updated = current.filter(entry => entry.id !== id);

  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete journal entry from localStorage', err);
  }

  return updated;
};

export const isRecipeSaved = (
  methodName: string,
  championStyleName: string,
  coffeeAmount: number,
  waterAmount: number
): boolean => {
  const entries = getJournalEntries();
  return entries.some(
    e =>
      e.methodName === methodName &&
      e.championStyleName === championStyleName &&
      e.coffeeAmount === coffeeAmount &&
      e.waterAmount === waterAmount
  );
};
