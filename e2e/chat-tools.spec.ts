import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  answerText,
  assistantBubbles,
  composer,
  conversation,
  fulfillSse,
  postedBody,
  sendText,
  sse,
  stoppedRow,
  waitForAnswers,
} from "./helpers/chat";
import {
  CHAT_PATH,
  FULL_DEFAULT_ANSWER,
  TOOL_ANSWER,
  TOOL_INPUT_TEXT,
  TOOL_LABEL_EN,
  TOOL_LABEL_PT,
  TOOL_NAME,
  TOOL_OUTPUT_TEXT,
  TOOL_PROMPT,
} from "./helpers/fixtures";
import { expectNoEnglish, expectPortuguese, MIN_TARGET_PX } from "./helpers/i18n";

// A tool call in the chat (template spec §5.10): the production build in mock mode, where a
// message that names an item makes the mock call the project's tool, then answer from its result
// (lib/ai/mock-scenarios.ts). The default renderer shows the call as a chip after the answer's
// text. The project's tool, its labels and its answer come from helpers/fixtures.ts.

// Shell text (lib/i18n/shell-messages.ts), re-declared as literals so that a rewording fails
// here instead of moving with the dictionary.
const INPUT_EN = "Input";
const OUTPUT_EN = "Output";
const INPUT_PT = "Entrada";
const OUTPUT_PT = "Saída";

const chipOf = (bubble: Locator) => bubble.locator(`[data-tool="${TOOL_NAME}"]`);

/**
 * Asks the tool question with Enter, so it reads no label of either language, and waits for its
 * answer: one bubble, and aria-busy false once the answer has finished streaming.
 */
async function askWithTool(page: Page): Promise<Locator> {
  await composer(page).fill(TOOL_PROMPT);
  await composer(page).press("Enter");
  await expect(assistantBubbles(page)).toHaveCount(1);
  await expect(conversation(page)).toHaveAttribute("aria-busy", "false", { timeout: 20_000 });
  return assistantBubbles(page);
}

test("a tool call shows as a chip after the answer, with its input and output a click away", async ({
  page,
}) => {
  await page.goto(CHAT_PATH);
  const bubble = await askWithTool(page);

  await expect(answerText(bubble)).toHaveText(TOOL_ANSWER);
  const chip = chipOf(bubble);
  await expect(chip).toHaveAttribute("data-tool-state", "done");
  const trigger = chip.getByRole("button");
  await expect(trigger).toHaveText(TOOL_LABEL_EN);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  // The renderer contract: the text first, the caption (Regenerate) last; the chips between.
  const children = bubble.locator(":scope > *");
  await expect(children).toHaveCount(3);
  await expect(children.nth(1).locator(`[data-tool="${TOOL_NAME}"]`)).toHaveCount(1);
  await expect(children.nth(2).getByRole("button", { name: "Regenerate" })).toBeVisible();

  await expect(chip.getByText(TOOL_INPUT_TEXT)).not.toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(chip.getByText(INPUT_EN, { exact: true })).toBeVisible();
  await expect(chip.getByText(OUTPUT_EN, { exact: true })).toBeVisible();
  await expect(chip.getByText(TOOL_INPUT_TEXT)).toBeVisible();
  await expect(chip.getByText(TOOL_OUTPUT_TEXT)).toBeVisible();

  await trigger.click();
  await expect(chip.getByText(TOOL_INPUT_TEXT)).not.toBeVisible();
});

// Chat's default hasContent counts a tool call (template spec §5.8): an answer that is only a
// tool call still shows, with its chip and Regenerate, where text alone would leave it hidden.
test("an answer that is only a tool call still shows, with its chip", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    fulfillSse(
      route,
      sse([
        { type: "start" },
        { type: "start-step" },
        {
          type: "tool-input-available",
          toolCallId: "call-1",
          toolName: TOOL_NAME,
          input: { itemId: "ITM-0042" },
        },
        { type: "tool-output-available", toolCallId: "call-1", output: { found: true } },
        { type: "finish-step" },
        { type: "finish", finishReason: "tool-calls" },
      ]),
    ),
  );
  await page.goto(CHAT_PATH);
  const bubble = await askWithTool(page);

  await expect(answerText(bubble)).toHaveText("");
  await expect(chipOf(bubble)).toHaveAttribute("data-tool-state", "done");
  await expect(bubble.getByRole("button", { name: "Regenerate" })).toBeVisible();
  await expect(stoppedRow(page)).toHaveCount(0);
});

// The route sends the model the text of earlier answers only (template spec §5.8, step 3), so a
// history that holds a tool call is posted, accepted and answered like any other.
test("a follow-up after a tool answer posts the call in the history and gets its answer", async ({
  page,
}) => {
  await page.goto(CHAT_PATH);
  await askWithTool(page);

  const body = await postedBody(page, () => sendText(page, "Thanks. Anything else?"));
  const earlier = body.messages[1];
  expect(earlier.role).toBe("assistant");
  expect(earlier.parts.some((part) => part.type === `tool-${TOOL_NAME}`)).toBe(true);

  await waitForAnswers(page, 2);
  await expect(answerText(assistantBubbles(page).nth(1))).toHaveText(FULL_DEFAULT_ANSWER);
  await expect(chipOf(assistantBubbles(page).nth(0))).toHaveCount(1);
  await expect(chipOf(assistantBubbles(page).nth(1))).toHaveCount(0);
});

test("in Portuguese the chip's label and headings are Portuguese, and the tool's data stays English", async ({
  page,
}) => {
  await page.goto(`${CHAT_PATH}?lang=pt-BR`);
  await expectPortuguese(page);
  const bubble = await askWithTool(page);

  const chip = chipOf(bubble);
  const trigger = chip.getByRole("button");
  await expect(trigger).toHaveText(TOOL_LABEL_PT);
  await trigger.click();
  await expect(chip.getByText(INPUT_PT, { exact: true })).toBeVisible();
  await expect(chip.getByText(OUTPUT_PT, { exact: true })).toBeVisible();
  await expect(chip.locator('pre[lang="en"]')).toHaveCount(2);
  await expectNoEnglish(page);
});

test.describe("a phone at 375×812 with touch", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });

  test("the chip is a 44 px target, and its open data never scrolls the page sideways", async ({
    page,
  }) => {
    await page.goto(CHAT_PATH);
    const bubble = await askWithTool(page);

    const trigger = chipOf(bubble).getByRole("button");
    const box = await trigger.boundingBox();
    expect(box?.height, "height of the chip").toBeGreaterThanOrEqual(MIN_TARGET_PX);

    await trigger.tap();
    await expect(chipOf(bubble).getByText(TOOL_OUTPUT_TEXT)).toBeVisible();
    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  });
});
