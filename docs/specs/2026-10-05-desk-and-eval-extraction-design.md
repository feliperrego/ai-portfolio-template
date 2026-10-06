# X-02: the desk shell, trace and eval core move into the template — design

- **Status:** approved by Felipe on 2026-10-05 ("ok para todos"): X2-01 to X2-29 of §8. The `[P]` tags stay as a record; later documents cite these items as `[D: X2-nn]`.
- **What it carries out:** "Between P1 and P2, a short step X-02 moves into the template the shared shell P1 builds: the app shell, the chat in a panel, tool parts in the history, the trace panel and the Evals page" [D: Q7, 2026-10-01; `portfolio/ROADMAP.md` line 52]. Trigger: P1 went live on 2026-10-05 [F: ROADMAP, P1 row].
- **Sources:** read-only maps of this template at `27e6957`, of P1 (`support-assistant`, `git diff 765172c..5c0e893`) and of what P2–P4 need, plus a survey of triggers and a completeness critic (2026-10-05). P2–P4 have no spec yet, so their needs are read from their ROADMAP rows.
- **Ids:** proposals are X2-01 and up (X-01's P1–P23 would clash with the project names); the amendment to the template spec takes W-01 and up.

| Tag | Meaning |
|---|---|
| `[F]` | Read in a file or in git; the source is named. |
| `[D]` | Decided by Felipe; the reference is named. |
| `[P]` | My proposal, not yet confirmed. |

## 1. Goal and done [P]

P2 starts from a template that already has, all running in mock mode with no API key: an app shell with nav, header actions and a banner; a `Chat` that can sit in a panel; tool calls rendered as chips; a trace (tool calls, tokens, latency, checks); an Evals page and a per-case page over a committed sample run; and an eval core (`pnpm eval`, `pnpm eval --check` in CI). A project fills in a small set of project-owned files: nav and brand, its cases, its `runCase` and scorer, its headline sentence, its tool labels and its mock cues.

Principle: move only what P1 proved and P2 needs on its first day. P1 is the only reference, so every generic seam is a guess; a shape with one user waits for an "X-03" after P2 ships (X2-06).

Done when:
1. `main` holds every piece of §2, and lint, typecheck, test, `eval --check`, build and e2e pass, with CI inside the 10-minute budget [D: X-01 P20] (last measured 4:43 [F: template spec §14]).
2. The removal recipe (template spec §9 step 6b) keeps working, checked by one dry run in a scratch copy, as X-01 did.
3. Every pending item of template spec §14 whose trigger was P1's design has a verdict (§2.8).
4. The template spec, ROADMAP and `.env.example` agree with the code (§7).

Size: 1 to 1.5 agent days [P: estimate].

## 2. What moves

### 2.0 Ownership [P: X2-21]

- **Shell-owned, new:** `components/app-shell/**`, `components/trace/**`, `components/evals/**`, `lib/trace/**`, `lib/eval/**` except `lib/eval/project.ts`, `scripts/eval.ts`, `lib/i18n/display.ts`, `lib/ai/mock-steps.ts`; and `lib/ai/mock.ts`, which has no class today [F: template spec §5.8 table].
- **Project-owned, new:** `lib/eval/project.ts`, `lib/ai/limits.ts`, `lib/ai/mock-scenarios.ts` (P1 rewrote it, +271/−13 [F]), `app/(shell)/layout.tsx`, `app/(shell)/evals/page.tsx`, `app/(shell)/evals/[case]/page.tsx`, `measurements/{cases.json, cases.sha256, eval-mock.json}`, `.prettierignore`.
- **Template-only:** this spec (and a plan, if one is written), added to the `rm` list of §9 step 1, which `tests/chat-boundary.test.ts` requires [F].
- The lists in code follow: `tests/helpers/repo-files.ts` gains the new shell list, and `tests/shell-imports.test.ts` gains the two new project modules the shell reads.

### 2.1 Chat in a panel: one seam [P: X2-10, X2-11]

P1 changed one shell-owned file only, `components/chat/chat.tsx` (+31/−17, commit `08d5ee3`): a `header?: (newChat: ReactNode) => ReactNode` prop, so the chat can sit in a drawer with its own bar [F]. Its body field (`persona`) went through the existing `transport` prop, so it needs no seam [F: P1 `components/app-chat.tsx`].

- The `header` prop joins the template's `Chat` and the §5.8 seam list, with its comment rewritten (P1's cites a P1 spec section, which `tests/shell-comments.test.ts` rejects in shell files [F]).
- `CHAT_PATH` (default `"/"`) goes into the project-owned `e2e/helpers/fixtures.ts`, read by the chat e2e specs: every change P1 made to them [F].
- Stays in P1: the drawer, `/try`, the persona picker.

