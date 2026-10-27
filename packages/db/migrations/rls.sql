-- Row-level security: the app sets `SET LOCAL app.school_id = '<uuid>'` per request. Run after drizzle migrations.
-- Tables with a school_id column get one uniform policy. Platform-admin access uses a separate DB role (audited).
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.columns
           WHERE table_schema = 'public' AND column_name = 'school_id' AND table_name <> 'school_settings'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant ON %I', t);
    EXECUTE format($p$CREATE POLICY tenant ON %I USING (school_id = nullif(current_setting('app.school_id', true), '')::uuid)
                      WITH CHECK (school_id = nullif(current_setting('app.school_id', true), '')::uuid)$p$, t);
  END LOOP;
END $$;
