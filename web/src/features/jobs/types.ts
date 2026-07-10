// Mirrors the shapes returned by the NestJS API (scoring.service.ts + jobs.service.ts).
export type Risk = 'low' | 'medium' | 'high';

export interface ScoreBreakdownItem {
  key: string;
  label: string;
  weight: number;
  rawScore: number;
  contribution: number;
  reason: string;
}

export interface ScoreResult {
  total: number;
  risk: Risk;
  breakdown: ScoreBreakdownItem[];
}

export interface NormalizedJob {
  externalId: string;
  title: string;
  company: string;
  description?: string | null;
  url?: string | null;
  location?: string | null;
  firstPublished?: string | null;
  source: string;
}

export interface ScoredJob {
  job: NormalizedJob;
  score: ScoreResult;
}
