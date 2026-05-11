export const GAME_CONFIG = {
  BASE_EXP: 100,
  SPEED_BONUS_EXP: 50,
  PERFECT_BONUS_EXP: 100,
  ACCURACY_THRESHOLD: 70,
  COMBO_BONUS_PER: 5,
  COMBO_DAMAGE_BONUS: 2,
  BASE_DAMAGE_MIN: 10,
  BASE_DAMAGE_MAX: 30,
  ENEMY_HEAL_AMOUNT: 2,
  ENEMY_HEAL_INTERVAL: 10000,
};

export const calculateDamage = (baseDamage: number, combo: number): number => {
  const comboBonus = Math.floor(combo / GAME_CONFIG.COMBO_BONUS_PER) * GAME_CONFIG.COMBO_DAMAGE_BONUS;
  const variance = Math.random() * (GAME_CONFIG.BASE_DAMAGE_MAX - GAME_CONFIG.BASE_DAMAGE_MIN);
  return baseDamage + Math.floor(variance) + comboBonus;
};

export const calculateExp = (
  baseExp: number,
  accuracy: number,
  timeUsed: number,
  averageTime: number
): number => {
  let exp = baseExp;
  
  if (accuracy >= GAME_CONFIG.ACCURACY_THRESHOLD) {
    exp += baseExp * ((accuracy - GAME_CONFIG.ACCURACY_THRESHOLD) / 100);
  }
  
  if (timeUsed < averageTime) {
    exp += GAME_CONFIG.SPEED_BONUS_EXP;
  }
  
  if (accuracy === 100) {
    exp += GAME_CONFIG.PERFECT_BONUS_EXP;
  }
  
  return Math.floor(exp);
};

export const calculateWpm = (chars: number, timeMs: number): number => {
  if (timeMs === 0) return 0;
  const minutes = timeMs / 60000;
  return Math.floor((chars / 5) / minutes);
};

export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 100;
  return Math.floor((correct / total) * 100);
};
