export type CollectibleRarity = 'common' | 'rare' | 'legendary';

export interface Organization {
  id: string;
  name: string;
  type: 'campus' | 'museum' | 'tourism' | 'event' | 'other';
}

export interface CampaignStop {
  id: string;
  title: string;
  area: string;
  clue: string;
  markerId: string;
}

export interface Collectible {
  id: string;
  stopId: string;
  title: string;
  description: string;
  rarity: CollectibleRarity;
  imageSrc: string;
}

export interface Campaign {
  id: string;
  organization: Organization;
  title: string;
  description: string;
  stops: CampaignStop[];
  collectibles: Collectible[];
}
