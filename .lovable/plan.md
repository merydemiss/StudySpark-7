## What changes

### 1. Make everything free
- Delete `src/lib/premium-limits.ts`, `src/lib/premium.functions.ts`, `src/lib/usage.server.ts`
- Remove premium/quota checks from `src/routes/api/chat.ts`
- Drop `usage_counters` table and `profiles.premium_until` column
- Remove any premium UI references (upgrade buttons, paywall page if scaffolded)

### 2. AI Voice Broadcast (new)
- New server route `src/routes/api/tts.ts` — streams Lovable AI `gpt-4o-mini-tts` (SSE, PCM) via `LOVABLE_API_KEY`
- New page `src/routes/_authenticated/voice.tsx` — paste/select text, pick voice + speed, play with realtime PCM playback; "Read aloud" buttons on Notes summary + flashcards
- Unlimited, no quotas

### 3. Study Planner (new)
- New tables: `assignments` (title, subject, due_at, status, priority, notes) and `study_goals` (title, target_minutes, period weekly/monthly, progress_minutes)
- Plus `study_sessions` (subject, duration_seconds, started_at) to track focus time
- New page `src/routes/_authenticated/planner.tsx`:
  - Assignment list with add/edit/complete, sorted by due date, overdue highlighting
  - Weekly goals with progress bars
  - Pomodoro-style focus timer (25/5 default, configurable) that logs sessions and rolls up into goals
- Dashboard widget showing next 3 due assignments + today's focus minutes

### 4. Polish
- App shell nav: add Voice + Planner entries
- Update dashboard cards/streaks to read from real `study_sessions`
- Update profile XP to factor in sessions + assignments completed

## Technical notes

- All DB tables use `auth.uid()` RLS, GRANT to authenticated + service_role, `updated_at` triggers
- Voice playback uses AudioContext with PCM 24kHz mono (per Lovable TTS guide), chunking long text at sentence boundaries
- Planner uses `createServerFn` with `requireSupabaseAuth`; timer state in component, persisted on stop
- Mobile-first responsive, keeps existing blue→purple theme + dark mode

Approve and I'll ship it.