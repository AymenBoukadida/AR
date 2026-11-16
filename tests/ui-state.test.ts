import { describe, expect, it } from 'vitest';
import { renderAppShell, renderCameraFeedback, renderCollectionPanel } from '../src/ui/app-shell';
import { demoCampaign } from '../src/data/demo-campaign';

describe('campaign UI state', () => {
  it('renders initial collection progress', () => {
    const html = renderAppShell(demoCampaign, []);

    expect(html).toContain('0 / 5 discovered');
    expect(html).toContain('Start scanning');
  });

  it('renders discovered collectible details and clue', () => {
    const html = renderCollectionPanel(demoCampaign, ['caffeine-wizard']);

    expect(html).toContain('The Caffeine Wizard');
    expect(html).toContain('Start where every journey begins.');
  });

  it('renders recovery guidance when camera access is unavailable', () => {
    const html = renderCameraFeedback('denied');

    expect(html).toContain('Camera access is blocked');
    expect(html).toContain('browser settings');
  });
});
