import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';

export interface SpriteSheet {
  url: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  frameCount: number;
  startIndex?: number;
}

export interface SpriteAnim {
  frames?: string[];
  sheet?: SpriteSheet;
}

interface FighterSpriteProps {
  anim: SpriteAnim;
  fps?: number;
  className?: string;
}

export default function FighterSprite({ anim, fps = 14, className }: FighterSpriteProps) {
  const safeFrames = useMemo(() => (anim.frames && anim.frames.length > 0 ? anim.frames : []), [anim.frames]);
  const sheet = anim.sheet;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const count = safeFrames.length > 0 ? safeFrames.length : sheet?.frameCount || 0;
    if (count <= 1) return;
    const interval = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, Math.max(20, Math.floor(1000 / fps)));
    return () => window.clearInterval(interval);
  }, [safeFrames, sheet?.frameCount, fps]);

  if (safeFrames.length === 0 && !sheet) return null;

  if (safeFrames.length > 0) {
    return <img className={clsx('fighter-sprite-img', className)} src={safeFrames[index]} alt="" draggable={false} />;
  }

  const startIndex = sheet!.startIndex || 0;
  const frameIndex = startIndex + index;
  const col = frameIndex % sheet!.columns;
  const row = Math.floor(frameIndex / sheet!.columns);
  const totalFrames = (sheet!.startIndex || 0) + sheet!.frameCount;
  const rows = Math.max(1, Math.ceil(totalFrames / sheet!.columns));

  return (
    <div
      className={clsx('fighter-sprite-sheet', className)}
      style={{
        backgroundImage: `url(${sheet!.url})`,
        backgroundPosition: `${-col * 100}% ${-row * 100}%`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${sheet!.columns * 100}% ${rows * 100}%`,
      }}
    />
  );
}
