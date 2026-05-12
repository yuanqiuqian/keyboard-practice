import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  color?: 'primary' | 'enemy' | 'success' | 'warning';
  variant?: 'default' | 'fightHud';
}

export default function ProgressBar({
  value,
  max,
  className,
  showLabel = false,
  color = 'primary',
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: 'bg-primary',
    enemy: 'bg-enemy',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-text-muted">HP</span>
          <span className="text-text font-mono">{value} / {max}</span>
        </div>
      )}
      <div
        className={clsx(
          'overflow-hidden',
          variant === 'fightHud' ? 'h-3 bg-black/40 rounded-sm border border-surface/70' : 'h-4 bg-surface rounded-full'
        )}
      >
        <div
          className={clsx(
            'h-full transition-all duration-300 ease-out',
            variant === 'fightHud' ? '' : 'rounded-full',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
