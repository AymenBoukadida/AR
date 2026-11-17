import type { Campaign, Collectible } from '../domain/campaign';

export const demoCampaign: Campaign = {
  id: 'lumen-museum',
  organization: {
    id: 'lumen-museum',
    name: 'Lumen Museum',
    type: 'museum',
  },
  title: 'The Midnight Museum',
  description:
    'Five curious things slipped out of their cases after closing. Scan each marker to coax one back before the museum wakes up.',
  stops: [
    {
      id: 'atrium',
      title: 'The Grand Atrium',
      area: 'Ground floor Â· under the skylight',
      clue: 'Start where the marble floor holds the daylight.',
      markerId: 'hiro-main',
    },
    {
      id: 'clock-hall',
      title: 'Hall of Clocks',
      area: 'First floor Â· east wing',
      clue: 'Find the room where every clock disagrees.',
      markerId: 'hiro-main',
    },
    {
      id: 'sculpture-court',
      title: 'The Sculpture Court',
      area: 'Ground floor Â· open air',
      clue: 'Look for the figure who has stood still the longest.',
      markerId: 'hiro-main',
    },
    {
      id: 'cabinet',
      title: 'Cabinet of Wonders',
      area: 'Lower level Â· room 04',
      clue: 'Small things, strange labels, one locked drawer.',
      markerId: 'hiro-main',
    },
    {
      id: 'rooftop',
      title: 'The Rooftop',
      area: 'Fifth floor Â· observatory',
      clue: 'Climb until the city becomes part of the exhibit.',
      markerId: 'hiro-main',
    },
  ],
  collectibles: [
    {
      id: 'welcome-raven',
      stopId: 'atrium',
      title: 'The Welcome Raven',
      description: 'Perches above the ticket desk and silently judges your coat.',
      rarity: 'common',
      imageSrc: '/art/raven.svg',
    },
    {
      id: 'brass-moth',
      stopId: 'clock-hall',
      title: 'The Brass Moth',
      description: 'Nested inside the oldest clock in 1921. Its wings still keep perfect time.',
      rarity: 'common',
      imageSrc: '/art/moth.svg',
    },
    {
      id: 'marble-sneeze',
      stopId: 'sculpture-court',
      title: 'The Marble Sneeze',
      description: 'A sculptorâ€™s unfinished masterpiece, frozen one second before the achoo.',
      rarity: 'rare',
      imageSrc: '/art/sneeze.svg',
    },
    {
      id: 'tiny-leviathan',
      stopId: 'cabinet',
      title: 'The Tiny Leviathan',
      description: 'A whale the size of a thumb. The label reads: do not feed.',
      rarity: 'rare',
      imageSrc: '/art/leviathan.svg',
    },
    {
      id: 'night-curator',
      stopId: 'rooftop',
      title: 'The Night Curator',
      description: 'She collects the dreams visitors leave behind and files them by colour.',
      rarity: 'legendary',
      imageSrc: '/art/curator.svg',
    },
  ],
};

export function getCollectible(campaign: Campaign, id: string): Collectible | undefined {
  return campaign.collectibles.find((collectible) => collectible.id === id);
}

