import { GameMode } from '@/types/game';

export const englishWords: Record<number, string[]> = {
  1: [
    'cat', 'dog', 'sun', 'run', 'big', 'red', 'hot', 'map', 'cup', 'pen',
    'box', 'bed', 'car', 'bus', 'hat', 'fan', 'egg', 'ice', 'jam', 'key',
    'leg', 'arm', 'eye', 'ear', 'lip', 'toe', 'bat', 'rat', 'ant', 'bee',
    'fish', 'bird', 'tree', 'book', 'door', 'rain', 'wind', 'snow', 'fire',
    'stone', 'road', 'hill', 'lake', 'boat', 'star', 'moon', 'sky', 'hand',
    'foot', 'nose', 'face', 'neck', 'back', 'head', 'hair', 'teeth', 'tongue',
  ],
  2: [
    'apple', 'water', 'happy', 'green', 'house', 'mouse', 'bread', 'chair',
    'table', 'plant', 'cloud', 'storm', 'world', 'ocean', 'music', 'dance',
    'smile', 'laugh', 'candy', 'pizza', 'night', 'dream', 'light', 'magic',
    'power', 'crown', 'sword', 'brave', 'hero', 'quest', 'level', 'heart',
    'brain', 'river', 'flower', 'garden', 'kitchen', 'bedroom', 'bathroom',
    'school', 'teacher', 'student', 'friend', 'family', 'party', 'holiday',
    'vacation', 'weather', 'picture', 'camera', 'computer', 'keyboard', 'mouse',
  ],
  3: [
    'I am happy', 'The sun is bright', 'She runs fast', 'The cat is cute',
    'He is tall', 'We are friends', 'It is cold', 'The sky is blue',
    'The bird sings', 'I like music', 'The dog barks', 'She smiles wide',
    'He is brave', 'We play games', 'It is dark', 'The fire burns',
    'I see stars', 'She reads books', 'The rain falls', 'We dance well',
    'You are kind', 'They are funny', 'He works hard', 'She loves books',
    'The tree grows', 'The water flows', 'The wind blows', 'The bird flies',
    'We eat lunch', 'They drink tea', 'I write notes', 'You draw pictures',
    'The baby cries', 'The dog wags', 'The cat purrs', 'The bird chirps',
  ],
  4: [
    'The sky is blue today', 'The bird sings sweetly', 'She walks in the park',
    'He reads an old book', 'We play games at night', 'The moon is bright',
    'The wind blows gently', 'She dances gracefully', 'The fire crackles',
    'The clock ticks slowly', 'He climbs the mountain', 'We travel together',
    'The stars shine bright', 'She writes beautiful poetry', 'The river flows',
    'He catches the ball', 'We learn new things', 'The leaves fall down',
    'The sun rises slowly', 'The rain falls softly', 'The snow covers ground',
    'The flowers bloom beautifully', 'The birds build nests', 'The bees collect honey',
    'The children play happily', 'The adults work hard', 'The students study carefully',
    'The teacher explains clearly', 'The music sounds lovely', 'The food tastes delicious',
    'The movie is interesting', 'The book is exciting', 'The game is fun',
  ],
  5: [
    'Today is a beautiful day for an adventure', 'The princess waits in the highest tower',
    'Brave heroes never give up hope', 'The dragon guards the ancient treasure',
    'Magic spells can change the world', 'Every journey begins with one step',
    'The kingdom needs a true hero now', 'Courage and wisdom guide the way',
    'The forest holds many secrets deep', 'Stars light the path through darkness',
    'A true warrior protects the innocent', 'The legend of the hero lives forever',
    'Victory comes to those who persevere', 'Friendship is the greatest treasure',
    'The mountain peak touches the clouds', 'Dreams become real with hard work',
    'Learning to type well takes practice', 'Every character counts in a battle',
    'Focus and accuracy will lead to victory', 'The keyboard is your greatest weapon',
    'With determination you can achieve anything', 'Practice makes perfect in typing',
    'The hero must face many challenges', 'Each enemy defeated brings you closer',
    'The princess believes in your success', 'Your skills will grow with each battle',
    'Never lose hope even when facing dragons', 'The final battle awaits your arrival',
  ],
};

