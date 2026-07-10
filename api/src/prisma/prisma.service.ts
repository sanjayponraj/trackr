import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Extends the generated PrismaClient so `PrismaService` IS a fully-typed DB client.
// OnModuleInit is a Nest lifecycle hook: Nest calls onModuleInit() once the module
// is set up, which is where we open the DB connection.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
