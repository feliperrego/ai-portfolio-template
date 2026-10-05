import { describe, expect, it } from "vitest";
import { isShellFile, readRepoFile, repoFiles, SOURCE_FILE } from "./helpers/repo-files";

// Template-only (X-01 design §4.1): deleted when a project is created from the template, where
// code may cite the project's own decisions.
//
// Comments cite sections, never decision or proposal ids (X-01 design §4.2): ids cannot be told
// apart by shape, since two specs can each have a T-19, and an unnamed "spec §N" would point at
// the wrong document. The shell files are the design's scope (X-01 design §6); the id and
// project-spec checks also run over the rest of the template's code, which the same rule covers.

// A decision or proposal id of a spec: R-07, S-17, T-19, D-S-22, D-chat-2 (X-01 design §6), and
// the shapes the template spec itself uses: D-sec1, U-P1, V-P7, W-01, DR1. The designs' own items
// count too: X-01's questions and proposals ("X-01 P7", "X-01 Q5", matched before the bare
// "X-01" can be) and X-02's proposals (X2-01). Of the two-letter shapes only DR1 is an id, so
// ES6 or MP4 pass.
const DECISION_ID =
  /\b(?:X-01 [PQ]\d+|X\d-\d+|[A-Z](?:-[A-Za-z]+)?-\d+|[A-Z]-[A-Za-z]+\d+|DR\d+)\b/g;
// The ids code may name: the designs the shell comes from.
const ALLOWED_IDS = ["X-01", "X-02"];
// A project's own spec, which a template file must not cite: "#1 spec", "P1 spec", a delta spec.
const PROJECT_SPEC = /[Dd]elta spec|#\d+ spec|\bP\d+ spec/g;
// In a shell file every section names its document: "template spec §5.6", "X-01 design §4.3",
// "X-02 design §2.6".
const UNNAMED_SECTION = /(?<!template )spec §|(?<!X-0[12] )design §/g;

function decisionIds(text: string): string[] {
  return [...text.matchAll(DECISION_ID)]
    .map((match) => match[0])
    .filter((id) => !ALLOWED_IDS.includes(id));
}

function findings(file: string, checks: { name: string; find: (text: string) => string[] }[]) {
  const text = readRepoFile(file);
  return checks.flatMap(({ name, find }) =>
    find(text).map((found) => `${file}: ${name} "${found}"`),
  );
}

const ID_AND_SPEC_CHECKS = [
  { name: "decision id", find: decisionIds },
  { name: "project spec", find: (text: string) => text.match(PROJECT_SPEC) ?? [] },
];
const SECTION_CHECK = {
  name: "section without its document",
  find: (text: string) => text.match(UNNAMED_SECTION) ?? [],
};

const code = repoFiles().filter(
  (file) =>
    SOURCE_FILE.test(file) &&
    !file.startsWith("docs/") &&
    // This file names what it looks for.
    file !== "tests/shell-comments.test.ts",
);
const shellFiles = code.filter(isShellFile);
const otherCode = code.filter((file) => !isShellFile(file));

describe("the patterns", () => {
  it.each([
    "R-07",
    "S-17",
    "T-19",
    "U-01",
    "W-01",
    "D-S-22",
    "D-chat-2",
    "D-sec1",
    "U-P1",
    "V-P7",
    "DR1",
    "DR12",
    // The designs' own items: X-01's questions and proposals, X-02's proposals.
    "X-01 P7",
    "X-01 Q5",
    "X2-01",
    "X2-29",
  ])("%s is a decision id", (id) => {
    expect(decisionIds(`as ${id} says`)).toEqual([id]);
  });

  it.each([
    "X-01",
    "X-02",
    "UTF-8",
    "h-11",
    "min-w-11",
    "ES2022",
    "ES6",
    "MP4",
    "P16",
    "X-01 design",
  ])("%s is not flagged", (text) => {
    expect(decisionIds(`as ${text} says`)).toEqual([]);
  });

  it("a section cited with its document passes; one without it, or with a project's spec, does not", () => {
    const cited = "(template spec §5.6, §7.5; X-01 design §4.3; X-02 design §2.6)";
    expect(cited.match(UNNAMED_SECTION)).toBeNull();
    expect("(spec §9)".match(UNNAMED_SECTION)).toEqual(["spec §"]);
    expect("(design §2)".match(UNNAMED_SECTION)).toEqual(["design §"]);
    expect("(X-03 design §1)".match(UNNAMED_SECTION)).toEqual(["design §"]);
    expect("#1 spec §3.3 and the Delta spec".match(PROJECT_SPEC)).toEqual([
      "#1 spec",
      "Delta spec",
    ]);
    expect("as P1 spec §1 item 4 and P12 spec say".match(PROJECT_SPEC)).toEqual([
      "P1 spec",
      "P12 spec",
    ]);
    // Case-sensitive (X-01 design §6): a sentence may start with "Delta", but "DELTA SPEC"
    // or "#1 SPEC" is not how a comment cites a spec.
    expect("the DELTA SPEC and #2 SPEC".match(PROJECT_SPEC)).toBeNull();
  });
});

describe("comments", () => {
  it("shell files cite no decision id and no project spec, and name the document of each section", () => {
    expect(shellFiles).toEqual(
      expect.arrayContaining([
        "components/site-header.tsx",
        "lib/i18n/locale.ts",
        "lib/ai/mock.ts",
      ]),
    );
    const found = shellFiles.flatMap((file) =>
      findings(file, [...ID_AND_SPEC_CHECKS, SECTION_CHECK]),
    );
    expect(found).toEqual([]);
  });

  it("the rest of the template's code cites no decision id and no project spec either", () => {
    expect(otherCode).toEqual(
      expect.arrayContaining(["app/api/chat/route.ts", "e2e/chat.spec.ts", "lib/ai/model.ts"]),
    );
    const found = otherCode.flatMap((file) => findings(file, ID_AND_SPEC_CHECKS));
    expect(found).toEqual([]);
  });
});
