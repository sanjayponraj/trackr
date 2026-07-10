// A job normalized into Trackr's internal shape, regardless of where it came from.
// Note: this is a superset of ScorableJob (title + company + description +
// firstPublished), so a NormalizedJob can be passed straight to the scoring engine.
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

export interface JobQuery {
  company: string;
  limit?: number;
}

// Every ingestion source implements this. Adding Workday/Lever later = one new
// class implementing JobSource, with zero changes to the scoring or jobs service.
export interface JobSource {
  readonly name: string;
  fetchJobs(query: JobQuery): Promise<NormalizedJob[]>;
}
