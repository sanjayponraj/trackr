import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // GET /jobs/import?company=databricks&limit=10
  // Fetches real Greenhouse postings and returns them scored, ghostiest-first.
  @Get('import')
  import(@Query('company') company?: string, @Query('limit') limit?: string) {
    if (!company) {
      throw new BadRequestException('Query param "company" is required.');
    }
    return this.jobsService.importAndScore(
      company,
      limit ? Number(limit) : undefined,
    );
  }
}
