# Architecture

## Goals driving the design
Cheap Android phones, shared phones, slow/intermittent data, near-zero hosting cost, strict per-school isolation, child safety, and an audit trail for anything involving money or results.

## Stack and justification
| Concern | Choice | Why |
|---|---|---|
| Monorepo | pnpm workspaces, TypeScript | Shared types between web, API and tools. (pnpm not installed locally; `corepack enable` provides it.) |
| Web (PWA + dashboards) | **SvelteKit** | Compiles away the framework, so the initial load stays well under 150 KB on cheap phones. Next.js would ship a larger runtime. |
| Offline | Workbox service worker, IndexedDB (via `idb`), Background Sync with a foreground-flush fallback (iOS/Firefox lack Background Sync) | Brief requirement. |
| Database | PostgreSQL + Drizzle ORM | SQL-first, light, strong typing; row-level security for school isolation. |
| Queue | Redis + BullMQ | Reminders, SMS, webhooks, daily reconciliation. |
| Files | S3-compatible object storage (Cloudflare R2 or Backblaze B2) + CDN | No egress fees on R2, which matters for PDFs. |
| Auth | Own thin layer on Lucia-style sessions + phone OTP via SMS adapter (Africa's Talking first). "Managed auth" was in the brief; OTP pricing and Uganda SMS delivery make a vendor costly, so this is a **proposed change**, recorded in decisions/0002. Needs your OK before build. |
| i18n | Paraglide-style message catalogs, keys from day one, English first | Luganda/Swahili later with native review. |
| Maths | KaTeX, loaded only on pages that use it | Keeps base bundle small. |
| CI/CD | GitHub Actions: lint, typecheck, tests, dependency audit | Brief. |
| Local dev | Docker Compose: postgres, redis, minio | Brief. |
| Hosting | One small VPS (4 GB) running Node, Postgres and Redis, R2 for files, Cloudflare free CDN. Order of magnitude USD 15-30/month plus SMS. Detailed estimate in the final cost doc, not guessed here. |

## Repo layout
```
apps/web          SvelteKit app (student/parent PWA, teacher/admin dashboard)
packages/db       Drizzle schema, migrations, RLS policies
packages/core     domain logic: permissions, scheduling, ledger, grading
packages/ui       design tokens + components
packages/content  Markdown/KaTeX content pipeline and schema validation
tools/ingest      verdict-gated fetcher (built)
content/          original authored notes (Markdown + front-matter)
docs/             this folder; docs/decisions = ADRs
```

## Key design decisions
1. **Tenant isolation:** every tenant table has `school_id`; Postgres RLS enforces it so a missing filter in app code cannot leak data. Platform admin uses a separate role with audited access.
2. **Permissions are server-side only.** One policy module in `packages/core` (`can(user, action, resource)`) used by every route; tests assert the full role x action matrix, including guardian-level flags (can pay, view results, message, may collect).
3. **QR never grants access.** QR/join code resolves to a *join request*; access requires school approval (or a class code plus approval policy set by the school).
4. **Two curriculum tracks** are separate trees (`track = legacy | new`) with a `topic_link` table for cross-links.
5. **Content is files first.** Notes live as Markdown with front-matter and validate against a schema in CI; the DB indexes them. Provenance and licence are required fields; a resource with `publishable=false` is blocked from production builds.
6. **Offline model:** download "packs" per holiday package (notes, quizzes, search index) into IndexedDB; submissions, check-ins, requests and messages go to an outbox with idempotency keys and flush on reconnect. Payments never queue.
7. **Ledger:** double-entry `LedgerEntry` (debit/credit accounts per school), append-only; Payment state changes only through a single function that writes an `AuditLog` row in the same transaction. Webhooks verified by signature and deduplicated by provider event id. The platform never holds funds.
8. **Sensitive fields:** field-level encryption (AES-GCM, per-school data key wrapped by a master key) for financial and results data. Keys from a secrets manager, never in the repo.
9. **Faith setting** (Full/Light/Off) is read from SchoolSettings and overridable by family; devotional content has a `review_status` (draft, reviewed_by_chaplain, published) and only `published` is served.
10. **Bible module:** adapter interface `BibleProvider`; bundled public-domain KJV and WEB only; a licensed adapter and outbound link fallback exist but are off by default.
11. **Frequently tested:** counts of authored topic tags per paper/year; always rendered with the label "Frequently tested, not a prediction." No question text copied unless licensed.
12. **Performance budget:** initial JS+HTML+CSS <150 KB gzip, enforced in CI by a size check and Lighthouse CI.

## Security baseline
Rate limits on OTP and payment endpoints, CSRF protection, strict CSP, no third-party trackers, dependency scanning, upload moderation queue, audit log on staff actions and on every view/change of results and payments. Data export and deletion for parents; retention schedule per data type (set in a retention table, enforced by a job; values to be confirmed by you with counsel under the Data Protection and Privacy Act 2019).

## Build order inside Phase 1
schema + RLS + auth/OTP → school registration, QR/join, approvals → packages, slots, schedule → content pipeline + seeded notes → session flow → quizzes → parent/teacher views → notices, events, requests, guardian permissions.
