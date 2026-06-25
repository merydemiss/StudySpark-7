
-- 1) Premium expiry on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS premium_until timestamptz;

-- 2) Daily usage counters
CREATE TABLE IF NOT EXISTS public.usage_counters (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  messages_count integer NOT NULL DEFAULT 0,
  tts_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.usage_counters TO authenticated;
GRANT ALL ON public.usage_counters TO service_role;

ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own usage"
  ON public.usage_counters
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER usage_counters_touch
  BEFORE UPDATE ON public.usage_counters
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
