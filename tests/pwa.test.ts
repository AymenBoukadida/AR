import { describe, expect, it } from 'vitest';
import { PWA_MANIFEST_PATH, SERVICE_WORKER_PATH } from '../src/app-config';

describe('PWA configuration', () => {
  it('points to the install manifest and service worker', () => {
    expect(PWA_MANIFEST_PATH).toBe('/manifest.webmanifest');
    expect(SERVICE_WORKER_PATH).toBe('/service-worker.js');
  });
});
