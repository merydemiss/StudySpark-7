// Server-only helpers for checking premium status and bumping daily counters
// from raw HTTP routes (e.g. /api/chat, /api/tts) where we don't have the
// createServerFn middleware context.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  FREE_MESSAGES_PER_DAY,
  FREE_TTS_SECONDS_PER_DAY,
} from "./premium-limits";

export type UserSupabase = SupabaseClient<Database>;

export function createUserSupabase(token: string): UserSupabase {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function isUserPremium(supabase: UserSupabase, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("premium_until")
    .eq("id", userId)
    .maybeSingle();
  if (!data?.premium_until) return false;
  return new Date(data.premium_until) > new Date();
}

export async function getDailyUsage(supabase: UserSupabase, userId: string) {
  const { data } = await supabase
    .from("usage_counters")
    .select("messages_count, tts_seconds")
    .eq("user_id", userId)
    .eq("day", today())
    .maybeSingle();
  return {
    messages: data?.messages_count ?? 0,
    ttsSeconds: data?.tts_seconds ?? 0,
  };
}

async function bump(
  supabase: UserSupabase,
  userId: string,
  patch: { messages?: number; ttsSeconds?: number },
) {
  const day = today();
  const { data: existing } = await supabase
    .from("usage_counters")
    .select("messages_count, tts_seconds")
    .eq("user_id", userId)
    .eq("day", day)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("usage_counters")
      .update({
        messages_count: existing.messages_count + (patch.messages ?? 0),
        tts_seconds: existing.tts_seconds + (patch.ttsSeconds ?? 0),
      })
      .eq("user_id", userId)
      .eq("day", day);
  } else {
    await supabase.from("usage_counters").insert({
      user_id: userId,
      day,
      messages_count: patch.messages ?? 0,
      tts_seconds: patch.ttsSeconds ?? 0,
    });
  }
}

export async function checkChatQuota(supabase: UserSupabase, userId: string) {
  if (await isUserPremium(supabase, userId)) return { allowed: true as const };
  const { messages } = await getDailyUsage(supabase, userId);
  if (messages >= FREE_MESSAGES_PER_DAY) {
    return {
      allowed: false as const,
      reason: "message_limit",
      used: messages,
      limit: FREE_MESSAGES_PER_DAY,
    };
  }
  return { allowed: true as const };
}

export async function checkTtsQuota(
  supabase: UserSupabase,
  userId: string,
  requestedSeconds: number,
) {
  if (await isUserPremium(supabase, userId)) return { allowed: true as const };
  const { ttsSeconds } = await getDailyUsage(supabase, userId);
  if (ttsSeconds + requestedSeconds > FREE_TTS_SECONDS_PER_DAY) {
    return {
      allowed: false as const,
      reason: "tts_limit",
      used: ttsSeconds,
      limit: FREE_TTS_SECONDS_PER_DAY,
    };
  }
  return { allowed: true as const };
}

export async function incrementMessages(supabase: UserSupabase, userId: string) {
  await bump(supabase, userId, { messages: 1 });
}

export async function incrementTtsSeconds(
  supabase: UserSupabase,
  userId: string,
  seconds: number,
) {
  await bump(supabase, userId, { ttsSeconds: seconds });
}
