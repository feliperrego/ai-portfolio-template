import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { messages, toolLabel } from "@/lib/i18n/messages";
import { shellMessages } from "@/lib/i18n/shell-messages";
import type { ToolState, ToolView } from "@/lib/trace/tool-view";
import type { Check } from "@/lib/trace/trace";
import { ChecksBlock, ToolCallsBlock, UsageBlock, VerdictBadge } from "./blocks";
import { JsonBlock, ToolCall, ToolCallData, ToolCallList } from "./tool-call";

// The tool chip and the trace blocks (template spec §5.10). Vitest runs in node with no DOM
// (template spec §7.2), so these tests read the server render, the English prerender: what each
// part shows, not what a click does. A tool's label comes from the project's toolLabel, so the
// expected label is computed through it, never written here.

const T = shellMessages.en;

function render(element: ReactElement): string {
  return renderToStaticMarkup(createElement(LocaleProvider, null, element));
}

/** The text of a markup, tags dropped and entities of the JSON blocks decoded. */
function text(markup: string): string {
  return markup
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}

function view(state: ToolState, fields: Partial<ToolView> = {}): ToolView {
  return { id: "call-1", name: "sampleTool", input: { itemId: "ITM-0042" }, state, ...fields };
}

const DONE = view("done", { output: { found: true, item: { name: "Brass desk lamp" } } });

describe("ToolCall", () => {
  it("shows the project's label for the call, with the data attributes the e2e reads", () => {
    const markup = render(createElement(ToolCall, { view: DONE }));
    expect(markup).toContain('data-tool="sampleTool"');
    expect(markup).toContain('data-tool-state="done"');
    expect(text(markup)).toContain(toolLabel(DONE, messages.en));
  });

  it.each([
    ["running", T.toolCall.running],
    ["awaiting-approval", T.toolCall.awaitingApproval],
    ["error", T.toolCall.failed],
    ["denied", T.toolCall.denied],
  ] as const)("says a %s call's state next to its label", (state, words) => {
    const markup = render(createElement(ToolCall, { view: view(state) }));
    expect(markup).toContain(`data-tool-state="${state}"`);
    expect(text(markup)).toContain(words);
  });

  it("says nothing more for a finished call", () => {
    const shown = text(render(createElement(ToolCall, { view: DONE })));
    for (const words of [
      T.toolCall.running,
      T.toolCall.awaitingApproval,
      T.toolCall.failed,
      T.toolCall.denied,
    ]) {
      expect(shown).not.toContain(words);
    }
  });

  it("spins only while a call runs", () => {
    expect(render(createElement(ToolCall, { view: view("running") }))).toContain("animate-spin");
    for (const state of ["awaiting-approval", "done", "error", "denied"] as const) {
      expect(render(createElement(ToolCall, { view: view(state) }))).not.toContain("animate-spin");
    }
  });

  it("starts closed: its input and output show only once it is opened", () => {
    const shown = text(render(createElement(ToolCall, { view: DONE })));
    expect(shown).not.toContain(T.toolCall.input);
    expect(shown).not.toContain("Brass desk lamp");
  });

  it("is a button that grows to a 44 px target on a touch screen", () => {
    expect(render(createElement(ToolCall, { view: DONE }))).toMatch(
      /<button[^>]*class="[^"]*pointer-coarse:min-h-11/,
    );
  });
});

describe("ToolCallData", () => {
  it("shows the input, then the output of a finished call", () => {
    const shown = text(render(createElement(ToolCallData, { view: DONE })));
    expect(shown.indexOf(T.toolCall.input)).toBeLessThan(shown.indexOf(T.toolCall.output));
    expect(shown).toContain('"itemId": "ITM-0042"');
    expect(shown).toContain('"name": "Brass desk lamp"');
    expect(shown).not.toContain(T.toolCall.error);
  });

  it("shows the input, then the error of a failed call", () => {
    const failed = view("error", { error: "The item service is down." });
    const shown = text(render(createElement(ToolCallData, { view: failed })));
    expect(shown).toContain(T.toolCall.error);
    expect(shown).toContain('"The item service is down."');
    expect(shown).not.toContain(T.toolCall.output);
  });

  it.each(["running", "awaiting-approval", "denied"] as const)(
    "shows only the input of a %s call",
    (state) => {
      const shown = text(render(createElement(ToolCallData, { view: view(state) })));
      expect(shown).toContain('"itemId": "ITM-0042"');
      expect(shown).not.toContain(T.toolCall.output);
      expect(shown).not.toContain(T.toolCall.error);
    },
  );

  it("shows an input that has not streamed yet as an empty object", () => {
    const shown = text(
      render(createElement(ToolCallData, { view: view("running", { input: undefined }) })),
    );
    expect(shown).toContain("{}");
  });
});

