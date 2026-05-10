import { Level, GameMode } from '@/types/game';
import { getEnemyByLevel } from './enemies';

export const createLevelsForMode = (mode: GameMode): Level[] => {
  const levelNames: Record<number, string> = {
    1: '入门试炼',
    2: '初露锋芒',
    3: '渐入佳境',
    4: '炉火纯青',
    5: '王者之路',
  };

  return Array.from({ length: 5 }, (_, i) => {
    const levelNum = i + 1;
    const enemy = getEnemyByLevel(levelNum);
    return {
      id: levelNum,
      name: levelNames[levelNum],
      enemyId: enemy.id,
      words: [],
      averageTime: 30 + levelNum * 15,
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
