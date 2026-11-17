import type { HuntTarget } from '../domain/hunt-progress';
import { requestCameraAccess } from './camera-permissions';

export type ScannerRuntimeStatus = 'starting' | 'scanning' | 'found' | 'error';

export interface ArScanner {
  start(target: HuntTarget, container: HTMLElement): Promise<void>;
  stop(): void;
  onDiscovery(callback: (collectibleId: string) => void): void;
  onStatus(callback: (status: ScannerRuntimeStatus, detail?: string) => void): void;
}

export function createMarkerDiscoveryHandler(
  mapping: Record<string, string>,
  onDiscovery: (collectibleId: string) => void,
): (markerId: string) => void {
  return (markerId) => {
    const collectibleId = mapping[markerId];
    if (collectibleId) onDiscovery(collectibleId);
  };
}

const MAX_PLANE_WIDTH = 2.4;

const round = (value: number): number => Math.round(value * 1000) / 1000;

export function planeSizeFor(width: number, height: number): { width: number; height: number } {
  if (!width || !height) {
    return { width: MAX_PLANE_WIDTH, height: round(MAX_PLANE_WIDTH * (9 / 16)) };
  }

  return { width: MAX_PLANE_WIDTH, height: round((MAX_PLANE_WIDTH * height) / width) };
}

function loadImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve({ width: 0, height: 0 });
    image.src = src;
  });
}

export function createArScanner(): ArScanner {
  let discoveryHandler: (collectibleId: string) => void = () => undefined;
  let statusHandler: (status: ScannerRuntimeStatus, detail?: string) => void = () => undefined;
  let scene: HTMLElement | undefined;
  let found = false;
  let videoReadyHandler: (() => void) | undefined;
  let readyTimer: number | undefined;

  const clearListeners = (): void => {
    if (videoReadyHandler) window.removeEventListener('arjs-video-loaded', videoReadyHandler);
    videoReadyHandler = undefined;
    if (readyTimer !== undefined) window.clearTimeout(readyTimer);
    readyTimer = undefined;
  };

  const stopVideoTracks = (): void => {
    if (!scene) return;
    for (const video of Array.from(scene.querySelectorAll('video'))) {
      const stream = video.srcObject;
      if (stream instanceof MediaStream) stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const stop = (): void => {
    clearListeners();
    stopVideoTracks();
    scene?.remove();
    scene = undefined;
    found = false;
  };

  return {
    async start(target, container) {
      stop();
      statusHandler('starting');

      const permission = await requestCameraAccess();
      if (permission !== 'granted') {
        statusHandler('error', permission);
        throw new Error(`camera-${permission}`);
      }

      if (!customElements.get('a-scene')) {
        statusHandler('error', 'unsupported');
        throw new Error('camera-unsupported');
      }

      const image = await loadImageSize(target.collectible.imageSrc);
      const plane = planeSizeFor(image.width, image.height);

      scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('renderer', 'alpha: true; antialias: true;');
      scene.setAttribute('loading-screen', 'enabled: false');
      scene.setAttribute('vr-mode-ui', 'enabled: false');
      scene.setAttribute('device-orientation-permission-ui', 'enabled: false');
      scene.setAttribute(
        'arjs',
        'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; maxDetectionRate: 60;',
      );
      scene.innerHTML = `
        <a-marker
          type="pattern"
          url="/pattern-hiro.patt"
          emitevents="true"
          smooth="true"
          smoothCount="8"
          smoothTolerance="0.01"
          smoothThreshold="4"
        >
          <a-entity
            position="0 0.4 0"
            animation="property: position; to: 0 0.58 0; dir: alternate; dur: 2400; loop: true; easing: easeInOutSine"
          >
            <a-plane
              width="${plane.width}"
              height="${plane.height}"
              material="shader: flat; src: ${target.collectible.imageSrc}; transparent: true; alphaTest: 0.05"
            ></a-plane>
          </a-entity>
        </a-marker>
        <a-entity camera></a-entity>
      `;

      const marker = scene.querySelector('a-marker');
      marker?.addEventListener('markerFound', () => {
        if (found) return;
        found = true;
        statusHandler('found');
        discoveryHandler(target.collectible.id);
      });

      container.append(scene);

      videoReadyHandler = () => {
        if (!found) statusHandler('scanning');
      };
      window.addEventListener('arjs-video-loaded', videoReadyHandler);

      readyTimer = window.setTimeout(() => {
        if (!found) statusHandler('scanning');
      }, 2500);
    },

    stop,

    onDiscovery(callback) {
      discoveryHandler = callback;
    },

    onStatus(callback) {
      statusHandler = callback;
    },
  };
}
