import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { EVAL_METRIC, type EvalRun, MEASUREMENTS_DIR, type TracedResult } from "./record";

/**
 * The eval run the screens show (template spec §5.11): the newest finished real run, or the mock
 * run while none exists, labelled with its date, model and commit either way. Shell-owned.
 * Server-only: it reads measurements/ at build time, so a page passes its client components the
 * run as data.
 */

/**
 * The run file to show among the file names of measurements/: the newest
 * <metric>-YYYY-MM-DD.json (lib/measure/record.ts), else <metric>-mock.json. Pure.
 */
export function pickRunFile(files: readonly string[], metric: string = EVAL_METRIC): string {
  const name = metric.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const finished = new RegExp(`^${name}-\\d{4}-\\d{2}-\\d{2}\\.json$`);
  const newest = files
    .filter((file) => finished.test(file))
    .sort()
    .at(-1);
  return `${MEASUREMENTS_DIR}/${newest ?? `${metric}-mock.json`}`;
}

/**
 * The shown run and its path in the repo, read from disk; `root` is the repo. A run without a
 * summary (an aborted one) is never shown.
 */
export function readShownRun<Result extends TracedResult = TracedResult, Extra = unknown>({
  root = process.cwd(),
  metric = EVAL_METRIC,
}: { root?: string; metric?: string } = {}): { file: string; run: EvalRun<Result, Extra> } {
  const file = pickRunFile(readdirSync(path.join(root, MEASUREMENTS_DIR)), metric);
  const run = JSON.parse(readFileSync(path.join(root, file), "utf8")) as EvalRun<Result, Extra>;
  if (run.aborted || run.summary === null) {
    throw new Error(`${file} is not a finished run: the screens show finished runs only.`);
  }
  return { file, run };
}

/** What the screens say about the run: its date (ISO 8601), model, short commit, and mode. */
export type RunLabel = {
  date: string;
  model: string;
  /** Null for a mock run, which records no commit. */
  commit: string | null;
  /** The working tree had changes when the run ran. */
  dirty: boolean;
  /** A mock run: never a measurement. */
  mock: boolean;
};

export function runLabel(run: EvalRun): RunLabel {
  return {
    date: run.date,
    model: run.model,
    commit: run.commit?.sha.slice(0, 7) ?? null,
    dirty: run.commit?.dirty ?? false,
    mock: run.mock,
  };
}
