import { Body, Controller, Post } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import type { ScorableJob } from './signal.interface';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  // POST /scoring/preview  { title, company, firstPublished, ... }
  // Returns the ghost score + per-signal breakdown. No DB needed — pure engine.
  // (Request validation with DTOs/class-validator comes on Day 3 of the plan.)
  @Post('preview')
  preview(@Body() job: ScorableJob) {
    return this.scoringService.score(job);
  }
}
