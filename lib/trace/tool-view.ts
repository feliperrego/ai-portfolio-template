import {
  type DynamicToolUIPart,
  getToolName,
  isToolUIPart,
  type ToolUIPart,
  type UIMessage,
} from "ai";

/**
 * One tool call as the screens show it (template spec §5.10): a chip in the conversation and a
 * row of the trace. The live chat reads it from a message's tool parts; an eval run records the
 * same view for each call, so a recorded answer shows what a live one shows. Pure and
 * client-safe.
 */

/**
 * Where a call stands. "awaiting-approval" waits for the visitor's answer; "denied" is final: the
 * tool never ran, so the call never shows as running.
 */
export type ToolState = "running" | "awaiting-approval" | "done" | "error" | "denied";

export type ToolView = {
  id: string;
  name: string;
  /** The input as far as it has streamed. */
  input: unknown;
  /** The tool's output, once it has one. */
  output?: unknown;
  /** The tool's error, when it failed. */
  error?: string;
  state: ToolState;
};

/** One tool part as a view: the SDK's seven states folded into the five the screens name. */
function toolViewOf(part: ToolUIPart | DynamicToolUIPart): ToolView {
  const base = { id: part.toolCallId, name: getToolName(part), input: part.input };
  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return { ...base, state: "running" };
    case "approval-requested":
      return { ...base, state: "awaiting-approval" };
    // The visitor answered; the server has not yet run the tool or recorded the refusal.
    case "approval-responded":
      return { ...base, state: part.approval.approved ? "running" : "denied" };
    // A preliminary output is a streaming tool's partial result: the call is still running.
    case "output-available":
      return { ...base, output: part.output, state: part.preliminary ? "running" : "done" };
    case "output-error":
      return { ...base, error: part.errorText, state: "error" };
    case "output-denied":
      return { ...base, state: "denied" };
  }
}

/** The tool calls of a message, in order. */
export function toolViewsOf(message: UIMessage): ToolView[] {
  return message.parts.flatMap((part) => (isToolUIPart(part) ? [toolViewOf(part)] : []));
}

/** A string field of a tool's input or output, or undefined. */
export function stringField(value: unknown, key: string): string | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field : undefined;
}
