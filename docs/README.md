# Trackr — Ghost Job Detector

A tool that analyzes job postings and scores how likely each one is a **ghost job**
(a posting where the company isn't really hiring). Built as a two-week learning
project to become interview-ready on **React, Next.js, and NestJS**.

## Docs index

- [`architecture.md`](./architecture.md) — system design, folder structure, patterns
- [`data-strategy.md`](./data-strategy.md) — where job postings come from + ingestion design
- [`NOTES.md`](./NOTES.md) — running "how does this work & why" journal (interview cheat sheet)

## The concept

A ghost job is a posting that's up to collect resumes, satisfy internal policy, or
project growth — with no real intent to hire. Trackr scores a posting 0–100 and,
crucially, **explains why** with a per-signal breakdown.

The detection is a transparent, **rule-based scoring engine** (heuristics) — no ML
required. This is the heart of the project and the best interview talking point.

## Ghost signals

Each signal contributes a weighted amount to the total ghost score.

| Signal | Ghost indicator | Data source |
|---|---|---|
| Posting age | Up 30 / 60 / 90+ days | `first_published` |
| Repost / staleness | Frequently updated but never filled | `updated_at`, tracking over time |
| Salary transparency | No salary listed | Aggregator (Adzuna) or manual |
| Description vagueness | Generic boilerplate, buzzword density | `content` text analysis |
| Evergreen language | "Always hiring", "building a pipeline" | `content` keyword match |
| Applicant volume vs. age | Many applicants, still open | Manual / aggregator |
| Named contact | No human recruiter named | Manual / posting |

## MVP scope (ruthlessly limited on purpose)

1. Add a job (manual form + paste-description box)
2. Compute ghost score (0–100) with Low / Medium / High risk label
3. Score breakdown UI — each signal, its contribution, plain-English reason
4. Job list / dashboard — sortable by score, filterable by risk
5. Auth — saved analyses per user

**Deliberately out of scope:** scraping LinkedIn/Indeed, ML models, email
notifications, teams/collaboration. "I scoped ruthlessly to ship in two weeks"
is itself a strong interview answer.

## Stretch

- Live ingestion from a real API (Greenhouse — free, no key)
- Seed + validate against the Kaggle "Real/Fake Job Posting" dataset
- Re-analyze over time (score history)
- Community "I applied and never heard back" reports
