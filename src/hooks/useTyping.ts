import { useCallback, useEffect } from 'react';
import { useGameStore } from './useGameStore';
import { getWordsByMode } from '@/data/words';
import { GameMode } from '@/types/game';

interface TypingResult {
  isCorrect: boolean;
  damage: number;
  wordComplete: boolean;
  charIndex: number;
}

export const useTyping = (mode: GameMode, level: number) => {
  const { battleState, updateBattleState } = useGameStore();

  const initializeWords = useCallback(() => {
    const words = getWordsByMode(mode, level);
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
    const firstWord = shuffled[0] || '';
    
    updateBattleState({
      currentWordIndex: 0,
      currentWord: firstWord,
      typedText: '',
      totalWords: shuffled.length,
      wordsCompleted: 0,
    });
    
    return shuffled;
  }, [mode, level, updateBattleState]);

  const handleKeyPress = useCallback((key: string): TypingResult => {
    if (!battleState || !battleState.currentWord) {
      return { isCorrect: false, damage: 0, wordComplete: false, charIndex: 0 };
    }

    const { currentWord, typedText, combo, mistakes, totalChars, damageDealt } = battleState;
    const nextCharIndex = typedText.length;
    const expectedChar = currentWord[nextCharIndex];

    if (key === expectedChar) {
      const newTypedText = typedText + key;
      const wordComplete = newTypedText === currentWord;
      
      let comboBonus = 0;
      if (wordComplete) {
        comboBonus = combo + 1;
      }

      const baseDamage = 15 + Math.floor(Math.random() * 15);
      const damage = wordComplete ? Math.floor(baseDamage * (1 + comboBonus * 0.1)) : 0;

      updateBattleState({
        typedText: newTypedText,
        combo: wordComplete ? 0 : comboBonus,
        maxCombo: Math.max(battleState.maxCombo, comboBonus),
        totalChars: totalChars + 1,
        damageDealt: damageDealt + damage,
      });

      return {
        isCorrect: true,
        damage,
        wordComplete,
        charIndex: nextCharIndex,
      };
    } else {
      updateBattleState({
        combo: 0,
        mistakes: mistakes + 1,
      });

      return {
        isCorrect: false,
        damage: 0,
        wordComplete: false,
        charIndex: nextCharIndex,
      };
    }
  }, [battleState, updateBattleState]);

  const advanceToNextWord = useCallback((words: string[]) => {
    if (!battleState) return;

    const nextIndex = battleState.currentWordIndex + 1;
    
    if (nextIndex >= words.length) {
      return 'battle_complete';
    }

    const nextWord = words[nextIndex];
    
    updateBattleState({
      currentWordIndex: nextIndex,
      currentWord: nextWord,
      typedText: '',
      wordsCompleted: battleState.wordsCompleted + 1,
    });

    return 'next_word';
  }, [battleState, updateBattleState]);

  const resetTyping = useCallback(() => {
    updateBattleState({
      typedText: '',
      combo: 0,
      mistakes: 0,
      totalChars: 0,
      damageDealt: 0,
      startTime: Date.now(),
    });
  }, [updateBattleState]);

  return {
    handleKeyPress,
    initializeWords,
    advanceToNextWord,
    resetTyping,
  };
};
