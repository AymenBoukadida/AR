export const DEFAULT_CAMPAIGN_ID = 'hiro-hunt-demo';
export const PWA_MANIFEST_PATH = '/manifest.webmanifest';
export const SERVICE_WORKER_PATH = '/service-worker.js';

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker.register(SERVICE_WORKER_PATH).catch(() => undefined);
  }
}
