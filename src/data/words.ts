import { GameMode } from '@/types/game';
import { getAllLevelIds, getWordsByModeFromConfig } from '@/config/gameConfig';

export const englishWords: Record<number, string[]> = Object.fromEntries(
  getAllLevelIds().map((level) => [level, getWordsByModeFromConfig('english', level)])
);

export const pinyinWords: Record<number, string[]> = Object.fromEntries(
  getAllLevelIds().map((level) => [level, getWordsByModeFromConfig('pinyin', level)])
);

export const wubiWords: Record<number, string[]> = Object.fromEntries(
  getAllLevelIds().map((level) => [level, getWordsByModeFromConfig('wubi', level)])
);

export const getWordsByMode = (mode: GameMode, level: number): string[] => {
  return getWordsByModeFromConfig(mode, level);
};

export const getModeName = (mode: GameMode): string => {
  switch (mode) {
    case 'english':
      return '英文模式';
    case 'pinyin':
      return '拼音模式';
    case 'wubi':
      return '五笔模式';
    default:
      return '';
  }
};

export const getModeDescription = (mode: GameMode): string => {
  switch (mode) {
    case 'english':
      return '练习英文单词和短句的拼写';
    case 'pinyin':
      return '练习汉字拼音输入';
    case 'wubi':
      return '练习五笔字型和词组编码';
    default:
      return '';
  }
};
