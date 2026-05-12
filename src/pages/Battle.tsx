import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { useTyping } from '@/hooks/useTyping';
import { useBattle } from '@/hooks/useBattle';
import { getEnemyByLevel } from '@/data/enemies';
import { getWordsByMode } from '@/data/words';
import { GameMode, BattleResult } from '@/types/game';
import { calculateWpm, calculateAccuracy, calculateExp } from '@/utils/gameConfig';
import { completeLevel, addExp, updateBestStats } from '@/utils/storage';
import Button from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';
import DamageNumber from '@/components/common/DamageNumber';
import FighterSprite from '@/components/common/FighterSprite';
import { GAME_CONFIG_JSON } from '@/config/gameConfig';
import { getSpriteSet } from '@/config/sprites';

interface FloatingDamage {
  id: number;
  damage: number;
  x: number | string;
  y: number | string;
  type: 'damage' | 'heal';
  target: 'player' | 'enemy';
}

export default function Battle() {
  const navigate = useNavigate();
  const { mode, level } = useParams<{ mode: GameMode; level: string }>();
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isPlayerHurt, setIsPlayerHurt] = useState(false);
  const [isEnemyHurt, setIsEnemyHurt] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [attackEffects, setAttackEffects] = useState<{ id: number; type: 'magic' | 'slash' | 'impact'; source: 'player' | 'enemy' }[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: 'warning' | 'enemy' }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const damageIdRef = useRef(0);
  const effectIdRef = useRef(0);

  const { battleState, startBattle, updateBattleState, player, loadData, completeLevel: markComplete, isLoading } = useGameStore();
  const { handleKeyPress, initializeWords, advanceToNextWord } = useTyping(mode!, parseInt(level || '1'));

  const levelNum = parseInt(level || '1');
  const enemy = getEnemyByLevel(levelNum);
  const playerSprite = getSpriteSet(GAME_CONFIG_JSON.player.spriteKey);
  const enemySprite = getSpriteSet((enemy as { spriteKey?: string }).spriteKey);

  const addFloatingDamage = useCallback((damage: number, type: 'damage' | 'heal', target: 'player' | 'enemy') => {
    const id = damageIdRef.current++;
    const xBase = target === 'enemy' ? 68 : 22;
    const x = `${xBase + Math.random() * 8}%`;
    const y = `${40 + Math.random() * 10}%`;
    
    setFloatingDamages((prev) => [...prev, { id, damage, x, y, type, target }]);
    
    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 1000);
  }, []);

  const triggerAttackEffect = useCallback((source: 'player' | 'enemy', isCritical: boolean) => {
    const effectId = effectIdRef.current++;
    const effectType: 'magic' | 'slash' | 'impact' = isCritical
      ? 'impact'
      : Math.random() > 0.7
        ? 'magic'
        : 'slash';
    
    setAttackEffects((prev) => [...prev, { id: effectId, type: effectType, source }]);
    
    setTimeout(() => {
      setAttackEffects((prev) => prev.filter((e) => e.id !== effectId));
    }, 550);
  }, []);

  const spawnParticles = useCallback((count: number, target: 'player' | 'enemy', isCritical: boolean) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const particleId = effectIdRef.current++;
      const xBase = target === 'enemy' ? 66 : 20;
      const x = xBase + Math.random() * 12;
      const y = 45 + Math.random() * 12;
      newParticles.push({ id: particleId, x, y, color: isCritical ? 'warning' : 'enemy' });
    }
    
    setParticles((prev) => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 800);
  }, []);

  const handleEnemyDefeated = useCallback(() => {
    if (!battleState) return;
    
    const timeUsed = (Date.now() - battleState.startTime) / 1000;
    const correctChars = battleState.totalChars - battleState.mistakes;
    const accuracy = calculateAccuracy(correctChars, battleState.totalChars);
    const wpm = calculateWpm(battleState.totalChars, Date.now() - battleState.startTime);
    
    const expGained = calculateExp(100, accuracy, timeUsed, enemy.maxHp / 10);
    const { leveledUp, newLevel } = addExp(expGained);
    
    updateBestStats(mode!, wpm, accuracy);
    markComplete(mode!, levelNum);
    
    setBattleResult({
      victory: true,
      accuracy,
      wpm,
      timeUsed,
      damageDealt: battleState.damageDealt,
      maxCombo: battleState.maxCombo,
      expGained,
      levelUp: leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    });
    setShowResult(true);
  }, [battleState, enemy, mode, levelNum, markComplete]);

  const handlePlayerDefeated = useCallback(() => {
    if (!battleState) return;
    
    const timeUsed = (Date.now() - battleState.startTime) / 1000;
    const correctChars = battleState.totalChars - battleState.mistakes;
    const accuracy = calculateAccuracy(correctChars, battleState.totalChars);
    const wpm = calculateWpm(battleState.totalChars, Date.now() - battleState.startTime);
    
    setBattleResult({
      victory: false,
      accuracy,
      wpm,
      timeUsed,
      damageDealt: battleState.damageDealt,
      maxCombo: battleState.maxCombo,
      expGained: 0,
      levelUp: false,
    });
    setShowResult(true);
  }, [battleState]);

  const { damageEnemy } = useBattle(levelNum, {
    onEnemyDefeated: handleEnemyDefeated,
    onPlayerDefeated: handlePlayerDefeated,
    onDamageDealt: (damage) => {
      addFloatingDamage(damage, 'damage', 'enemy');
      setIsEnemyHurt(true);
      triggerAttackEffect('player', damage > 15);
      spawnParticles(damage > 15 ? 14 : 10, 'enemy', damage > 15);
      setTimeout(() => setIsEnemyHurt(false), 250);
    },
    onDamageReceived: (damage) => {
      addFloatingDamage(damage, 'damage', 'player');
      setIsPlayerHurt(true);
      triggerAttackEffect('enemy', false);
      spawnParticles(10, 'player', false);
      setTimeout(() => setIsPlayerHurt(false), 250);
    },
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (mode && level && !isLoading) {
      const wordsNeeded = Math.min(getWordsByMode(mode, parseInt(level)).length, 25 + parseInt(level) * 5);
      const words = [...getWordsByMode(mode, parseInt(level))].sort(() => Math.random() - 0.5).slice(0, wordsNeeded);
      setGameWords(words);
      startBattle(enemy.maxHp);
    }
  }, [mode, level, enemy, isLoading, startBattle]);

  useEffect(() => {
    if (battleState && gameWords.length > 0 && !battleState.currentWord) {
      const firstWord = gameWords[0];
      updateBattleState({
        currentWord: firstWord,
        currentWordIndex: 0,
        totalWords: gameWords.length,
        typedText: '',
      });
    }
  }, [battleState, gameWords, updateBattleState]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [battleState?.currentWord]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showResult || !battleState || !battleState.currentWord) return;

    const key = e.key;
    if (key.length !== 1) return;

    e.preventDefault();

    const result = handleKeyPress(key);

    if (result.isCorrect && result.wordComplete) {
      setIsAttacking(true);
      damageEnemy(result.damage);
      
      setTimeout(() => {
        setIsAttacking(false);
        const nextResult = advanceToNextWord(gameWords);
        if (nextResult === 'battle_complete') {
          handleEnemyDefeated();
        }
      }, 240);
    }
  }, [battleState, handleKeyPress, damageEnemy, advanceToNextWord, gameWords, showResult, handleEnemyDefeated]);

  if (!mode || !level) {
    navigate('/');
    return null;
  }

  if (isLoading || !battleState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-pixel text-primary animate-pulse">加载中...</div>
      </div>
    );
  }

  if (showResult && battleResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="card max-w-md w-full text-center animate-bounce-in">
          <div className={`text-6xl mb-4 ${battleResult.victory ? 'text-success' : 'text-enemy'}`}>
            {battleResult.victory ? '🏆' : '💀'}
          </div>
          <h2 className={`font-pixel text-3xl mb-6 ${battleResult.victory ? 'text-success' : 'text-enemy'}`}>
            {battleResult.victory ? '胜利!' : '失败'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-surface/50 rounded-lg p-3">
              <div className="text-text-muted text-sm">准确率</div>
              <div className="text-2xl font-bold text-primary">{battleResult.accuracy}%</div>
            </div>
            <div className="bg-surface/50 rounded-lg p-3">
              <div className="text-text-muted text-sm">速度</div>
              <div className="text-2xl font-bold text-warning">{battleResult.wpm} WPM</div>
            </div>
            <div className="bg-surface/50 rounded-lg p-3">
              <div className="text-text-muted text-sm">用时</div>
              <div className="text-2xl font-bold">{battleResult.timeUsed.toFixed(1)}秒</div>
            </div>
            <div className="bg-surface/50 rounded-lg p-3">
              <div className="text-text-muted text-sm">最大连击</div>
              <div className="text-2xl font-bold text-success">{battleResult.maxCombo}</div>
            </div>
          </div>

          {battleResult.victory && (
            <div className="mb-6 p-4 bg-success/20 rounded-lg">
              <div className="text-success font-bold mb-2">获得经验值: +{battleResult.expGained}</div>
              {battleResult.levelUp && (
                <div className="text-warning font-pixel animate-pulse">
                  升级了！现在是 {battleResult.newLevel} 级！
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/')}>
              返回主页
            </Button>
            <Button className="flex-1" onClick={() => window.location.reload()}>
              再战一局
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const timeElapsed = battleState ? Math.floor((Date.now() - battleState.startTime) / 1000) : 0;
  const accuracy = battleState && battleState.totalChars > 0
    ? calculateAccuracy(battleState.totalChars - battleState.mistakes, battleState.totalChars)
    : 100;

  return (
    <div className="min-h-screen flex flex-col fight-shell" onClick={() => inputRef.current?.focus()}>
      <div className={clsx('fight-stage', `stage-${levelNum}`)}>
        <div className="fight-hud">
          <div className="fight-hud-top">
            <Button variant="secondary" size="sm" onClick={() => navigate(`/select/${mode}`)}>
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              退出
            </Button>
            <div className="fight-hud-center">
              <div className="fight-hud-timer font-pixel">{timeElapsed}</div>
              <div className="fight-hud-sub">
                <span className="font-mono text-success">{accuracy}%</span>
                <span className="font-mono text-warning">{battleState.combo}连击</span>
              </div>
            </div>
            <div className="fight-hud-right-spacer" />
          </div>

          <div className="fight-hud-bars">
            <div className="fight-hud-bar fight-hud-bar-left">
              <div className="fight-hud-name">
                勇敢的战士 <span className="text-text-muted">Lv.{player.level}</span>
              </div>
              <ProgressBar value={battleState.playerHp} max={battleState.playerMaxHp} color="success" variant="fightHud" />
            </div>
            <div className="fight-hud-bar fight-hud-bar-right">
              <div className="fight-hud-name text-right">{enemy.name}</div>
              <ProgressBar value={battleState.enemyHp} max={battleState.enemyMaxHp} color="enemy" variant="fightHud" />
            </div>
          </div>
        </div>

        <div className="fight-arena">
          <div
            className={clsx(
              'fighter fighter-player',
              isAttacking ? 'fighter-player-attack' : 'fighter-idle',
              isPlayerHurt ? 'fighter-hurt' : ''
            )}
          >
            <div className="fighter-sprite drop-shadow-lg">
              <FighterSprite frames={isAttacking ? playerSprite.attack : playerSprite.idle} fps={playerSprite.fps} />
            </div>
            <div className="fighter-shadow" />
          </div>

          <div
            className={clsx(
              'fighter fighter-enemy',
              battleState.enemyAttacking ? 'fighter-enemy-attack' : 'fighter-idle',
              isEnemyHurt ? 'fighter-hurt' : ''
            )}
          >
            <div className="fighter-sprite drop-shadow-lg">
              <FighterSprite
                frames={battleState.enemyAttacking ? enemySprite.attack : enemySprite.idle}
                fps={enemySprite.fps}
              />
            </div>
            <div className="fighter-shadow" />
          </div>

          <div className="fight-overlay pointer-events-none">
            {attackEffects.map((effect) => (
              <div
                key={effect.id}
                className={clsx('fight-effect', `fight-effect-${effect.source}`, `fight-effect-${effect.type}`)}
              >
                <div className="fight-effect-emoji">
                  {effect.type === 'magic' ? '✨' : effect.type === 'slash' ? '💥' : '⚡'}
                </div>
              </div>
            ))}

            {particles.map((particle) => (
              <div
                key={particle.id}
                className={clsx(
                  'particle absolute w-2 h-2 rounded-full',
                  particle.color === 'warning' ? 'bg-warning' : 'bg-enemy'
                )}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  '--tx': `${(Math.random() - 0.5) * 120}px`,
                  '--ty': `${(Math.random() - 0.5) * 120}px`,
                } as React.CSSProperties}
              />
            ))}

            {floatingDamages.map((fd) => (
              <DamageNumber key={fd.id} damage={fd.damage} x={fd.x} y={fd.y} type={fd.type} />
            ))}
          </div>
        </div>

        <div className="fight-progress">
          <span className="font-mono text-text-muted">
            {battleState.wordsCompleted}/{battleState.totalWords} 词汇
          </span>
        </div>
      </div>

      <div className="fight-input bg-background-light/80 backdrop-blur-sm border-t border-surface">
        <div className="max-w-3xl mx-auto p-6">
          <div className="text-center mb-4">
            <span className="text-text-muted text-sm">输入下面的文字来攻击敌人</span>
          </div>

          <div className="bg-surface/50 rounded-xl p-6 mb-4 min-h-[80px] flex items-center justify-center">
            {battleState.currentWord && (
              <div className="font-mono text-3xl tracking-wide">
                {battleState.currentWord.split('').map((char, index) => {
                  let className = 'typing-char ';
                  if (index < battleState.typedText.length) {
                    className += battleState.typedText[index] === char ? 'correct' : 'incorrect';
                  } else if (index === battleState.typedText.length) {
                    className += 'current';
                  } else {
                    className += 'pending';
                  }
                  return (
                    <span key={index} className={className}>
                      {char}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-center text-2xl font-mono text-text"
            value={battleState.typedText}
            onChange={() => {}}
            onKeyDown={onKeyDown}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
