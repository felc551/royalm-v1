
import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_merge',
    title: 'First Steps',
    description: 'Complete your first merge',
    icon: '✨',
    unlocked: false
  },
  {
    id: 'level_5',
    title: 'Rising Ruler',
    description: 'Reach level 5',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'level_10',
    title: 'Legendary Leader',
    description: 'Reach level 10',
    icon: '⭐',
    unlocked: false
  },
  {
    id: 'first_area',
    title: 'Kingdom Builder',
    description: 'Restore your first area',
    icon: '🏰',
    unlocked: false
  },
  {
    id: 'all_areas',
    title: 'Master Architect',
    description: 'Restore all kingdom areas',
    icon: '🏛️',
    unlocked: false
  },
  {
    id: 'max_item',
    title: 'Master Crafter',
    description: 'Create a max level item',
    icon: '💎',
    unlocked: false
  },
  {
    id: 'rich',
    title: 'Wealthy Monarch',
    description: 'Accumulate 10,000 gold',
    icon: '💰',
    unlocked: false
  },
  {
    id: 'battle_master',
    title: 'Battle Champion',
    description: 'Complete 10 battle missions',
    icon: '⚔️',
    unlocked: false
  },
  {
    id: 'dragon_tamer',
    title: 'Dragon Tamer',
    description: 'Unlock the Dragon Sanctuary',
    icon: '🐉',
    unlocked: false
  },
  {
    id: 'grand_master',
    title: 'Grand Master',
    description: 'Reach level 20',
    icon: '🌟',
    unlocked: false
  }
];

export const checkAchievement = (id: string, condition: boolean): boolean => {
  return condition;
};
