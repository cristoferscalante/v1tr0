-- ============================================================
-- Las tres columnas de fecha de NextAuth eran `timestamp without time zone`,
-- las únicas del esquema sin zona. Postgres guardaba el instante naive y el
-- driver lo reinterpretaba en la zona del proceso: con TZ=America/Bogota
-- (UTC-5) una sesión nacía ya "caducada 5 horas antes" y NextAuth la borraba
-- en el primer acceso. En Vercel no se notaba porque allí el proceso corre en
-- UTC, así que el error solo aparecía en desarrollo y en cualquier despliegue
-- fuera de UTC.
--
-- Los valores guardados SON instantes UTC (así los serializa el driver), de
-- modo que `AT TIME ZONE 'UTC'` los reinterpreta sin desplazarlos.
-- ============================================================

ALTER TABLE public.sessions
  ALTER COLUMN expires TYPE timestamptz USING expires AT TIME ZONE 'UTC';

ALTER TABLE public.users
  ALTER COLUMN email_verified TYPE timestamptz USING email_verified AT TIME ZONE 'UTC';

ALTER TABLE public.verification_tokens
  ALTER COLUMN expires TYPE timestamptz USING expires AT TIME ZONE 'UTC';

-- ============================================================
-- Verificación
-- ============================================================
-- SELECT table_name, column_name, data_type FROM information_schema.columns
--  WHERE table_schema='public' AND data_type LIKE 'timestamp%'
--    AND table_name IN ('sessions','users','verification_tokens');
--  → las tres deben decir "timestamp with time zone"
