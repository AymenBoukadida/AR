import { describe, expect, it } from 'vitest';
import { renderAppShell, renderCameraFeedback, renderCollectionPanel } from '../src/ui/app-shell';
import { demoCampaign } from '../src/data/demo-campaign';

describe('campaign UI state', () => {
  it('renders the museum campaign and its progress', () => {
    const html = renderAppShell(demoCampaign, []);

    expect(html).toContain('The Midnight Museum');
    expect(html).toContain('0 of 5 discovered');
    expect(html).toContain('Scan marker');
  });

  it('shows the next stop clue', () => {
    const html = renderAppShell(demoCampaign, ['welcome-raven']);

    expect(html).toContain('Hall of Clocks');
    expect(html).toContain('every clock disagrees');
  });

  it('hides undiscovered collectible names', () => {
    const html = renderCollectionPanel(demoCampaign, ['welcome-raven']);

    expect(html).toContain('The Welcome Raven');
    expect(html).toContain('Locked');
    expect(html).not.toContain('The Night Curator');
  });

  it('renders recovery guidance when camera access is unavailable', () => {
    const html = renderCameraFeedback('denied');

    expect(html).toContain('Camera access is blocked');
    expect(html).toContain('browser settings');
  });
});
