# Campaign content model

The app is content-driven so the same engine can support a campus, museum, tourism route, or event.

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

## Stops

A stop represents a physical location. It contains a visitor-facing area label, a clue, and a marker identifier.

The current MVP uses the same Hiro marker for the first stop. A production campaign should assign a unique marker or QR identifier to every stop.

## Collectibles

Each collectible contains:

- `id` — stable identifier
- `stopId` — the location that unlocks it
- `title` — public name
- `description` — story or educational copy
- `rarity` — `common`, `rare`, or `legendary`
- `imageSrc` — the image shown in AR

When creator uploads are added, these fields should be produced by the approval workflow rather than edited directly in the frontend repository.
