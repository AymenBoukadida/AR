import './styles.css';
import { registerServiceWorker } from './app-config';
import { createArScanner } from './ar/ar-scanner';
import { demoCampaign, getCollectible } from './data/demo-campaign';
import type { HuntTarget } from './domain/hunt-progress';
import { getNextTarget } from './domain/hunt-progress';
import { createLocalCollectionStore } from './services/local-collection-store';
import type { AppView, CameraFeedbackState } from './ui/app-shell';
import { renderAppShell, renderCameraFeedback } from './ui/app-shell';
import {
  renderCollectibleReveal,
  renderScannerOverlay,
  scannerStatusCopy,
  type ScannerStatus,
} from './ui/scanner-overlay';

const app = document.querySelector<HTMLElement>('#app');
const overlayRoot = document.querySelector<HTMLElement>('#overlay');

if (app && overlayRoot) {
  const collectionStore = createLocalCollectionStore(window.localStorage);
  const scanner = createArScanner();
  let view: AppView = 'explore';
  let activeTarget: HuntTarget | undefined;

  const render = (): void => {
    app.innerHTML = renderAppShell(demoCampaign, collectionStore.getDiscoveredIds(), view);
  };

  const closeScanner = (): void => {
    scanner.stop();
    overlayRoot.innerHTML = '';
    activeTarget = undefined;
    document.body.classList.remove('is-scanning');
  };

  const updateScannerState = (status: ScannerStatus): void => {
    const overlay = overlayRoot.querySelector<HTMLElement>('[data-scanner-overlay]');
    if (!overlay) return;
    overlay.dataset.state = status;
    const statusElement = overlay.querySelector<HTMLElement>('[data-scanner-status-text]');
    if (statusElement) statusElement.textContent = scannerStatusCopy(status);
  };

  const showScannerError = (state: CameraFeedbackState): void => {
    const overlay = overlayRoot.querySelector<HTMLElement>('[data-scanner-overlay]');
    if (!overlay) return;
    overlay.dataset.state = 'error';
    const footer = overlay.querySelector<HTMLElement>('.scanner-footer');
    if (footer) footer.innerHTML = renderCameraFeedback(state);
  };

  const openScanner = async (): Promise<void> => {
    const target = getNextTarget(demoCampaign, collectionStore.getDiscoveredIds());
    if (!target) {
      view = 'collection';
      render();
      return;
    }

    scanner.stop();
    activeTarget = target;
    overlayRoot.innerHTML = renderScannerOverlay({
      stopNumber: target.stopNumber,
      totalStops: target.totalStops,
      area: target.stop.area,
    });
    document.body.classList.add('is-scanning');

    const viewport = overlayRoot.querySelector<HTMLElement>('#ar-viewport');
    if (!viewport) return;

    try {
      await scanner.start(target, viewport);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const state: CameraFeedbackState = message.includes('denied')
        ? 'denied'
        : message.includes('unsupported')
          ? 'unsupported'
          : 'unavailable';
      showScannerError(state);
    }
  };

  scanner.onStatus((status, detail) => {
    if (status === 'error') {
      showScannerError(detail === 'denied' ? 'denied' : detail === 'unsupported' ? 'unsupported' : 'unavailable');
      return;
    }
    updateScannerState(status);
  });

  scanner.onDiscovery((collectibleId) => {
    const collectible = getCollectible(demoCampaign, collectibleId);
    const target = activeTarget;
    if (!collectible || !target) return;

    collectionStore.discover(collectibleId);
    const overlay = overlayRoot.querySelector<HTMLElement>('[data-scanner-overlay]');
    if (!overlay) return;

    overlay.dataset.state = 'found';
    overlay.classList.add('has-reveal');
    overlay.insertAdjacentHTML(
      'beforeend',
      renderCollectibleReveal(collectible, { stopNumber: target.stopNumber, area: target.stop.area }),
    );
  });

  document.addEventListener('click', (event) => {
    const element = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-action], [data-view]');
    if (!element) return;

    const nextView = element.dataset.view as AppView | undefined;
    if (nextView) {
      view = nextView;
      render();
      return;
    }

    switch (element.dataset.action) {
      case 'start-scan':
        void openScanner();
        break;
      case 'close-scanner':
      case 'continue-hunt':
        closeScanner();
        render();
        break;
      case 'view-collection':
        closeScanner();
        view = 'collection';
        render();
        break;
      case 'retry-camera':
        void openScanner();
        break;
      case 'reset-progress':
        if (window.confirm('Reset your collection and start the museum again?')) {
          collectionStore.clear();
          view = 'explore';
          render();
        }
        break;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('is-scanning')) {
      closeScanner();
      render();
    }
  });

  render();
}

registerServiceWorker();
