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

-- Cross-tenant lookups that must work before a user has a school context. SECURITY DEFINER runs as the
-- (superuser) owner, so RLS is bypassed, but each function returns only the minimum columns.
CREATE OR REPLACE FUNCTION resolve_join_code(code text)
RETURNS TABLE (school_id uuid, school_name text, class_id uuid, class_name text, verified boolean)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id, s.name, NULL::uuid, NULL::text, s.verify_status = 'verified' FROM school s WHERE s.join_code = code
  UNION ALL
  SELECT s.id, s.name, c.id, c.name, s.verify_status = 'verified' FROM class c JOIN school s ON s.id = c.school_id WHERE c.join_code = code
$$;

CREATE OR REPLACE FUNCTION user_memberships(uid uuid)
RETURNS TABLE (school_id uuid, role text)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT school_id, role::text FROM user_role WHERE user_id = uid
$$;

CREATE OR REPLACE FUNCTION school_by_qr_hash(h text)
RETURNS TABLE (school_id uuid, school_name text, verified boolean)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT id, name, verify_status = 'verified' FROM school WHERE qr_token_hash = h
$$;
GRANT EXECUTE ON FUNCTION resolve_join_code(text), user_memberships(uuid), school_by_qr_hash(text) TO PUBLIC;
