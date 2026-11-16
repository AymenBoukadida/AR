import { describe, expect, it } from 'vitest';
import { checkCameraPermission, type CameraEnvironment } from '../src/ar/camera-permissions';

function environment(overrides: Partial<CameraEnvironment> = {}): CameraEnvironment {
  return {
    isSecureContext: true,
    hasMediaDevices: true,
    permissionState: 'prompt',
    ...overrides,
  };
}

describe('camera permission checks', () => {
  it('reports granted permission', async () => {
    await expect(checkCameraPermission(environment({ permissionState: 'granted' }))).resolves.toBe('granted');
  });

  it('reports denied permission', async () => {
    await expect(checkCameraPermission(environment({ permissionState: 'denied' }))).resolves.toBe('denied');
  });

  it('reports prompt permission', async () => {
    await expect(checkCameraPermission(environment())).resolves.toBe('prompt');
  });

  it('reports unsupported or insecure environments', async () => {
    await expect(checkCameraPermission(environment({ hasMediaDevices: false }))).resolves.toBe('unsupported');
    await expect(checkCameraPermission(environment({ isSecureContext: false }))).resolves.toBe('unavailable');
  });
});
