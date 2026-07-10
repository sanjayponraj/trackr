import { Risk } from '../types';

const BAR_COLOR: Record<Risk, string> = {
  low: 'bg-green-500',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

export function ScoreBar({ total, risk }: { total: number; risk: Risk }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
        <div
          className={`h-full rounded-full transition-all ${BAR_COLOR[risk]}`}
          style={{ width: `${Math.min(Math.max(total, 0), 100)}%` }}
        />
      </div>
      <span className="w-10 text-right text-sm font-semibold tabular-nums text-zinc-700">
        {total}
      </span>
    </div>
  );
}
