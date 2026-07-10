import { ScoredJob } from '../types';
import { RiskBadge } from './risk-badge';
import { ScoreBar } from './score-bar';

export function JobCard({ scored }: { scored: ScoredJob }) {
  const { job, score } = scored;

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-900">
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-500">
            {job.company}
            {job.location ? ` · ${job.location}` : ''}
          </p>
        </div>
        <RiskBadge risk={score.risk} />
      </div>

      <div className="mt-4">
        <ScoreBar total={score.total} risk={score.risk} />
      </div>

      {/* Native <details> gives an expandable "why" with zero client JS —
          a good example of not reaching for a Client Component unnecessarily. */}
      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Why this score?
        </summary>
        <ul className="mt-3 space-y-3">
          {score.breakdown.map((item) => (
            <li key={item.key} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-800">{item.label}</span>
                <span className="tabular-nums text-zinc-500">
                  +{item.contribution}
                </span>
              </div>
              <p className="mt-0.5 text-zinc-500">{item.reason}</p>
            </li>
          ))}
        </ul>
      </details>

      {job.url ? (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          View posting →
        </a>
      ) : null}
    </article>
  );
}
