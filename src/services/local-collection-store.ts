import type { CollectionStore } from '../domain/collection';

const STORAGE_KEY = 'hiro-hunt:collection:v1';

function readIds(storage: Storage): string[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((id): id is string => typeof id === 'string')) return [];
    return [...new Set(parsed)];
  } catch {
    return [];
  }
}

export function createLocalCollectionStore(storage: Storage): CollectionStore {
  let discoveredIds = readIds(storage);

  const persist = (): void => {
    storage.setItem(STORAGE_KEY, JSON.stringify(discoveredIds));
  };

  return {
    getDiscoveredIds: () => [...discoveredIds],
    discover: (id) => {
      if (!discoveredIds.includes(id)) {
        discoveredIds = [...discoveredIds, id];
        persist();
      }
    },
    hasDiscovered: (id) => discoveredIds.includes(id),
    clear: () => {
      discoveredIds = [];
      storage.removeItem(STORAGE_KEY);
    },
  };
}
