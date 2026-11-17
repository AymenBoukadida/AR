import { describe, expect, it, vi } from 'vitest';
import { createMarkerDiscoveryHandler, planeSizeFor } from '../src/ar/ar-scanner';

describe('marker discovery adapter', () => {
  it('maps a known marker to its collectible', () => {
    const onDiscovery = vi.fn();
    const handler = createMarkerDiscoveryHandler({ 'hiro-main': 'welcome-raven' }, onDiscovery);

    handler('hiro-main');

    expect(onDiscovery).toHaveBeenCalledWith('welcome-raven');
  });

  it('ignores unknown markers', () => {
    const onDiscovery = vi.fn();
    const handler = createMarkerDiscoveryHandler({ 'hiro-main': 'welcome-raven' }, onDiscovery);

    handler('unknown');

    expect(onDiscovery).not.toHaveBeenCalled();
  });
});

describe('AR plane sizing', () => {
  it('keeps a landscape image at the maximum width', () => {
    expect(planeSizeFor(1600, 900)).toEqual({ width: 2.4, height: 1.35 });
  });

  it('keeps a portrait image inside the same width', () => {
    const size = planeSizeFor(900, 1600);

    expect(size.width).toBe(2.4);
    expect(size.height).toBeCloseTo(4.267, 2);
  });

  it('falls back to widescreen when the image size is unknown', () => {
    expect(planeSizeFor(0, 0)).toEqual({ width: 2.4, height: 1.35 });
  });
});
