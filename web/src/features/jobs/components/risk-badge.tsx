import { Risk } from '../types';

const STYLES: Record<Risk, string> = {
  low: 'bg-green-100 text-green-800 ring-green-600/20',
  medium: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  high: 'bg-red-100 text-red-800 ring-red-600/20',
};

const LABELS: Record<Risk, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
};

export function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STYLES[risk]}`}
    >
      {LABELS[risk]}
    </span>
  );
}
