import { describe, expect, it } from 'vitest';
import { demoCampaign } from '../src/data/demo-campaign';
import { renderCollectibleReveal, renderScannerOverlay, scannerStatusCopy } from '../src/ui/scanner-overlay';

describe('scanner overlay', () => {
  it('renders the camera viewport, reticle, and stop context', () => {
    const html = renderScannerOverlay({ stopNumber: 2, totalStops: 5, area: 'Hall of Clocks' });

    expect(html).toContain('id="ar-viewport"');
    expect(html).toContain('Stop 2 of 5');
    expect(html).toContain('Hall of Clocks');
    expect(html).toContain('data-action="close-scanner"');
    expect(html).toContain('reticle');
  });

  it('describes each scanning state', () => {
    expect(scannerStatusCopy('starting')).toContain('Starting camera');
    expect(scannerStatusCopy('scanning')).toContain('Point at the marker');
    expect(scannerStatusCopy('found')).toContain('Collectible found');
  });

  it('renders the collectible reveal sheet', () => {
    const collectible = demoCampaign.collectibles[1];
    const html = renderCollectibleReveal(collectible, { stopNumber: 2, area: 'Hall of Clocks' });

    expect(html).toContain(collectible.title);
    expect(html).toContain(collectible.description);
    expect(html).toContain('Added to your collection');
    expect(html).toContain('Hall of Clocks');
    expect(html).toContain('data-action="continue-hunt"');
  });
});
