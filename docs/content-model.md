# Campaign content model

The app is content-driven so the same engine can support a campus, museum, tourism route, or event. The pilot is the Lumen Museum campaign in `src/data/demo-campaign.ts`.

## Campaign

A campaign contains an organization, a title, a description, stops, and collectibles.

```ts
interface Campaign {
  id: string;
  organization: Organization;
  title: string;
  description: string;
  stops: CampaignStop[];
  collectibles: Collectible[];
}
```

`organization.type` distinguishes `campus`, `museum`, `tourism`, `event`, `brand`, and `other`.

## Stops

A stop represents a physical location. It contains a visitor-facing area label, a clue, and a marker identifier.

```ts
interface CampaignStop {
  id: string;
  title: string;
  area: string;
  clue: string;
  markerId: string;
}
```

Stops are ordered. The hunt resolves the first stop whose collectible is not yet discovered, so the order of `stops` is the visitor's route.

In the museum pilot all five stops share `markerId: 'hiro-main'`, which maps to `/pattern-hiro.patt`. A production campaign should assign a unique marker or QR identifier to every stop.

## Collectibles

Each collectible contains:

- `id` — stable identifier
- `stopId` — the location that unlocks it
- `title` — public name
- `description` — story or educational copy
- `rarity` — `common`, `rare`, or `legendary`
- `imageSrc` — the image shown in AR and in the collection

The museum pilot ships five placeholder specimen plates in `public/art/`. They are deliberately simple SVG plates so a real campaign can swap in venue artwork without touching the code. Replace the `imageSrc` value on each collectible, keep the file inside `public/`, and the AR plane sizes itself from the new image aspect ratio.

When creator uploads are added, these fields should be produced by the approval workflow rather than edited directly in the frontend repository.

## Progression

`getNextTarget(campaign, discoveredIds)` returns the stop, collectible, stop number, and total stop count for the next undiscovered stop. When every collectible is discovered it returns `undefined` and the app shows the completion card.

Progress is stored per browser under `hiro-hunt:collection:v1` in `localStorage`. There is no account, no GPS lookup, and no server round trip.
