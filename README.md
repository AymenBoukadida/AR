# Hiro Hunt Experiences

Hiro Hunt is a mobile-first AR scavenger-hunt engine for campuses, museums, tourism routes, events, and brands. Visitors scan a Hiro marker, unlock a collectible, read its story, and continue toward the next stop.

The pilot campaign is **The Midnight Museum** at the fictional Lumen Museum: five objects have slipped out of their cases and the visitor coaxes them back, one scan at a time.

## Current MVP

- Installable PWA with a mobile campaign screen
- Full-screen AR scanner with framing reticle, scan line, and live status copy
- A-Frame and AR.js marker scanning
- Sequential hunt: each successful scan unlocks the next undiscovered stop
- Explicit camera support and permission checks with recovery guidance
- Collection grid with locked and discovered states
- Local collection progress using `localStorage`
- Printable or second-screen marker page at `/marker.html`

## Run locally

```sh
npm install
npm run dev
```

For a phone on the same network, use the HTTPS development command:

```sh
npm run dev:phone
```

Open the HTTPS URL printed by Vite on the phone. The browser may show a certificate warning because the development certificate is local. Camera access requires HTTPS or `localhost`.

## Test and build

```sh
npm test -- --run
npm run lint
npm run build
```

## Try the AR flow

1. Open `/marker.html` on a second screen, or print it. The marker must stay visible in white space.
2. Open the app on a phone and allow camera access when prompted.
3. Tap **Scan marker** and fill the frame with the square marker.
4. Hold 20–30 cm away and avoid glare on the second screen.
5. The collectible appears above the marker and is added to the collection.
6. Tap **Continue exploring** to return to the next stop clue.
7. Reload the page and confirm the collection progress remains.

The demo campaign reuses one Hiro marker for every stop, so a single marker walks through all five collectibles. Unique markers or QR identifiers per stop are the next step for a real venue.

## Project structure

- `src/domain` — venue-neutral campaign, collection, and hunt-progression types
- `src/data` — demo campaign content
- `src/ar` — camera permission checks and the AR.js scene adapter
- `src/ui` — app shell and scanner overlay rendering
- `public` — PWA files, AR marker assets, collectible plates, and `marker.html`
- `docs/content-model.md` — how campaign content is structured
- `docs/deployment.md` — static hosting and phone testing

The MVP uses one Hiro marker and local storage. Unique markers or QR identifiers, creator uploads, moderation, analytics, accounts, and cloud synchronization are planned extensions.
