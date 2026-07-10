import { apiClient } from '@/lib/api-client';
import { ScoredJob } from './types';

// Calls GET /jobs/import on the Nest API — fetches real Greenhouse postings,
// scored and sorted ghostiest-first.
export function importJobs(company: string, limit = 10): Promise<ScoredJob[]> {
  const params = new URLSearchParams({ company, limit: String(limit) });
  return apiClient<ScoredJob[]>(`/jobs/import?${params.toString()}`);
}
