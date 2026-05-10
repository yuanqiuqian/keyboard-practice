import { GameSaveData, Player, GameStats, GameMode } from '@/types/game';

const STORAGE_KEY = 'keyboard-hero-save';

const defaultPlayer: Player = {
  level: 1,
  exp: 0,
  maxHp: 100,
  currentHp: 100,
  attack: 20,
  defense: 0.2,
};

const defaultStats: GameStats = {
  totalPlayTime: 0,
  enemiesDefeated: 0,
  bestWpm: {
    english: 0,
    pinyin: 0,
    wubi: 0,
  },
  bestAccuracy: {
    english: 0,
    pinyin: 0,
    wubi: 0,
  },
};

export const defaultSaveData: GameSaveData = {
  player: defaultPlayer,
  unlockedLevels: {
    english: [1],
    pinyin: [1],
    wubi: [1],
  },
  completedLevels: {
    english: [],
    pinyin: [],
    wubi: [],
  },
  statistics: defaultStats,
};

export const loadGameData = (): GameSaveData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved) as GameSaveData;
      return { ...defaultSaveData, ...data };
    }
  } catch (error) {
    console.warn('Failed to load game data:', error);
  }
  return defaultSaveData;
};

export const saveGameData = (data: GameSaveData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save game data:', error);
  }
};

export const unlockLevel = (mode: GameMode, levelId: number): void => {
  const data = loadGameData();
  if (!data.unlockedLevels[mode].includes(levelId)) {
    data.unlockedLevels[mode].push(levelId);
    saveGameData(data);
  }
};

export const completeLevel = (mode: GameMode, levelId: number): void => {
  const data = loadGameData();
  if (!data.completedLevels[mode].includes(levelId)) {
    data.completedLevels[mode].push(levelId);
    data.statistics.enemiesDefeated += 1;
    
    if (levelId < 5) {
      unlockLevel(mode, levelId + 1);
    }
    
    saveGameData(data);
  }
};

export const addExp = (exp: number): { leveledUp: boolean; newLevel: number } => {
  const data = loadGameData();
  data.player.exp += exp;
  
  let leveledUp = false;
  const expNeeded = 100 * data.player.level;
  
  while (data.player.exp >= expNeeded) {
    data.player.exp -= expNeeded;
    data.player.level += 1;
    data.player.maxHp += 10;
    data.player.currentHp = data.player.maxHp;
    data.player.attack += 5;
    leveledUp = true;
  }
  
  saveGameData(data);
  return { leveledUp, newLevel: data.player.level };
};

export const updateBestStats = (mode: GameMode, wpm: number, accuracy: number): void => {
  const data = loadGameData();
  
  if (wpm > data.statistics.bestWpm[mode]) {
    data.statistics.bestWpm[mode] = wpm;
  }
  if (accuracy > data.statistics.bestAccuracy[mode]) {
    data.statistics.bestAccuracy[mode] = accuracy;
  }
  
  saveGameData(data);
};

export const resetGameData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
