import type { Campaign } from '../domain/campaign';

export type CameraFeedbackState = 'denied' | 'unsupported' | 'unavailable';

export function renderAppShell(campaign: Campaign, discoveredIds: string[]): string {
  return `
    <main class="app-shell">
      <section class="hero" aria-labelledby="campaign-title">
        <p class="eyebrow">${campaign.organization.name}</p>
        <h1 id="campaign-title">${campaign.title}</h1>
        <p class="hero-copy">${campaign.description}</p>
        <p class="progress" aria-live="polite">${discoveredIds.length} / ${campaign.collectibles.length} discovered</p>
        <button class="primary-action" type="button" data-action="start-scan">Start scanning</button>
      </section>
      <section class="collection-section" aria-labelledby="collection-title">
        <h2 id="collection-title">Your collection</h2>
        ${renderCollectionPanel(campaign, discoveredIds)}
      </section>
      <section id="scanner" class="scanner" aria-live="polite" hidden></section>
    </main>
  `;
}

export function renderCollectionPanel(campaign: Campaign, discoveredIds: string[]): string {
  const cards = campaign.collectibles.map((collectible) => {
    const discovered = discoveredIds.includes(collectible.id);
    const stop = campaign.stops.find((candidate) => candidate.id === collectible.stopId);
    return `
      <article class="collectible-card${discovered ? ' is-discovered' : ''}">
        <div class="collectible-image" role="img" aria-label="${discovered ? collectible.title : 'Undiscovered collectible'}" style="background-image:url('${discovered ? collectible.imageSrc : ''}')"></div>
        <div>
          <p class="rarity">${discovered ? collectible.rarity : 'undiscovered'}</p>
          <h3>${discovered ? collectible.title : 'A mystery awaits'}</h3>
          <p>${discovered ? collectible.description : 'Find the marker to reveal this collectible.'}</p>
          ${discovered && stop ? `<p class="clue">Next clue: ${stop.clue}</p>` : ''}
        </div>
      </article>
    `;
  }).join('');

  return `<div class="collection-grid">${cards}</div>`;
}

export function renderCameraFeedback(state: CameraFeedbackState): string {
  const copy = {
    denied: 'Camera access is blocked. Open your browser settings, allow camera access for this site, then try again.',
    unsupported: 'This browser cannot access a camera. Open Hiro Hunt in a modern mobile browser or use the collection below.',
    unavailable: 'No camera is available right now. Check that another app is not using it, then try again.',
  }[state];

  return `<div class="feedback" role="alert"><strong>Scanner unavailable</strong><p>${copy}</p><button type="button" data-action="retry-camera">Try again</button></div>`;
}
