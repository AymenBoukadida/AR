import type { Collectible } from '../domain/campaign';

export type ScannerStatus = 'starting' | 'scanning' | 'found' | 'error';

export interface ScannerOverlayOptions {
  stopNumber: number;
  totalStops: number;
  area: string;
}

export interface RevealContext {
  stopNumber: number;
  area: string;
}

export function scannerStatusCopy(status: ScannerStatus): string {
  switch (status) {
    case 'starting':
      return 'Starting camera…';
    case 'scanning':
      return 'Point at the marker and hold steady';
    case 'found':
      return 'Collectible found';
    case 'error':
      return 'Camera unavailable';
  }
}

export function renderScannerOverlay({ stopNumber, totalStops, area }: ScannerOverlayOptions): string {
  return `
    <div class="scanner-overlay" data-scanner-overlay data-state="starting">
      <div class="ar-viewport" id="ar-viewport"></div>
      <div class="scanner-shade" aria-hidden="true"></div>
      <header class="scanner-bar">
        <button class="icon-button" type="button" data-action="close-scanner" aria-label="Close scanner">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
        <div class="scanner-heading">
          <p class="scanner-eyebrow">Stop ${stopNumber} of ${totalStops}</p>
          <p class="scanner-area">${area}</p>
        </div>
        <span class="scanner-live"><span class="live-dot" aria-hidden="true"></span>Live</span>
      </header>
      <div class="reticle" aria-hidden="true">
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>
        <span class="scanline"></span>
      </div>
      <div class="scanner-footer">
        <p class="scanner-status" data-scanner-status role="status">
          <span class="scanner-spinner" aria-hidden="true"></span>
          <span data-scanner-status-text>${scannerStatusCopy('starting')}</span>
        </p>
        <p class="scanner-tip">Fill the frame with the square marker. Move closer if it does not lock on.</p>
      </div>
    </div>
  `;
}

export function renderCollectibleReveal(collectible: Collectible, context: RevealContext): string {
  return `
    <section class="reveal-sheet" role="dialog" aria-modal="true" aria-labelledby="reveal-title">
      <p class="reveal-eyebrow">Added to your collection</p>
      <div class="reveal-media">
        <img src="${collectible.imageSrc}" alt="${collectible.title}" />
      </div>
      <div class="reveal-body">
        <span class="rarity rarity-${collectible.rarity}">${collectible.rarity}</span>
        <h2 id="reveal-title">${collectible.title}</h2>
        <p class="reveal-description">${collectible.description}</p>
        <p class="reveal-meta">Stop ${context.stopNumber} · ${context.area}</p>
        <button class="primary-button" type="button" data-action="continue-hunt">Continue exploring</button>
        <button class="ghost-button" type="button" data-action="view-collection">View collection</button>
      </div>
    </section>
  `;
}
