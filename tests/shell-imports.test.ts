import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CHAT_SHELL_FILES,
  I18N_SHELL_FILES,
  MOCK_SHELL_FILES,
  ROOT,
  TRACE_SHELL_FILES,
  importSpecifiers,
  isShellFile,
  localImports,
  repoFiles,
  SOURCE_FILE,
} from "./helpers/repo-files";

// The shell's imports (X-01 design §4.1, §6). A project edits its own files freely and leaves
// the shell alone, so the shell may reach only the shell, the shadcn/ui primitives and lib/utils,
// and the project files whose names and exports every project keeps. This test travels with the
// shell: it holds in any project that has not edited the shell.

/**
 * The project-owned modules the shell may import (X-01 design §6): the identity, the chat's
 * limits, the dictionary, and the mock's cues and answers (MOCK_SCENARIOS, template spec §5.2).
 */
const PROJECT_MODULES_THE_SHELL_READS = [
  "lib/project.ts",
  "lib/chat/limits.ts",
  "lib/i18n/messages.ts",
  "lib/ai/mock-scenarios.ts",
];

/** Template files that are neither shell nor project: the shadcn/ui primitives and cn(). */
function isTemplateBase(file: string): boolean {
  return file.startsWith("components/ui/") || file === "lib/utils.ts";
}

const files = repoFiles();
const shellFiles = files.filter((file) => SOURCE_FILE.test(file) && isShellFile(file));

describe("import reading", () => {
  it("reads import statements, not text that looks like one", () => {
    const source = [
      '// Mirrors lib/chat/config.ts; import { X } from "@/lib/chat/config" would break §5.',
      'const note = "from @/lib/chat/limits";',
      'import type { A } from "./a";',
      'import "./side-effect";',
      'export { B } from "@/lib/b";',
      'const lazy = () => import("../c");',
    ].join("\n");
    expect(importSpecifiers(source)).toEqual(["./a", "./side-effect", "@/lib/b", "../c"]);
  });

  // Files that stay after the removal recipe, so this holds in every project.
  it("resolves the @/ alias and relative paths to repo files, and leaves packages out", () => {
    expect(localImports("lib/i18n/shell-messages.ts")).toEqual(["lib/i18n/locale.ts"]);
    expect(localImports("components/footer.tsx")).toEqual([
      "components/i18n/locale-provider.tsx",
      "lib/project.ts",
    ]);
  });
});

describe("shell imports", () => {
  it("the shell files are all present: i18n, the mock and the trace always, the chat while it stays", () => {
    // The removal recipe of a non-chat project deletes components/chat/ with the rest of the chat
    // (X-01 design §5); the i18n part, the mock model and the trace stay in every project.
    const keepsChat = existsSync(path.join(ROOT, "components/chat"));
    const expected = [
      ...I18N_SHELL_FILES,
      ...MOCK_SHELL_FILES,
      ...TRACE_SHELL_FILES,
      ...(keepsChat ? CHAT_SHELL_FILES : []),
    ];
    expect(expected.filter((file) => !files.includes(file))).toEqual([]);
    expect(shellFiles).toEqual(expect.arrayContaining(expected));
  });

  it("shell files import no project module but the ones every project keeps", () => {
    const outside = shellFiles.flatMap((file) =>
      localImports(file)
        .filter(
          (target) =>
            !isShellFile(target) &&
            !isTemplateBase(target) &&
            !PROJECT_MODULES_THE_SHELL_READS.includes(target),
        )
        .map((target) => `${file} imports ${target}`),
    );
    expect(outside).toEqual([]);
  });

  it("nothing in lib/ai/ imports lib/chat/, so the mock model survives the removal recipe", () => {
    const aiFiles = files.filter((file) => file.startsWith("lib/ai/") && SOURCE_FILE.test(file));
    expect(aiFiles).toContain("lib/ai/mock.ts");
    const intoChat = aiFiles.flatMap((file) =>
      localImports(file)
        .filter((target) => target.startsWith("lib/chat/"))
        .map((target) => `${file} imports ${target}`),
    );
    expect(intoChat).toEqual([]);
  });
});
