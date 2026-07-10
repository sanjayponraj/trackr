import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { GreenhouseSource } from './sources/greenhouse.source';
import { ScoringModule } from '../scoring/scoring.module';

// Imports ScoringModule so JobsService can inject the exported ScoringService.
@Module({
  imports: [ScoringModule],
  controllers: [JobsController],
  providers: [JobsService, GreenhouseSource],
})
export class JobsModule {}
