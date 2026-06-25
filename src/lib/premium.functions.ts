import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  FREE_MESSAGES_PER_DAY,
  FREE_TTS_SECONDS_PER_DAY,
  PREMIUM_DURATION_DAYS,
} from "./premium-limits";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export type PremiumStatus = {
  isPremium: boolean;
  premiumUntil: string | null;
  messagesUsed: number;
  ttsSecondsUsed: number;
  messagesLimit: number;
  ttsSecondsLimit: number;
};

export const getPremiumStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PremiumStatus> => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("premium_until")
      .eq("id", userId)
      .maybeSingle();

    const premiumUntil = profile?.premium_until ?? null;
    const isPremium = premiumUntil ? new Date(premiumUntil) > new Date() : false;

    const { data: usage } = await supabase
      .from("usage_counters")
      .select("messages_count, tts_seconds")
      .eq("user_id", userId)
      .eq("day", today())
      .maybeSingle();

    return {
      isPremium,
      premiumUntil,
      messagesUsed: usage?.messages_count ?? 0,
      ttsSecondsUsed: usage?.tts_seconds ?? 0,
      messagesLimit: FREE_MESSAGES_PER_DAY,
      ttsSecondsLimit: FREE_TTS_SECONDS_PER_DAY,
    };
  });

/**
 * Dev-only "purchase" — grants 1 year of premium without taking real money.
 * Replace this with a real Stripe/Paddle webhook handler before going live.
 */
export const grantPremium = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const until = new Date();
    until.setDate(until.getDate() + PREMIUM_DURATION_DAYS);
    const { error } = await supabase
      .from("profiles")
      .update({ premium_until: until.toISOString() })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true, premiumUntil: until.toISOString() };
  });

/** Manually cancel premium (for testing). */
export const cancelPremium = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({ premium_until: null })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
