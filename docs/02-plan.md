# Short plan

Design: I will make my own screens in the spirit of the supplied mockups (green #0B6E4F, gold #F2A900, ink #14213D, background #F4F7FB, Nunito). I will say where I deviate and why.

## Proposed stack (to justify at deliverable 2)
TypeScript monorepo (pnpm). SvelteKit for the PWA and dashboard (smallest JS, helps the 150 KB budget). Workbox service worker, IndexedDB, background sync. PostgreSQL + Drizzle. Redis (BullMQ) for queues. S3-compatible storage behind a CDN. Phone OTP through a pluggable SMS provider (Africa's Talking adapter). Docker Compose for local dev, GitHub Actions CI. Single small VPS to start, cost documented.

## Order of work
1. **Now:** this audit. **Stop for your decisions** (above).
2. Architecture doc, ERD (section 6 + 4B.E entities), API spec, design system.
3. Phase 1 MVP in small commits, tests alongside, PR per phase.
4. Phase 2, Phase 3, docs, per brief.
5. Payment provider research is done before Phase 2 and I will ask before integrating. Grading research (UNEB/NCDC official scales) before any result logic.

## Decisions I'll record in /docs/decisions
Stack, repo layout, ID scheme, i18n approach. Anything on licensing, cost, privacy, faith settings or family fees goes to you first.
