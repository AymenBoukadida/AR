export interface CollectionStore {
  getDiscoveredIds(): string[];
  discover(id: string): void;
  hasDiscovered(id: string): boolean;
  clear(): void;
}
