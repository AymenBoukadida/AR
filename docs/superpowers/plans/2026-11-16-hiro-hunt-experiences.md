# Hiro Hunt Experiences Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable mobile web slice of Hiro Hunt Experiences from the existing single-marker AR demo.

**Architecture:** A Vite + TypeScript static application will separate campaign content, collection state, AR scene setup, and the browser UI. The first persistence adapter uses localStorage, while typed interfaces keep future API synchronization replaceable. A-Frame and AR.js remain responsible only for camera tracking and rendering the configured collectible.

**Tech Stack:** Vite, TypeScript, A-Frame, AR.js, semantic HTML/CSS, Vitest, ESLint, npm.

**Spec:** `docs/superpowers/specs/2026-11-16-hiro-hunt-experiences-design.md`

## Global Constraints

- The first release is a static mobile web application and installable PWA.
- The first release uses the existing Hiro pattern marker and does not add GPS, accounts, or cloud sync.
- Campaign content must be generic enough for campuses, museums, tourism routes, and events.
- Third-party AR dependencies must use pinned versions.
- Collection state must be stored behind an interface and persisted locally.
- Tests must not require a camera, network, or external service.
- No automatic image-to-3D generation is part of this release.
- Camera permission must be checked before AR initialization and denied/unavailable states must provide recovery guidance.

## Review Focus

- Camera permission denied or unavailable: the visitor receives a clear recovery message and a non-camera content path.
- Marker rescanned after discovery: the collectible is shown again without incrementing progress.
- Corrupt or missing localStorage data: the app resets safely to an empty collection.
- Campaign content replaced with a different venue type: labels and progress still work without university-specific assumptions.
- Narrow mobile viewport and reduced motion: the controls remain usable and animations do not block discovery.
- PWA install or service-worker failure: the core web experience remains usable without installation or offline caching.

---

### Task 1: Establish the TypeScript application shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/main.ts`
- Create: `src/styles.css`
- Create: `public/manifest.webmanifest`
- Create: `public/service-worker.js`
- Move or replace: `index.html`
- Delete or replace: `index.html` legacy inline implementation
- Test: `tests/smoke.test.ts`
- Test: `tests/pwa.test.ts`

**Interfaces:**
- Consumes: none.
- Produces: `npm run dev`, `npm run build`, and `npm test` commands; a browser entry point at `src/main.ts`.

- [ ] **Step 1: Write the failing smoke test**

Create a Vitest test that imports the app's pure boot configuration and asserts the default campaign identifier is `hiro-hunt-demo`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run tests/smoke.test.ts`

Expected: FAIL because the TypeScript application does not exist yet.

- [ ] **Step 3: Add the Vite and TypeScript shell**

Create the npm scripts `dev`, `build`, `preview`, `test`, and `lint`. Replace inline scripts with a minimal HTML shell that loads `src/main.ts`, add a reset and responsive layout stylesheet, add a manifest and service-worker registration, and make the app bootstrap without a camera dependency. Service-worker registration failure must not prevent the app from loading.

- [ ] **Step 4: Run the test and build**

Run: `npm test -- --run tests/smoke.test.ts` and `npm run build`

Expected: PASS and a successful `dist/` build.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts index.html src tests
git commit -m "build: add typed web application shell"
```

### Task 2: Add generic campaign and collectible content

**Files:**
- Create: `src/domain/campaign.ts`
- Create: `src/data/demo-campaign.ts`
- Test: `tests/campaign.test.ts`

**Interfaces:**
- Consumes: application shell from Task 1.
- Produces: `Campaign`, `Collectible`, and `CampaignStop` types; `demoCampaign`; `getCollectible(campaign, id)`.

- [ ] **Step 1: Write failing campaign tests**

Test that the demo campaign has five collectibles, every collectible has an id, title, description, rarity, image source, and stop id, and `getCollectible` returns `undefined` for an unknown id.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run tests/campaign.test.ts`

Expected: FAIL because the domain types and campaign data do not exist.

- [ ] **Step 3: Implement the campaign model and demo data**

Define venue-neutral types for organization, campaign, stop, collectible, clue, and marker configuration. Add five sample collectibles with campus/museum/tourism-neutral copy, using the existing `capture.jpg` for the first asset until additional approved assets exist.

- [ ] **Step 4: Run the tests**

Run: `npm test -- --run tests/campaign.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/campaign.ts src/data/demo-campaign.ts tests/campaign.test.ts
git commit -m "feat: add venue-neutral campaign content model"
```

### Task 3: Implement local collection state

**Files:**
- Create: `src/domain/collection.ts`
- Create: `src/services/local-collection-store.ts`
- Test: `tests/collection.test.ts`

**Interfaces:**
- Consumes: `Collectible` ids from Task 2.
- Produces: `CollectionStore` with `getDiscoveredIds(): string[]`, `discover(id: string): void`, `hasDiscovered(id: string): boolean`, and `clear(): void`.

- [ ] **Step 1: Write failing collection tests**

