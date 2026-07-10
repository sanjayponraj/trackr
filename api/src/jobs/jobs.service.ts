import { Injectable } from '@nestjs/common';
import { GreenhouseSource } from './sources/greenhouse.source';
import { NormalizedJob } from './sources/job-source.interface';
import { ScoringService, ScoreResult } from '../scoring/scoring.service';

export interface ScoredJob {
  job: NormalizedJob;
  score: ScoreResult;
}

@Injectable()
export class JobsService {
  constructor(
    private readonly greenhouse: GreenhouseSource,
    private readonly scoring: ScoringService,
  ) {}

  // Fetch real postings from Greenhouse, run each through the scoring engine,
  // and return them sorted ghostiest-first.
  async importAndScore(company: string, limit?: number): Promise<ScoredJob[]> {
    const jobs = await this.greenhouse.fetchJobs({ company, limit });
    return jobs
      .map((job) => ({ job, score: this.scoring.score(job) }))
      .sort((a, b) => b.score.total - a.score.total);
  }
}
