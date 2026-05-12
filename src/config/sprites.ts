export type SpriteKey =
  | 'maleAdventurer'
  | 'femaleAdventurer'
  | 'malePerson'
  | 'femalePerson'
  | 'zombie'
  | 'robot';

export interface SpriteSet {
  idle: string[];
  attack: string[];
  fps: number;
}

const base = '/assets/characters/arcade';

const walkFrames = (folder: string, prefix: string) => {
  return Array.from({ length: 8 }, (_, i) => `${base}/${folder}/${prefix}_walk${i}.png`);
};

const spriteSet = (folder: string, prefix: string): SpriteSet => {
  return {
    idle: [`${base}/${folder}/${prefix}_idle.png`],
    attack: walkFrames(folder, prefix),
    fps: 14,
  };
};

export const SPRITES: Record<SpriteKey, SpriteSet> = {
  maleAdventurer: spriteSet('male_adventurer', 'maleAdventurer'),
  femaleAdventurer: spriteSet('female_adventurer', 'femaleAdventurer'),
  malePerson: spriteSet('male_person', 'malePerson'),
  femalePerson: spriteSet('female_person', 'femalePerson'),
  zombie: spriteSet('zombie', 'zombie'),
  robot: spriteSet('robot', 'robot'),
};

export const getSpriteSet = (key?: string): SpriteSet => {
  const k = key as SpriteKey | undefined;
  return (k && SPRITES[k]) || SPRITES.maleAdventurer;
};

