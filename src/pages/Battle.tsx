import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Zap, Target, Shield, Swords } from 'lucide-react';
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

interface FloatingDamage {
  id: number;
  damage: number;
  x: number;
  y: number;
  type: 'damage' | 'heal';
}

export default function Battle() {
  const navigate = useNavigate();
  const { mode, level } = useParams<{ mode: GameMode; level: string }>();
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isHurt, setIsHurt] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const damageIdRef = useRef(0);

  const { battleState, startBattle, updateBattleState, player, loadData, completeLevel: markComplete, isLoading } = useGameStore();
  const { handleKeyPress, initializeWords, advanceToNextWord } = useTyping(mode!, parseInt(level || '1'));

  const levelNum = parseInt(level || '1');
  const enemy = getEnemyByLevel(levelNum);

  const addFloatingDamage = useCallback((damage: number, type: 'damage' | 'heal', isEnemy: boolean) => {
    const id = damageIdRef.current++;
    const x = isEnemy ? 70 + Math.random() * 20 : 20 + Math.random() * 20;
    const y = 30 + Math.random() * 20;
    
    setFloatingDamages((prev) => [...prev, { id, damage, x, y, type }]);
    
    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 1000);
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

  const { damageEnemy, damagePlayer } = useBattle(levelNum, {
    onEnemyDefeated: handleEnemyDefeated,
    onPlayerDefeated: handlePlayerDefeated,
    onDamageDealt: (damage) => addFloatingDamage(damage, 'damage', true),
    onDamageReceived: (damage) => addFloatingDamage(damage, 'damage', false),
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
      }, 300);
    } else if (!result.isCorrect) {
      setIsHurt(true);
      setTimeout(() => setIsHurt(false), 300);
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
    <div className="min-h-screen flex flex-col" onClick={() => inputRef.current?.focus()}>
      <div className="bg-background-light/50 backdrop-blur-sm p-4 border-b border-surface">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/select/${mode}`)}>
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            退出
          </Button>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-text-muted" />
              <span className="font-mono">{timeElapsed}秒</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-success" />
              <span className="font-mono">{accuracy}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              <span className="font-mono">{battleState.combo}连击</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className={`card text-center transition-transform ${isAttacking ? 'animate-attack' : ''}`}>
              <div className="text-8xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold mb-2">勇敢的战士</h3>
              <div className="mb-2">
                <ProgressBar value={battleState.playerHp} max={battleState.playerMaxHp} showLabel color="success" />
              </div>
              <div className="flex justify-center gap-4 text-sm text-text-muted">
                <span>等级 {player.level}</span>
                <span>攻击 {player.attack}</span>
              </div>
            </div>
            {floatingDamages.filter(d => !d.type || d.type === 'damage').length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {floatingDamages.filter(d => !d.type).map((fd) => (
                  <DamageNumber key={fd.id} damage={fd.damage} x={fd.x} y={fd.y} type={fd.type} />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className={`card text-center transition-transform ${isHurt ? 'animate-hurt' : ''} ${battleState.enemyAttacking ? 'ring-4 ring-enemy animate-pulse' : ''}`}>
              <div className="text-8xl mb-4">{enemy.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{enemy.name}</h3>
              <div className="mb-2">
                <ProgressBar value={battleState.enemyHp} max={battleState.enemyMaxHp} showLabel color="enemy" />
              </div>
              <div className="text-sm text-text-muted">
                {battleState.wordsCompleted}/{battleState.totalWords} 词汇
              </div>
            </div>
            {floatingDamages.filter(d => d.type === 'damage').map((fd) => (
              <DamageNumber key={fd.id} damage={fd.damage} x={fd.x} y={fd.y} type={fd.type} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background-light/80 backdrop-blur-sm p-6 border-t border-surface">
        <div className="max-w-3xl mx-auto">
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
