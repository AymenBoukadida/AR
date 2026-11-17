import { describe, expect, it } from 'vitest';
import { demoCampaign } from '../src/data/demo-campaign';
import { getNextTarget } from '../src/domain/hunt-progress';

describe('hunt progression', () => {
  it('starts at the first stop', () => {
    const target = getNextTarget(demoCampaign, []);

    expect(target?.stop.id).toBe('atrium');
    expect(target?.collectible.id).toBe('welcome-raven');
    expect(target?.stopNumber).toBe(1);
    expect(target?.totalStops).toBe(5);
  });

  it('skips collectibles that are already discovered', () => {
    const target = getNextTarget(demoCampaign, ['welcome-raven']);

    expect(target?.stop.id).toBe('clock-hall');
    expect(target?.collectible.id).toBe('brass-moth');
    expect(target?.stopNumber).toBe(2);
  });

  it('returns undefined when every stop is complete', () => {
    const allIds = demoCampaign.collectibles.map((collectible) => collectible.id);

    expect(getNextTarget(demoCampaign, allIds)).toBeUndefined();
  });
});
