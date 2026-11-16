import type { Campaign, Collectible } from '../domain/campaign';

export const demoCampaign: Campaign = {
  id: 'hiro-hunt-demo',
  organization: {
    id: 'hiro-lab',
    name: 'Hiro Hunt Lab',
    type: 'other',
  },
  title: 'The Curious Collection',
  description: 'Find the hidden markers, meet the strange locals, and complete the collection.',
  stops: [
    { id: 'stop-one', title: 'The First Clue', area: 'Main entrance', clue: 'Start where every journey begins.', markerId: 'hiro-main' },
    { id: 'stop-two', title: 'The Quiet Corner', area: 'Reading room', clue: 'Look where stories wait patiently.', markerId: 'hiro-main' },
    { id: 'stop-three', title: 'The Gathering Place', area: 'Central courtyard', clue: 'Find the place where paths cross.', markerId: 'hiro-main' },
    { id: 'stop-four', title: 'The Workshop', area: 'Creative studio', clue: 'Search where ideas become real things.', markerId: 'hiro-main' },
    { id: 'stop-five', title: 'The Final View', area: 'Upper terrace', clue: 'Finish somewhere with a good view.', markerId: 'hiro-main' },
  ],
  collectibles: [
    { id: 'caffeine-wizard', stopId: 'stop-one', title: 'The Caffeine Wizard', description: 'Has attended more coffee breaks than lectures.', rarity: 'common', imageSrc: '/capture.jpg' },
    { id: 'deadline-goblin', stopId: 'stop-two', title: 'The Deadline Goblin', description: 'Feeds on unfinished assignments and dramatic sighs.', rarity: 'common', imageSrc: '/capture.jpg' },
    { id: 'lost-tourist', stopId: 'stop-three', title: 'The Lost Tourist', description: 'Has a map, three directions, and no idea where they are.', rarity: 'rare', imageSrc: '/capture.jpg' },
    { id: 'wifi-vampire', stopId: 'stop-four', title: 'The Wi-Fi Vampire', description: 'Appears whenever the signal drops below two bars.', rarity: 'rare', imageSrc: '/capture.jpg' },
    { id: 'professor-boss', stopId: 'stop-five', title: 'The Professor Boss', description: 'The final collectible. Bring curiosity and a charged phone.', rarity: 'legendary', imageSrc: '/capture.jpg' },
  ],
};

export function getCollectible(campaign: Campaign, id: string): Collectible | undefined {
  return campaign.collectibles.find((collectible) => collectible.id === id);
}