Test discovery, duplicate discovery, clearing, and malformed localStorage input. Assert duplicate discovery does not create duplicate ids and malformed data resets safely.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run tests/collection.test.ts`

Expected: FAIL because the collection store does not exist.

- [ ] **Step 3: Implement the store**

Use a versioned localStorage key `hiro-hunt:collection:v1`, deduplicate ids with a `Set`, and keep browser storage access injectable so tests can use an in-memory Storage implementation.

- [ ] **Step 4: Run the tests**

Run: `npm test -- --run tests/collection.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/collection.ts src/services/local-collection-store.ts tests/collection.test.ts
git commit -m "feat: persist local collectible progress"
```

### Task 4: Build the campaign and collection interface

**Files:**
- Create: `src/ui/app-shell.ts`
- Create: `src/ui/collection-panel.ts`
- Create: `src/ui/feedback.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`
- Test: `tests/ui-state.test.ts`

**Interfaces:**
- Consumes: `demoCampaign` and `CollectionStore` from Tasks 2 and 3.
- Produces: accessible start-scanning control, progress counter, collection panel, collectible detail view, clue display, and camera error feedback.

- [ ] **Step 1: Write failing UI-state tests**

Test rendering of `0 / 5` progress, rendering of a discovered collectible, and a camera-unavailable feedback state that includes a non-camera way to view the collectible details.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run tests/ui-state.test.ts`

Expected: FAIL because the UI modules do not exist.

- [ ] **Step 3: Implement the UI modules**

Use semantic buttons, headings, lists, and live status text. Keep all copy campaign-driven. Add mobile-first layout, visible focus states, reduced-motion handling, and a collection panel that never blocks the camera recovery path.

- [ ] **Step 4: Run tests and build**

Run: `npm test -- --run tests/ui-state.test.ts` and `npm run build`

Expected: PASS and successful build.

- [ ] **Step 5: Commit**

```bash
git add src/main.ts src/ui src/styles.css tests/ui-state.test.ts
git commit -m "feat: add scavenger hunt collection interface"
```

### Task 5: Integrate the AR marker scanner

**Files:**
- Create: `src/ar/ar-scene.ts`
- Create: `src/ar/ar-scanner.ts`
- Create: `src/ar/camera-permissions.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`
- Test: `tests/ar-scanner.test.ts`
- Test: `tests/camera-permissions.test.ts`

**Interfaces:**
- Consumes: marker configuration from `demoCampaign` and discovery callback from `CollectionStore`.
- Produces: `CameraPermissionStatus`, `checkCameraPermission(): Promise<CameraPermissionStatus>`, and `ArScanner` with `start(): Promise<void>`, `stop(): void`, and `onDiscovery(callback: (collectibleId: string) => void): void`.

- [ ] **Step 1: Write failing scanner adapter tests**

Test that permission checks distinguish granted, denied, prompt, unsupported, and unavailable states. Test that the scanner maps the configured marker id to the configured collectible id, ignores unknown marker ids, and reports camera initialization failures to the UI callback.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- --run tests/ar-scanner.test.ts`

Expected: FAIL because the scanner adapter does not exist.

- [ ] **Step 3: Implement the AR adapter**

Check secure context, `navigator.mediaDevices`, and the Permissions API when available before starting AR. Provide a clear retry/settings message for denied or unavailable camera access. Load pinned A-Frame and AR.js versions in the Vite entry, create the scene from the campaign marker configuration, render the collectible image as a flat AR plane, and keep the external library events behind the `ArScanner` interface. Do not put collection or UI business logic inside A-Frame event handlers.

- [ ] **Step 4: Run tests and build**

Run: `npm test -- --run tests/ar-scanner.test.ts` and `npm run build`

Expected: PASS and successful build.

- [ ] **Step 5: Commit**

```bash
git add src/ar src/main.ts src/styles.css tests/ar-scanner.test.ts package.json
git commit -m "feat: integrate Hiro marker scanning"
```

### Task 6: Update documentation and verify the mobile flow

**Files:**
- Modify: `README.md`
- Create: `docs/content-model.md`
- Create: `docs/deployment.md`
- Create: `tests/fixtures/README.md`

**Interfaces:**
- Consumes: completed application from Tasks 1-5.
- Produces: reproducible local run instructions, static deployment instructions, campaign content editing guide, and manual verification checklist.

- [ ] **Step 1: Document the content model and local run**

Document `npm install`, `npm run dev`, `npm test`, `npm run build`, supported camera requirements, marker printing, and how to replace demo campaign content without changing application logic.

- [ ] **Step 2: Document deployment and recovery behavior**

Document static hosting requirements, HTTPS camera requirement, camera-denied behavior, localStorage reset instructions, and the current limitations around unique markers, accounts, and image-to-3D generation.

- [ ] **Step 3: Run the full verification suite**

Run: `npm test -- --run`, `npm run lint`, and `npm run build`

Expected: all tests pass, lint passes, and `dist/` is generated.

- [ ] **Step 4: Manually verify on a phone**

Serve the build from HTTPS or a trusted local tunnel, open it on a phone, deny and then allow camera permission, scan the printed Hiro marker, discover the collectible, reload the page, and confirm progress remains.

- [ ] **Step 5: Commit**

```bash
git add README.md docs tests/fixtures
git commit -m "docs: document Hiro Hunt setup and content workflow"
```
