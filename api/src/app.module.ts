import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScoringModule } from './scoring/scoring.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [ScoringModule, JobsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
