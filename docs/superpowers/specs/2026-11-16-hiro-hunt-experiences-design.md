# Hiro Hunt Experiences Design

## Intent

Turn the existing single-marker AR demo into the first usable slice of Hiro Hunt Experiences: a reusable, mobile-first scavenger-hunt experience for campuses, museums, tourism routes, and events.

The first release is intentionally local and static. It proves the player loop and establishes a generic campaign model before adding accounts, cloud storage, creator uploads, moderation, analytics, or billing.

## Goals

- Let a visitor open the experience in a mobile browser without installing an app.
- Let a visitor scan the existing Hiro marker and reveal a collectible image in AR.
- Show campaign title, stop information, collectible details, clue text, and discovery progress outside the camera view.
- Persist discovered collectibles on the device.
- Represent content as a generic campaign rather than hard-coding a university.
- Keep the content model ready for museums, tourism routes, campuses, and events.
- Make the current demo easy to run locally and deploy as static files.
- Make the experience installable as a PWA on a phone.
- Check camera support and permission state before starting AR.

## Non-goals

- User accounts or cloud synchronization.
- Creator upload workflows or automatic image-to-3D generation.
- GPS tracking or precise location collection.
- Leaderboards, payments, sponsorships, or organization billing.
- Automatic moderation or copyright verification.
- Multiple marker formats in the first slice.

## Product behavior

The experience opens on a campaign home view with the campaign title, short description, progress, and a start-scanning action. The scanner requests camera access and displays the collectible when the configured Hiro marker is detected. A discovery is recorded once per collectible, the collection counter updates, and the visitor can view the collectible story and the next clue. Re-scanning an already discovered marker shows the collectible without increasing progress.

The initial campaign contains five sample collectibles suitable for a campus, museum, or tourism route. Content is configuration, not logic, so a later creator portal can replace it.

## Technical direction

- Use Vite and TypeScript for a small, testable browser application.
- Keep A-Frame and AR.js as the AR layer, with pinned versions and local application code separated from vendor setup.
- Use semantic HTML and CSS for the surrounding campaign UI; use A-Frame only for the camera scene and collectible plane.
- Use localStorage for the first persistence adapter behind a small typed interface.
- Use Vitest for pure campaign and collection-state tests.
- Keep the app deployable to any static host.
- Use a web app manifest and service worker for installability and cached application assets.
- Use the Permissions API when available, while handling unsupported browsers and denied permissions explicitly.

## Future extension points

- Replace the local content provider with a campaign API.
- Replace localStorage with an authenticated sync adapter.
- Add unique marker or QR identifiers per stop.
- Add creator uploads, image validation, moderation, AR preview, and publishing states.
- Add 2.5D and approved 3D collectible assets after the image-card experience is reliable.

## Success criteria

- A first-time visitor can understand the experience without reading the source code.
- A visitor can scan the marker on a supported mobile browser and see the collectible.
- A visitor can install the app from a supported mobile browser and recover clearly from denied camera permission.
- Reloading the page preserves discovered progress.
- The app builds and tests successfully without network access during the test run.
- Replacing campaign content does not require changing application logic.
