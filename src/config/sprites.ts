export type SpriteKey =
  | 'maleAdventurer'
  | 'femaleAdventurer'
  | 'malePerson'
  | 'femalePerson'
  | 'zombie'
  | 'robot'
  | 'slime'
  | 'bat'
  | 'scorpion'
  | 'werewolf'
  | 'dragon';

export interface SpriteSheet {
  url: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  frameCount: number;
  startIndex?: number;
}

export interface SpriteAnim {
  frames?: string[];
  sheet?: SpriteSheet;
}

export interface SpriteSet {
  idle: SpriteAnim;
  attack: SpriteAnim;
  fps: number;
}

const base = '/assets/characters/arcade';
const monsterBase = '/assets/characters/monsters';

const walkFrames = (folder: string, prefix: string) => {
  return Array.from({ length: 8 }, (_, i) => `${base}/${folder}/${prefix}_walk${i}.png`);
};

const spriteSet = (folder: string, prefix: string): SpriteSet => {
  return {
    idle: { frames: [`${base}/${folder}/${prefix}_idle.png`] },
    attack: { frames: walkFrames(folder, prefix) },
    fps: 14,
  };
};

const sheetAnim = (
  url: string,
  frameWidth: number,
  frameHeight: number,
  columns: number,
  frameCount: number,
  startIndex?: number
): SpriteAnim => {
  return { sheet: { url, frameWidth, frameHeight, columns, frameCount, startIndex } };
};

export const SPRITES: Record<SpriteKey, SpriteSet> = {
  maleAdventurer: spriteSet('male_adventurer', 'maleAdventurer'),
  femaleAdventurer: spriteSet('female_adventurer', 'femaleAdventurer'),
  malePerson: spriteSet('male_person', 'malePerson'),
  femalePerson: spriteSet('female_person', 'femalePerson'),
  zombie: spriteSet('zombie', 'zombie'),
  robot: spriteSet('robot', 'robot'),
  slime: {
    idle: sheetAnim(`${monsterBase}/slime/slime_sheet.png`, 37, 37, 6, 6, 0),
    attack: sheetAnim(`${monsterBase}/slime/slime_sheet.png`, 37, 37, 6, 6, 0),
    fps: 10,
  },
  bat: {
    idle: sheetAnim(`${monsterBase}/bat/bat_sheet.png`, 24, 24, 9, 9, 0),
    attack: sheetAnim(`${monsterBase}/bat/bat_sheet.png`, 24, 24, 9, 9, 0),
    fps: 14,
  },
  scorpion: {
    idle: sheetAnim(`${monsterBase}/scorpion/scorpion_sheet.png`, 1024, 1024, 4, 4, 0),
    attack: sheetAnim(`${monsterBase}/scorpion/scorpion_sheet.png`, 1024, 1024, 4, 4, 4),
    fps: 8,
  },
  werewolf: {
    idle: sheetAnim(`${monsterBase}/werewolf/werewolf_walk.png`, 32, 32, 3, 12, 0),
    attack: sheetAnim(`${monsterBase}/werewolf/werewolf_walk.png`, 32, 32, 3, 12, 0),
    fps: 12,
  },
  dragon: {
    idle: {
      frames: [
        `${monsterBase}/dragon/dragon1/idle/dragon1_idle_000.png`,
        `${monsterBase}/dragon/dragon1/idle/dragon1_idle_001.png`,
        `${monsterBase}/dragon/dragon1/idle/dragon1_idle_002.png`,
      ],
    },
    attack: {
      frames: [
        `${monsterBase}/dragon/dragon1/attack/dragon1_attack_000.png`,
        `${monsterBase}/dragon/dragon1/attack/dragon1_attack_001.png`,
        `${monsterBase}/dragon/dragon1/attack/dragon1_attack_002.png`,
      ],
    },
    fps: 10,
  },
};

export const getSpriteSet = (key?: string): SpriteSet => {
  const k = key as SpriteKey | undefined;
  return (k && SPRITES[k]) || SPRITES.maleAdventurer;
};
