import { useCallback, useEffect, useState } from 'react';
import type { WojakCharacter } from '../types/wojak';

interface WojakStorage {
  wojaks: WojakCharacter[];
  nextId: number;
  totalMinted: number;
}

const STORAGE_KEY = 'wojak-of-all-trades';
const INITIAL_STORAGE: WojakStorage = {
  wojaks: [],
  nextId: 1,
  totalMinted: 0,
};

export const useWojakStorage = () => {
  const [storage, setStorage] = useState<WojakStorage>(INITIAL_STORAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert createdAt strings back to Date objects
        if (parsed.wojaks && Array.isArray(parsed.wojaks)) {
          parsed.wojaks = parsed.wojaks.map((wojak: WojakCharacter) => ({
            ...wojak,
            createdAt: new Date(wojak.createdAt),
          }));
        }
        setStorage(parsed);
      }
    } catch (error) {
      console.error('Failed to load wojak storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever storage changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      } catch (error) {
        console.error('Failed to save wojak storage:', error);
      }
    }
  }, [storage, isLoading]);

  const mintWojak = useCallback(
    (wojak: Omit<WojakCharacter, 'id' | 'createdAt'>) => {
      const newWojak: WojakCharacter = {
        ...wojak,
        id: `wojak_${storage.nextId.toString().padStart(6, '0')}`,
        createdAt: new Date(),
      };

      setStorage((prev) => ({
        ...prev,
        wojaks: [...prev.wojaks, newWojak],
        nextId: prev.nextId + 1,
        totalMinted: prev.totalMinted + 1,
      }));

      return newWojak;
    },
    [storage.nextId]
  );

  const getWojakById = useCallback(
    (id: string) => {
      return storage.wojaks.find((wojak) => wojak.id === id);
    },
    [storage.wojaks]
  );

  const getAllWojaks = useCallback(() => {
    return [...storage.wojaks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [storage.wojaks]);

  const getWojaksByRarity = useCallback(
    (rarity: string) => {
      return storage.wojaks.filter((wojak) => {
        // Calculate overall rarity based on traits
        const traits = [wojak.template, wojak.hat, wojak.glasses, wojak.mask];

        const rareTraits = traits.filter(
          (trait) =>
            trait === 'Chad' ||
            trait === 'Grug' ||
            trait === 'SoyjakWAOW' ||
            trait === 'SoyjakYelling' ||
            trait === '318' ||
            trait === '319' ||
            trait === '320' ||
            trait === '766' ||
            trait === '767' ||
            trait === '768' ||
            trait === '751' ||
            trait === '752'
        ).length;

        const overallRarity =
          rareTraits >= 3
            ? 'legendary'
            : rareTraits >= 2
              ? 'epic'
              : rareTraits >= 1
                ? 'rare'
                : 'common';

        return overallRarity === rarity;
      });
    },
    [storage.wojaks]
  );

  const searchWojaks = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return storage.wojaks.filter(
        (wojak) =>
          wojak.name.toLowerCase().includes(lowercaseQuery) ||
          wojak.id.toLowerCase().includes(lowercaseQuery)
      );
    },
    [storage.wojaks]
  );

  const deleteWojak = useCallback((id: string) => {
    setStorage((prev) => ({
      ...prev,
      wojaks: prev.wojaks.filter((wojak) => wojak.id !== id),
    }));
  }, []);

  const clearAllWojaks = useCallback(() => {
    setStorage(INITIAL_STORAGE);
  }, []);

  const getStats = useCallback(() => {
    const total = storage.wojaks.length;
    const byRarity = {
      common: getWojaksByRarity('common').length,
      uncommon: getWojaksByRarity('uncommon').length,
      rare: getWojaksByRarity('rare').length,
      epic: getWojaksByRarity('epic').length,
      legendary: getWojaksByRarity('legendary').length,
    };

    return {
      total,
      byRarity,
      totalMinted: storage.totalMinted,
      nextId: storage.nextId,
    };
  }, [storage.wojaks, storage.totalMinted, storage.nextId, getWojaksByRarity]);

  return {
    wojaks: storage.wojaks,
    isLoading,
    mintWojak,
    getWojakById,
    getAllWojaks,
    getWojaksByRarity,
    searchWojaks,
    deleteWojak,
    clearAllWojaks,
    getStats,
  };
};
