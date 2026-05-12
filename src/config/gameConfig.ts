import type { GameMode } from '@/types/game';
import raw from './config.json';

export type LevelId = 1 | 2 | 3 | 4 | 5;

export interface ConfigEnemy {
  id: string;
  name: string;
  maxHp: number;
  damage: number;
  attackInterval: number;
  description: string;
  emoji: string;
}

export interface ConfigLevel {
  name: string;
  averageTime: number;
  enemy: ConfigEnemy;
  words: Record<GameMode, string[]>;
}

export interface GameConfigSchema {
  player: {
    base: {
      maxHp: number;
      attack: number;
      defense: number;
    };
  };
  progression: {
    expBasePerLevel: number;
    hpPerLevel: number;
    attackPerLevel: number;
  };
  levels: Record<string, ConfigLevel>;
}

export const GAME_CONFIG_JSON = raw as unknown as GameConfigSchema;

export const getAllLevelIds = (): number[] => {
  return Object.keys(GAME_CONFIG_JSON.levels)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
};

export const getLevelConfig = (level: number): ConfigLevel => {
  const cfg = GAME_CONFIG_JSON.levels[String(level)];
  if (!cfg) {
    // fallback: return level 1
    return GAME_CONFIG_JSON.levels['1'];
  }
  return cfg;
};

export const getWordsByModeFromConfig = (mode: GameMode, level: number): string[] => {
  const cfg = getLevelConfig(level);
  return cfg.words?.[mode] || [];
};

