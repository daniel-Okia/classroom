# Classroom

Free, simple, low-bandwidth PWA and responsive dashboard for Ugandan schools, teachers, parents and students (nursery to S6). *Built on faith. Strengthened at home. Learning together.*

**Status:** Phase 1 (MVP) built and tested locally. Not deployed. See [docs/phase-1-summary.md](docs/phase-1-summary.md).

## Quick start
```bash
corepack enable && pnpm install
scripts/dev-db.sh start                    # disposable Postgres on :54329 (or: docker compose up -d postgres)
pnpm --filter @classroom/web seed          # taxonomy + 4 sample lessons + draft devotion plan
cd apps/web && ALLOW_DRAFT_DEVOTIONS=1 pnpm dev   # http://localhost:5173
```
Login codes are printed in the server console in dev (no SMS is sent). Run `scripts/e2e.sh` for the full acceptance script and `pnpm test` for unit and integration tests.

## Layout
| Path | What |
|---|---|
| `apps/web` | SvelteKit app: PWA, parent/student/teacher/admin screens, API |
| `packages/core` | permissions (`can()`), join codes, scheduling, notification rules |
| `packages/db` | Drizzle schema, migrations, row-level security |
| `packages/content` | lesson format, validator, release gate, quiz marking |
| `content/` | original lessons and the taxonomy |
| `tools/ingest` | verdict-gated, robots-aware fetcher (NCDC test-only) |
| `docs/` | audit, architecture, ERD, API draft, design system, decisions |

## Docs
[Source audit](docs/01-source-audit.md) · [Plan](docs/02-plan.md) · [Architecture](docs/03-architecture.md) · [ERD](docs/04-erd.md) · [Design system](docs/05-design-system.md) · [API](docs/api/openapi.yaml) · [Content authoring](docs/content-authoring.md) · [Licensing checklist](docs/licensing-checklist.md) · [Gaps report](docs/gaps-report.md) · [Decisions](docs/decisions)
