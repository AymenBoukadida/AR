import type { Campaign, CampaignStop, Collectible } from './campaign';

export interface HuntTarget {
  stop: CampaignStop;
  collectible: Collectible;
  stopNumber: number;
  totalStops: number;
}

export function getNextTarget(campaign: Campaign, discoveredIds: string[]): HuntTarget | undefined {
  for (const [index, stop] of campaign.stops.entries()) {
    const collectible = campaign.collectibles.find((candidate) => candidate.stopId === stop.id);
    if (collectible && !discoveredIds.includes(collectible.id)) {
      return { stop, collectible, stopNumber: index + 1, totalStops: campaign.stops.length };
    }
  }

  return undefined;
}
