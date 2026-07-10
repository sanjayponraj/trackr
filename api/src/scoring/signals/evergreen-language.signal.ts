import { Injectable } from '@nestjs/common';
import {
  GhostSignal,
  ScorableJob,
  SignalEvaluation,
} from '../signal.interface';
import { htmlToText } from '../text.util';

// Phrases that signal "we're collecting resumes", not "we have a specific opening".
// These are the clearest ghost-job tells in a posting's own words.
const EVERGREEN_PHRASES = [
  'always hiring',
  'always looking',
  'always accepting',
  'building a pipeline',
  'pipeline of candidates',
  'talent pipeline',
  'talent community',
  'future opportunities',
  'future openings',
  'general application',
  'on an ongoing basis',
  'evergreen',
  'no specific opening',
  'keep your resume on file',
  'for future consideration',
];

// Heuristic: presence of "pipeline"/"always hiring" language strongly implies the
// posting isn't tied to a real, current vacancy.
@Injectable()
export class EvergreenLanguageSignal implements GhostSignal {
  readonly key = 'evergreen_language';
  readonly label = 'Evergreen language';
  readonly weight = 3;

  evaluate(job: ScorableJob): SignalEvaluation {
    const text = htmlToText(job.description).toLowerCase();
    if (!text) {
      return {
        score: 0,
        reason: 'No description to scan for evergreen language.',
      };
    }

    const hits = EVERGREEN_PHRASES.filter((phrase) => text.includes(phrase));
    if (hits.length === 0) {
      return { score: 0, reason: 'No evergreen/pipeline language detected.' };
    }

    // Any single strong phrase is already a big tell; more hits push toward 1.
    const score = Math.min(0.6 + (hits.length - 1) * 0.2, 1);
    return { score, reason: `Evergreen phrasing found: ${hits.join(', ')}.` };
  }
}
