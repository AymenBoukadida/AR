import { describe, expect, it } from 'vitest';
import { createLocalCollectionStore } from '../src/services/local-collection-store';

function createMemoryStorage(initial?: string): Storage {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
    removeItem: () => { value = null; },
    clear: () => { value = null; },
    key: () => null,
    length: value === null ? 0 : 1,
  };
}

describe('local collection store', () => {
  it('records a collectible only once', () => {
    const store = createLocalCollectionStore(createMemoryStorage());

    store.discover('caffeine-wizard');
    store.discover('caffeine-wizard');

    expect(store.getDiscoveredIds()).toEqual(['caffeine-wizard']);
    expect(store.hasDiscovered('caffeine-wizard')).toBe(true);
  });

  it('recovers from malformed storage data', () => {
    const store = createLocalCollectionStore(createMemoryStorage('{bad'));

    expect(store.getDiscoveredIds()).toEqual([]);
  });

  it('clears discovered collectibles', () => {
    const store = createLocalCollectionStore(createMemoryStorage());

    store.discover('deadline-goblin');
    store.clear();

    expect(store.getDiscoveredIds()).toEqual([]);
  });
});
