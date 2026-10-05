import type { UIMessage } from "ai";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { messages, toolLabel } from "@/lib/i18n/messages";
import { toolViewsOf } from "@/lib/trace/tool-view";
import { renderPlainText } from "./plain-text-message";

// Chat's default renderer (template spec §5.8, §5.10): the answer's text, then a chip for each
// tool call, then the caption. Vitest runs in node with no DOM (template spec §7.2), so this reads
// the server render. The chip's label is the project's, computed through its toolLabel.

const CAPTION = createElement("p", { "data-caption": "" });

function render(message: UIMessage): string {
  return renderToStaticMarkup(
    createElement(
      LocaleProvider,
      null,
      renderPlainText(message, { streaming: false, caption: CAPTION }),
    ),
  );
}

const ROOT = '<div data-message-role="assistant" class="flex flex-col gap-2">';
const TEXT = '<div class="whitespace-pre-wrap wrap-anywhere">';
const CHIPS = '<ul class="flex flex-col gap-1.5">';
const CAPTION_END = '<p data-caption=""></p></div>';

const toolPart = {
  type: "tool-sampleTool",
  toolCallId: "call-1",
  state: "output-available",
  input: { itemId: "ITM-0042" },
  output: { found: true },
};

describe("renderPlainText", () => {
  it("shows an answer with no tool call as its text, then the caption", () => {
    const markup = render({
      id: "a",
      role: "assistant",
      parts: [{ type: "step-start" }, { type: "text", text: "Hello there." }],
    });
    expect(markup).toBe(`${ROOT}${TEXT}Hello there.</div>${CAPTION_END}`);
  });

  it("shows a chip for each tool call between the text and the caption", () => {
    const message = {
      id: "a",
      role: "assistant",
      parts: [
        { type: "step-start" },
        toolPart,
        { type: "step-start" },
        { type: "text", text: "Item ITM-0042 is available." },
      ],
    } as unknown as UIMessage;
    const markup = render(message);
    expect(markup.startsWith(`${ROOT}${TEXT}Item ITM-0042 is available.</div>${CHIPS}`)).toBe(true);
    expect(markup.endsWith(`</ul>${CAPTION_END}`)).toBe(true);
    expect(markup.match(/data-tool="\w+"/g)).toEqual(['data-tool="sampleTool"']);
    expect(markup).toContain(toolLabel(toolViewsOf(message)[0], messages.en));
  });

  // While the tool runs there is no text yet: the text slot stays first, empty.
  it("keeps the empty text first for an answer that is only a tool call so far", () => {
    const message = {
      id: "a",
      role: "assistant",
      parts: [{ type: "step-start" }, { ...toolPart, state: "input-available", output: undefined }],
    } as unknown as UIMessage;
    const markup = render(message);
    expect(markup.startsWith(`${ROOT}${TEXT}</div>${CHIPS}`)).toBe(true);
    expect(markup).toContain('data-tool-state="running"');
  });
});
