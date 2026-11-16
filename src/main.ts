import './styles.css';
import { registerServiceWorker } from './app-config';
import { demoCampaign } from './data/demo-campaign';
import { createLocalCollectionStore } from './services/local-collection-store';
import { createArScanner } from './ar/ar-scanner';
import { renderAppShell, renderCameraFeedback } from './ui/app-shell';

const app = document.querySelector<HTMLElement>('#app');

if (app) {
  const collectionStore = createLocalCollectionStore(window.localStorage);
  const scanner = createArScanner(demoCampaign);
  scanner.onDiscovery((collectibleId) => {
    collectionStore.discover(collectibleId);
    app.innerHTML = renderAppShell(demoCampaign, collectionStore.getDiscoveredIds());
    bindScanButton();
  });

  const bindScanButton = (): void => {
    app.querySelector<HTMLButtonElement>('[data-action="start-scan"]')?.addEventListener('click', async () => {
      try {
        await scanner.start();
      } catch (error) {
        const reason = error instanceof Error && error.message.includes('denied') ? 'denied' : 'unavailable';
        const feedback = app.querySelector<HTMLElement>('#scanner');
        if (feedback) {
          feedback.hidden = false;
          feedback.innerHTML = renderCameraFeedback(reason);
        }
      }
    });
  };

  app.innerHTML = renderAppShell(demoCampaign, collectionStore.getDiscoveredIds());
  bindScanButton();
}

registerServiceWorker();
