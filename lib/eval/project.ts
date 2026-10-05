import { isStepCount, type LanguageModel, streamText, toUIMessageStream, type UIMessage } from "ai";
import { MAX_OUTPUT_TOKENS, MAX_STEPS } from "@/lib/ai/limits";
import { TOOLS } from "@/lib/tools";
import { toolViewsOf } from "@/lib/trace/tool-view";
import { type Check, traceMetadataOf, traceMetadataOnFinish } from "@/lib/trace/trace";
import type { CaseOutcome, EvalCase, EvalProject, Score, TracedResult } from "./record";
import { collectUIMessage } from "./run";

/**
 * The project's eval (template spec §5.11): its cases, how one runs, how its answer scores, and
 * README line 1's sentence. Project-owned: a project replaces the sample with its own cases
 * (measurements/cases.json, frozen before its first run), its runCase and its scorer, and keeps
 * the EVAL_PROJECT export, which `pnpm eval` reads (scripts/eval.ts). Server-only.
 *
 * The template's eval is a sample to replace: three cases asked once each to the model with the
 * sample tool of lib/tools.ts, scored by the tools the answer called and the phrases its reply
 * holds. A chat project runs each case through its chat's own pipeline instead (its instructions,
 * tools and limits), so the eval measures what a visitor gets. The sample calls the model
 * directly, with no import from lib/chat/, so it survives the removal recipe of a project without
 * a chat (template spec §9 step 6b).
 */

export type SampleCase = EvalCase & {
  /** The case's one user message. */
  message: string;
  /** A correct answer calls exactly these tools, in order, and its reply holds every phrase. */
  expected: { tools: string[]; replyMentions: string[] };
};

/** What the run records of one answer. */
export type SampleResult = TracedResult & {
  message: string;
  /** All the answer's text, every step's a blank line apart. */
  reply: string;
  finishReason: string | null;
};

/** The checks every answer is scored by, in order: the screens label each one. */
export const CHECK_IDS = ["tool-calls", "reply-mentions"] as const;
export type CheckId = (typeof CHECK_IDS)[number];

function check(id: CheckId, ok: boolean, detail: string[]): Check {
  return ok || detail.length === 0 ? { id, ok } : { id, ok, detail };
}

function replyOf(message: UIMessage): string {
  return message.parts.flatMap((part) => (part.type === "text" ? [part.text] : [])).join("\n\n");
}

async function runCase(
  evalCase: SampleCase,
  { model }: { model: LanguageModel },
): Promise<CaseOutcome<SampleResult>> {
  const result = streamText({
    model,
    messages: [{ role: "user", content: evalCase.message }],
    tools: TOOLS,
    stopWhen: isStepCount(MAX_STEPS),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    reasoning: "none",
    // The failure reaches the run through the stream's error chunk (collectUIMessage).
    onError: () => {},
  });
  const outcome = await collectUIMessage(
    toUIMessageStream({
      stream: result.stream,
      tools: TOOLS,
      // The answer's tokens, as the trace reads them (template spec §5.10).
      messageMetadata: traceMetadataOnFinish(performance.now()),
      // The script's operator reads the model's own error; no visitor sees it.
      onError: (error) => (error instanceof Error ? error.message : String(error)),
      sendReasoning: false,
    }),
  );
  if ("abortReason" in outcome) return outcome;
  const { message, finishReason } = outcome;
  return {
    result: {
      message: evalCase.message,
      reply: replyOf(message),
      toolCalls: toolViewsOf(message),
      usage: traceMetadataOf(message).usage,
      finishReason,
    },
  };
}

function score({ expected }: SampleCase, { reply, toolCalls }: SampleResult): Score {
  const called = toolCalls.map(({ name }) => name);
  const toolsOk =
    called.length === expected.tools.length &&
    called.every((name, i) => name === expected.tools[i]);
  const missing = expected.replyMentions.filter(
    (phrase) => !reply.toLowerCase().includes(phrase.toLowerCase()),
  );
  const checks = [
    check("tool-calls", toolsOk, called),
    check("reply-mentions", missing.length === 0, missing),
  ];
  const pass = checks.every(({ ok }) => ok);
  return { pass, tally: { passed: pass ? 1 : 0, total: 1 }, checks };
}

export const EVAL_PROJECT: EvalProject<SampleCase, SampleResult> = {
  runCase,
  score,
  headline: ({ rate, cases }) => `${rate}% of ${cases} frozen sample cases passed`,
  // Nothing in a mock answer of the sample changes from run to run.
  volatileKeys: [],
};
