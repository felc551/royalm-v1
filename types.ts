export enum ItemType {
  WOOD = 'wood',
  STONE = 'stone',
  CROP = 'crop',
  POTION = 'potion'
}

export interface GameItem {
  id: string; // unique instance id
  type: ItemType;
  level: number;
  isNew?: boolean;
  effectType?: 'spawn' | 'merge';
}

export interface GridSlot {
  index: number;
  item: GameItem | null;
}

export interface Parcel {
  id: string;
  name: string;
  isUnlocked: boolean;
  costGold: number;
  costItems: { type: ItemType; level: number; count: number }[];
  description: string;
  imageSeed: number;
}

export interface PlayerState {
  gold: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  xp: number;
  level: number;
  achievements: string[];
  unlockedAreas: number;
  battlesCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export type GameTab = 'merge' | 'kingdom' | 'adventure';