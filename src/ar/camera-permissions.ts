export type CameraPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'unavailable';

export interface CameraEnvironment {
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  permissionState?: PermissionState;
}

function browserEnvironment(): CameraEnvironment {
  return {
    isSecureContext: window.isSecureContext,
    hasMediaDevices: Boolean(navigator.mediaDevices?.getUserMedia),
  };
}

export async function checkCameraPermission(environment: CameraEnvironment = browserEnvironment()): Promise<CameraPermissionStatus> {
  if (!environment.isSecureContext) return 'unavailable';
  if (!environment.hasMediaDevices) return 'unsupported';
  if (environment.permissionState === 'granted') return 'granted';
  if (environment.permissionState === 'denied') return 'denied';
  if (environment.permissionState === 'prompt') return 'prompt';

  if (typeof navigator.permissions?.query === 'function') {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state;
    } catch {
      return 'prompt';
    }
  }

  return 'prompt';
}

export async function requestCameraAccess(): Promise<CameraPermissionStatus> {
  const status = await checkCameraPermission();
  if (status !== 'prompt') return status;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    stream.getTracks().forEach((track) => track.stop());
    return 'granted';
  } catch {
    return 'denied';
  }
}
