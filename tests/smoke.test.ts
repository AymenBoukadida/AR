import { describe, expect, it } from 'vitest';
import { DEFAULT_CAMPAIGN_ID } from '../src/app-config';

describe('application boot configuration', () => {
  it('uses the museum campaign by default', () => {
    expect(DEFAULT_CAMPAIGN_ID).toBe('lumen-museum');
  });
});
