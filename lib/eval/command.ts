import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { LanguageModel } from "ai";
import { assertSafeToWrite, measurementPath } from "@/lib/measure/record";
import { CASES_PATH, frozenCaseSetHash, readCaseSet } from "./cases";
import { mockRunChanges } from "./check";
import { readmeLines } from "./readme";
import {
  EVAL_METRIC,
  type EvalCase,
  type EvalProject,
  type EvalRun,
  MOCK_RUN_PATH,
  type TracedResult,
} from "./record";
import { runEval } from "./run";
import { summarizeResults } from "./summary";

/**
 * What `pnpm eval` does (template spec §5.11), with its inputs passed in, so each rule it keeps is
 * tested: scripts/eval.ts loads .env.local and the model, then calls evalCommand. Every check that
 * can fail is made before any case is asked: the frozen set's SHA-256, --check in mock mode only,
 * the committed mock run for --check, and no good real run of the same day to overwrite. A real
 * run writes measurements/eval-YYYY-MM-DD.json; one that stops early writes its own .aborted.json
 * and fails (lib/measure/record.ts). Shell-owned. Server-only.
 */

export const CHECK_FLAG = "--check";

/** True for `pnpm eval --check`; any other argument is refused, so a typo never re-records. */
export function checkRequested(args: readonly string[]): boolean {
  const unknown = args.filter((arg) => arg !== CHECK_FLAG && arg !== "--");
  if (unknown.length > 0) {
    throw new Error(`Unknown argument: ${unknown.join(" ")}. The only one is ${CHECK_FLAG}.`);
  }
  return args.includes(CHECK_FLAG);
}

export type EvalCommandOptions<Case extends EvalCase, Result extends TracedResult, Extra> = {
  /** `--check`: run the mock and compare it with MOCK_RUN_PATH, writing nothing. */
  check: boolean;
  /** lib/ai/model.ts IS_MOCK and MODEL_LABEL. */
  mock: boolean;
  modelLabel: string;
  /** The model every case runs against, made once the frozen set is checked. */
  model: () => LanguageModel;
  /** The project's part (lib/eval/project.ts EVAL_PROJECT). */
  project: EvalProject<Case, Result, Extra>;
  /** The repo, where measurements/ is. */
  root?: string;
  /** The commit a real run runs at, and whether the working tree has changes. */
  commit?: () => { sha: string; dirty: boolean };
  /** The run's start. */
  now?: () => Date;
  log?: (line: string) => void;
};

/** The commit at HEAD, and whether the tree has changes other than the mock run's own file. */
function gitCommit(root: string): { sha: string; dirty: boolean } {
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  return {
    sha: git("rev-parse", "HEAD"),
    dirty: git("status", "--porcelain", "--", ".", `:(exclude)${MOCK_RUN_PATH}`) !== "",
  };
}

export async function evalCommand<Case extends EvalCase, Result extends TracedResult, Extra>({
  check,
  mock,
  modelLabel,
  model,
  project,
  root = process.cwd(),
  commit = () => gitCommit(root),
  now = () => new Date(),
  log = console.log,
}: EvalCommandOptions<Case, Result, Extra>): Promise<void> {
  const write = (file: string, run: EvalRun<Result, Extra>) =>
    writeFileSync(path.join(root, file), `${JSON.stringify(run, null, 2)}\n`);

  if (check && !mock) {
    throw new Error(`${CHECK_FLAG} compares a mock run with ${MOCK_RUN_PATH}: set AI_MOCK=1.`);
  }
  // The committed mock run, read before the run, so a missing file fails at no cost.
  const committedRun = check
    ? (JSON.parse(readFileSync(path.join(root, MOCK_RUN_PATH), "utf8")) as EvalRun)
    : null;

  const sha256 = frozenCaseSetHash(root);
  const set = readCaseSet<Case>(root);
  const runModel = model();

  const date = now().toISOString();
  const file = mock ? MOCK_RUN_PATH : measurementPath(EVAL_METRIC, { date, aborted: false });
  // Checked before any request is spent (template spec §7.5).
  if (!mock) assertSafeToWrite(file, false, existsSync(path.join(root, file)));

  const mode = check ? "mock check" : "mock";
  log(`Mode:    ${mock ? `${mode}: no model call, no cost` : `real: ${modelLabel}`}`);
  log(`Cases:   ${set.cases.length} from ${CASES_PATH} (frozen ${set.frozenOn})`);
  const { results, abortReason } = await runEval({
    cases: set.cases,
    model: runModel,
    runCase: project.runCase,
    score: project.score,
    onResult: ({ id, pass, label, latencyMs }) =>
      log(
        `  ${id} ${pass ? "pass" : "FAIL"}  ${label === undefined ? "" : `${label}  `}${latencyMs} ms`,
      ),
  });

  const aborted = abortReason !== null;
  const run: EvalRun<Result, Extra> = {
    date,
    aborted,
    abortReason,
    mock,
    model: modelLabel,
    // A mock run records no commit, so it never goes stale when only the commit changes.
    commit: mock ? null : commit(),
    caseSet: { path: CASES_PATH, sha256, frozenOn: set.frozenOn, n: set.cases.length },
    results,
    summary: aborted ? null : summarizeResults(results),
    ...(project.extra === undefined ? {} : { extra: project.extra(results) }),
  };

  if (aborted) {
    const abortedFile = measurementPath(EVAL_METRIC, { date, aborted: true });
    if (!mock) write(abortedFile, run);
    throw new Error(`The run stopped: ${abortReason}.${mock ? "" : ` Wrote ${abortedFile}.`}`);
  }

  const { summary } = run;
  const passed = `Passed:  ${summary!.passed} of ${summary!.cases}`;
  if (committedRun !== null) {
    const changes = mockRunChanges(committedRun, run, project.volatileKeys);
    if (changes.length > 0) {
      throw new Error(
        `This mock run differs from ${MOCK_RUN_PATH}:\n` +
          changes.map((change) => `  ${change}\n`).join("") +
          `If the change is intended, rerun AI_MOCK=1 pnpm eval and commit ${MOCK_RUN_PATH}.`,
      );
    }
    log(`
${passed}
Checked: every case's answer and score equal ${MOCK_RUN_PATH}'s. Nothing written.`);
    return;
  }

  write(file, run);
  const lines = readmeLines(run, file, project.headline);
  log(`
${passed}
Wrote:   ${file}
${mock ? "\nMock run: the lines below only show the format. Never paste them into the README.\n" : ""}
README line 1:
${lines.title}

First line of "How it's measured":
${lines.howMeasured}`);
}
