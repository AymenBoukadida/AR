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
const AR_VIDEO_ID = 'arjs-video';

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

function stopStream(video: HTMLVideoElement): void {
  const stream = video.srcObject;
  if (stream instanceof MediaStream) stream.getTracks().forEach((track) => track.stop());
  video.srcObject = null;
}

export function clearArVideo(): void {
  for (const video of Array.from(document.querySelectorAll<HTMLVideoElement>(`#${AR_VIDEO_ID}`))) {
    stopStream(video);
    video.remove();
  }
  document.getElementById('error-popup')?.remove();
}

export function createArScanner(): ArScanner {
  let discoveryHandler: (collectibleId: string) => void = () => undefined;
  let statusHandler: (status: ScannerRuntimeStatus, detail?: string) => void = () => undefined;
  let scene: HTMLElement | undefined;
  let viewport: HTMLElement | undefined;
  let found = false;
  let videoHandler: (() => void) | undefined;
  let cameraErrorHandler: (() => void) | undefined;
  let readyTimer: number | undefined;
  let adoptTimer: number | undefined;

  const clearTimers = (): void => {
    if (videoHandler) window.removeEventListener('arjs-video-loaded', videoHandler);
    videoHandler = undefined;
    if (cameraErrorHandler) window.removeEventListener('camera-error', cameraErrorHandler);
    cameraErrorHandler = undefined;
    if (readyTimer !== undefined) window.clearTimeout(readyTimer);
    readyTimer = undefined;
    if (adoptTimer !== undefined) window.clearInterval(adoptTimer);
    adoptTimer = undefined;
  };

  const adoptCamera = (): boolean => {
    if (!viewport) return false;
    const video = document.getElementById(AR_VIDEO_ID);
    if (!(video instanceof HTMLVideoElement)) return false;
    if (video.parentElement !== viewport) viewport.prepend(video);
    void video.play().catch(() => undefined);
    return true;
  };

  const onCameraReady = (): void => {
    if (!adoptCamera() || found) return;
    clearTimers();
    statusHandler('scanning');
  };

  const stop = (): void => {
    clearTimers();
    clearArVideo();
    scene?.remove();
    scene = undefined;
    viewport = undefined;
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

      viewport = container;
      scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('renderer', 'alpha: true; antialias: true;');
      scene.setAttribute('background', 'transparent: true');
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

      videoHandler = onCameraReady;
      window.addEventListener('arjs-video-loaded', videoHandler);

      cameraErrorHandler = () => {
        if (found) return;
        clearTimers();
        statusHandler('error', 'denied');
      };
      window.addEventListener('camera-error', cameraErrorHandler);

      container.append(scene);

      adoptTimer = window.setInterval(() => {
        if (adoptCamera()) onCameraReady();
      }, 250);

      readyTimer = window.setTimeout(() => {
        if (found) return;
        clearTimers();
        statusHandler('error', 'timeout');
      }, 15000);
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
