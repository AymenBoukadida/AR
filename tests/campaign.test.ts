import { describe, expect, it } from 'vitest';
import { demoCampaign, getCollectible } from '../src/data/demo-campaign';

describe('demo campaign', () => {
  it('contains five venue-neutral collectibles', () => {
    expect(demoCampaign.collectibles).toHaveLength(5);
    for (const collectible of demoCampaign.collectibles) {
      expect(collectible.id).toBeTruthy();
      expect(collectible.title).toBeTruthy();
      expect(collectible.description).toBeTruthy();
      expect(collectible.rarity).toMatch(/common|rare|legendary/);
      expect(collectible.imageSrc).toBeTruthy();
      expect(collectible.stopId).toBeTruthy();
    }
  });

  it('returns undefined for an unknown collectible', () => {
    expect(getCollectible(demoCampaign, 'missing')).toBeUndefined();
  });
});
