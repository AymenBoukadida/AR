import { describe, expect, it } from 'vitest';
import { demoCampaign, getCollectible } from '../src/data/demo-campaign';

describe('museum campaign', () => {
  it('contains five museum collectibles', () => {
    expect(demoCampaign.collectibles).toHaveLength(5);
    expect(demoCampaign.organization.type).toBe('museum');

    for (const collectible of demoCampaign.collectibles) {
      expect(collectible.id).toBeTruthy();
      expect(collectible.title).toBeTruthy();
      expect(collectible.description).toBeTruthy();
      expect(collectible.rarity).toMatch(/common|rare|legendary/);
      expect(collectible.imageSrc).toBeTruthy();
      expect(collectible.stopId).toBeTruthy();
    }
  });

  it('gives every stop exactly one collectible', () => {
    expect(demoCampaign.stops).toHaveLength(5);

    for (const stop of demoCampaign.stops) {
      const matches = demoCampaign.collectibles.filter((collectible) => collectible.stopId === stop.id);
      expect(matches).toHaveLength(1);
      expect(stop.clue).toBeTruthy();
      expect(stop.area).toBeTruthy();
      expect(stop.markerId).toBeTruthy();
    }
  });

  it('returns undefined for an unknown collectible', () => {
    expect(getCollectible(demoCampaign, 'missing')).toBeUndefined();
  });
});
