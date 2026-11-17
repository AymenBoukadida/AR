import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PWA_MANIFEST_PATH, SERVICE_WORKER_PATH } from '../src/app-config';

const serviceWorkerSource = readFileSync(new URL('../public/service-worker.js', import.meta.url), 'utf8');

describe('PWA configuration', () => {
  it('points to the install manifest and service worker', () => {
    expect(PWA_MANIFEST_PATH).toBe('/manifest.webmanifest');
    expect(SERVICE_WORKER_PATH).toBe('/service-worker.js');
  });

  it('serves navigations from the network before the cache', () => {
    expect(serviceWorkerSource).toContain("request.mode === 'navigate'");
    expect(serviceWorkerSource.indexOf('fetch(request)')).toBeLessThan(
      serviceWorkerSource.indexOf("caches.match('/index.html')"),
    );
  });

  it('claims open pages and drops older caches when it updates', () => {
    expect(serviceWorkerSource).toContain('self.skipWaiting()');
    expect(serviceWorkerSource).toContain('self.clients.claim()');
    expect(serviceWorkerSource).toContain('caches.delete(key)');
  });
});
