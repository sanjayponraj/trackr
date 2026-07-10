import { Inject, Injectable } from '@nestjs/common';
import { GhostSignal, GHOST_SIGNALS, ScorableJob } from './signal.interface';

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  weight: number;
  rawScore: number; // 0..1 from the signal
  contribution: number; // points this signal added to the total
  reason: string;
}

export interface ScoreResult {
  total: number; // 0..100
  risk: 'low' | 'medium' | 'high';
  breakdown: ScoreBreakdownItem[];
}

@Injectable()
export class ScoringService {
  // Nest injects every registered ghost signal here as an array. The service
  // doesn't know or care which signals exist — add a signal to the module and
  // it automatically participates. This is the strategy pattern via DI.
  constructor(@Inject(GHOST_SIGNALS) private readonly signals: GhostSignal[]) {}

  score(job: ScorableJob): ScoreResult {
    const totalWeight = this.signals.reduce((sum, s) => sum + s.weight, 0);

    const breakdown: ScoreBreakdownItem[] = this.signals.map((signal) => {
      const { score, reason } = signal.evaluate(job);
      const contribution = (score * signal.weight * 100) / totalWeight;
      return {
        key: signal.key,
        label: signal.label,
        weight: signal.weight,
        rawScore: score,
        contribution: Math.round(contribution),
        reason,
      };
    });

    const total = Math.round(
      breakdown.reduce((sum, item) => sum + item.contribution, 0),
    );

    return { total, risk: this.riskLabel(total), breakdown };
  }

  private riskLabel(total: number): ScoreResult['risk'] {
    if (total >= 66) return 'high';
    if (total >= 33) return 'medium';
    return 'low';
  }
}
