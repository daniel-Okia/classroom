# Phase 1 summary

## Built (all tested locally)
- School registration, platform verification, QR/short-code join with approval, printable A4 poster, per-school isolation (Postgres RLS + server-side `can()`).
- Phone-number OTP sign-in (console SMS in dev; Africa's Talking adapter ready), per-phone and per-IP rate limits, 5-try lockout.
- Guardians, children, per-guardian permissions, parent consent log, "Study as <child>" mode.
- Holiday packages, daily 1-2 h slot, schedule builder, sessions with active-time tracking and self check-in.
- Library with two separate tracks (new/legacy), 4 original sample lessons, server-rendered Markdown + KaTeX, quizzes marked on the server (answer key never sent to the browser).
- Opening moment (verse + prayer + Begin), verse of the day, faith setting Full/Light/Off, chaplain review status gate.
- Offline: PWA manifest, service worker (app shell, visited pages), outbox that queues quiz answers and check-ins and replays them idempotently.
- Teacher: class overview with statuses, assign tasks, review text submissions, marks and comments.
- Hub: notices (audiences, priority, scheduling, read receipts), events with RSVP/consent and `.ics`, structured requests with status trail, parent-teacher/office messaging visible to admin with abuse reports, quiet-hours rules.
- Quality: 92 core + 7 content + 24 web integration tests, 41 HTTP acceptance checks (`scripts/e2e.sh`), type-check clean, CI workflow, bundle budget check (client JS about 55 KB gzipped across all routes).

## Assumed
- Every learner is treated as a minor for consent (so enrolment always records parent consent).
- SvelteKit native service worker instead of Workbox (decision 0005). Student sign-in via guardian (0004).
- Taxonomy for 4 level/subject sets only; topic names copied from NCDC syllabi for testing.
- QR carries the school/class code, not a secret; approval is the real gate.

## Not done / known gaps
- Lighthouse scores not measured. Real-phone and slow-network testing not done. Accessibility checked by structure only, no screen-reader pass.
- Photo answers: schema supports them, upload UI and moderation not built. Teacher review is text only.
- Push and SMS reminders, daily reminder scheduling, and notice delivery over SMS/push are not built (rules exist in `packages/core/src/notify.ts`). Notice "delivery reports" are read counts only.
- Parent PIN and Kids Mode, past-paper timed mode, frequent-topic insights, offline lesson packs and offline search are Phase 2.
- Fees, payments, results, report cards, bursar tools are Phases 2-3 (provider research still to do, and I will ask before integrating).
- Field-level encryption, data export/delete, retention jobs, i18n catalogues: not built yet (schema and design are ready).
- No deployment, no remote git repository and no PR yet (local branch `phase-1-mvp`).
- The seed lessons and devotion entries are AI-drafted drafts. Nothing is reviewed by a teacher or chaplain.

## Needs your input
1. Approve a git remote so I can open the Phase 1 PR.
2. NCDC and UNEB permission letters (I can draft them).
3. Who reviews lessons (teacher) and devotions (chaplain)?
4. Hosting choice and SMS provider account before Phase 2 reminders.
5. Phase 2 payments: I will compare providers and recommend one; nothing is integrated until you approve.
