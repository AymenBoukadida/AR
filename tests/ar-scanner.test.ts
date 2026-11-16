import { describe, expect, it, vi } from 'vitest';
import { createMarkerDiscoveryHandler } from '../src/ar/ar-scanner';

describe('marker discovery adapter', () => {
  it('maps a known marker to its collectible', () => {
    const onDiscovery = vi.fn();
    const handler = createMarkerDiscoveryHandler({ 'hiro-main': 'caffeine-wizard' }, onDiscovery);

    handler('hiro-main');

    expect(onDiscovery).toHaveBeenCalledWith('caffeine-wizard');
  });

  it('ignores unknown markers', () => {
    const onDiscovery = vi.fn();
    const handler = createMarkerDiscoveryHandler({ 'hiro-main': 'caffeine-wizard' }, onDiscovery);

    handler('unknown');

    expect(onDiscovery).not.toHaveBeenCalled();
  });
});
