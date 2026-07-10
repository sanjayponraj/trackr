// The minimal shape a job needs to be scored. Deliberately decoupled from the
// Prisma `Job` model so the scoring engine doesn't depend on the database — you
// can score a pasted form, an API result, or a DB row all the same way.
export interface ScorableJob {
  title: string;
  company: string;
  description?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  applicantCount?: number | null;
  firstPublished?: Date | string | null;
}

// What a single signal returns: a normalized 0..1 score and a human reason.
export interface SignalEvaluation {
  score: number; // 0 = not ghosty, 1 = very ghosty
  reason: string;
}

// Every ghost signal implements this. Adding a new heuristic = one new class.
export interface GhostSignal {
  readonly key: string;
  readonly label: string;
  readonly weight: number; // relative importance in the final score
  evaluate(job: ScorableJob): SignalEvaluation;
}

// Injection token for "all the signals as an array". Nest can't inject an
// interface (interfaces vanish at runtime), so we use a symbol token instead.
export const GHOST_SIGNALS = Symbol('GHOST_SIGNALS');
