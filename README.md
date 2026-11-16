# Hiro Hunt Experiences

Hiro Hunt is a mobile-first AR scavenger-hunt prototype for campuses, museums, tourism routes, and events. Visitors scan a Hiro marker, unlock a collectible, read its story, and continue toward the next stop.

## Current MVP

- Installable PWA with a mobile campaign screen
- A-Frame and AR.js marker scanning
- Explicit camera support and permission checks
- Five venue-neutral demo collectibles
- Local collection progress using `localStorage`
- Camera recovery guidance when permission is denied or unavailable

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

1. Open the app on a phone.
2. Allow camera access when prompted.
3. Print or display `pattern-hiro.png` on another screen.
4. Point the phone at the marker.
5. The first collectible should appear above the marker.
6. Reload the page and confirm the collection progress remains.

## Project structure

- `src/domain` — venue-neutral campaign and collection types
- `src/data` — demo campaign content
- `src/ar` — camera permission checks and AR adapter
- `src/ui` — campaign and collection rendering
- `public` — PWA files and AR assets
- `docs/content-model.md` — how campaign content is structured
- `docs/deployment.md` — static hosting and phone testing

The current MVP uses one Hiro marker and local storage. Unique markers or QR identifiers, creator uploads, moderation, analytics, accounts, and cloud synchronization are planned extensions.
