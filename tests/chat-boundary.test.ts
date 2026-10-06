import { describe, expect, it } from "vitest";
import {
  importSpecifiers,
  isShellFile,
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
// which the recipe deletes for a home page in the app shell (template spec §9 step 6b). It also checks that the owner table of template spec §5.8 names the
// files the code's lists hold (below).

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
/** Step 4 deletes the page, the one file outside the chat paths that renders the chat. */
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
        "lib/trace/tool-view.ts",
        "components/trace/tool-call.tsx",
        "lib/eval/command.ts",
        "lib/eval/project.ts",
        "scripts/eval.ts",
        "lib/site-header.ts",
        "components/app-shell/app-shell.tsx",
        "components/evals/evals-view.tsx",
        "app/(shell)/layout.tsx",
        "app/(shell)/evals/[case]/page.tsx",
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

/** The `rm` commands of a bash block, with backslash continuations joined: flags and operands. */
function rmCommands(block: string): { flags: string[]; operands: string[] }[] {
  return block
    .replace(/\\\n/g, " ")
    .split(/\n|&&|;/)
    .map((command) => command.trim().split(/\s+/))
    .filter((words) => words[0] === "rm")
    .map((words) => ({
      flags: words.slice(1).filter((word) => word.startsWith("-")),
      operands: words.slice(1).filter((word) => !word.startsWith("-")),
    }));
}

/** What the `rm` commands of a bash block name. */
function rmOperands(block: string): string[] {
  return rmCommands(block).flatMap((command) => command.operands);
}

/** -r, -R, or a bundle that holds one (-rf, -fr), or --recursive. */
const RECURSIVE_FLAG = /^(?:-[A-Za-z]*[rR][A-Za-z]*|--recursive)$/;

/** A folder: named with a trailing slash, or a path the repo has files under. */
function isFolder(operand: string): boolean {
  return operand.endsWith("/") || files.some((file) => file.startsWith(`${operand}/`));
}

/** The folders that `rm` commands without -r name: rm refuses them and exits non-zero. */
function foldersWithoutRecursive(block: string): string[] {
  return rmCommands(block)
    .filter(({ flags }) => !flags.some((flag) => RECURSIVE_FLAG.test(flag)))
    .flatMap(({ operands }) => operands.filter(isFolder));
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
const importBlock = bashBlocks(section9)[0] ?? "";
const removalBlock = bashBlocks(section9.slice(section9.indexOf("**6b.")))[0] ?? "";
const importStep = rmOperands(importBlock);
const removalStep = rmOperands(removalBlock);
/** Step 6b.4's: the page it replaces. */
const pageBlock = bashBlocks(section9.slice(section9.indexOf("**6b.")))[1] ?? "";

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

  it.each([
    ["step 1", importBlock],
    ["step 6b.1", removalBlock],
  ])("every folder %s names is removed with rm -r, which rm needs for a folder", (_, block) => {
    expect(foldersWithoutRecursive(block)).toEqual([]);
  });

  it("a lost -r is caught, whatever form the flag takes", () => {
    expect(foldersWithoutRecursive(removalBlock.replace("rm -r ", "rm "))).toEqual([
      "components/chat/",
      "lib/chat/",
      "app/api/chat/",
    ]);
    // A folder named without its trailing slash is still a folder.
    expect(foldersWithoutRecursive("rm -f components/chat x.ts && rm lib/chat/ y.ts")).toEqual([
      "components/chat",
      "lib/chat/",
    ]);
    expect(
      foldersWithoutRecursive("rm -rf a/\nrm -fr b/; rm -R c/ && rm --recursive d/\nrm x.ts"),
    ).toEqual([]);
  });

  it("step 6b.4 deletes the page, the one file outside the chat paths that imports them", () => {
    expect(rmOperands(pageBlock)).toEqual(REPLACED_BY_THE_RECIPE);
    expect(foldersWithoutRecursive(pageBlock)).toEqual([]);
  });

  it("step 6b.1 deletes exactly the chat paths this test guards", () => {
    const expand = (entries: string[]) => [...new Set(entries.flatMap(namedFiles))].sort();
    expect(expand(removalStep)).toEqual(files.filter(isChatPath));
    expect(removalStep.filter((operand) => !operand.includes("*")).sort()).toEqual(
      [...CHAT_PATHS].sort(),
    );
  });
});

// The owner table of template spec §5.8 and the lists in code name the same files: the shell's
// in tests/helpers/repo-files.ts, which the travelling guards read, and the template's own in
// step 1's rm command.

/** What a row of the owner table names: paths, as `a/**`, `a/` or a file, and files excepted. */
type OwnerRow = { paths: string[]; except: string[] };

