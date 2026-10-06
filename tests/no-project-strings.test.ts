import { describe, expect, it } from "vitest";
import { readRepoFile, repoFiles } from "./helpers/repo-files";

// Template-only (X-01 design §4.1): deleted when a project is created from the template, which
// may then name the projects it builds on.
//
// The chat shell came from the first two projects, streaming-chat and rag-citations
// (X-01 design §4.2), and the app shell, the trace and the eval core from the third,
// support-assistant (template spec §15). None of their product or feature text may ship in the
// template (X-01 design §6, §9; template spec §7.2). The match is case-sensitive, so ordinary
// words such as "streaming", "store" or "customer" stay usable. The list holds product and
// feature strings only, never personal data.
const PROJECT_STRINGS = [
  // Product names and repo slugs.
  "Streaming Chat",
  "RAG with Citations",
  "streaming-chat",
  "rag-citations",
  // The first project's time-to-first-token caption and its empty state.
  "First token",
  "Primeiro token",
  "data-ttft-ms",
  "Watch an answer stream in",
  "Veja a resposta chegar em tempo real",
  // The second project's corpus, citations and refusals.
  "AI SDK Core",
  "lib/rag/",
  "data-citation",
  "data-refusal",
  "quotes verified",
  "citações verificadas",
  // The third project's slug, and the brand of its fictional store, which also names the store
  // and its products.
  "support-assistant",
  "Acme",
  // Its help center, in both languages and as a path, and its "try as a customer" drawer.
  "Help Center",
  "Central de Ajuda",
  "help-center",
  "Try as a customer",
  "Experimente como cliente",
  // Its own folders and components; the pieces the template took have neutral names.
  "components/desk/",
  "components/inbox/",
  "components/support/",
  "components/try/",
  "lib/inbox/",
  "lib/store/",
  "lib/support/",
  "DeskShell",
  "TryDrawer",
  "PersonaPicker",
  // Its tools, the hand-off card's names, and its eval unit, the ticket (the template's is a case).
  "listMyOrders",
  "getOrder",
  "handOff",
  "HandOff",
  "data-hand-off",
  "ticket",
  "Ticket",
];

function projectStrings(text: string): string[] {
  return PROJECT_STRINGS.filter((string) => text.includes(string));
}

// Every file of the repo outside docs/ (the specs name the projects on purpose), but this one.
const scanned = repoFiles().filter(
  (file) => !file.startsWith("docs/") && file !== "tests/no-project-strings.test.ts",
);

describe("no project strings", () => {
  it("the match is case-sensitive", () => {
    expect(projectStrings("Explain streaming in one paragraph; stream chat.")).toEqual([]);
    expect(projectStrings("a Streaming Chat demo")).toEqual(["Streaming Chat"]);
  });

  it("the list holds the third project's names, paths and features, but not its ordinary words", () => {
    expect(projectStrings("the support-assistant repo of Acme Outfitters")).toEqual([
      "support-assistant",
      "Acme",
    ]);
    expect(
      projectStrings('import { DeskShell } from "@/components/desk/desk-shell"; // Help Center'),
    ).toEqual(["Help Center", "components/desk/", "DeskShell"]);
    expect(projectStrings("tool.getOrder, handOff and the eval tickets")).toEqual([
      "getOrder",
      "handOff",
      "ticket",
    ]);
    // A customer, a store, a persona and a hand-off are ordinary words, and personal holds one.
    expect(
      projectStrings(
        "The rate-limit store keeps no personal data; a customer asks for a hand-off.",
      ),
    ).toEqual([]);
  });

  it("the scan reads the code, the configuration and the README, but not docs/ or this file", () => {
    expect(scanned).toEqual(
      expect.arrayContaining([
        "README.md",
        "package.json",
        ".github/workflows/ci.yml",
        "components/chat/chat.tsx",
        "e2e/chat.spec.ts",
      ]),
    );
    expect(scanned.filter((file) => file.startsWith("docs/"))).toEqual([]);
  });

  it("no file outside docs/ holds a product or feature string of the projects the shell came from", () => {
    const found = scanned.flatMap((file) => {
      const text = readRepoFile(file);
      // Binary files, such as the favicon, hold no text to check.
      if (text.includes("\0")) return [];
      return projectStrings(text).map((string) => `${file}: "${string}"`);
    });
    expect(found).toEqual([]);
  });
});