describe("JsonBlock", () => {
  // Tools return data in English; the pt-BR scan of the e2e skips what is marked lang="en".
  it("prints the value as indented JSON, marked as English", () => {
    const markup = render(createElement(JsonBlock, { value: { a: [1, "two"] } }));
    expect(markup).toMatch(/^<pre lang="en"/);
    expect(text(markup)).toBe('{\n  "a": [\n    1,\n    "two"\n  ]\n}');
  });
});

describe("ToolCallList", () => {
  it("lists one chip per call, in order", () => {
    const markup = render(
      createElement(ToolCallList, {
        views: [DONE, view("running", { id: "call-2", name: "otherTool" })],
      }),
    );
    expect(markup).toMatch(/^<ul/);
    expect(markup.match(/data-tool="(\w+)"/g)).toEqual([
      'data-tool="sampleTool"',
      'data-tool="otherTool"',
    ]);
  });
});

describe("UsageBlock", () => {
  it("shows the tokens and the latency, in the interface language's number format", () => {
    const markup = render(
      createElement(UsageBlock, {
        usage: { inputTokens: 1200, outputTokens: 80, totalTokens: 1280 },
        latencyMs: 1834,
      }),
    );
    expect(markup).toContain('data-testid="usage"');
    const shown = text(markup);
    expect(shown).toContain(T.trace.usage);
    expect(shown).toContain(`${T.trace.inputTokens}1,200`);
    expect(shown).toContain(`${T.trace.outputTokens}80`);
    expect(shown).toContain(`${T.trace.totalTokens}1,280`);
    expect(shown).toContain(`${T.trace.latency}1.8 s`);
  });

  it("says a count or a latency nobody reported is not reported", () => {
    const partial = text(
      render(
        createElement(UsageBlock, {
          usage: { inputTokens: null, outputTokens: 80, totalTokens: null },
          latencyMs: null,
        }),
      ),
    );
    expect(partial).toContain(`${T.trace.inputTokens}${T.trace.notReported}`);
    expect(partial).toContain(`${T.trace.latency}${T.trace.notReported}`);
    const none = text(render(createElement(UsageBlock, { usage: null, latencyMs: null })));
    expect(none.split(T.trace.notReported)).toHaveLength(5);
  });
});

describe("ToolCallsBlock", () => {
  it("says so when no tool was called", () => {
    const shown = text(render(createElement(ToolCallsBlock, { calls: [] })));
    expect(shown).toContain(T.trace.toolCalls);
    expect(shown).toContain(T.trace.noToolCalls);
  });

  it("shows a chip for each call", () => {
    const markup = render(createElement(ToolCallsBlock, { calls: [DONE] }));
    expect(markup).toContain('data-tool="sampleTool"');
    expect(text(markup)).not.toContain(T.trace.noToolCalls);
  });
});

describe("ChecksBlock", () => {
  const checks: Check[] = [
    { id: "called-the-tool", ok: true },
    { id: "named-the-item", ok: false, detail: ["ITM-0042", "Brass desk lamp"] },
  ];
  const checkLabel = (id: string) => `Label of ${id}`;

  it("shows the verdict, then each check with its project label and its state for screen readers", () => {
    const markup = render(createElement(ChecksBlock, { pass: false, checks, checkLabel }));
    expect(markup).toContain('data-verdict="fail"');
    expect(markup).toContain('data-testid="checks"');
    expect(markup).toMatch(/data-check="called-the-tool" data-ok="true"/);
    expect(markup).toMatch(/data-check="named-the-item" data-ok="false"/);
    const shown = text(markup);
    expect(shown).toContain(T.trace.result);
    expect(shown).toContain(T.trace.why);
    expect(shown).toContain(`Label of called-the-tool ${T.trace.checkHolds}`);
    expect(shown).toContain(`Label of named-the-item ${T.trace.checkFails}`);
    expect(markup).toMatch(/class="sr-only">\(holds\)</);
  });

  // A failure's data is data, in English: the pt-BR scan skips it.
  it("shows a failed check's detail as data marked English", () => {
    const markup = render(createElement(ChecksBlock, { pass: false, checks, checkLabel }));
    expect(markup).toMatch(
      /<span lang="en"[^>]*><code[^>]*>ITM-0042<\/code><code[^>]*>Brass desk lamp<\/code><\/span>/,
    );
  });
});

describe("VerdictBadge", () => {
  it("says passed or failed, with the attribute the e2e reads", () => {
    const pass = render(createElement(VerdictBadge, { pass: true }));
    const fail = render(createElement(VerdictBadge, { pass: false }));
    expect(pass).toContain('data-verdict="pass"');
    expect(text(pass)).toBe(T.trace.pass);
    expect(fail).toContain('data-verdict="fail"');
    expect(text(fail)).toBe(T.trace.fail);
  });
});
