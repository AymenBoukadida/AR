import './styles.css';
import { registerServiceWorker } from './app-config';
import { demoCampaign } from './data/demo-campaign';
import { createLocalCollectionStore } from './services/local-collection-store';
import { renderAppShell } from './ui/app-shell';

const app = document.querySelector<HTMLElement>('#app');

if (app) {
  const collectionStore = createLocalCollectionStore(window.localStorage);
  app.innerHTML = renderAppShell(demoCampaign, collectionStore.getDiscoveredIds());
}

registerServiceWorker();
