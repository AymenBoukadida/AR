import type { Campaign } from '../domain/campaign';
import { requestCameraAccess } from './camera-permissions';

export interface ArScanner {
  start(): Promise<void>;
  stop(): void;
  onDiscovery(callback: (collectibleId: string) => void): void;
}

export function createMarkerDiscoveryHandler(mapping: Record<string, string>, onDiscovery: (collectibleId: string) => void): (markerId: string) => void {
  return (markerId) => {
    const collectibleId = mapping[markerId];
    if (collectibleId) onDiscovery(collectibleId);
  };
}

export function createArScanner(campaign: Campaign): ArScanner {
  let discoveryCallback: (collectibleId: string) => void = () => undefined;
  let scene: HTMLElement | undefined;

  const marker = campaign.stops[0];
  const collectible = campaign.collectibles.find((item) => item.stopId === marker?.id);

  return {
    async start() {
      const permission = await requestCameraAccess();
      if (permission !== 'granted') throw new Error(`camera-${permission}`);
      if (!marker || !collectible) throw new Error('campaign-marker-missing');

      scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false;');
      scene.innerHTML = `
        <a-marker type="pattern" url="/pattern-hiro.patt" data-marker-id="${marker.markerId}">
          <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="2.25" material="shader: flat; src: ${collectible.imageSrc}"></a-plane>
        </a-marker>
        <a-entity camera></a-entity>
      `;
      const markerElement = scene.querySelector('a-marker');
      markerElement?.addEventListener('markerFound', () => discoveryCallback(collectible.id));
      document.querySelector('#scanner')?.append(scene);
    },
    stop() {
      scene?.remove();
      scene = undefined;
    },
    onDiscovery(callback) {
      discoveryCallback = callback;
    },
  };
}
