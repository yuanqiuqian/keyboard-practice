import { Enemy } from '@/types/game';
import { getAllLevelIds, getLevelConfig } from '@/config/gameConfig';

export const enemies: Enemy[] = getAllLevelIds().map((level) => getLevelConfig(level).enemy);

export const getEnemyById = (id: string): Enemy | undefined => {
  return enemies.find((e) => e.id === id);
};

export const getEnemyByLevel = (level: number): Enemy => {
  return getLevelConfig(level).enemy;
};
