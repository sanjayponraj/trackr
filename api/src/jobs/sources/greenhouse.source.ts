import { Injectable, NotFoundException } from '@nestjs/common';
import {
  JobQuery,
  JobSource,
  NormalizedJob,
} from './job-source.interface';

// Raw shape of a Greenhouse job (only the fields we use).
interface GreenhouseJob {
  id: number;
  title: string;
  content: string;
  absolute_url: string;
  first_published?: string;
  updated_at?: string;
  location?: { name?: string };
}

@Injectable()
export class GreenhouseSource implements JobSource {
  readonly name = 'greenhouse';

  async fetchJobs({ company, limit = 20 }: JobQuery): Promise<NormalizedJob[]> {
    const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(
      company,
    )}/jobs?content=true`;

    const res = await fetch(url);
    if (res.status === 404) {
      throw new NotFoundException(
        `No Greenhouse board found for "${company}".`,
      );
    }
    if (!res.ok) {
      throw new Error(`Greenhouse request failed (${res.status}).`);
    }

    const data = (await res.json()) as { jobs?: GreenhouseJob[] };
    const jobs = data.jobs ?? [];

    // Map external shape -> internal shape. This translation layer is what keeps
    // the rest of the app independent of any specific provider.
    return jobs.slice(0, limit).map((j) => ({
      externalId: String(j.id),
      title: j.title,
      company,
      description: j.content,
      url: j.absolute_url,
      location: j.location?.name ?? null,
      firstPublished: j.first_published ?? null,
      source: this.name,
    }));
  }
}
