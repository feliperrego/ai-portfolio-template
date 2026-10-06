import { EvalsView } from "@/components/evals/evals-view";
import { EVALS_PAGE, type SampleResult } from "@/lib/eval/project";
import { readShownRun } from "@/lib/eval/runs";
import { evalsView } from "@/lib/eval/view";

/**
 * The Evals page (template spec §5.12): the shown run, read from measurements/ at build time, with
 * the project's words and links (EVALS_PAGE). Project-owned.
 */
export default function Evals() {
  return <EvalsView data={evalsView(readShownRun<SampleResult>(), EVALS_PAGE)} />;
}
