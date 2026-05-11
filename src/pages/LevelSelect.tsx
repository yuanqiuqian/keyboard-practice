import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, Star, Sword, Skull } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { getEnemyByLevel } from '@/data/enemies';
import { getModeName } from '@/data/words';
import { GameMode } from '@/types/game';
import Button from '@/components/common/Button';

export default function LevelSelect() {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: GameMode }>();
  const { unlockedLevels, completedLevels, loadData, isLoading } = useGameStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!mode) {
    navigate('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-pixel text-primary animate-pulse">加载中...</div>
      </div>
    );
  }

  const unlocked = unlockedLevels[mode] || [];
  const completed = completedLevels[mode] || [];

  const handleSelectLevel = (levelId: number) => {
    if (unlocked.includes(levelId)) {
      navigate(`/battle/${mode}/${levelId}`);
    }
  };

  const levels = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="secondary" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            返回
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-pixel text-3xl text-primary mb-2">
            {getModeName(mode)}
          </h1>
          <p className="text-text-muted">
            选择关卡，开始你的冒险
          </p>
        </div>

        <div className="grid gap-6">
          {levels.map((level) => {
            const enemy = getEnemyByLevel(level);
            const isUnlocked = unlocked.includes(level);
            const isCompleted = completed.includes(level);
            const stars = isCompleted ? 3 : (isUnlocked ? 1 : 0);

            return (
              <button
                key={level}
                onClick={() => handleSelectLevel(level)}
                disabled={!isUnlocked}
                className={`
                  card flex items-center gap-6 transition-all duration-300
                  ${isUnlocked ? 'hover:border-primary/50 hover:scale-102 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                `}
              >
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center text-4xl
                  ${isUnlocked ? 'bg-enemy/20' : 'bg-surface'}
                `}>
                  {isUnlocked ? enemy.emoji : <Lock className="w-8 h-8 text-text-muted" />}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">第 {level} 关</h3>
                    <span className="text-lg text-text-muted">{enemy.name}</span>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-success" />}
                  </div>
                  <p className="text-sm text-text-muted mb-2">{enemy.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Skull className="w-4 h-4 text-enemy" />
                      <span>HP: {enemy.maxHp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sword className="w-4 h-4 text-warning" />
                      <span>伤害: {enemy.damage}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= stars ? 'text-warning fill-warning' : 'text-surface'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-text-muted">
                    {isCompleted ? '已通关' : isUnlocked ? '可挑战' : '未解锁'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>未解锁</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span>已通关</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
