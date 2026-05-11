import { create } from 'zustand';
import { GameMode, Player, GameSaveData, BattleState } from '@/types/game';
import { loadGameData, saveGameData, defaultSaveData } from '@/utils/storage';

interface GameStore {
  player: Player;
  unlockedLevels: Record<GameMode, number[]>;
  completedLevels: Record<GameMode, number[]>;
  currentMode: GameMode | null;
  currentLevel: number | null;
  battleState: BattleState | null;
  isLoading: boolean;

  setCurrentMode: (mode: GameMode | null) => void;
  setCurrentLevel: (level: number | null) => void;
  
  startBattle: (enemyMaxHp: number) => void;
  updateBattleState: (updates: Partial<BattleState>) => void;
  endBattle: () => void;
  
  unlockLevel: (mode: GameMode, levelId: number) => void;
  completeLevel: (mode: GameMode, levelId: number) => void;
  
  loadData: () => void;
  saveData: () => void;
  resetData: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: defaultSaveData.player,
  unlockedLevels: defaultSaveData.unlockedLevels,
  completedLevels: defaultSaveData.completedLevels,
  currentMode: null,
  currentLevel: null,
  battleState: null,
  isLoading: true,

  setCurrentMode: (mode) => set({ currentMode: mode }),
  
  setCurrentLevel: (level) => set({ currentLevel: level }),

  startBattle: (enemyMaxHp) => {
    const player = get().player;
    set({
      battleState: {
        playerHp: player.currentHp,
        playerMaxHp: player.maxHp,
        enemyHp: enemyMaxHp,
        enemyMaxHp: enemyMaxHp,
        currentWordIndex: 0,
        currentWord: '',
        typedText: '',
        startTime: Date.now(),
        mistakes: 0,
        totalChars: 0,
        combo: 0,
        maxCombo: 0,
        enemyAttacking: false,
        isPlayerTurn: true,
        wordsCompleted: 0,
        totalWords: 0,
        damageDealt: 0,
      },
    });
  },

  updateBattleState: (updates) => {
    const currentState = get().battleState;
    if (currentState) {
      set({ battleState: { ...currentState, ...updates } });
    }
  },

  endBattle: () => {
    set({ battleState: null, currentMode: null, currentLevel: null });
  },

  unlockLevel: (mode, levelId) => {
    const unlocked = get().unlockedLevels;
    if (!unlocked[mode].includes(levelId)) {
      const newUnlocked = {
        ...unlocked,
        [mode]: [...unlocked[mode], levelId],
      };
      set({ unlockedLevels: newUnlocked });
      const data: GameSaveData = {
        player: get().player,
        unlockedLevels: newUnlocked,
        completedLevels: get().completedLevels,
        statistics: defaultSaveData.statistics,
      };
      saveGameData(data);
    }
  },

  completeLevel: (mode, levelId) => {
    const completed = get().completedLevels;
    if (!completed[mode].includes(levelId)) {
      const newCompleted = {
        ...completed,
        [mode]: [...completed[mode], levelId],
      };
      set({ completedLevels: newCompleted });
      
      if (levelId < 5) {
        get().unlockLevel(mode, levelId + 1);
      }
    }
  },

  loadData: () => {
    const data = loadGameData();
    set({
      player: data.player,
      unlockedLevels: data.unlockedLevels,
      completedLevels: data.completedLevels,
      isLoading: false,
    });
  },

  saveData: () => {
    const { player, unlockedLevels, completedLevels } = get();
    const data: GameSaveData = {
      player,
      unlockedLevels,
      completedLevels,
      statistics: defaultSaveData.statistics,
    };
    saveGameData(data);
  },

  resetData: () => {
    set({
      player: defaultSaveData.player,
      unlockedLevels: defaultSaveData.unlockedLevels,
      completedLevels: defaultSaveData.completedLevels,
    });
    saveGameData(defaultSaveData);
  },
}));