/** `lib/{a, b}.ts` is lib/a.ts and lib/b.ts. */
function expandBraces(pattern: string): string[] {
  const match = /\{([^}]*)\}/.exec(pattern);
  if (match === null) return [pattern];
  const before = pattern.slice(0, match.index);
  const after = pattern.slice(match.index + match[0].length);
  return match[1].split(",").flatMap((choice) => expandBraces(before + choice.trim() + after));
}

/**
 * The paths the Files cell of an owner's row names, in order: each code span that holds a "/" or
 * a ".", so the `name` of "the `package.json` `name`" is a word, with its braces expanded; and the
 * files that "but `x` and its test" excepts.
 */
function ownerRow(markdown: string, owner: string): OwnerRow {
  const row = markdown.split("\n").find((line) => line.startsWith(`| ${owner} |`)) ?? "";
  const cell = row.split("|")[2] ?? "";
  const except: string[] = [];
  const included = cell.replace(/ but `([^`]+)` and its test/g, (_, file: string) => {
    except.push(file, file.replace(/\.([cm]?[jt]sx?)$/, ".test.$1"));
    return "";
  });
  const paths = [...included.matchAll(/`([^`]+)`/g)]
    .map((match) => match[1])
    .filter((span) => /[./]/.test(span))
    .flatMap(expandBraces);
  return { paths, except };
}

/** The files a row names, in the order of `among`. */
function rowFiles(row: OwnerRow, among: string[]): string[] {
  const named = (file: string) =>
    row.paths.some((entry) =>
      entry.endsWith("/**")
        ? file.startsWith(entry.slice(0, -2))
        : entry.endsWith("/")
          ? file.startsWith(entry)
          : file === entry,
    );
  return among.filter((file) => named(file) && !row.except.includes(file));
}

const section58 = spec.slice(spec.indexOf("\n### 5.8 "), spec.indexOf("\n### 5.9 "));
const shellRow = ownerRow(section58, "Shell");
const projectRow = ownerRow(section58, "Project");
const templateOnlyRow = ownerRow(section58, "Template only");

describe("the owner table of template spec §5.8", () => {
  it("reads a row's paths: folders, braces, and an exception with its test", () => {
    const row = ownerRow(
      [
        "| Owner | Files | Rule |",
        "|---|---|---|",
        "| Shell | `a/**`, `lib/{x, y}.ts`, `lib/e/**` but `lib/e/p.ts` and its test, `n.ts` | r |",
        "| Project | the `package.json` `name`, `.prettierignore`, `docs/` (prose) | r |",
      ].join("\n"),
      "Shell",
    );
    expect(row).toEqual({
      paths: ["a/**", "lib/x.ts", "lib/y.ts", "lib/e/**", "n.ts"],
      except: ["lib/e/p.ts", "lib/e/p.test.ts"],
    });
    expect(
      ownerRow("| Project | the `package.json` `name`, `.prettierignore`, `docs/` |", "Project"),
    ).toEqual({ paths: ["package.json", ".prettierignore", "docs/"], except: [] });
    expect(
      rowFiles(row, ["a/b.tsx", "lib/x.ts", "lib/e/p.ts", "lib/e/p.test.ts", "lib/e/q.ts", "m.ts"]),
    ).toEqual(["a/b.tsx", "lib/x.ts", "lib/e/q.ts"]);
  });

  it("every path a row names exists, so the table keeps up with renames", () => {
    for (const row of [shellRow, projectRow, templateOnlyRow]) {
      expect(row.paths.length).toBeGreaterThan(0);
      expect(
        row.paths.filter((entry) => rowFiles({ paths: [entry], except: [] }, files).length === 0),
      ).toEqual([]);
    }
  });

  it("the Shell row names exactly the files the shell's lists hold", () => {
    expect(rowFiles(shellRow, files)).toEqual(files.filter(isShellFile));
  });

  it("the Project row names no shell file", () => {
    expect(rowFiles(projectRow, files).filter(isShellFile)).toEqual([]);
  });

  // A test of a project file is the project's, as its file is (template spec §5.8): the Project
  // row names it too, so a project that replaces a file knows its test goes with it.
  it("the Project row names the test beside each file it names", () => {
    const named = rowFiles(projectRow, files);
    const testsBeside = named
      .map((file) => file.replace(/\.([cm]?[jt]sx?)$/, ".test.$1"))
      .filter((test) => files.includes(test) && !named.includes(test));
    expect(named).toEqual(expect.arrayContaining(["lib/tools.ts", "lib/eval/project.ts"]));
    expect(testsBeside).toEqual([]);
  });

  it("the Template only row names exactly what step 1 deletes", () => {
    expect(rowFiles(templateOnlyRow, files)).toEqual(
      [...new Set(importStep.flatMap(namedFiles))].sort(),
    );
  });
});
