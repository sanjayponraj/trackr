# Data Strategy — where job postings come from

Sourcing is the make-or-break decision for a ghost-job tool. Ranked by fit for a
two-week learning project.

## Tier 1 — No sourcing (MVP)

- **Manual entry / paste description.** User provides the data. All effort goes to
  the scoring engine + UI (the actual learning). Zero legal/technical risk. Start here.

## Tier 2 — Free, legal, structured APIs

Company ATS platforms expose **public JSON job boards** — no auth, no scraping:

- Greenhouse: `https://boards-api.greenhouse.io/v1/boards/{company}/jobs?content=true`
- Lever: `https://api.lever.co/v0/postings/{company}`
- Ashby: `https://api.ashbyhq.com/posting-api/job-board/{company}`

### Workday (undocumented CXS API — usable but less stable)

Every `myworkdayjobs.com` career site is backed by the reverse-engineered CXS API.
Two-step fetch, and the URL varies per company (tenant + datacenter + site).

```
# 1. list (POST):
https://{tenant}.{dc}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs
#    body: {"appliedFacets":{},"limit":20,"offset":0,"searchText":""}
# 2. detail (GET) using each job's externalPath:
https://{tenant}.{dc}.myworkdayjobs.com/wday/cxs/{tenant}/{site}{externalPath}
```

Verified live (NVIDIA, `wd5`, site `NVIDIAExternalCareerSite`): list returned 2000
jobs. Fields:

| Field | Where | Powers signal |
|---|---|---|
| `postedOn` (e.g. "Posted 30+ Days Ago") | list | Coarse posting age — near pre-built ghost signal |
| `startDate` (e.g. `2026-07-09`) | detail | Exact posting age |
| `jobDescription` (HTML) | detail | Vagueness, evergreen keywords |
| `externalPath`, `title`, `locationsText` | list | display / links |

Caveats vs. Greenhouse: undocumented (can change), POST-based, per-company URL
discovery (datacenter code `wd1/wd3/wd5/...` + custom site slug), two requests for
full data. Greenhouse is the easier first integration; Workday adds reach.

Free aggregators (free tiers, sign up for key):

- **Adzuna** — big aggregator, includes salary (powers salary-transparency signal)
- **The Muse** — free, minimal auth
- **Remotive / Arbeitnow / RemoteOK** — free remote-job JSON, no auth
- **USAJOBS** — official US gov API
- **Hacker News "Who's Hiring"** via Algolia API

## Tier 3 — Datasets (build + validate the detector)

- **Kaggle "Real/Fake Job Posting Prediction"** (~18k labeled postings). Seed the DB,
  then check whether the ghost score correlates with the fake label. Demo line:
  "I validated my heuristics against a labeled dataset."

## Tier 4 — Avoid

- Scraping LinkedIn / Indeed / Glassdoor: anti-bot, ToS violations, legally gray,
  time sink. Mature interview answer: "I chose public APIs over scraping for legal
  and reliability reasons."

## Recommended path

1. MVP: manual entry + paste-description (Tier 1).
2. Add **Greenhouse** as first real source (free, no key) — teaches consuming a
   third-party API from Nest (HttpModule, DTOs, mapping to internal schema).
3. Seed with Kaggle dataset to test/demo scoring accuracy.

## Live findings — Greenhouse API (verified)

Endpoint tested: `https://boards-api.greenhouse.io/v1/boards/databricks/jobs?content=true`
Returned **787 jobs**. Per-job fields relevant to ghost detection:

| Field | Example | Powers signal |
|---|---|---|
| `first_published` | `2026-03-05T09:32:12-05:00` | Posting age |
| `updated_at` | `2026-07-01T18:31:32-04:00` | Repost / staleness |
| `content` | HTML description | Vagueness, evergreen keywords |
| `location.name` | `Japan` | context |
| `absolute_url` | job link | display |
| `id` | `8437000002` | dedupe / external id |

**Missing from Greenhouse:** salary, applicant count → blend an aggregator
(Adzuna) or manual entry for those signals. Good real-world lesson in data-source
tradeoffs and normalization.

## Ingestion design

`api/src/jobs/sources/` — one file per source implementing `JobSource`, each
normalizing to the internal `Job` shape (strategy pattern). Swap/add sources
without touching the scoring engine.
