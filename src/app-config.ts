export const APP_NAME = 'Hiro Hunt';
export const DEFAULT_CAMPAIGN_ID = 'lumen-museum';
export const PWA_MANIFEST_PATH = '/manifest.webmanifest';
export const SERVICE_WORKER_PATH = '/service-worker.js';

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker.register(SERVICE_WORKER_PATH).catch(() => undefined);
  }
}
