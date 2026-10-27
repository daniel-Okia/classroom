# Deploying the demo to Vercel + Supabase

1. **Database (once).** Apply `packages/db/migrations/0000_*.sql`, then `rls.sql`, as the Supabase `postgres` user. Create `app_user` (login, nosuperuser, nobypassrls), grant it table/sequence/function access, and revoke everything from `anon` and `authenticated` so Supabase's REST API exposes nothing. Seed: `DATABASE_URL=... pnpm --filter @classroom/web seed`.
2. **Vercel project.** Import the GitHub repo. Root Directory `apps/web`; enable "Include source files outside of the Root Directory". Install command `cd ../.. && corepack enable && pnpm install --frozen-lockfile`. The Vercel adapter is picked automatically (`VERCEL=1`).
3. **Environment variables** (Production + Preview): `DATABASE_URL` (transaction pooler, `app_user`), `AUTH_SECRET`, `DEMO_SHOW_OTP=1`. Do **not** add `MIGRATE_DATABASE_URL` to Vercel.
4. **Protect the demo.** Content is AI-drafted and unreviewed: turn on Deployment Protection so only you can open it.
5. **Never run `pnpm test` with `DATABASE_URL` pointing at Supabase.** The tests create schools and users. Use the local dev database (`scripts/dev-db.sh start`).