export const pinyinWords: Record<number, string[]> = {
  1: [
    'wo', 'ni', 'ta', 'men', 'de', 'shi', 'zhi', 'zhu', 'you', 'yi',
    'shu', 'xue', 'hua', 'chi', 'he', 'zuo', 'kan', 'ting', 'shuo', 'xiao',
    'ma', 'ba', 'na', 'la', 'ga', 'ka', 'da', 'ta', 'za', 'ca',
  ],
  2: [
    'zhongguo', 'beijing', 'shanghai', 'tianqi', 'xuexi', 'gongzuo',
    'shenghuo', 'tongzhi', 'pengyou', 'jiating', 'xuexiao', 'yiyuan',
    'biancheng', 'wangzhan', 'xinwen', 'tupian', 'yinpin', 'shipin',
    'youjian', 'lianxi', 'jihua', 'mubiao', 'fangfa', 'guize',
  ],
  3: [
    'laoshi hao', 'xiexie ni', 'zaijian', 'hen gaoxing', 'bu ke qi',
    'ni hao ma', 'wo hen hao', 'zhidao le', 'bu yong le', 'mei guanxi',
    'qing wen yi', 'zhen de ma', 'zenme ban', 'jintian tianqi hao',
    'mingtian jian', 'zuotian wo qu', 'xianzai ji dian', 'ji ge ren',
  ],
  4: [
    'fengguo san dai', 'shuiguo da pomgran', 'zhongguo heping tongyi',
    'tianyan yi wu', 'xueer bugen', 'qianfu houji', 'shuiguo lenguang',
    'baibei dacheng', 'yibai bu nao', 'wan quan yizhi', 'kuai le de shiguang',
    'changcheng youliang', 'gongzuo shenghuo', 'kaixin meiyitian',
  ],
  5: [
    'weilai de shijie xu yao women gongtong chuangzao',
    'zhonghua minzu shi weida de minzu',
    'renmin qunzhong shi lishi de chuangzaozhe',
    'keji shi di yi shengchanli',
    'zhishi shi zuiyoujia de caifu',
    'ai xin shi renlei zui meili de yuyan',
    'pingyu he jiyun shi shehui de jichu',
    'wenhua chengdu shi minzu jingshen de biaozhi',
    'zhongguo meng shi shijie meng de zhuyao zucheng bufen',
  ],
};

export const wubiWords: Record<number, string[]> = {
  1: [
    'gcfg', 'agh', 'dngk', 'tyi', 'ufh', 'qhgf', 'yngb', 'tfn', 'wgkf', 'wyon',
    'fshk', 'dhdf', 'wsy', 'dmjk', 'ghng', 'kfay', 'qaj', 'dqyy', 'wyy', 'rtfg',
  ],
  2: [
    'gkgl', 'lpsu', 'khfl', 'rtqt', 'wsje', 'wfiy', 'wpqn', 'wycn', 'udqn',
    'ipfq', 'isrh', 'wtpy', 'wycu', 'wfuf', 'wbtg', 'wgjq', 'wntr', 'wxxn',
    'wtdj', 'wltu',
  ],
  3: [
    'vygg', 'vypl', 'vyon', 'tfhw', 'tfln', 'tffc', 'tfuk', 'tftb', 'tfnd',
    'tfwf', 'tfad', 'tfag', 'tftj', 'tfuj', 'tfwn', 'tftx', 'tfge', 'tfwy',
    'tfpg', 'tfkf',
  ],
  4: [
    'yqyg', 'yqtk', 'yqgo', 'yqgi', 'yqdw', 'yqtd', 'yqrm', 'yqds', 'yqbc',
    'yquk', 'yqdy', 'yqde', 'yqeh', 'yqeu', 'yqet', 'yqdt', 'yqit', 'yqid',
  ],
  5: [
    'gklp', 'glrp', 'gkdp', 'gkfr', 'gkit', 'gkpy', 'gkwn', 'gkwf', 'gkuq',
    'gkdd', 'gkdf', 'gkdr', 'gkdy', 'gket', 'gkef', 'gkej', 'gkel', 'gker',
  ],
};

export const getWordsByMode = (mode: GameMode, level: number): string[] => {
  switch (mode) {
    case 'english':
      return englishWords[level] || [];
    case 'pinyin':
      return pinyinWords[level] || [];
    case 'wubi':
      return wubiWords[level] || [];
    default:
      return [];
  }
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
