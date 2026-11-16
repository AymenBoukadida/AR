import './styles.css';
import { DEFAULT_CAMPAIGN_ID, registerServiceWorker } from './app-config';

const app = document.querySelector<HTMLElement>('#app');

if (app) {
  app.innerHTML = `
    <main class="app-shell">
      <section class="hero" aria-labelledby="campaign-title">
        <p class="eyebrow">Hiro Hunt Experiences</p>
        <h1 id="campaign-title">Discover the hidden collection</h1>
        <p class="hero-copy">Scan a Hiro marker to unlock a collectible and reveal the next stop.</p>
        <p class="campaign-id" data-campaign-id>${DEFAULT_CAMPAIGN_ID}</p>
        <button class="primary-action" type="button">Start scanning</button>
      </section>
    </main>
  `;
}

registerServiceWorker();
