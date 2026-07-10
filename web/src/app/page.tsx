import { Suspense } from 'react';
import { importJobs } from '@/features/jobs/api';
import { ApiError } from '@/lib/api-client';
import { AnalyzeForm } from '@/features/jobs/components/analyze-form';
import { JobCard } from '@/features/jobs/components/job-card';
import { ResultsSkeleton } from '@/features/jobs/components/job-card-skeleton';
import { ScoredJob } from '@/features/jobs/types';

// Upper bound on postings fetched per company. Big boards (e.g. Databricks has
// ~800) render a lot of cards — pagination would be the next step for scale.
const MAX_JOBS = 500;

// In Next 15+/16, searchParams is async and must be awaited.
type PageProps = {
  searchParams: Promise<{ company?: string, jobTitle?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { company, jobTitle } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
        Ghost Job Detector
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Pick a company to pull its live Greenhouse postings and see how likely
        each one is a ghost job.
      </p>

      <div className="mt-6">
        {/* Client Component for input; wrapped in Suspense because it reads
            useSearchParams. */}
        <Suspense>
          <AnalyzeForm />
        </Suspense>
      </div>

      <div className="mt-8">
        {company  ? (
          // key={company} makes the boundary re-suspend (show the skeleton) each
          // time you analyze a new company, instead of showing stale results.
          <Suspense key={company} fallback={<ResultsSkeleton />}>
            <Results company={company} jobTitle={jobTitle || ''} />
          </Suspense>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}

// Server Component: fetches on the server (this log shows in your TERMINAL, not
// the browser) and renders the scored jobs.
async function Results({ company, jobTitle }: { company: string, jobTitle: string }) {
  console.log('[server] scoring jobs for', company);

  let jobs: ScoredJob[] = [];
  try {
    jobs = await importJobs(company, MAX_JOBS);
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : 'Something went wrong.';
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {message}
      </p>
    );
  }

  if(jobTitle) {
    jobs = jobs.filter((job) => job.job.title.toLowerCase().includes(jobTitle.toLowerCase()));
  }

  if (jobs.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No postings found for “{company}”.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        {jobs.length} postings, most suspicious first.
      </p>
      {jobs.map((scored) => (
        <JobCard key={scored.job.externalId} scored={scored} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 px-6 py-12 text-center">
      <p className="text-sm text-zinc-500">
        Choose a company from the dropdown above to analyze its open roles.
      </p>
    </div>
  );
}
