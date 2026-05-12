import { Level, GameMode } from '@/types/game';
import { getLevelConfig, getAllLevelIds } from '@/config/gameConfig';

export const createLevelsForMode = (mode: GameMode): Level[] => {
  const levelIds = getAllLevelIds();
  return levelIds.map((levelNum) => {
    const cfg = getLevelConfig(levelNum);
    return {
      id: levelNum,
      name: cfg.name,
      enemyId: cfg.enemy.id,
      words: [],
      averageTime: cfg.averageTime,
      unlocked: levelNum === 1,
      completed: false,
    };
  });
};

export const allLevels: Record<GameMode, Level[]> = {
  english: createLevelsForMode('english'),
  pinyin: createLevelsForMode('pinyin'),
  wubi: createLevelsForMode('wubi'),
};

export const getLevel = (mode: GameMode, levelId: number): Level | undefined => {
  return allLevels[mode]?.find((l) => l.id === levelId);
};

export const getNextLevel = (mode: GameMode, currentLevelId: number): Level | undefined => {
  const levels = allLevels[mode];
  return levels?.find((l) => l.id === currentLevelId + 1);
};