### 2.2 App shell [P: X2-12]

From P1's `components/desk/desk-shell.tsx` [F]: a sidebar held open from md up, a nav trigger on phones, then the header, the banner, the main area and the footer. Its nav, brand and chat props are P1's.

- `AppShell({ brand, nav, actions?, banner?, children })`, importing nothing from the chat paths (`tests/chat-boundary.test.ts` would fail otherwise [F]).
- A server helper `siteHeaderProps()` for model, mock and commit, written three times today [F].
- The shadcn primitives it uses, with P1's deliberate edits (Sheet `keepMounted`, the sidebar's phone title as props, `use-mobile` on `useSyncExternalStore`) and the English defaults always overridden from the dictionary [F: P1 commit `1658e41`].
- Routes [P: X2-09]: the template's `/` stays the full-page chat, outside the shell; a project-owned `app/(shell)/layout.tsx` wraps `/evals` and `/evals/[case]`.

### 2.3 Tool calls rendered in the history [P: X2-02, X2-13]

"Tool parts in the history" is read as rendering: P1 renders tool calls but sends text-only history to the model [D: P1 P-07].

- `ToolView` and its reducers, the tool chip and the JSON block move to `lib/trace` and `components/trace`, outside the chat paths; `hasTextOrTools` joins `lib/chat/ui.ts` for `Chat`'s `hasContent` seam.
- `ToolView.state` gains `awaiting-approval` and `denied` (the SDK's approval states [F: ai 7.0.114 types]); today they would show as running forever. One record type replaces P1's two.
- A project supplies `toolLabel(view, t)` and picks which tools render as cards. The hand-off card stays in P1; the approval card is P2's.

### 2.4 Limits and mock tool steps [P: X2-14, X2-15]

- `MAX_OUTPUT_TOKENS` and `MAX_STEPS` move to a project-owned `lib/ai/limits.ts`, so a project without chat (step 6b deletes `lib/chat/**`) keeps its cap [F].
- P1's generic mock pieces (tool-call parts, the step machine) go into `lib/ai/mock.ts` and a shell-owned `lib/ai/mock-steps.ts`; cues and answers stay project-owned.

### 2.5 Trace [P: X2-03, X2-16]

From P1's Analysis panel [F]: `TraceMetadata {usage, latencyMs}` and a helper that attaches it on finish; the usage, tool-calls and checks blocks; the verdict badge. The passages block moves with the RAG code at P3 [D: Q6].

Cost (X2-03, Felipe's call): (a) drop "cost" from the trace definition now, tokens per case being the measured stand-in and dollars staying on the Gateway dashboard as in P1 [D: P1 D8]; (b) Gateway-measured cost later, after a runtime check, triggered by P4's router stretch. Recommendation: (a).

### 2.6 Eval core [P: X2-01, X2-17, X2-18, X2-20]

From P1 [F: `scripts/eval.ts`, `lib/eval/*`, `lib/inbox/run.ts`]: the CLI (`--check`, the frozen-set hash checked before any call, `.env.local` loaded first, no overwrite of a good run, an aborted run's own file), the runner that stops at the first case it cannot score, the cluster bootstrap, the run envelope, the mock-run compare, the README lines and the run picker.

- Shell-owned `lib/eval/{record, cases, run, stats, summary, check, runs, readme}.ts` and `scripts/eval.ts`, importing neither `lib/chat` nor `lib/rag`, so the core survives step 6b and serves P3.
- The project module `lib/eval/project.ts` supplies the case type, `runCase(case)`, `score` (`{pass, tally, checks, label?}`, so P3 and P4 can score several units per case), the summary extras, the headline sentence and the keys the mock check ignores.
- Mock runs record no commit sha, or the check ignores it [P: X2-18]: P1 needed four chore commits only to refresh that label [F: `f49dfd6`, `9dc512e`, `b992f62`, `4872023`].
- A project-owned sample replaced at import [P: X2-20]: three neutral cases (one through a sample tool, so the chip and the trace render in CI), its hash and its mock run.
- The rules P1 learned carry over: labels are recorded once and never recomputed by a page; a scorer change ships with a new run; tests over recorded runs pick examples by property, never by case id [F: P1 commits `af52583`, `f231eeb`, `fe1ae94`].

### 2.7 Evals page and per-case page [P: X2-04, X2-19]

- A shell-owned `EvalsView` with fixed sections: the run label, the headline with its 95% CI or the mock statement [D: P1 D9], groups, a per-case table linking through `caseHref(id)`, and run details; one slot for supporting rows. The per-case page renders the trace.
- Mock gate (X2-04, Felipe's call): a mock run shows only the D9 statement and the pass counts, no latency or token figures; the template only ever holds a mock run.
- The outcome matrix stays in P1 until a second project wants one.

### 2.8 Pending items owed since P1's design [P: X2-24]

Template spec §14 gave nine minor findings of the X-01 review the trigger "P1's design … reviews this list" [F: lines 796–805]. P1's design did not review them [F: P1 spec has no record; P1's composer equals the template's]. Corrected here (rule 6). Verdicts: fix findings 1 (cap text hidden by a draft), 2 (Safari IME), 3 (double-click guard vs Stop), 5 (`{"text"}` literals, which lands first so moved code is written to it), 6 (assert `header[data-commit]`), 7 and 8 (guard regexes and `rm -r` flags) and 9 (who owns the chat tests when a seam changes); finding 4 keeps its own trigger, which has not fired (P1 keeps a 1024-token cap [F]).

### 2.9 i18n [P: X2-22]

New top-level shell keys for the moved labels, pinned in both locales; labels for a project's own values (outcomes, checks, tool names) come in as props, so no shell component reads a project key; generic formatters move to a shell-owned `lib/i18n/display.ts`. §5.9 gains the rule that recorded English content carries `lang="en"`, which the pt-BR scan skips [F: P1 `thread.tsx`].

## 3. What does not move, and when it would [P]

| Item | Trigger |
|---|---|
| The drawer, `/try`, the persona picker | P2 copies them from P1; extracted at X-03 if P2 keeps a drawer |
| The approval card and `useChat`'s approval seams | P2 builds them; X-03 extracts them before P4, which reuses them |
| Tool parts in the request history | P2's design |
| The list/detail/aside grid, tabs, recorded-run list and thread, the live per-answer trace, P1's README test | X-03, if P2 uses the same shape |
| The outcome matrix | A second project wants one |
| Timeouts and safe error text out of `lib/chat` | P3 starts (the first run of step 6b) |
| RAG (`lib/rag`, the passages block, the verifier) | P3 starts [D: Q6] |
| Store data and formatters, the hand-off card, the outcome taxonomy, score rules, brand | Never; P2 copies the store from P1 [D: Q4] |
| Gateway-measured cost | X2-03 (b) |

## 4. How the projects take it [P: X2-07]

- **P1:** no code changes, one dated status line in its spec ("X-02 moved these pieces into the template at `<sha>`; this repo keeps its own copies"). Later fixes to the shared pieces reach P1 by hand, only where a visitor can hit them, counted toward the template's sync row [D: V-12].
- **One check in P1 [P: X2-29]:** a drawer closed by an outside click may keep streaming, and a later Esc on the desk would then stop that answer [F: the maps; untested]. One e2e in P1; a fix there only if it reproduces. It is P1's own code, so it does not count toward the sync row.
- **#1 and #2:** nothing changes.
- **P2:** imports at X-02's commit through template spec §9 step 1, and copies the drawer and the store from P1.

## 5. Tests and CI [P: X2-21, X2-23, X2-25, X2-26]

- **Unit (Node):** the stats, the case-set hash check, the runner's stop rule, the mock-run compare, the run picker against a temporary folder, the README lines, the Evals view model with a mock run and a fixture real run (the only coverage of the real branch, since the template only holds a mock run), the tool view with approval states, the trace helper, the mock steps, the display formatters, the new shell keys.
- **Static:** shell-imports with the new lists; a check that client components import node-only modules by type only.
- **E2E:** the chat specs through `CHAT_PATH`; the smoke test asserting `header[data-commit]`; a new `evals.spec.ts` for `/evals` (the mock statement, no rate) and `/evals/[case]` (checks, tool chip, usage); a phone pass at 375 px.
- **Template-only guards:** shell-comments, no-project-strings (adding P1's strings) and chat-boundary extended (§2.8 items 7–8).
- **CI:** `pnpm eval --check` after the tests, as in P1; the time re-measured against the budget.
- **Removal recipe:** step 6b keeps the shell, the Evals pages, the trace and the eval core; its gates add `eval --check`; one dry run in a scratch copy.

## 6. Risks [P]

| Risk | What pins it |
|---|---|
| Generic seams guessed from one project | Move only what P1 proved and P2 needs; X-03 after P2 |
| Scope slips past a "short step" | X2-01 decides the scope; the order of work lands one green commit per step |
| Mock numbers on screen | The mock gate (X2-04) and its e2e |
| The removal recipe breaks for P3 | The core imports neither `lib/chat` nor `lib/rag`; chat-boundary; the dry run |
| P1 strings or comments leak in | The guards are extended, and every moved file's comments are rewritten |
| A `node:fs` module in a client bundle | The static type-only import test |
| A chat panel beside a page's own `<main>` (two landmarks, keys reaching a hidden panel) | Recorded in §5.8 with P2's design as trigger (X2-28) |

## 7. Docs to correct [P: X2-27]

Template spec §14 "Amendment X-02" (W-01 and up); §4 tree; §5.1, §6 and `.env.example` (the OIDC `vercel env pull .env.local` path P1 used); §5.8; §5.9; §7.5, whose browser-measurement wording contradicts the server eval; §9 steps 1, 6 and 6b (Felipe creates the public repo himself, as auto mode blocks the agent [F: P1 spec §7]); the §10 rows P1 answered; ROADMAP line 52 (list the eval core) and the trace definition's "cost".

Order of work [P]: guards and lint fixes; the `header` seam and `CHAT_PATH`; limits and mock steps; trace and tool view; eval core and sample; app shell and Evals pages; i18n; composer fixes; recipe dry run; docs; CI measured. One commit per step, each green.

## 8. Proposals for one answer

Answer format: "todas ok exceto X2-04". X2-01 to X2-08 are your call (scope, what visitors see, process), where my proposals miss more often; the rest are software choices. If X2-01 is a no, X2-17 to X2-20 drop out.

| ID | Proposal |
|---|---|
| X2-01 | (Your call) Scope: the `header` seam, the app shell, the tool chip, the trace blocks, the Evals and per-case pages, and the eval core; ROADMAP line 52 corrected to list the eval core |
| X2-02 | (Your call) "Tool parts in the history" means rendering; tool parts in the request history are P2's design |
| X2-03 | (Your call) Cost: (a) dropped from the trace definition now; (b) Gateway-measured cost later, triggered by P4's router stretch |
| X2-04 | (Your call) A mock run's Evals page shows only the D9 statement and the pass counts |
| X2-05 | (Your call) P2's design chooses the agent panel's container; the drawer, `/try` and the persona picker stay in P1 |
| X2-06 | (Your call) An "X-03" after P2 ships and before P4: approval card and seams, request-history tool parts, grid, tabs, live trace, README test, the drawer if P2 keeps one |
| X2-07 | (Your call) P1, #1 and #2 get no code changes; P1 gets one status line |
| X2-08 | (Your call) S1 applies to X-02: short spec, build, one review, no prototype; the recipe dry run stays |
| X2-09 | The template's `/` stays the full-page chat; the shell's pages are `/evals` and `/evals/[case]` |
| X2-10 | The `header` prop joins the template's `Chat`; body fields use `transport` |
| X2-11 | `CHAT_PATH` read by the chat e2e specs; the smoke test asserts `header[data-commit]` |
| X2-12 | `AppShell` with brand, nav, actions and banner slots, no chat imports; `siteHeaderProps()`; the primitives with P1's edits |
| X2-13 | Tool view, chip and JSON block in `lib/trace`/`components/trace`; approval and denied states; one record type; a project `toolLabel` |
| X2-14 | `MAX_OUTPUT_TOKENS` and `MAX_STEPS` move to project-owned `lib/ai/limits.ts` |
| X2-15 | Mock tool-call parts in `mock.ts`; the step machine in shell-owned `mock-steps.ts`; cues project-owned |
| X2-16 | `TraceMetadata` and its finish helper; usage, tool-calls and checks blocks; the verdict badge |
| X2-17 | The eval core as in §2.6, driven by project-owned `lib/eval/project.ts`, importing neither `lib/chat` nor `lib/rag` |
| X2-18 | Mock runs record no commit sha, or the check ignores it |
| X2-19 | The Evals page frame with fixed sections, a supporting-rows slot and `caseHref`; per-case pages with `dynamicParams = false` |
| X2-20 | A project-owned sample of three neutral cases, one through a sample tool |
| X2-21 | The ownership lists of §2.0 in §5.8 and in `repo-files.ts`; shell-imports extended; the type-only node-import check |
| X2-22 | New shell i18n keys; project labels as props; shell `display.ts`; the `lang="en"` rule |
| X2-23 | The template-only guards extended; moved comments cite "template spec §N" only |
| X2-24 | The verdicts of §2.8: fix findings 1, 2, 3, 5, 6, 7, 8, 9; finding 4 keeps its trigger |
| X2-25 | Step 6b updated for the kept pieces, `eval --check` among its gates, one dry run |
| X2-26 | `pnpm eval --check` in CI; the time re-measured |
| X2-27 | The doc corrections of §7 |
| X2-28 | The known limits of a chat in a panel recorded in §5.8, with P2's design as trigger |
| X2-29 | One e2e in P1 checks whether a closed drawer keeps streaming; a fix in P1 only if it reproduces |

## 9. Results

Recorded, dated, as the work happens.

### Removal dry run (2026-10-05)

X2-25's one dry run of template spec §9 step 6b, run at `e7cb376` on the branch `x02`, after the shell, the trace, the eval core, the Evals pages and the composer fixes had landed [F: the run's logs].

**Copy.** The commit was extracted into a scratch folder outside the worktree, the way template spec §9 step 1 makes a project, as X-01 did (X-01 design §11). `git init` only gives the travelling guards their file list; nothing was committed in the copy. The `rm` commands and the code blocks of steps 6b.3 and 6b.4 were read out of the copy's own spec by a script before step 1 deleted it. Commands, run in the copy:

```bash
git init -q
git -C <template checkout> archive HEAD | tar -x -C .
# §9 step 1: its rm command, as the spec writes it
rm docs/specs/2026-09-25-ai-portfolio-template-design.md docs/plans/2026-09-25-ai-portfolio-template.md \
  docs/specs/2026-09-29-chat-shell-extraction-design.md docs/plans/2026-09-29-chat-shell-extraction.md \
  docs/specs/2026-10-05-desk-and-eval-extraction-design.md \
  tests/chat-boundary.test.ts tests/no-project-strings.test.ts tests/shell-comments.test.ts
pnpm install
# step 6b.1
rm -r components/chat/ components/app-chat.tsx hooks/use-stick-to-bottom.ts \
  hooks/use-stick-to-bottom.test.ts lib/chat/ app/api/chat/ components/ui/alert.tsx \
  components/ui/textarea.tsx tests/api-chat-route.test.ts tests/helpers/sse.ts \
  tests/vercel-config.test.ts e2e/chat*.spec.ts e2e/helpers/chat.ts e2e/helpers/fixtures.ts
# step 6b.2
pnpm remove @ai-sdk/react
printf '{}\n' > vercel.json
# steps 6b.3 and 6b.4: the type of 6b.3's code block, each locale without `empty` and `prompts`,
# and 6b.4's page, applied by the script
# step 6b.5, as CI runs it (.github/workflows/ci.yml, with CI=1 as on GitHub Actions)
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
AI_MOCK=1 pnpm test
AI_MOCK=1 pnpm eval --check
CI=1 AI_MOCK=1 pnpm build
CI=1 AI_MOCK=1 pnpm e2e
```

**Result: green as written; step 6b needs no correction** [F].

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` | exit 0 |
| `pnpm lint` | exit 0 |
| `pnpm typecheck` | exit 0 |
| `AI_MOCK=1 pnpm test` | 37 files, 410 tests passed. The shell and the sample that stay: `lib/eval/*` 108 (view 17, project 15, command 14, stats 13, cases 11, run 8, summary 8, check 7, runs 7, readme 5, mock-run 3), `lib/ai/*` 66 (mock 22, mock-scenarios 19, mock-steps 16, model 7, limits 2), `lib/trace/*` 25, `components/trace/trace` 24, `lib/tools` 9, `lib/site-header` 4, `lib/i18n/*` 93 (locale 74, messages 12, display 5, localized 2), `components/app-shell/nav` 4; and `lib/http` 11, `lib/measure/record` 9, `lib/project` 3, `lib/rate-limit` 16, `tests/client-imports` 4, `tests/eslint-jsx-literals` 11, `tests/eslint-provider-imports` 8, `tests/eval-script` 2, `tests/health-route` 2, `tests/playwright-config` 3, `tests/shell-imports` 8 |
| `AI_MOCK=1 pnpm eval --check` | exit 0: 3 of 3, "Nothing written." |
| `CI=1 AI_MOCK=1 pnpm build` | exit 0, with no build cache: `/` and `/evals` static, `/evals/[case]` prerendered for c01, c02 and c03, `/api/health` dynamic, no `/api/chat` |
| `CI=1 AI_MOCK=1 pnpm e2e` | 26 passed on 1 worker in 5.3 s: `evals.spec.ts` 6, `i18n.spec.ts` 10, `measure-guards.spec.ts` 8, `smoke.spec.ts` 2. The server logged Next's `NoFallbackError` for the 404 test, as in the template (template spec §5.12) |

Also found [F]:
- Before the recipe, the import alone passed lint, typecheck, unit and `eval --check`: 46 files, 556 tests, the 604 of `e7cb376` minus the 48 of the three guards step 1 deletes.
- After step 6b.2, `vercel.json` equals the template's before X-01 (`ca5c9de`). `package.json` differs only by `zod`, `tsx` and the `eval` script; `pnpm-lock.yaml` only by `zod` as a direct dependency (the lockfile already held it), `tsx` and its `esbuild`, and the `vite` and `vitest` entries that name them as peers.
- `tests/shell-imports.test.ts` passes on its no-chat branch, and `tests/client-imports.test.ts` still finds the Evals views.
- A scan of the kept files for the deleted paths found them named only where that is meant: comments saying a file imports nothing of `lib/chat/`, the travelling guards' lists, which handle both branches, the lint tests' example paths, and the lint rule that allows `@ai-sdk/react`. One comment read as if the chat stayed: `lib/ai/limits.ts` said the chat's own limits "stay in" `lib/chat/limits.ts`; it now says that step 6b deletes that file with the chat.
- The non-chat page sits outside the app shell, as DR3 wrote it, while the shell's nav still links to `/` as `site.home`; from `/` a visitor reaches `/evals` only by typing it. A variant that deletes `app/page.tsx` and puts the page in the shell as `app/(shell)/page.tsx` also passed every gate in a second copy (unit 37 files and 410 tests, `eval --check` 3 of 3, build, e2e 26 passed). Whether the recipe should take it is asked of Felipe [P].
