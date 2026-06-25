// Shared client + server constants for the freemium plan.

export const FREE_MESSAGES_PER_DAY = 30;
export const FREE_TTS_SECONDS_PER_DAY = 20 * 60; // 20 minutes

export const PREMIUM_PRICE_USD = 67;
export const PREMIUM_DURATION_DAYS = 365;

/** Rough estimate so the daily voice meter is fair without measuring audio bytes. */
export function estimateTtsSeconds(text: string): number {
  const chars = text.trim().length;
  // ~15 chars/sec at default speed; clamp to >= 1 second when there's any text.
  return chars === 0 ? 0 : Math.max(1, Math.ceil(chars / 15));
}
