import { Injectable } from '@nestjs/common';
import {
  GhostSignal,
  ScorableJob,
  SignalEvaluation,
} from '../signal.interface';
import { htmlToText, wordCount } from '../text.util';

// Buzzwords/filler that tend to appear in low-effort or placeholder postings.
const BUZZWORDS = [
  'rockstar',
  'ninja',
  'guru',
  'wear many hats',
  'fast-paced',
  'fast paced',
  'hit the ground running',
  'self-starter',
  'self starter',
  'dynamic environment',
  'work hard play hard',
  'synergy',
  'think outside the box',
  'go-getter',
];

// Heuristic: real, active postings describe concrete responsibilities and are
// substantial. Very short or buzzword-heavy descriptions read as generic/ghosty.
@Injectable()
export class DescriptionVaguenessSignal implements GhostSignal {
  readonly key = 'description_vagueness';
  readonly label = 'Description vagueness';
  readonly weight = 2;

  evaluate(job: ScorableJob): SignalEvaluation {
    const text = htmlToText(job.description);
    if (!text) {
      return {
        score: 0.6,
        reason: 'No description provided — hard to verify a real role.',
      };
    }

    const words = wordCount(text);
    const lower = text.toLowerCase();
    const buzzHits = BUZZWORDS.filter((b) => lower.includes(b));

    // Length component: <80 words is thin, 300+ words is substantial.
    const lengthScore =
      words < 80 ? 0.7 : words < 150 ? 0.4 : words < 300 ? 0.2 : 0.05;
    // Buzzword component: each hit adds suspicion, capped.
    const buzzScore = Math.min(buzzHits.length * 0.15, 0.45);

    const score = Math.min(lengthScore + buzzScore, 1);
    const parts = [`${words} words`];
    if (buzzHits.length) parts.push(`buzzwords: ${buzzHits.join(', ')}`);

    return { score, reason: `Description analysis (${parts.join('; ')}).` };
  }
}
