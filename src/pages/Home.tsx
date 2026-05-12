import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Shield, Zap, Trophy, Star } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { getModeName, getModeDescription } from '@/data/words';
import { GameMode } from '@/types/game';
import Button from '@/components/common/Button';
import ProgressBar from '@/components/common/ProgressBar';

const modeIcons: Record<GameMode, JSX.Element> = {
  english: <Zap className="w-8 h-8" />,
  pinyin: <Star className="w-8 h-8" />,
  wubi: <Sword className="w-8 h-8" />,
};

export default function Home() {
  const navigate = useNavigate();
  const { player, completedLevels, loadData, isLoading } = useGameStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-pixel text-primary animate-pulse">加载中...</div>
      </div>
    );
  }

  const handleSelectMode = (mode: GameMode) => {
    navigate(`/select/${mode}`);
  };

  const totalCompleted = Object.values(completedLevels).flat().length;
  const expNeeded = player.level * 100;
  const expProgress = (player.exp / expNeeded) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-6 animate-slide-in">
          <h1 className="font-pixel text-4xl md:text-6xl text-primary drop-shadow-lg">
            键盘勇者
          </h1>
          <p className="text-xl text-text-muted">
            营救公主的冒险之旅，从打字开始
          </p>
        </div>

        <div className="card flex items-center gap-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">勇敢的战士</h2>
                <p className="text-text-muted">等级 {player.level}</p>
              </div>
              <div className="flex items-center gap-2 text-warning">
                <Trophy className="w-5 h-5" />
                <span>{totalCompleted}/15 关卡</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">经验值</span>
                <span className="font-mono">{player.exp} / {expNeeded}</span>
              </div>
              <ProgressBar value={player.exp} max={expNeeded} color="warning" />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-primary" />
                <span>HP: {player.maxHp}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sword className="w-4 h-4 text-enemy" />
                <span>攻击: {player.attack}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">选择练习模式</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(['english', 'pinyin', 'wubi'] as GameMode[]).map((mode, index) => (
              <button
                key={mode}
                onClick={() => handleSelectMode(mode)}
                className="card hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-slide-in group"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {modeIcons[mode]}
                </div>
                <h3 className="text-xl font-bold mb-2">{getModeName(mode)}</h3>
                <p className="text-text-muted text-sm mb-4">{getModeDescription(mode)}</p>
                <div className="text-sm text-primary">
                  已通关 {completedLevels[mode].length}/5 关
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-text-muted text-sm animate-slide-in" style={{ animationDelay: '0.5s' }}>
          <p>击败沿途的敌人，营救被困的公主！</p>
        </div>
      </div>
    </div>
  );
}
