'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { COMPANIES } from '../companies';

// Client Component: a combobox — type any Greenhouse slug OR pick from the
// datalist suggestions. Submitting updates the URL's ?company= param, which
// re-runs the Server Component page to fetch + render. useTransition surfaces a
// pending state while the server fetches.
export function AnalyzeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [company, setCompany] = useState(searchParams.get('company') ?? '');
  const [isPending, startTransition] = useTransition();
  const [jobTitle, setJobTitle] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = company.trim();
    const jobTitleTrimmed = jobTitle.trim();
    if (!trimmed) return;
    // This log appears in the BROWSER console (Client Component).
    console.log('[client] analyzing', trimmed);
    startTransition(() => {
      let url = `/?company=${encodeURIComponent(trimmed)}`
      if(jobTitleTrimmed) {
        url += `&jobTitle=${encodeURIComponent(jobTitleTrimmed)}`;
      }
      router.push(url);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        list="company-suggestions"
        placeholder="Type or pick a company (e.g. five9)"
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
      />
      <datalist id="company-suggestions">
        {COMPANIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </datalist>
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Type a job title (e.g. Software Engineer)"
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {isPending ? 'Analyzing…' : 'Analyze'}
      </button>
    </form>
  );
}
