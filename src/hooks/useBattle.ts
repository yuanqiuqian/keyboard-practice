import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from './useGameStore';
import { getEnemyByLevel } from '@/data/enemies';
import { Enemy } from '@/types/game';

interface BattleCallbacks {
  onEnemyDefeated: () => void;
  onPlayerDefeated: () => void;
  onDamageDealt: (damage: number) => void;
  onDamageReceived: (damage: number) => void;
}

export const useBattle = (level: number, callbacks: BattleCallbacks) => {
  const { battleState, updateBattleState, player } = useGameStore();
  const enemy = getEnemyByLevel(level);
  const enemyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const healTimerRef = useRef<NodeJS.Timeout | null>(null);

  const enemyAttack = useCallback(() => {
    if (!battleState || battleState.enemyHp <= 0) return;

    const damage = Math.max(1, enemy.damage - Math.floor(player.defense * enemy.damage));
    
    updateBattleState({
      playerHp: Math.max(0, battleState.playerHp - damage),
      enemyAttacking: false,
    });

    callbacks.onDamageReceived(damage);

    if (battleState.playerHp - damage <= 0) {
      callbacks.onPlayerDefeated();
    }
  }, [battleState, enemy, player.defense, updateBattleState, callbacks]);

  const startEnemyTimer = useCallback(() => {
    if (enemyTimerRef.current) {
      clearInterval(enemyTimerRef.current);
    }

    enemyTimerRef.current = setInterval(() => {
      if (battleState && battleState.enemyHp > 0 && !battleState.enemyAttacking) {
        updateBattleState({ enemyAttacking: true });
        setTimeout(enemyAttack, 500);
      }
    }, enemy.attackInterval * 1000);
  }, [enemy.attackInterval, battleState, enemyAttack, updateBattleState]);

  const startEnemyHealing = useCallback(() => {
    if (healTimerRef.current) {
      clearInterval(healTimerRef.current);
    }

    healTimerRef.current = setInterval(() => {
      if (battleState && battleState.enemyHp > 0 && battleState.enemyHp < battleState.enemyMaxHp) {
        updateBattleState({
          enemyHp: Math.min(battleState.enemyMaxHp, battleState.enemyHp + 2),
        });
      }
    }, 10000);
  }, [battleState, updateBattleState]);

  useEffect(() => {
    if (battleState && battleState.enemyHp > 0) {
      startEnemyTimer();
      startEnemyHealing();
    }

    return () => {
      if (enemyTimerRef.current) {
        clearInterval(enemyTimerRef.current);
      }
      if (healTimerRef.current) {
        clearInterval(healTimerRef.current);
      }
    };
  }, [battleState?.enemyHp, startEnemyTimer, startEnemyHealing]);

  const damageEnemy = useCallback((damage: number) => {
    if (!battleState) return;

    const newEnemyHp = Math.max(0, battleState.enemyHp - damage);
    
    updateBattleState({
      enemyHp: newEnemyHp,
    });

    callbacks.onDamageDealt(damage);

    if (newEnemyHp <= 0) {
      callbacks.onEnemyDefeated();
    }
  }, [battleState, updateBattleState, callbacks]);

  const damagePlayer = useCallback((damage: number) => {
    if (!battleState) return;

    const actualDamage = Math.max(1, Math.floor(damage * (1 - player.defense)));
    const newPlayerHp = Math.max(0, battleState.playerHp - actualDamage);

    updateBattleState({
      playerHp: newPlayerHp,
    });

    if (newPlayerHp <= 0) {
      callbacks.onPlayerDefeated();
    }
  }, [battleState, player.defense, updateBattleState, callbacks]);

  return {
    enemy,
    damageEnemy,
    damagePlayer,
  };
};
