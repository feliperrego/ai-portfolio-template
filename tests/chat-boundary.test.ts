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
