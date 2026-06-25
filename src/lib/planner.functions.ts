import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Assignments
export const listAssignments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("assignments")
      .select("*")
      .eq("user_id", context.userId)
      .order("due_at", { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const assignmentInput = z.object({
  title: z.string().min(1).max(200),
  subject: z.string().max(80).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  due_at: z.string().datetime().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const createAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => assignmentInput.parse(d))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("assignments")
      .insert({
        user_id: context.userId,
        title: data.title,
        subject: data.subject ?? null,
        notes: data.notes ?? null,
        due_at: data.due_at ?? null,
        priority: data.priority,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const toggleAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending", "done"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("assignments")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAssignment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("assignments")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Goals
export const listGoals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("study_goals")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createGoal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        title: z.string().min(1).max(120),
        target_minutes: z.number().int().min(15).max(10000),
        period: z.enum(["weekly", "monthly"]).default("weekly"),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("study_goals")
      .insert({
        user_id: context.userId,
        title: data.title,
        target_minutes: data.target_minutes,
        period: data.period,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteGoal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("study_goals")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Sessions
export const logSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        subject: z.string().max(80).optional().nullable(),
        duration_seconds: z.number().int().min(1).max(60 * 60 * 8),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("study_sessions").insert({
      user_id: context.userId,
      subject: data.subject ?? null,
      duration_seconds: data.duration_seconds,
      ended_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getStudyStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const { data, error } = await context.supabase
      .from("study_sessions")
      .select("duration_seconds, started_at")
      .eq("user_id", context.userId)
      .gte("started_at", since.toISOString())
      .order("started_at", { ascending: false });
    if (error) throw new Error(error.message);
    const sessions = data ?? [];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const todaySec = sessions
      .filter((s) => new Date(s.started_at) >= todayStart)
      .reduce((a, b) => a + (b.duration_seconds ?? 0), 0);
    const weekSec = sessions
      .filter((s) => new Date(s.started_at) >= weekStart)
      .reduce((a, b) => a + (b.duration_seconds ?? 0), 0);
    // streak: consecutive days with at least 1 session
    const days = new Set(
      sessions.map((s) => new Date(s.started_at).toISOString().slice(0, 10)),
    );
    let streak = 0;
    const cursor = new Date();
    for (;;) {
      const key = cursor.toISOString().slice(0, 10);
      if (days.has(key)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return {
      todayMinutes: Math.round(todaySec / 60),
      weekMinutes: Math.round(weekSec / 60),
      totalSessions: sessions.length,
      streak,
    };
  });
