import { Enemy } from '@/types/game';

export const enemies: Enemy[] = [
  {
    id: 'slime',
    name: '森林史莱姆',
    maxHp: 200,
    damage: 6,
    attackInterval: 6,
    description: '栖息在森林深处的绿色凝胶生物，看似弱小实则狡猾',
    emoji: '🟢',
  },
  {
    id: 'bat',
    name: '洞穴蝙蝠',
    maxHp: 350,
    damage: 8,
    attackInterval: 5,
    description: '黑暗洞穴中的群居生物，善于利用超声波定位猎物',
    emoji: '🦇',
  },
  {
    id: 'scorpion',
    name: '沙漠蝎子',
    maxHp: 500,
    damage: 10,
    attackInterval: 4,
    description: '炙热沙漠中的致命猎手，尾部的毒针能造成剧痛',
    emoji: '🦂',
  },
  {
    id: 'werewolf',
    name: '雪山狼人',
    maxHp: 700,
    damage: 12,
    attackInterval: 3.5,
    description: '被诅咒的战士，在月圆之夜会变成凶残的狼人',
    emoji: '🐺',
  },
  {
    id: 'dragon',
    name: '黑暗巨龙',
    maxHp: 1000,
    damage: 15,
    attackInterval: 3,
    description: '守护公主的终极守护者，喷吐的火焰能焚烧一切',
    emoji: '🐉',
  },
];

export const getEnemyById = (id: string): Enemy | undefined => {
  return enemies.find((e) => e.id === id);
};

export const getEnemyByLevel = (level: number): Enemy => {
  const index = Math.min(level - 1, enemies.length - 1);
  return enemies[index];
};
