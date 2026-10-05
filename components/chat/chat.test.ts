import type { UIMessage } from "ai";
import { createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Chat, type ChatProps } from "@/components/chat/chat";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { shellMessages } from "@/lib/i18n/shell-messages";

// Chat's header seam (template spec §5.8). Vitest runs in node with no DOM (template spec §7.2),
// so these tests read the server render, the English prerender of the page: what Chat puts above
// the conversation, not what a click does.

const PROPS: ChatProps<UIMessage> = {
  modelLabel: "mock",
  isMock: true,
  commit: "local",
  rateLimitPerHour: 20,
  empty: { title: "Empty title", groups: [{ prompts: ["A prompt"] }] },
};

const NEW_CHAT = shellMessages.en.header.newChat;

function render(header?: ChatProps<UIMessage>["header"]): string {
  return renderToStaticMarkup(
    createElement(LocaleProvider, null, createElement(Chat, { ...PROPS, header })),
  );
}

/** How many times the visible New chat label appears. */
function newChatLabels(markup: string): number {
  return markup.split(`>${NEW_CHAT}</span>`).length - 1;
}

describe("Chat's header", () => {
  it("by default is the site header, with New chat among its actions", () => {
    const markup = render();
    const header = markup.match(/<header[^>]*>[\s\S]*?<\/header>/)?.[0] ?? "";
    expect(header).toContain('data-model="mock"');
    expect(header).toContain('data-commit="local"');
    expect(header).toMatch(new RegExp(`<button[^>]*>[\\s\\S]*>${NEW_CHAT}</span></button>`));
    expect(newChatLabels(markup)).toBe(1);
  });

  it("a header prop replaces the site header and receives the New chat button", () => {
    let received: ReactNode = null;
    const markup = render((newChat) => {
      received = newChat;
      return createElement("div", { "data-panel-bar": "" }, newChat);
    });

    // No site header: a chat in a panel leaves the page's one header[data-model] alone.
    expect(markup).not.toContain("<header");
    expect(markup).not.toContain("data-model");

    // The bar holds the same button Chat would put in the site header, before the conversation.
    expect(isValidElement(received)).toBe(true);
    const button = renderToStaticMarkup(received);
    expect(button).toMatch(new RegExp(`^<button[^>]*>[\\s\\S]*>${NEW_CHAT}</span></button>$`));
    expect(markup).toContain(`<div data-panel-bar="">${button}</div>`);
    expect(markup.indexOf("data-panel-bar")).toBeLessThan(markup.indexOf("<main"));
    expect(newChatLabels(markup)).toBe(1);

    // It is New chat itself, with its handler, not a copy of its label.
    expect(typeof (received as unknown as ReactElement<{ onClick?: unknown }>).props.onClick).toBe(
      "function",
    );
  });
});
