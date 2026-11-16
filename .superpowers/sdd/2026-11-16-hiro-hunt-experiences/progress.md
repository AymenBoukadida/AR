# SDD ledger — plan: docs/superpowers/plans/2026-11-16-hiro-hunt-experiences.md

Pre-flight: Task 1 produces the application shell consumed by Tasks 2-5; Task 2 produces campaign types consumed by Tasks 3-5; Task 3 produces CollectionStore consumed by Task 4 and Task 5; Task 4 and Task 5 both modify main.ts and styles.css, so AR integration follows UI wiring. PWA and camera permission requirements were added before implementation because the user explicitly requested phone testing.

Ruling: Use a native Vite/TypeScript build with no backend in the first slice — the user wants a phone-testable MVP quickly, and the spec defers accounts, uploads, moderation, analytics, and billing; cost if wrong is a later migration from local content/localStorage to an API.

Task 1: complete (tests: `npm test -- --run tests/smoke.test.ts tests/pwa.test.ts` → 2 passed; build: `npm run build` → successful)

Task 2: complete (tests: `npm test -- --run` → 3 files, 4 tests passed)

Task 3: complete (tests: `npm test -- --run` → 4 files, 7 tests passed)

Task 4: complete (tests: `npm test -- --run` → 5 files, 10 tests passed; build successful)

Task 5: complete (tests: `npm test -- --run` → 7 files, 16 tests passed; build successful)

Task 6: complete (tests: `npm test -- --run` → 7 files, 16 tests passed; `npm run lint` passed; `npm run build` succeeded)

Task 6: Ruling: Vite 6 rejects the legacy `--https` CLI flag, so HTTPS is configured through `@vitejs/plugin-basic-ssl` and `dev:phone` only passes `--host 0.0.0.0` — this preserves secure-context camera testing; cost if the local certificate is not trusted is that the user must accept the browser warning or use a tunnel.
