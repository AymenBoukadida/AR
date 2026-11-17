export type CameraPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'unavailable';

export interface CameraEnvironment {
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  permissionState?: PermissionState;
}

let grantedThisSession = false;

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
  if (grantedThisSession) return 'granted';

  const status = await checkCameraPermission();
  if (status !== 'prompt') {
    if (status === 'granted') grantedThisSession = true;
    return status;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    stream.getTracks().forEach((track) => track.stop());
    grantedThisSession = true;
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return 'granted';
  } catch (error) {
    const name = error instanceof DOMException ? error.name : '';
    return name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'unavailable';
  }
}
