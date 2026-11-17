import type { Campaign, CampaignStop, Collectible } from '../domain/campaign';
import { getNextTarget, type HuntTarget } from '../domain/hunt-progress';
import { scannerStatusCopy } from './scanner-overlay';

export type AppView = 'explore' | 'collection';
export type CameraFeedbackState = 'denied' | 'unsupported' | 'unavailable';

export function renderAppShell(campaign: Campaign, discoveredIds: string[], view: AppView = 'explore'): string {
  return `
    <div class="app">
      ${renderTopBar(campaign, discoveredIds)}
      ${renderViewSwitch(campaign, discoveredIds, view)}
      <main class="app-main">
        ${view === 'collection' ? renderCollectionView(campaign, discoveredIds) : renderExploreView(campaign, discoveredIds)}
      </main>
      <footer class="app-footer">
        <a class="marker-link" href="/marker.html" target="_blank" rel="noreferrer">Open the test marker</a>
      </footer>
    </div>
  `;
}

function renderTopBar(campaign: Campaign, discoveredIds: string[]): string {
  const found = discoveredIds.length;
  const total = campaign.collectibles.length;
  const percent = total === 0 ? 0 : Math.round((found / total) * 100);

  return `
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true">${campaign.organization.name.charAt(0)}</span>
        <div class="brand-text">
          <p class="brand-name">${campaign.organization.name}</p>
          <p class="brand-sub">Hiro Hunt</p>
        </div>
      </div>
      <div class="progress-ring" style="--value:${percent}" role="img" aria-label="${found} of ${total} discovered">
        <span>${found}/${total}</span>
      </div>
    </header>
  `;
}

function renderViewSwitch(campaign: Campaign, discoveredIds: string[], view: AppView): string {
  const total = campaign.collectibles.length;
  return `
    <nav class="view-switch" aria-label="Campaign views">
      <button type="button" data-view="explore" class="${view === 'explore' ? 'is-active' : ''}" aria-current="${view === 'explore' ? 'page' : 'false'}">Explore</button>
      <button type="button" data-view="collection" class="${view === 'collection' ? 'is-active' : ''}" aria-current="${view === 'collection' ? 'page' : 'false'}">
        Collection <span class="switch-count">${discoveredIds.length}/${total}</span>
      </button>
    </nav>
  `;
}

function renderExploreView(campaign: Campaign, discoveredIds: string[]): string {
  const found = discoveredIds.length;
  const total = campaign.collectibles.length;
  const percent = total === 0 ? 0 : Math.round((found / total) * 100);
  const target = getNextTarget(campaign, discoveredIds);

  return `
    <section class="hero-card" aria-labelledby="campaign-title">
      <p class="eyebrow">Now exploring</p>
      <h1 id="campaign-title">${campaign.title}</h1>
      <p class="hero-copy">${campaign.description}</p>
      <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${found}" aria-label="Collection progress">
        <span style="width:${percent}%"></span>
      </div>
      <p class="progress-label">${found} of ${total} discovered</p>
    </section>
    ${target ? renderNextStop(target, found) : renderCompleteState(total)}
    ${renderHowTo()}
  `;
}

function renderNextStop(target: HuntTarget, found: number): string {
  const firstStop = found === 0;
  return `
    <section class="next-stop" aria-labelledby="next-title">
      <div class="stop-head">
        <span class="stop-number" aria-hidden="true">${String(target.stopNumber).padStart(2, '0')}</span>
        <div class="stop-heading">
          <p class="eyebrow">${firstStop ? 'First stop' : 'Next stop'}</p>
          <h2 id="next-title">${target.stop.title}</h2>
          <p class="stop-area">${target.stop.area}</p>
        </div>
      </div>
      <blockquote class="clue-quote">“${target.stop.clue}”</blockquote>
      <button class="scan-button" type="button" data-action="start-scan">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.7"/>
        </svg>
        Scan marker
      </button>
    </section>
  `;
}

function renderCompleteState(total: number): string {
  return `
    <section class="complete-card" aria-labelledby="complete-title">
      <p class="eyebrow">Collection complete</p>
      <h2 id="complete-title">Every object is back in its case.</h2>
      <p>You recovered all ${total} pieces of the Midnight Museum. The night curator thanks you — quietly, and from a distance.</p>
      <button class="primary-button" type="button" data-action="reset-progress">Start the museum again</button>
    </section>
  `;
}

function renderHowTo(): string {
  return `
    <section class="how-to" aria-labelledby="how-title">
      <h2 class="section-title" id="how-title">How it works</h2>
      <ol class="steps">
        <li><span class="step-number" aria-hidden="true">1</span><p>Open the marker on a second screen — a laptop, a tablet, or a printed sheet.</p></li>
        <li><span class="step-number" aria-hidden="true">2</span><p>Tap <strong>Scan marker</strong> and fill the frame with the square marker.</p></li>
        <li><span class="step-number" aria-hidden="true">3</span><p>The collectible appears in AR and is added to your collection automatically.</p></li>
      </ol>
    </section>
  `;
}

function renderCollectionView(campaign: Campaign, discoveredIds: string[]): string {
  return `
    <section class="collection-view" aria-labelledby="collection-title">
      <div class="section-head">
        <h2 class="section-title" id="collection-title">The collection</h2>
        <p class="section-meta">${discoveredIds.length} of ${campaign.collectibles.length}</p>
      </div>
      ${renderCollectionPanel(campaign, discoveredIds)}
    </section>
  `;
}

export function renderCollectionPanel(campaign: Campaign, discoveredIds: string[]): string {
  const cards = campaign.collectibles
    .map((collectible) => {
      const discovered = discoveredIds.includes(collectible.id);
      const stop = campaign.stops.find((candidate) => candidate.id === collectible.stopId);
      return discovered
        ? renderDiscoveredCard(collectible)
        : renderLockedCard(stop);
    })
    .join('');

  return `<div class="collection-grid">${cards}</div>`;
}

function renderDiscoveredCard(collectible: Collectible): string {
  return `
    <article class="collection-card is-found">
      <div class="collection-media">
        <img src="${collectible.imageSrc}" alt="${collectible.title}" loading="lazy" />
      </div>
      <div class="collection-body">
        <span class="rarity rarity-${collectible.rarity}">${collectible.rarity}</span>
        <h3>${collectible.title}</h3>
        <p>${collectible.description}</p>
      </div>
    </article>
  `;
}

function renderLockedCard(stop: CampaignStop | undefined): string {
  return `
    <article class="collection-card is-locked">
      <div class="collection-media" aria-hidden="true"><span>?</span></div>
      <div class="collection-body">
        <span class="rarity">Locked</span>
        <h3>${stop?.title ?? 'Unknown stop'}</h3>
        <p>Scan the marker at this stop to reveal it.</p>
      </div>
    </article>
  `;
}

export function renderCameraFeedback(state: CameraFeedbackState): string {
  const copy = {
    denied:
      'Camera access is blocked. Open your browser settings, allow camera access for this site, then try again.',
    unsupported:
      'This browser cannot access a camera. Open Hiro Hunt in a modern mobile browser, or browse your collection below.',
    unavailable:
      'No camera is available right now. Check that another app is not using it, then try again.',
  }[state];

  return `<div class="feedback" role="alert"><strong>${scannerStatusCopy('error')}</strong><p>${copy}</p><button class="ghost-button" type="button" data-action="retry-camera">Try again</button></div>`;
}
