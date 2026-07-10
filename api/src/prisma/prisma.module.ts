import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() means any module can inject PrismaService without importing PrismaModule
// each time. `exports` is what makes PrismaService available to other modules.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
