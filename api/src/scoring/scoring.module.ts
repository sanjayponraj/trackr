import { Module } from '@nestjs/common';
import { GHOST_SIGNALS, GhostSignal } from './signal.interface';
import { PostingAgeSignal } from './signals/posting-age.signal';
import { DescriptionVaguenessSignal } from './signals/description-vagueness.signal';
import { EvergreenLanguageSignal } from './signals/evergreen-language.signal';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';

// To add a new signal later:
//   1. create the signal class (implements GhostSignal, @Injectable)
//   2. add it to `providers` below
//   3. add it to the `inject` array of the GHOST_SIGNALS factory
@Module({
  controllers: [ScoringController],
  providers: [
    PostingAgeSignal,
    DescriptionVaguenessSignal,
    EvergreenLanguageSignal,
    {
      // Builds the array that ScoringService injects. Nest resolves each class in
      // `inject`, then passes them as args to `useFactory`.
      provide: GHOST_SIGNALS,
      useFactory: (...signals: GhostSignal[]): GhostSignal[] => signals,
      inject: [
        PostingAgeSignal,
        DescriptionVaguenessSignal,
        EvergreenLanguageSignal,
      ],
    },
    ScoringService,
  ],
  exports: [ScoringService],
})
export class ScoringModule {}
