import { Injectable } from '@nestjs/common';
import {
  GhostSignal,
  ScorableJob,
  SignalEvaluation,
} from '../signal.interface';

// Heuristic: the longer a posting stays open, the more likely it's a ghost job.
// Fresh postings score ~0; postings open 90+ days score ~1.
@Injectable()
export class PostingAgeSignal implements GhostSignal {
  readonly key = 'posting_age';
  readonly label = 'Posting age';
  readonly weight = 10;

  evaluate(job: ScorableJob): SignalEvaluation {
    if (!job.firstPublished) {
      return {
        score: 0.3,
        reason: 'No posting date available (mild suspicion).',
      };
    }

    const published = new Date(job.firstPublished);
    const ageDays = Math.floor(
      (Date.now() - published.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (ageDays >= 90) {
      return {
        score: 1,
        reason: `Open ${ageDays} days — long-lived postings are a strong ghost signal.`,
      };
    }
    if (ageDays >= 60) {
      return {
        score: 0.7,
        reason: `Open ${ageDays} days — unusually long time to fill.`,
      };
    }
    if (ageDays >= 30) {
      return { score: 0.4, reason: `Open ${ageDays} days — somewhat stale.` };
    }
    return {
      score: 0.1,
      reason: `Open only ${ageDays} days — looks actively hiring.`,
    };
  }
}
