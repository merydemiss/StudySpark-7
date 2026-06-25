import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const FlashcardSchema = z.object({ front: z.string(), back: z.string() });

const NoteAnalysisSchema = z.object({
  title: z.string().describe("A short 3-6 word title for these notes"),
  summary: z.string().describe("A clear 2-4 sentence summary"),
  keyPoints: z.array(z.string()).min(3).max(10).describe("The most important takeaways as bullets"),
  flashcards: z.array(FlashcardSchema).min(4).max(12).describe("Question/answer pairs for spaced repetition"),
});

export const listNotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("notes")
      .select("id, title, summary, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getNote = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("notes")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("notes")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createAndAnalyzeNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      sourceText: z.string().min(20, "Please paste at least a few sentences").max(40000),
      title: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    if (!lovableKey) throw new Error("AI is not configured");

    const gateway = createLovableAiGatewayProvider(lovableKey);

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      experimental_output: Output.object({ schema: NoteAnalysisSchema }),
      system:
        "You are StudySpark's note-processing tutor. Analyze the student's notes and produce a clear summary, key points, and flashcards that help them remember the material.",
      prompt: `Process these notes:\n\n${data.sourceText}`,
    });

    const analysis = experimental_output;

    const { data: row, error } = await context.supabase
      .from("notes")
      .insert({
        user_id: context.userId,
        title: data.title || analysis.title,
        source_text: data.sourceText,
        summary: analysis.summary,
        key_points: analysis.keyPoints as never,
        flashcards: analysis.flashcards as never,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
