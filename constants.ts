import { ItemType, Parcel } from './types';

export const GRID_SIZE = 6; // 6x6
export const MAX_ITEM_LEVEL = 10;

export const ITEM_DEFINITIONS: Record<ItemType, { name: string; hue: string; baseValue: number }> = {
  [ItemType.WOOD]: { name: 'Lumber', hue: 'hue-rotate-15', baseValue: 5 },
  [ItemType.STONE]: { name: 'Masonry', hue: 'grayscale', baseValue: 8 },
  [ItemType.CROP]: { name: 'Harvest', hue: 'hue-rotate-90', baseValue: 3 },
  [ItemType.POTION]: { name: 'Elixir', hue: 'hue-rotate-240', baseValue: 15 },
};

export const INITIAL_PARCELS: Parcel[] = [
  {
    id: 'p1',
    name: 'Royal Gardens',
    isUnlocked: false,
    costGold: 100,
    costItems: [{ type: ItemType.WOOD, level: 3, count: 1 }],
    description: 'Restore the ancient gardens to their former glory.',
    imageSeed: 101
  },
  {
    id: 'p2',
    name: 'Guard Tower',
    isUnlocked: false,
    costGold: 500,
    costItems: [{ type: ItemType.STONE, level: 4, count: 1 }, { type: ItemType.WOOD, level: 4, count: 1 }],
    description: 'Repair the watchtower to secure the borders.',
    imageSeed: 202
  },
  {
    id: 'p3',
    name: 'Marketplace',
    isUnlocked: false,
    costGold: 1500,
    costItems: [{ type: ItemType.CROP, level: 5, count: 2 }],
    description: 'A bustling hub for trade and commerce.',
    imageSeed: 303
  },
  {
    id: 'p4',
    name: 'Alchemist Lab',
    isUnlocked: false,
    costGold: 3000,
    costItems: [{ type: ItemType.STONE, level: 6, count: 1 }, { type: ItemType.POTION, level: 4, count: 1 }],
    description: 'Discover secrets of the arcane.',
    imageSeed: 404
  },
  {
    id: 'p5',
    name: 'Training Grounds',
    isUnlocked: false,
    costGold: 5000,
    costItems: [{ type: ItemType.STONE, level: 6, count: 2 }, { type: ItemType.WOOD, level: 5, count: 1 }],
    description: 'Train warriors for your kingdom.',
    imageSeed: 505
  },
  {
    id: 'p6',
    name: 'Grand Library',
    isUnlocked: false,
    costGold: 8000,
    costItems: [{ type: ItemType.WOOD, level: 7, count: 2 }, { type: ItemType.POTION, level: 5, count: 1 }],
    description: 'Unlock ancient knowledge and wisdom.',
    imageSeed: 606
  },
  {
    id: 'p7',
    name: 'Dragon Sanctuary',
    isUnlocked: false,
    costGold: 15000,
    costItems: [{ type: ItemType.STONE, level: 8, count: 2 }, { type: ItemType.POTION, level: 7, count: 1 }],
    description: 'Home to the legendary dragons.',
    imageSeed: 707
  },
  {
    id: 'p8',
    name: 'Crystal Palace',
    isUnlocked: false,
    costGold: 25000,
    costItems: [{ type: ItemType.STONE, level: 9, count: 2 }, { type: ItemType.CROP, level: 8, count: 2 }],
    description: 'The crown jewel of your kingdom.',
    imageSeed: 808
  }
];
