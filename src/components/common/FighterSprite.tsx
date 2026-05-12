import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';

interface FighterSpriteProps {
  frames: string[];
  fps?: number;
  className?: string;
}

export default function FighterSprite({ frames, fps = 14, className }: FighterSpriteProps) {
  const safeFrames = useMemo(() => (frames && frames.length > 0 ? frames : []), [frames]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (safeFrames.length <= 1) return;
    const interval = window.setInterval(() => {
      setIndex((i) => (i + 1) % safeFrames.length);
    }, Math.max(20, Math.floor(1000 / fps)));
    return () => window.clearInterval(interval);
  }, [safeFrames, fps]);

  if (safeFrames.length === 0) return null;

  return (
    <img
      className={clsx('fighter-sprite-img', className)}
      src={safeFrames[index]}
      alt=""
      draggable={false}
    />
  );
}

