import { describe, expect, it } from "vitest";
import {
  importSpecifiers,
  localImports,
  readRepoFile,
  repoFiles,
  SOURCE_FILE,
} from "./helpers/repo-files";

// Template-only (X-01 design §4.1): deleted when a project is created from the template. In a
// project, code outside these paths may import the chat on purpose, such as a renderer or a
// measurement that reads the shell.
//
// It proves the removal recipe of a non-chat project (X-01 design §5): deleting the chat paths
// and the @ai-sdk/react package leaves no import pointing at them, except from app/page.tsx,
// which the recipe replaces.

/** Step 1 of the recipe: what a non-chat project deletes. A trailing slash marks a folder. */
const CHAT_PATHS = [
  "components/chat/",
  "components/app-chat.tsx",
  "hooks/use-stick-to-bottom.ts",
  "hooks/use-stick-to-bottom.test.ts",
  "lib/chat/",
  "app/api/chat/",
  "components/ui/alert.tsx",
  "components/ui/textarea.tsx",
  "tests/api-chat-route.test.ts",
  "tests/helpers/sse.ts",
  "tests/vercel-config.test.ts",
  "e2e/helpers/chat.ts",
  "e2e/helpers/fixtures.ts",
];
/** Also step 1: e2e/chat*.spec.ts. */
const CHAT_SPEC = /^e2e\/chat[^/]*\.spec\.ts$/;
/** Step 4 replaces the page, the one file outside the chat paths that renders the chat. */
const REPLACED_BY_THE_RECIPE = ["app/page.tsx"];
/** Step 2 removes the package. */
const CHAT_PACKAGE = "@ai-sdk/react";

function isChatPath(file: string): boolean {
  return (
    CHAT_SPEC.test(file) ||
    CHAT_PATHS.some((entry) => (entry.endsWith("/") ? file.startsWith(entry) : file === entry))
  );
}

const files = repoFiles();
const keptSources = files.filter(
  (file) =>
    SOURCE_FILE.test(file) &&
    !file.startsWith("docs/") &&
    !isChatPath(file) &&
    !REPLACED_BY_THE_RECIPE.includes(file),
);

describe("chat boundary", () => {
  it("every path the recipe deletes exists, so the list keeps up with renames", () => {
    const missing = CHAT_PATHS.filter((entry) =>
      entry.endsWith("/") ? !files.some((file) => file.startsWith(entry)) : !files.includes(entry),
    );
    expect(missing).toEqual([]);
    expect(files.filter((file) => CHAT_SPEC.test(file))).toEqual(
      expect.arrayContaining(["e2e/chat.spec.ts", "e2e/chat-i18n.spec.ts"]),
    );
  });

  it("the page is the one file outside the chat paths that imports them", () => {
    expect(localImports("app/page.tsx")).toContain("components/app-chat.tsx");
    // What stays after the recipe (X-01 design §5), so an empty list cannot pass by accident.
    expect(keptSources).toEqual(
      expect.arrayContaining([
        "components/site-header.tsx",
        "lib/i18n/locale.ts",
        "lib/ai/mock.ts",
        "e2e/i18n.spec.ts",
      ]),
    );
    const intoChat = keptSources.flatMap((file) =>
      localImports(file)
        .filter(isChatPath)
        .map((target) => `${file} imports ${target}`),
    );
    expect(intoChat).toEqual([]);
  });

  it(`nothing outside the chat paths and the page imports ${CHAT_PACKAGE}, which the recipe removes`, () => {
    const users = keptSources.filter((file) =>
      importSpecifiers(readRepoFile(file)).some(
        (specifier) => specifier === CHAT_PACKAGE || specifier.startsWith(`${CHAT_PACKAGE}/`),
      ),
    );
    expect(users).toEqual([]);
  });
});

// The commands a project author runs verbatim: template spec §9 step 1 (the import) and step
// 6b.1 (the chat's removal), read out of the spec's bash blocks.
const TEMPLATE_SPEC = "docs/specs/2026-09-25-ai-portfolio-template-design.md";

/** The ```bash blocks of a Markdown text, in order. */
function bashBlocks(markdown: string): string[] {
  return [...markdown.matchAll(/^[ \t]*```bash\n([\s\S]*?)^[ \t]*```[ \t]*$/gm)].map(
    (match) => match[1],
  );
}

/** What the `rm` commands of a bash block name, with backslash continuations joined. */
function rmOperands(block: string): string[] {
  return block
    .replace(/\\\n/g, " ")
    .split(/\n|&&|;/)
    .map((command) => command.trim().split(/\s+/))
    .filter((words) => words[0] === "rm")
    .flatMap((words) => words.slice(1).filter((word) => !word.startsWith("-")));
}

/** The repo files an operand names: a file, a folder (trailing slash) or a `*` glob. */
function namedFiles(operand: string): string[] {
  if (operand.includes("*")) {
    const escaped = operand.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"));
    const glob = new RegExp(`^${escaped.join("[^/]*")}$`);
    return files.filter((file) => glob.test(file));
  }
  if (operand.endsWith("/")) return files.filter((file) => file.startsWith(operand));
  return files.filter((file) => file === operand);
}

const spec = readRepoFile(TEMPLATE_SPEC);
const section9 = spec.slice(spec.indexOf("\n## 9. "), spec.indexOf("\n## 10. "));
const importStep = rmOperands(bashBlocks(section9)[0] ?? "");
const removalStep = rmOperands(bashBlocks(section9.slice(section9.indexOf("**6b.")))[0] ?? "");

describe("the rm commands of template spec §9", () => {
  it.each([
    ["step 1", importStep],
    ["step 6b.1", removalStep],
  ])("every path %s names exists, so rm exits 0", (_, operands) => {
    expect(operands.length).toBeGreaterThan(0);
    expect(operands.filter((operand) => namedFiles(operand).length === 0)).toEqual([]);
  });

  it("step 1 deletes every file under docs/, so a new template doc joins its list", () => {
    const deleted = importStep.flatMap(namedFiles);
    expect(files.filter((file) => file.startsWith("docs/") && !deleted.includes(file))).toEqual([]);
  });

  it("step 6b.1 deletes exactly the chat paths this test guards", () => {
    const expand = (entries: string[]) => [...new Set(entries.flatMap(namedFiles))].sort();
    expect(expand(removalStep)).toEqual(files.filter(isChatPath));
    expect(removalStep.filter((operand) => !operand.includes("*")).sort()).toEqual(
      [...CHAT_PATHS].sort(),
    );
  });
});
