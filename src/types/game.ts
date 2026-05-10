export type GameMode = 'english' | 'pinyin' | 'wubi';

export interface Player {
  level: number;
  exp: number;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  damage: number;
  attackInterval: number;
  description: string;
  emoji: string;
}

export interface Level {
  id: number;
  name: string;
  enemyId: string;
  words: string[];
  averageTime: number;
  unlocked: boolean;
  completed: boolean;
  bestAccuracy?: number;
  bestTime?: number;
}

export interface BattleState {
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  currentWordIndex: number;
  currentWord: string;
  typedText: string;
  startTime: number;
  mistakes: number;
  totalChars: number;
  combo: number;
  maxCombo: number;
  enemyAttacking: boolean;
  isPlayerTurn: boolean;
  wordsCompleted: number;
  totalWords: number;
  damageDealt: number;
}

export interface GameStats {
  totalPlayTime: number;
  enemiesDefeated: number;
  bestWpm: Record<GameMode, number>;
  bestAccuracy: Record<GameMode, number>;
}

export interface GameSaveData {
  player: Player;
  unlockedLevels: Record<GameMode, number[]>;
  completedLevels: Record<GameMode, number[]>;
  statistics: GameStats;
}

export interface BattleResult {
  victory: boolean;
  accuracy: number;
  wpm: number;
  timeUsed: number;
  damageDealt: number;
  maxCombo: number;
  expGained: number;
  levelUp: boolean;
  newLevel?: number;
}
