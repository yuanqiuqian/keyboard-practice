import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

interface DamageNumberProps {
  damage: number;
  x: number | string;
  y: number | string;
  type: 'damage' | 'heal';
  onComplete?: () => void;
}

export default function DamageNumber({ damage, x, y, type, onComplete }: DamageNumberProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        'absolute font-pixel text-xl font-bold pointer-events-none animate-float-up z-50',
        type === 'damage' ? 'text-enemy' : 'text-success',
        'drop-shadow-lg'
      )}
      style={{
        left: x,
        top: y,
        textShadow: type === 'damage' 
          ? '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' 
          : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
      }}
    >
      {type === 'damage' ? '-' : '+'}{damage}
    </div>
  );
}
