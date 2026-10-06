# AI Portfolio Template — Design

- Status: approved by Felipe on 2026-09-25 ("specs ok, todas ok"). This covers every proposal in the confirmation table (T-01..T-21) and the rest of the document; the `[P]` tags stay in place as a record of what started as a proposal. Cite this approval as **D-spec**.
- Amended: 2026-09-28, by the lessons of projects #1 and #2 (U-01..U-08), approved by Felipe ("todas ok"). Section 13 lists them; each section they changed carries its `[D: U-xx, 2026-09-28]` tag. The proposals the amendment added, U-P1..U-P4, were approved the same day (end of section 13).
- Amended: 2026-09-29, by X-01 (V-01..V-12): the chat shell and i18n of #1 and #2 move into the template. Felipe approved the X-01 design on 2026-09-29 ("todas ok"). Section 14 lists the changes; each section they changed carries its `[D: V-xx, 2026-09-29]` tag. The proposals added while applying it, DR1–DR3 and V-P1..V-P9 (end of section 14), were approved by Felipe on 2026-09-30 ("todas ok").
- Amended: 2026-10-05, by X-02 (W-01..W-13), and on 2026-10-06 by the fixes of its review (W-14..W-17): the app shell, the chat in a panel, tool calls rendered in the history, the trace, the Evals pages and the eval core of P1 (`support-assistant`) move into the template. Felipe approved the X-02 design on 2026-10-05 ("ok para todos"). Section 15 lists the changes; each section they changed carries the tag of the design item it carries out, `[D: X2-nn, 2026-10-05]`. The proposals added while applying it, W-P1..W-P19 (end of section 15), were approved by Felipe on 2026-10-06 ("todas ok") and are tagged `[D: W-Pn, 2026-10-06]` where they appear; W-P20..W-P22 wait for his answer.
- Date: 2026-09-25
- Author: Felipe Rêgo (design drafted with Claude)
- Related: `streaming-chat` spec (project #1), the first project generated from this template; `rag-citations` spec (project #2); `support-assistant` spec (P1), cited as "P1 spec"; the X-01 design, `docs/specs/2026-09-29-chat-shell-extraction-design.md`, cited as "X-01 design"; the X-02 design, `docs/specs/2026-10-05-desk-and-eval-extraction-design.md`, cited as "X-02 design"

## How to read this document

Every claim carries its source:

- `[F]` — fact checked against documentation or package metadata. The source is noted.
- `[D]` — decision already taken by Felipe. The reference points to where.
- `[P]` — proposal not yet confirmed. The `[P]` items that most need Felipe's answer are collected in section 12, those the 2026-09-28 amendment added at the end of section 13, those added while applying X-01 at the end of section 14, and those added while applying X-02 at the end of section 15; the rest are software details, marked `[P]` where they appear.
- `UNVERIFIED` — something to confirm at implementation before relying on it.

Decision references:

- **D-chat-1**: design conversation of 2026-09-24/25. It chose the stack, the repo layout (template + one repo per project), the provider, abuse protection, language, the chat UI approach, and the portfolio list. The list's decisions: many **small** projects, each validating few skills; every project ships a live demo and one measured number; project #1 is the streaming chat, whose number is time to first token; RAG, evals, tools, MCP, prompt-injection tests, routing and observability are separate projects; start with the template and project #1. The list was written down on 2026-09-28 in `portfolio/ROADMAP.md`, in Felipe's workspace, not public; the portfolio grid on feliperrego.com, not built yet, is to be built from it.
- **D-sec1**: approval of "Section 1: the template", 2026-09-25.
- **D-S-xx**: the block approval "todas ok" of items S-01..S-24, 2026-09-25. These were approved for project #1. Wherever this spec lifts one into the template, the lift is `[P]`.
- **#1 API check**: the `[F: v7 check]` pass of the streaming-chat spec, 2026-09-25. It checked the AI SDK docs (context7, ai-sdk.dev) and the `ai@7.0.114` / `@ai-sdk/react@4.0.117` source.
- **U-xx**: Felipe's block approval "todas ok" of 2026-09-28 of the lessons from projects #1 and #2 (section 13). Cited as `[D: U-xx, 2026-09-28]`.
- **X-01**: a decision of the `rag-citations` spec (project #2), 2026-09-28, option (a): when to move the shared chat shell and i18n into the template (section 10). Carried out by the amendment of section 14.
- **V-xx**: the changes of the X-01 design (`docs/specs/2026-09-29-chat-shell-extraction-design.md`), which Felipe approved with "todas ok" on 2026-09-29: its questions Q1–Q7 and proposals P1–P23. The V ids are new; section 14 names the design items each one carries out. Cited as `[D: V-xx, 2026-09-29]`, and a design item as `[D: X-01 Qn]` or `[D: X-01 Pn]`.
- **X2-nn and W-xx**: the X-02 design's proposals X2-01..X2-29, which Felipe approved with "ok para todos" on 2026-10-05, cited as `[D: X2-nn, 2026-10-05]`. The W ids name the changes that carry them out (section 15); they are new, and the sections cite the design items instead. X-02 carries out the ROADMAP's Q7 [D: Q7, 2026-10-01]: the ROADMAP's own ids (Q1–Q12, S1–S10) and P1's (such as P1's D8) are cited with their date or as `[D: P1 Dn]`. P1–P4 name the ROADMAP's four projects, not proposals.

## 1. Purpose

Felipe is building a portfolio of many **small** AI projects, each proving few skills [D-chat-1]. The target is 1–3 days per project [P]. Every project must ship with:

- a live demo
- one measured number
- a README that fits one screen

[D-chat-1, D-sec1]

This template exists so that each project starts with:

- the same skeleton: model access, abuse protection, tests, CI, deploy, README
- no setup decisions left to make

That consistency is itself a signal to recruiters [P].

**Success criteria** [P]:

1. A new project repo is created from the template as in section 9, step 1: a `git archive` of a known template commit, then `gh repo create --source . --push` [D: U-07, 2026-09-28]. This replaced `gh repo create --template`, which #1 did not use.
2. `pnpm install && pnpm dev:mock` runs locally with no API key and no `.env` file.
3. CI passes on the first push without any secret.
4. The first Vercel deploy works when the steps in section 9 are followed.

## 2. Decisions this template encodes

| # | Decision | Source |
|---|---|---|
| 1 | Next.js 16 App Router + Vercel AI SDK | [D-chat-1, D-sec1] |
| 2 | TypeScript `strict`, pnpm, Tailwind CSS v4, shadcn/ui, Node 24, MIT license, `.env.example` | [D-sec1] |
| 3 | One GitHub template repo, `feliperrego/ai-portfolio-template`, marked as a template; one repo per project, created from it | [D-chat-1, D-sec1] |
| 4 | Models via Vercel AI Gateway, using plain `"provider/model"` strings | [D-chat-1] |
| 5 | Public demos protected by three layers: a per-IP rate limit (20/hour, Upstash Redis via the Vercel Marketplace, friendly 429), max output tokens in code, and a monthly spend cap in the AI Gateway dashboard, set by Felipe | [D-chat-1, D-sec1] |
| 6 | Everything in English: README, UI, commits, docs. Superseded for the UI only: #1 and #2 add an EN/pt-BR interface switch in their own code, while the README, docs and commits stay English (section 10). Since X-01 the template itself ships the switch, so every project, non-chat ones included, starts with an English interface and a pt-BR option (section 5.9) | [D-chat-1; F: #1 spec §14 A-21 (D-chat-2), #2 spec §9 (D-chat-3); D: U-08, 2026-09-28; D: V-02, 2026-09-29] |
| 7 | Chat UIs are built by hand on shadcn/ui primitives, not AI Elements | [D-chat-1] |
| 8 | CI never spends money and needs no secret: e2e runs against a mock model | [D-sec1] |
| 9 | Vercel Git deploy with a preview per PR | [D-sec1] |
| 10 | README skeleton that fits one screen, with the measured number first (section 8) | [D-sec1] |
| 11 | No auth, no database, no ADR folder in the template. It said "no i18n" until X-01, when i18n came in with the chat shell (sections 5.8, 5.9 and 10) | [D-sec1; D: U-08, 2026-09-28; D: V-02, 2026-09-29] |

## 3. Versions and platform

Versions current on npm as of 2026-09-25 [F: `npm view`]:

| Package | Version |
|---|---|
| `next` | 16.3.6 |
| `ai` | 7.0.114 |
| `@ai-sdk/react` | 4.0.117 |
| `@upstash/ratelimit` | 2.2.0 |
| `@upstash/redis` | 1.39.0 — peer dependency of `@upstash/ratelimit` (`^1.38.2`) [F: `npm view`] |
| `@playwright/test` | 1.63.0 |
| `zod` | 3.25.76 — P1's pin, for the sample tool's input schema (section 5.10); also the version `ai` resolves its peer to [F: P1 `package.json`, `pnpm-lock.yaml`; D: X2-13, 2026-10-05] |
| `tsx` | 4.23.15 — P1's pin, a dev dependency that runs `pnpm eval` (section 7.1) [F: P1 `package.json`; D: X2-17, 2026-10-05] |
| `pnpm` | 12.6.0 |

Platform:

- Node 24 [D-sec1]. It is also the default for new Vercel projects, and `engines.node: "24.x"` pins it [F: vercel.com/docs/functions/runtimes/node-js/node-js-versions, checked 2026-09-25].
- pnpm [D-sec1]. The template pins the locally installed pnpm 9.15.0 in `packageManager` rather than the latest (12.6.0) [P, D-spec final-review ruling]. Trigger to upgrade: Felipe upgrades pnpm globally; then bump `packageManager`, re-run every gate, and commit.
- Exact versions are pinned in `package.json` at scaffold time [P].

## 4. What the template contains

The `lib/http.ts`, `lib/measure/`, `e2e/helpers/measure.ts` and `e2e/measure-guards.spec.ts` entries, and the `measure` project in `playwright.config.ts`, came with the 2026-09-28 amendment [D: U-01, U-05, 2026-09-28]. The chat, i18n and identity entries (`app/api/chat/`, `components/chat/`, `components/i18n/`, `components/app-chat.tsx`, `components/site-header.tsx`, `hooks/`, `lib/chat/`, `lib/i18n/`, `lib/project.ts`, `lib/ai/mock-scenarios.ts`, the chat and i18n e2e files) and the `vercel.json` entry came with X-01 [D: V-01, V-02, V-03, V-07, V-10, 2026-09-29]. The `lib/ai/limits.ts` and `lib/ai/mock-steps.ts` entries came with X-02 [D: X2-14, X2-15, 2026-10-05], and so did the trace's: `components/trace/`, `lib/trace/`, `lib/i18n/display.ts` and the `badge` and `collapsible` primitives, with the project's tools in `lib/tools.ts` and `e2e/chat-tools.spec.ts` [D: X2-13, X2-16, X2-22, 2026-10-05], and so did the eval core's: `lib/eval/`, `scripts/eval.ts`, the sample in `lib/eval/project.ts` and `measurements/`, and `.prettierignore` [D: X2-17, X2-20, 2026-10-05], and the app shell's and the Evals pages': `app/(shell)/`, `components/app-shell/`, `components/evals/`, `lib/eval/view.ts`, `lib/i18n/localized.ts`, `lib/site-header.ts`, the sidebar's primitives with `hooks/use-mobile.ts`, and `e2e/evals.spec.ts` [D: X2-09, X2-12, X2-19, X2-21, 2026-10-05]. Section 5.8 says who owns each file.

```
.
├── app/
│   ├── layout.tsx            # root layout: fonts, globals.css, metadata from lib/project.ts and the page-title template (5.12), <LocaleProvider>
│   ├── globals.css           # Tailwind v4 (@import "tailwindcss")
│   ├── page.tsx              # the chat page: <AppChat/>, then <Footer/> (5.6), outside the app shell; a non-chat project deletes it for a home page in the shell (9, step 6b)
│   ├── (shell)/              # the pages in the app shell (5.12)
│   │   ├── layout.tsx        # <AppShell/>: the project's nav, brand and banner
│   │   └── evals/            # page.tsx, the Evals page; [case]/page.tsx, a case's page; each names itself in its metadata
│   └── api/
│       ├── chat/route.ts     # POST: guardModelRoute, validateAndClean, streamText (5.8)
│       └── health/route.ts   # GET → { ok, model, mock, rateLimit }
├── components/
│   ├── app-chat.tsx          # the project's client wrapper: passes Chat's props (5.8)
│   ├── app-shell/            # the frame of a project's pages: nav, header, banner, footer, page titles (5.12)
│   ├── chat/                 # the chat shell: chat, message-list, plain-text-message, composer, empty-state (5.8)
│   ├── i18n/                 # locale-provider, language-switch (5.9)
│   ├── site-header.tsx       # model label, mock badge, data-* attributes, page actions, EN/PT switch (5.6)
│   ├── footer.tsx            # links: feliperrego.com + this repo (5.5)
│   ├── evals/                # the Evals page, a case's page and the run's label (5.12)
│   ├── trace/                # the tool chip and the trace blocks: tool-call, blocks (5.10)
│   └── ui/                   # shadcn/ui components, added on demand (button, alert, textarea, badge, collapsible; sidebar, sheet, input, separator, skeleton, tooltip, card, table, 5.12)
├── hooks/
│   ├── use-mobile.ts         # the sidebar's phone breakpoint (5.12)
│   └── use-stick-to-bottom.ts # autoscroll that follows the stream, with "Jump to latest"
├── lib/
│   ├── ai/
│   │   ├── model.ts          # the ONLY place that decides model and mock mode
│   │   ├── limits.ts         # the model-call limits: MAX_OUTPUT_TOKENS, MAX_STEPS (5.1)
│   │   ├── mock.ts           # mock model factory (MockLanguageModelV4): how each step streams
│   │   ├── mock-steps.ts     # the step machine: text, tool calls, [[slow]], [[error]] (5.2)
│   │   └── mock-scenarios.ts # the project's cues and answers: default answer, sample tool (5.2)
│   ├── chat/
│   │   ├── config.ts         # the shell's values: MAX_USER_CHARS, timeouts, scroll threshold
│   │   ├── limits.ts         # the chat's limits: MAX_MESSAGES, MAX_ASSISTANT_CHARS
│   │   ├── instructions.ts   # the model's instructions
│   │   ├── validate.ts       # validateAndClean: the history the route accepts
│   │   ├── errors.ts         # the safe error text sent instead of a raw error
│   │   └── ui.ts             # pure helpers of the chat UI
│   ├── eval/
│   │   ├── record.ts         # the run's file and the project's part: EvalRun, CaseRecord, EvalProject (5.11)
│   │   ├── cases.ts          # the frozen cases and their SHA-256
│   │   ├── run.ts            # runEval: every case once, stopping right after the first that cannot be scored; collectUIMessage
│   │   ├── stats.ts          # the seeded bootstrap over cases, the Wilson interval when it has no spread, the median, the whole percent
│   │   ├── summary.ts        # the run's summary and the headline's numbers
│   │   ├── check.ts          # the mock run's check: a fresh mock run against the committed one
│   │   ├── runs.ts           # the run the screens show
│   │   ├── readme.ts         # README line 1 and the first line of "How it's measured"
│   │   ├── command.ts        # what `pnpm eval` does, with its inputs passed in
│   │   ├── view.ts           # what the Evals pages show: the run's label, the mock gate (5.12)
│   │   └── project.ts        # the project's cases, runCase, scorer, headline and Evals words: the sample (5.11)
│   ├── i18n/
│   │   ├── locale.ts         # LOCALES, locale resolution, storage key, requestLocale, interfaceLanguageLine
│   │   ├── format.ts         # format(): fills {name} placeholders
│   │   ├── display.ts        # numbers and days in the interface language: formatNumber, formatSeconds, formatDay (5.9)
│   │   ├── localized.ts      # Localized: a dictionary text in every language, for server pages (5.12)
│   │   ├── shell-messages.ts # the shell's text, EN and pt-BR
│   │   └── messages.ts       # the project's text, composed with the shell's, and its toolLabel (5.10)
│   ├── measure/
│   │   └── record.ts         # measurement file paths + the no-overwrite rule (7.5)
│   ├── trace/
│   │   ├── message-text.ts   # messageText: a message's text, each step's a blank line apart (5.10)
│   │   ├── tool-view.ts      # ToolView: one tool call, in five states, and interrupted once its answer is over (5.10)
│   │   └── trace.ts          # TraceMetadata (tokens, latency), its finish helper, Check (5.10)
│   ├── http.ts               # guardModelRoute: rate limit, then 415 for non-JSON (5.7)
│   ├── project.ts            # the project's identity: name, description, slug, repo URL (9, step 6)
│   ├── site-header.ts        # siteHeaderProps(): the header's server-only values (5.6, 5.12)
│   ├── tools.ts              # the project's tools: the sample lookUpItem the chat route offers (5.10)
│   ├── rate-limit.ts         # per-IP limiter + 429 response helper
│   └── utils.ts              # cn() for shadcn/ui
├── measurements/             # the frozen cases, their SHA-256 and the eval's runs; the sample's, replaced at import (5.11)
│   ├── cases.json
│   ├── cases.sha256
│   └── eval-mock.json        # the mock run, which the screens show until a real run exists
├── scripts/
│   └── eval.ts               # `pnpm eval`: loads .env.local, then the model, then runs lib/eval/command.ts (5.11)
├── tests/                    # Vitest tests that span modules (routes, configs, guards) and their helpers; unit tests may also sit next to their module
├── e2e/
│   ├── helpers/
│   │   ├── chat.ts           # chat locators, faked SSE answers, waits
│   │   ├── fixtures.ts       # the project's e2e literals: prompts, default answer, 429 texts
│   │   ├── i18n.ts           # header, switch and footer locators, language checks
│   │   └── measure.ts        # measurement guards + file writing (7.5)
│   ├── chat.spec.ts          # the chat
│   ├── chat-tools.spec.ts    # a tool call in the chat: the chip, its data, both languages (5.10)
│   ├── evals.spec.ts         # the Evals page and a case's page, both languages, a phone (5.12)
│   ├── chat-i18n.spec.ts     # the chat in both languages
│   ├── i18n.spec.ts          # the site in both languages; kept by non-chat projects
│   ├── measure-guards.spec.ts # checks the measurement guards against the mock build
│   └── smoke.spec.ts         # Playwright smoke test
├── .github/workflows/ci.yml
├── docs/                     # this spec, the X-01 and X-02 designs and their plans; deleted at import (9, step 1)
├── .env.example
├── .gitignore
├── .prettierignore           # keeps the frozen cases and the runs byte for byte (5.11)
├── AGENTS.md                 # generated by next dev (Next.js agent rules); committed
├── CLAUDE.md                 # @AGENTS.md; projects add their working agreement below it
├── README.md                 # the fixed skeleton (section 8)
├── LICENSE                   # MIT
├── components.json           # shadcn/ui
├── eslint.config.mjs
├── next.config.ts
├── package.json              # includes "packageManager": "pnpm@<version>"
├── pnpm-lock.yaml            # committed
├── playwright.config.ts      # chromium; plus measure, only when MEASURE_URL is set (7.5)
├── postcss.config.mjs
├── tsconfig.json             # "strict": true
├── vitest.config.mts
└── vercel.json               # supportsCancellation for app/api/chat/route.ts (5.1); {} again after the removal recipe (9, step 6b)
```

**Layout.** Folders stay flat, with no `src/` [P]. This matches the paths in the AI SDK docs.

**Scaffold** [P]:

1. Run `pnpm create next-app@16.3.6` with TypeScript, ESLint, Tailwind, App Router and no `src/`. Confirm the exact flags with `--help`.
2. Run `pnpm dlx shadcn@latest init`.
3. Set `"packageManager": "pnpm@<installed version>"` in `package.json`. CI reads the pnpm version from it; Vercel does too when Corepack is enabled (section 9, step 2).
4. Commit `pnpm-lock.yaml`.
5. In `.gitignore`:
   - add `!.env.example`, because the create-next-app default ignores `.env*` [F: the `.gitignore` generated by create-next-app 16.3.6 in a scratch scaffold, 2026-09-25]
   - add `playwright-report/` and `test-results/`
   - keep `next-env.d.ts` ignored [F: Next.js TypeScript docs, "Add it to `.gitignore`"]

## 5. Modules and contracts

### 5.1 `lib/ai/model.ts` [D-sec1]

```ts
export const IS_MOCK: boolean;        // process.env.AI_MOCK === '1'
export const MODEL_LABEL: string;     // process.env.AI_MODEL, or 'mock' when IS_MOCK
export function getModel(): LanguageModel; // "provider/model" string in real mode, the mock in mock mode
```

**Real mode.** `getModel()` returns `process.env.AI_MODEL`, a string such as `'anthropic/<model>'`. `streamText` accepts plain model strings and routes them through the AI Gateway [F: ai-sdk.dev getting-started, `model: 'openai/gpt-4o'`].

**Mock mode** (`AI_MOCK=1`). `getModel()` returns `createMockModel()` from `lib/ai/mock.ts`. Only the exact value `'1'` enables mock mode [P].

**Guards.** Both throw at module load, so a misconfigured deploy fails at build instead of on the first chat request:

- `IS_MOCK` together with `VERCEL_ENV === 'production'` [P: lifts D-S-15 into the template]. `VERCEL_ENV` is available at build and at runtime [F: #1 API check].
- A missing `AI_MODEL` in real mode [P]. The message points to `.env.example`.

**Rules:**

- The page, the health route and projects read the mock flag only from `IS_MOCK`.
- No other file imports a provider package [D-sec1]. The ESLint rule in section 7.1 enforces this. Hardcoded model ids anywhere else are a review rule.
- Every `streamText` / `generateText` call passes `maxOutputTokens` [D-sec1]. Each project sets the value in its own spec. This is a review rule, checked at section 9, step 6. The value is `MAX_OUTPUT_TOKENS` in `lib/ai/limits.ts`, a file the project owns (1024 in the template), and the chat route passes it (section 5.8) [D: V-06, 2026-09-29]. It lives outside `lib/chat/`, so a project without the chat keeps it (section 9, step 6b) [D: X2-14, 2026-10-05]. A model that calls tools over several steps stops at `MAX_STEPS` from the same file (5 in the template), so one answer's output stays under `MAX_STEPS` times the cap [D: X2-14, 2026-10-05].
- `lib/ai/model.ts` is server-only: client components receive `IS_MOCK` / `MODEL_LABEL` as props.

**Gateway authentication:** `AI_GATEWAY_API_KEY` wins when set (local runs). Otherwise the AI SDK uses Vercel OIDC, which is automatic on Vercel deployments [F: vercel.com/docs/ai-gateway/authentication-and-byok and `@ai-sdk/gateway` 4.0.94 source, checked 2026-09-25]. A local real run, such as a real `pnpm eval` (section 5.11), may use OIDC too, with no key: `vercel env pull .env.local` writes the project's `VERCEL_OIDC_TOKEN` to a git-ignored file that `pnpm eval` and `next dev` load. It pulls Development's variables, which hold no `AI_MODEL`, so the command sets it; the token expires, so a later run pulls it again (section 6). #2 and P1 ran their real calls this way [D: X2-27, 2026-10-05; F: `rag-citations` spec, "Credentials"; P1 spec §7, rollout step 2 and the second run].

**Known limit: Stop does not save tokens through the Gateway** [D: U-03, 2026-09-28]. When a client stops a stream, the route aborts its Gateway call, but the Gateway still completes and bills the provider generation:

- #1's Gateway log showed an aborted request as 499 after 1.0K output tokens had been generated over 11.9 s and billed [F: #1 spec §9 results, check 1, and §14 A-20].
- The upstream report is github.com/vercel/ai/issues/8325, opened 2025-08-27 and still open; no Vercel doc covers the case [F].

So `maxOutputTokens` (rule above) is the cost bound of every call, and no project claims that Stop saves tokens. `supportsCancellation` in `vercel.json`, set per streaming route on the Node runtime, still matters: it makes `req.signal` fire, so our function stops. It does not stop the Gateway [F: #1 spec §3.1 and §9 results, check 1]. The template sets it for `app/api/chat/route.ts`, and `tests/vercel-config.test.ts` pins it [D: V-10, 2026-09-29].

### 5.2 `lib/ai/mock.ts`

```ts
export function createMockModel(options?: {
  initialDelayInMs?: number;
  chunkDelayInMs?: number;
  chunks?: string[];
}): MockLanguageModelV4;
```

- It is built on `MockLanguageModelV4` from `ai/test` and `simulateReadableStream` from `ai` [F: ai-sdk.dev/docs/ai-sdk-core/testing].
- **Without options**, which is how `lib/ai/model.ts` calls it, it returns the scenario mock, ported from #1 [D: V-07, 2026-09-29], with P1's tool steps [D: X2-15, 2026-10-05; F: P1 `lib/ai/mock.ts`, `lib/ai/mock-scenarios.ts`]. Each `doStream` call is one step, which the step machine of `lib/ai/mock-steps.ts` takes from the prompt, in this order:
  - after a tool result (the prompt ends with a tool message), the project's scenarios continue from that result: in the template, the answer to the sample tool's result;
  - `[[error]]`: three words, then an `error` stream part. This happens only the first time the server process sees that exact text, so Retry with the same text gets the project's answer; an e2e test that sends it makes its text unique (`randomUUID()`).
  - `[[slow]]`: 300 short lines, far taller than an 800 px viewport, for the Stop and autoscroll tests.
  - anything else: the project's first step for the last user message. In the template that is a call to the sample tool `lookUpItem` for a message that names a fictional item id (`ITM-` and four digits), and otherwise the default answer, a fixed ~120-word English paragraph, one word plus its trailing space per chunk. The chat route offers the sample tool (`lib/tools.ts`, section 5.10), so such a message shows the call's chip, then the answer from its result; `tests/api-chat-route.test.ts` checks that no suggested prompt leads to a tool call, since the chat e2e expects the default answer for each. The eval sample runs the sample tool too [D: X2-13, X2-20, 2026-10-05].
- **Who owns which file** [D: X2-15, X2-21, 2026-10-05]. `lib/ai/mock.ts` (how a step streams, and the models) and `lib/ai/mock-steps.ts` (the step machine, `[[slow]]`, `[[error]]` and the default answer's text) are shell-owned. `lib/ai/mock-scenarios.ts` is project-owned: a project writes its own cues and answers there and keeps its `MOCK_SCENARIOS` export, `{ firstStep(turn), afterTool(result, turn) }`, which `lib/ai/mock.ts` reads; `afterTool` returns `undefined` for a result it does not continue, and the step starts over from the user message. `[[slow]]` and `[[error]]` stay in the shell because the chat e2e and the route tests use them. The shell's mock tests pass scenarios of their own, so a project's renamed scenarios never break them (P1 had to rename `"default"` in its copy) [F: P1 `lib/ai/mock.test.ts`].
- **With options**, every call streams the same chunks. **Defaults** [P]:
  - `initialDelayInMs: 600` [P: lifts D-S-12's calibration anchor into the template]
  - `chunkDelayInMs: 30`
  - `chunks`: the default answer, one word plus its trailing space per chunk

  The scenario mock uses the same 600 ms and 30 ms, written as literals [D: V-07, 2026-09-29].
- **Nothing in `lib/ai/` imports `lib/chat/`**, so the mock survives the removal recipe of a non-chat project (section 9, step 6b). `tests/shell-imports.test.ts` checks it [D: V-07, V-10, 2026-09-29].
- **Stream parts:** `text-start` / `text-delta { id, delta }` / `text-end` / `finish { finishReason: { unified, raw }, usage }`, and `error` for `[[error]]` [F: #1 API check]. A tool step streams `tool-call { toolCallId, toolName, input }`, the input as JSON text, then a `finish` with `tool-calls`; `streamText` runs the tool it was given and calls the model again with the result. Call ids are `mock-call-<n>`, one more than the prompt's tool messages. Every finish reports one output token per chunk and no input tokens [F: P1 `lib/ai/mock.ts`; D: X2-15, 2026-10-05].
- **Per-request behaviour.** The mock chooses each step inside its `doStream(options)`, reading `options.prompt`. So `getModel()` never takes arguments, and projects write their cues in `lib/ai/mock-scenarios.ts` instead of editing `model.ts` or the shell's mock files [D: X2-15, 2026-10-05].
- **Known limit: a tool result that is not JSON.** The step machine reads only JSON results, as P1's did, so after a tool's error or a denied approval it starts over from the user message, and a project whose first step calls the same tool calls it again until `MAX_STEPS` (section 5.1). Trigger: P2's design, which brings the approval states [D: W-P11, 2026-10-06].
- **Test access.** Tests read `doStreamCalls` from the returned instance [F: #1 API check].

### 5.3 `lib/rate-limit.ts` [D-chat-1, D-sec1]

```ts
export const RATE_LIMIT_PER_HOUR: number; // env RATE_LIMIT_PER_HOUR, default 20
export const RATE_LIMIT_ENABLED: boolean; // true when the Upstash env vars are present
export const RATE_LIMIT_PREFIX: string; // PROJECT_SLUG from lib/project.ts [D: V-03, 2026-09-29]
export async function rateLimit(req: Request): Promise<
  | { ok: true }
  | { ok: false; retryAfterSeconds?: number }
>;
export function rateLimitResponse(result: { ok: false; retryAfterSeconds?: number }): Response;
```

**Limiter.**

- Built with `Ratelimit.slidingWindow(RATE_LIMIT_PER_HOUR, '1 h')` and keyed by client IP [D-chat-1 for 20/hour; P for the sliding window and the env override].
- A denial `{ success: false, reset }` maps to `{ ok: false, retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) }`, or `{ ok: false }` when that is not a finite number [P]. `reset` is an epoch timestamp in ms [F: @upstash/ratelimit 2.2.0 `.d.ts`].
- The Upstash key prefix is `RATE_LIMIT_PREFIX`, so demos sharing one Upstash database keep separate counters [P, final-review ruling]. Since X-01 the prefix is the project's `PROJECT_SLUG` (section 9, step 6), instead of a string each project edited in this file [D: V-03, 2026-09-29].
- **Client IP** [P]: `ipAddress(req)` from `@vercel/functions`, falling back to the first `x-forwarded-for` entry, then to `'unknown'`. `ipAddress` reads only `x-real-ip`, which Vercel sets and local runs lack, so the fallback is needed [F: @vercel/functions 3.9.9 source].

**`rateLimitResponse`** returns `429 text/plain` with `Demo limit reached: ${RATE_LIMIT_PER_HOUR} messages per hour. Try again later.`, plus `Retry-After` when it is known [D-sec1 for the friendly 429; P for the helper and the wording].

**Redis env missing or empty** (local dev and CI): `RATE_LIMIT_ENABLED` is false, `rateLimit` always returns `{ ok: true }` [D-sec1], and it logs once [P]. Empty strings count as missing, so the e2e `webServer` can switch the limiter off (section 7.2).

**Order with the 415** [D: U-01, 2026-09-28]. A route that calls a model starts with `guardModelRoute(req)` (section 5.7), which runs `rateLimit` first and the Content-Type check second. So a cross-site form post still uses one of the visitor's requests per hour; what the 415 saves is the model call, that is, the AI Gateway spend. #1's route comment said the 415 saved "the rate-limit budget", which this order makes false [F: #1 `app/api/chat/route.ts`, lines 50-59].

**Redis error at runtime:** it returns `{ ok: true }` and calls `console.error` [P]. This needs a `try/catch`: Upstash `limit()` rejects when Redis throws, and only fails open by itself on its 5 s timeout [F: @upstash/ratelimit 2.2.0 source]. A broken limiter must not take the demo down; the Gateway spend cap is the backstop [D-chat-1].

**Env var names** [D: U-02, 2026-09-28]:

- In the Vercel Marketplace, pick **Upstash for Redis**, not **Redis**. They are separate products, and Redis gives a TCP `REDIS_URL`, which `@upstash/redis` does not use [F: vercel.com/docs/marketplace-storage, vercel.com/marketplace/redis].
- Leave the custom prefix empty. A prefix renames the variables, which would silently turn the limiter off [F: vercel.com/docs/integrations/install-an-integration/product-integration].
- The integration injects five variables: `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL` and `REDIS_URL` [F: Felipe's `vercel env ls` for #1, 2026-09-28, #1 spec §3.2; no public doc lists them].
- The limiter reads only the REST pair: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, or `KV_REST_API_URL` / `KV_REST_API_TOKEN` [F: @upstash/redis 1.39.0 source]. A unit test pins that `REDIS_URL` or `KV_URL` alone leave it off.
- To check a project's variable names, use `vercel env ls`. When values are needed, `vercel env pull .env.vercel --environment=production` writes them to a file Next.js does not load, so local runs never hit the production Redis; delete it afterwards. Without `--environment`, `vercel env pull` reads Development, which has no Upstash variables (section 6) [F: vercel CLI 59.15.1 `env pull --help`; D: U-04, 2026-09-28].

### 5.4 `app/api/health/route.ts` [P]

- `GET` returns `{ ok: true, model: MODEL_LABEL, mock: IS_MOCK, rateLimit: RATE_LIMIT_ENABLED ? 'upstash' : 'off' }`.
- It does not call the model.
- It has two jobs:
  - the e2e smoke test uses it
  - the deploy check in section 9 uses it to prove the limiter is really on in production

### 5.5 `components/footer.tsx`

- It links to `https://feliperrego.com` and to the repo URL [D-sec1].
- The repo URL is `REPO_URL` in `lib/project.ts`, which each project sets (section 9, step 6) [D: V-03, 2026-09-29]. Until X-01 it was a constant in `footer.tsx` that each project edited (T-12).
- Its text comes from the shell's dictionary (section 5.9), so it is a client component, and it is shell-owned (section 5.8). On touch devices its links are 44 px tall [D: V-02, V-04, V-10, 2026-09-29].
- Pages place `<Footer/>` themselves, so full-height layouts can include it inside their column [P].

### 5.6 `app/page.tsx` and the header [D: V-01, V-05, 2026-09-29]

- **The page is the chat.** `app/page.tsx` is a server component. It reads the server-only values (`MODEL_LABEL` and `IS_MOCK` from `lib/ai/model.ts`, the commit, `RATE_LIMIT_PER_HOUR` from `lib/rate-limit.ts`) and renders `<AppChat/>` (section 5.8), then `<Footer/>`, in a full-height column. The locale is resolved on the client (section 5.9), so the page still prerenders. The file is project-owned (section 5.8).
- **The non-chat page.** Until X-01 this file was a placeholder: the header, one line ("Replace this page.") and `<Footer/>`. X-01 made that page the one a non-chat project put here. Since 2026-10-06 a non-chat project deletes this file and writes its home page inside the app shell, as `app/(shell)/page.tsx`, with the code in section 9, step 6b [D: W-P8, 2026-10-06].
- **Header.** `components/site-header.tsx` shows `MODEL_LABEL` and, in mock mode, a "Mock model" badge. It carries these attributes [P: lifts D-S-14 into the template]:
  - `data-model={MODEL_LABEL}`
  - `data-commit={process.env.VERCEL_GIT_COMMIT_SHA || 'local'}`: an empty variable counts as unset, so the attribute is never empty [D: X2-12, 2026-10-05; F: a build with `VERCEL_GIT_COMMIT_SHA=""` gave `data-commit=""` with `??`]
  - `data-mock={IS_MOCK ? '' : undefined}`
- `data-mock` exists **only** in mock mode. Never pass a boolean: React renders `data-mock={false}` as the string `"false"`.
- The header also holds a visually hidden `<h1>` with `PRODUCT_NAME` (untranslated), an `actions` slot for page actions such as the chat's New chat, and the EN/PT switch (section 5.9). `ml-auto` sits on the wrapper around the actions and the switch, so the switch stays at the right end with or without actions. It is a client component: its text comes from the dictionary, and a server page passes the server-only values as props [D: V-02, V-05, 2026-09-29], from `siteHeaderProps()` (`lib/site-header.ts`, section 5.12) since X-02 [D: X2-12, 2026-10-05].

### 5.7 `lib/http.ts` [D: U-01, 2026-09-28]

```ts
export function isJsonRequest(req: Request): boolean;
export function unsupportedMediaTypeResponse(): Response;
export async function guardModelRoute(req: Request): Promise<Response | null>;
```

- `isJsonRequest` is true when the Content-Type media type, lower-cased and stripped of parameters, is `application/json`. So `application/json; charset=utf-8` and `Application/JSON` pass, and a request with no Content-Type fails [F: ported from #1 `app/api/chat/route.ts`].
- `unsupportedMediaTypeResponse` returns `415 text/plain` with `Invalid request: Content-Type must be application/json.` [F: #1's text; #1 checked a `text/plain` POST in production, #1 spec §9 results].
- `guardModelRoute` runs `rateLimit` (429 through `rateLimitResponse`), then the Content-Type check (415). It returns the response to send, or `null` when the route may go on. It never reads the body, so the route can still call `req.json()`. One helper fixes the order, so no route can get it wrong.
- **Why a 415 helps.** A JSON Content-Type is not CORS-safelisted, so a cross-site page cannot send one without a preflight. Only `application/x-www-form-urlencoded`, `multipart/form-data` and `text/plain` skip the preflight [F: MDN, "CORS-safelisted request header"]. The check turns those away before any model call.
- **Usage:**

  ```ts
  export async function POST(req: Request) {
    const blocked = await guardModelRoute(req);
    if (blocked) return blocked;
    // parse, validate, then call the model with maxOutputTokens (5.1)
  }
  ```

- It applies to every route that pays for a model call, embedding calls included [D: U-P1, 2026-09-28].

### 5.8 The chat shell [D: V-01, V-04, V-05, V-06, V-08, 2026-09-29]

The template's `/` is a working chat in mock mode, with no API key. It merges the shells of #1 and #2 (X-01 design §4.2): the composer, Send/Stop, Esc, Regenerate/Retry, the stopped and cut-off labels, the 429 and generic banners, autoscroll with "Jump to latest", New chat, the screen-reader status line and the EN/PT switch. #2 is the base for every file both projects share, since it is the later copy and carries fixes; #1 is the base for what #2 removed on purpose (history mode, the message cap, `validateAndClean`, the history route) and for the mock [D: X-01 P11]. A non-chat project removes the chat with section 9, step 6b.

**Who owns which file** [D: V-04, 2026-09-29; D: X2-21, 2026-10-05 for the X-02 files; D: W-16, 2026-10-06 for the project's tests]:

| Owner | Files | Rule |
|---|---|---|
| Shell | `components/app-shell/**`, `components/chat/**`, `components/evals/**`, `components/i18n/**`, `components/trace/**`, `components/site-header.tsx`, `components/footer.tsx`, `hooks/use-stick-to-bottom.ts`, `lib/ai/{mock,mock-steps}.ts`, `lib/chat/{ui,config,errors,validate}.ts`, `lib/eval/**` but `lib/eval/project.ts` and its test, `lib/i18n/{locale,format,display,localized,shell-messages}.ts`, `lib/site-header.ts`, `lib/trace/**`, `scripts/eval.ts` | A project edits them only to change the shell, so `git diff --no-index` against the template shows only deliberate changes |
| Project | `lib/project.ts`, `lib/ai/limits.ts`, `lib/ai/mock-scenarios.ts`, `lib/tools.ts`, `lib/chat/limits.ts`, `lib/chat/instructions.ts`, `lib/i18n/messages.ts`, `lib/eval/project.ts`, each with the test beside it (`lib/{project,tools}.test.ts`, `lib/ai/{limits,mock-scenarios}.test.ts`, `lib/chat/{limits,instructions}.test.ts`, `lib/i18n/messages.test.ts`, `lib/eval/project.test.ts`), `measurements/{cases.json, cases.sha256, eval-mock.json}`, `.prettierignore`, `components/app-chat.tsx`, `app/api/chat/route.ts`, `app/page.tsx`, `app/(shell)/**` (the app shell's layout and the Evals pages, section 5.12), `e2e/helpers/fixtures.ts`, the `package.json` `name` | Edited freely (section 9, step 6) |
| Template only | `docs/` (this spec, the X-01 and X-02 designs and their plans), `tests/chat-boundary.test.ts`, `tests/no-project-strings.test.ts`, `tests/shell-comments.test.ts` | Deleted at import (section 9, step 1) |

In the template, `tests/chat-boundary.test.ts` reads this table: the Shell row names exactly the files that `tests/helpers/repo-files.ts` lists as shell, which the travelling guards read; the Project row names no shell file, and names the test beside each file it names [D: W-16, 2026-10-06]; the Template only row names exactly what section 9 step 1 deletes; and every path the table names exists [D: X2-21, 2026-10-05]. Corrected 2026-10-05 (rule 6): the Template only row's note left out the X-02 design, which step 1 already deleted.

A test of a project file is the project's, as its file is: the Project row names it, and a project that replaces a file of its row replaces or edits its test with it, as section 9 step 6 says [D: W-16, 2026-10-06]. A file in no row is template base: the skeleton every project starts from, such as `lib/ai/model.ts`, `lib/measure/record.ts`, `lib/http.ts`, `lib/rate-limit.ts`, `lib/utils.ts`, the primitives under `components/ui/`, the root layout and the configs, and the tests that sit outside the shell's folders beside a skeleton or shell file, such as `lib/rate-limit.test.ts` or `lib/i18n/locale.test.ts`. A project keeps it and changes it only on purpose, unless section 9 step 6b deletes it with the chat (the primitives `alert` and `textarea`, and the chat's tests, whose owner "Who owns the chat tests" below names). No list in code names it [F: `tests/helpers/repo-files.ts` lists the shell only]. Corrected 2026-10-05 (rule 6): section 5.12 and the shell-imports sentence below rely on this class, which this section did not name [D: X2-27, 2026-10-05]. Corrected 2026-10-06 (rule 6): it said every project keeps a file in no row, which put the sample's tests, which a project replaces, and the files step 6b deletes in that class [D: W-16, 2026-10-06; F: the X-02 review].

A shell file imports no project module except `lib/project.ts`, `lib/chat/limits.ts`, `lib/i18n/messages.ts` (its dictionary, of which a shell file reads only the shell's keys, section 5.9, and since X-02 its `toolLabel`, section 5.10), `lib/ai/mock-scenarios.ts` and `lib/eval/project.ts` (the last two since X-02 [D: X2-13, X2-15, X2-17, 2026-10-05]); the eval's script and command also read `lib/ai/model.ts` and `lib/measure/record.ts`, which every project keeps, and the header's `lib/site-header.ts` reads `lib/ai/model.ts` [D: X2-12, X2-17, X2-21, 2026-10-05]. Nothing in `lib/ai/` imports `lib/chat/`, and neither does the eval core (section 5.11). `tests/shell-imports.test.ts` checks all three and travels with the shell: it holds in any project that leaves the shell alone [D: V-10, 2026-09-29]. It counts `components/ui/**` and `lib/utils.ts` as primitives a shell file may import, and any other repo file as a project module [P: V-P5]; the primitives the app shell brought, with P1's edits, are primitives too (section 5.12).

**`Chat`'s props** (`components/chat/chat.tsx`) [D: V-05, 2026-09-29; D: X2-10, 2026-10-05 for `header`]. `Chat<M extends UIMessage = UIMessage>` is generic over the message type.

| Prop | Default | What it is for |
|---|---|---|
| `modelLabel`, `isMock`, `commit`, `rateLimitPerHour` | required | Server-only values (sections 5.1, 5.3), passed down by the page |
| `empty: { title; intro?; groups: { heading?; prompts }[] }` | required | The empty state, in the current locale. A group with a heading renders a labelled section (#1's two groups); one group without a heading is a flat grid (#2) |
| `transport?` | `useChat`'s own: a POST to `/api/chat` with the whole history | A project that posts only the latest message passes its own |
| `maxMessages?: number \| null` | `MAX_MESSAGES`, whatever the transport | At the cap the composer locks until New chat. `null` turns the cap off, for a transport that posts only the latest message. A custom transport alone never turns it off: `new DefaultChatTransport({ api, body, headers })` still posts the history [F: `@ai-sdk/react` 4.0.117 `use-chat.ts`] |
| `renderAssistant?(message, { streaming, caption })` | plain text, then a chip for each tool call (`components/chat/plain-text-message.tsx`, section 5.10); plain text alone until X-02 | A caption, citations, cards for some tools |
| `hasContent?(message)` | what the renderer shows (`defaultHasContent`): `hasTextOrTools` with the default renderer, which shows a chip for each call [D: X2-13, 2026-10-05], and `hasVisibleText`, the default before X-02, with a renderer of the project's own, so a project that replaced the renderer keeps the behaviour it had [D: W-16, 2026-10-06] | Whether an assistant message has anything to show. A project renderer that shows chips too passes `hasTextOrTools` |
| `header?(newChat)` | the site header (section 5.6), with New chat in its `actions` | What sits above the conversation. It receives the New chat button, so a chat in a panel (a drawer, a docked panel) puts New chat in its own bar, and the page keeps its one `header[data-model]`. From P1, whose chat also sits in a drawer [F: P1 commit `08d5ee3`] |

- **The client wrapper.** A server page cannot pass functions to a client component, so `app/page.tsx` renders the project-owned client component `components/app-chat.tsx`, which passes these props. The template's wrapper passes only its own text and keeps every default [D: X-01 P8].
- **`hasContent` is read in four places**: the list's filter that hides an assistant message with nothing to show, the Regenerate slot, the typing indicator and the "Response complete" announcement. The last three are pure helpers in `lib/chat/ui.ts` (`regenerateSlot`, `showTypingIndicator` and `announcement`), typed `<M extends UIMessage>(…, hasContent: (m: M) => boolean = hasVisibleText)`, so a predicate typed on a project's message type passes `strict` [F: TypeScript `strictFunctionTypes`]. With the list's filter alone on `hasVisibleText`, a tool-only last message would stay hidden and get neither Regenerate nor the stopped row.
- **Renderer contract**: the root carries `data-message-role="assistant"`, its first child `div` is the answer text, and `caption` goes last. It holds in #1 and #2 [F: X-01 design §4.3]. The type is `AssistantRenderer<M> = (message: M, options: { streaming: boolean; caption: ReactNode }) => ReactNode`, and `MessageList` gives each call its key [P: V-P1].
- **What tests and measurements read**: the header's `data-model`, `data-commit` and `data-mock` (section 5.6), `[data-message-role]`, the alert slot, the `role="status"` line, the log named "Conversation", and 44 px targets at 375 px on touch devices.
- **A chat in a panel** [D: X2-10, X2-11, X2-28, 2026-10-05]. With `header`, a project chooses the container: a drawer, a docked panel or the full page. The chat e2e still runs where the chat fills the page, because its helpers search the whole page, New chat included, wherever the header seam puts it [D: W-16, 2026-10-06]: `chat.spec.ts` and `chat-i18n.spec.ts` open `CHAT_PATH` from the project-owned `e2e/helpers/fixtures.ts` (`/` in the template) in every `goto`, `toHaveURL` and pathname check, and a project whose `/` is another page points it at its full-page chat route. Esc stops an answer only while the chat is rendered, and its listener sits on `window`, so it runs after every keydown listener on the document, a dialog's among them, whatever order they were added in: a drawer that keeps a closed chat mounted but hidden no longer has its unseen answer stopped by an Esc on the page, and a drawer that handles an Esc itself sees it before the chat stops. P1's drawer check (X2-29) found both effects, and P1 fixed them at `f734536` on 2026-10-06; the template ported that fix, keeping its own IME check (`e2e/chat.spec.ts` pins both) [D: W-16, 2026-10-06; F: P1 commit `f734536`]. Known limits, with P2's design as their trigger: `Chat` always renders a `<main>`, so a panel on a page with its own `<main>` gives two main landmarks; and with `header` passed, `modelLabel`, `isMock` and `commit` go unused but stay required. Corrected 2026-10-06 (rule 6): the chat e2e looked for New chat inside `header[data-model]` only, so a full-page chat with a bar of its own failed it; and the known limits named key listeners on `document` that reach a hidden panel, of which the Esc listener no longer does, and the autoscroll's PageUp listener stops nothing in a panel hidden with `display: none`, which has nothing to scroll [F: `hooks/use-stick-to-bottom.ts` stops only when the conversation overflows].
- **The composer** (`components/chat/composer.tsx`) [D: X2-24, 2026-10-05; F: the X-01 final review, section 14]. Enter sends and Shift+Enter inserts a newline, but a key of an IME composition (Chinese, Japanese or Korean input) neither sends nor stops: `isComposingKey` (`lib/chat/ui.ts`) counts a key the browser marks `isComposing`, any key while a composition the chat tracked on the page (`compositionstart` to `compositionend`) is open, and a key with `keyCode` 229, because Safari fires `compositionend` before the keydown of the Enter or Esc that ended the composition and sends that keydown with `keyCode` 229. So Enter while composing never sends, and Esc while composing never stops an answer. Known limit [D: W-P12, 2026-10-06]: a phone keyboard that reports Enter with `keyCode` 229 would get a newline from Enter and send with the Send button; whether any does is unchecked. Trigger: a report from a phone, or P2's design if its visitors type on phones. Send's double-click guard ignores the second click of a double-click on Send, which lands on Stop once the button swaps, only within `SEND_DOUBLE_CLICK_MS` (500 ms) of the send; a later click on Stop stops, even one the browser counts in the same click chain (`isSendDoubleClick`). At the message cap the textarea is read-only and `aria-disabled`, not `disabled`, so it keeps the focus and a draft typed while the answer that reached the cap streamed; a line above it, tied to it by `aria-describedby`, says to start a new chat, and the textarea has no placeholder then. New chat leaves the draft in place, ready to send [D: W-P7, 2026-10-06].
- **Who owns the chat tests** [D: X2-24, 2026-10-05]. The chat's tests pin the shell's defaults: `e2e/chat.spec.ts`, `e2e/chat-i18n.spec.ts` and `e2e/chat-tools.spec.ts` with `e2e/helpers/chat.ts`, the shell's unit tests under `components/chat/` and `lib/chat/`, and `tests/api-chat-route.test.ts`. While a project keeps a default, it keeps the tests of that default unchanged. A project that changes a seam owns the tests of the default it replaced: it edits or deletes them in the same change and leaves the others alone, so a failing chat test still means the shell broke. A transport that posts only the latest message, with `maxMessages={null}`, edits the history-mode tests (the posted bodies, the message cap, the follow-up after a long answer, `chat-i18n.spec.ts`'s history body, and the route's cap and history cases); a renderer of its own edits the tests that read the default renderer (`chat-tools.spec.ts`, `components/chat/plain-text-message.test.ts`). Where every project would make the same edit, the template turns it into a value of the project-owned `e2e/helpers/fixtures.ts` instead: `CHAT_PATH` is the first (above).
- **Deferred seams.** Per-request timing hooks and `useChat` options such as tool approval are not props. Until its trigger fires (section 10), a project that needs one edits its copy of the shell. Extra request-body fields need no seam: `transport` takes a `DefaultChatTransport` whose `body` may be a function, read for each request and merged with `locale` [F: `ai` 7.0.114 `HttpChatTransportInitOptions.body: Resolvable<object>`, and P1's `components/app-chat.tsx` sends its persona this way; D: X2-10, 2026-10-05].

**Requests: history mode** [D: V-06, 2026-09-29; D: X-01 Q3]. `useChat`'s own transport posts the whole history, and `MAX_MESSAGES` caps it on both sides: the client stops at it, and the route rejects one more message. #1 posted the history; #2 posted only the latest message. The template takes #1's mode because #6 and #7 are multi-turn agents (remapped 2026-10-01: the roadmap's old #6 and #7 became P2 (ROADMAP) [D: Q2, 2026-10-01]).

**Limits.** The chat's limits live in `lib/chat/limits.ts` (project-owned): `MAX_MESSAGES` (20) and `MAX_ASSISTANT_CHARS` (6000). The token cap `MAX_OUTPUT_TOKENS` (1024) lives in the project-owned `lib/ai/limits.ts`, with `MAX_STEPS`, so a project without the chat keeps it (section 5.1) [D: X2-14, 2026-10-05]. Section 5.1 has each project set its token cap in its own spec, and `MAX_ASSISTANT_CHARS` is sized from that cap [F: #1 spec, C-09], so `lib/chat/limits.test.ts` ties the two [D: V-06, 2026-09-29]; the test allows 4 to 6 characters per output token [P: V-P3]. The shell's own values live in `lib/chat/config.ts` (shell-owned): `MAX_USER_CHARS` (2000, the composer's `maxLength`), the first-chunk and between-chunk timeouts (20 s and 15 s) and the autoscroll threshold.

**The route** (`app/api/chat/route.ts`, project-owned), in order [D: V-01, V-06, 2026-09-29]:

1. `guardModelRoute(req)`: the 429, then the 415, before the body is read (section 5.7).
2. `req.json()`, or a 400.
3. `validateAndClean(body)` (`lib/chat/validate.ts`, from #1). It accepts user and assistant messages only, user text parts only, at least one user message, at most `MAX_MESSAGES` messages and user text up to `MAX_USER_CHARS`; anything else gets a 400 with a plain-text reason. It then rebuilds each message as one text part, its text as the chat shows it (`messageText`, each step's a blank line apart, section 5.10) [D: X2-13; fixed 2026-10-06 after the X-02 review], so a forged body cannot pass provider options to the model, and cuts an assistant text over `MAX_ASSISTANT_CHARS` to its last `MAX_ASSISTANT_CHARS` characters. Corrected 2026-09-30 (rule 6): #1's logic answered that text with a 400, but an honest answer can be longer (the mock's `[[slow]]` answer is 10,092 characters; a real one cut at the token cap above about 5.9 characters per token), and history mode posts it with every later message, so each follow-up and each Retry failed until New chat. The cut keeps the model's input as bounded as the 400 did; keeping the end serves "continue" after a cut answer [P: V-P8]. **Known limit for P1 and P2:** non-text assistant parts are dropped, so tool results leave the history (section 10). Remapped 2026-10-01: the roadmap's old #6 became P2, and P1 has an order-lookup tool (ROADMAP) [D: Q1, Q2, 2026-10-01].
4. `requestLocale(body)`: exactly `"en"` or `"pt-BR"`; any other value is ignored, never a 400 (section 5.9).
5. `streamText` with `buildInstructions({ locale })`, the project's tools (`TOOLS` of `lib/tools.ts`, section 5.10) and `stopWhen: isStepCount(MAX_STEPS)` (section 5.1) [D: X2-13, 2026-10-05], `maxOutputTokens: MAX_OUTPUT_TOKENS`, `abortSignal: req.signal` and the two timeouts. A raw model error is logged once on the server, and the client gets the safe text of `lib/chat/errors.ts`; no reasoning part reaches the client.

**Default instructions** (`lib/chat/instructions.ts`, project-owned) [D: V-08, 2026-09-29]. #1's rules without its profile: plain text, no Markdown, because the default renderer shows raw text; a length rule (150 to 250 words by default); "answer in the language of the user's latest message; when that is unclear, the interface language" [D: #1 delta spec, D-chat-2]; then the interface-language line, last (section 5.9). A project adds its own rules and facts and keeps that line last, because the language rule points to it. The length ceiling a visitor may ask for is derived from `MAX_OUTPUT_TOKENS` (700 words for 1024 tokens), so a project that changes the cap never promises an answer the cap cuts off [P: V-P3].

### 5.9 Interface language (EN/pt-BR) [D: V-02, 2026-09-29]

```ts
// lib/i18n/locale.ts, shell-owned; pure and client-safe
export const LOCALES: readonly ["en", "pt-BR"];
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale;       // "en"
export const LOCALE_STORAGE_KEY: string;   // `${PROJECT_SLUG}:locale`
export function resolveLocale(input: { search: string; stored: string | null }): Locale;
export function requestLocale(body: unknown): Locale | undefined;
export function interfaceLanguageLine(locale: Locale | undefined): string | null;

// lib/i18n/format.ts, shell-owned
export function format(text: string, values: Record<string, string | number>): string;
```

The rest of the file is #2's [F: X-01 design §4.2]. The design named `requestLocale` and `interfaceLanguageLine` without their types, so their signatures are [P: V-P1].

- **Every project ships the switch**, non-chat ones included [D: X-01 Q2].
- **Resolution.** A valid `?lang=` (`en`, `pt` or `pt-br`, any case), then a valid stored value, then English. A `?lang=` alone is never stored. The switch stores its choice under `LOCALE_STORAGE_KEY`, one key per project, so two demos served from one origin never share a choice. It then removes `lang` from the URL with no reload and no router request, keeping the other parameters and the hash. With storage blocked, a choice lasts until a reload.
- **The served HTML is English.** `app/layout.tsx` renders `<html lang="en">` and wraps the body in `LocaleProvider` (`components/i18n/locale-provider.tsx`). The provider resolves the locale on the client, sets `<html lang>`, and sets `data-hydrated` on `<html>`, a wait for tests that does not depend on any one page. It sets `data-hydrated` only once the page shows the client's locale [P: V-P2]. There is no server locale routing and no browser-language detection (section 10).
- **Dictionary** [D: X-01 P5]. `lib/i18n/shell-messages.ts` (shell-owned) holds the shell's keys, `header`, `composer`, `list`, `chat`, `errors`, `status` and `footer`, with #1's approved text in both locales, and since X-02 `toolCall` and `trace` (section 5.10) and `appShell`, `run` and `evals` (section 5.12), with P1's text where P1 had one [D: X2-22, 2026-10-05; F: P1 `lib/i18n/messages.ts`]. `lib/i18n/messages.ts` (project-owned) holds the project's keys (the template's `empty.{title, subtitle}`, `prompts`, `toolLabels`, `site` and `evalText`) and builds each locale as `{ ...shellMessages[locale], ...projectMessages[locale] }`, typed `Record<Locale, Messages>`. The two share no top-level key: with one in common, the project's spread would replace the whole shell object. Shell components read only shell keys; project text reaches them through props, so a project may rename or drop any key of its own. `tests/shell-imports.test.ts` checks every shell file for it, reading the dictionary by the names the shell gives it, `t` and `messages[locale]`, so no shell file names anything else `t` [D: X2-22, 2026-10-05]. `{name}` marks where `format()` inserts a value.
- **The model.** The client sends `locale` with each request, and the route reads it with `requestLocale`. `interfaceLanguageLine` ends the instructions ("Interface language: English." or "Interface language: Portuguese (Brazil)."), and the language rule of section 5.8 falls back to it. It adds nothing without a valid locale.
- **The switch.** `components/i18n/language-switch.tsx` is a client component in the header (section 5.6). EN and PT are 44 × 44 px on touch devices.
- **Interface text in components** comes only from the dictionaries; the lint rule of section 7.1 enforces it. A project's words that a shell component shows reach it through props, or, for a tool's label, through the project's `toolLabel` (section 5.10) [D: X2-13, X2-22, 2026-10-05].
- **Numbers and dates** on screen follow the interface language through `lib/i18n/display.ts` (shell-owned): `formatNumber(value, locale, digits)`, `formatSeconds(ms, locale)`, for a run's day `formatDay(iso, locale)`, the UTC day, and for an instant such as when a recorded case was asked `formatDateTime(iso, locale)`, the UTC day and time with the zone named. These are P1's generic formatters; its store's dates and prices stay in P1 [D: X2-22, 2026-10-05; F: P1 `lib/i18n/display.ts`].
- **Text from a server page** [D: X2-22, 2026-10-05]. A server layout or page passes a project's words to a shell component as `Localized` values, the text of every locale, read from the dictionary with `localized(pick)` (`lib/i18n/localized.ts`); the component shows the current locale's (section 5.12).
- **Recorded English content** carries `lang="en"`: a tool's input and output, a failed check's data, a recorded case's question and answer (section 5.12). The pt-BR scan of the e2e (`englishLeftovers` in `e2e/helpers/i18n.ts`) skips `body [lang="en"]`, so data in English never reads as an untranslated interface string; it also skips the chat's messages, which are the visitor's and the model's words. Interface text never carries the mark: it comes from the dictionary in both languages [D: X2-22, 2026-10-05; F: P1's recorded thread and tool chip].

### 5.10 Tool calls and the trace [D: X2-02, X2-03, X2-13, X2-16, X2-22, 2026-10-05]

From P1, which shows each tool call as a chip and each answer's trace [F: P1 `lib/support/tool-view.ts`, `components/support/tool-call.tsx`, `components/support/answer-analysis.tsx`]. "Tool parts in the history" means this rendering: the history the route sends the model stays text only (section 5.8, the route's step 3) [D: X2-02, 2026-10-05]. Every file here is shell-owned and sits outside the chat paths, so a project without a chat keeps it (section 9, step 6b).

- **The tool view** (`lib/trace/tool-view.ts`). `toolViewsOf(message)` reads a message's tool parts, static (`tool-<name>`) and dynamic, in order, as `ToolView { id, name, input, output?, error?, state }`. `state` folds the SDK's seven part states into five: `running` (the input streaming or complete, an approved call the server has not run yet, or a preliminary output), `awaiting-approval` (`approval-requested`), `done` (`output-available`), `error` (`output-error`, with its text) and `denied` (`output-denied`, or a refused `approval-responded`). `denied` is final: the tool never ran, so a denied call never shows as running [F: `ai` 7.0.114 `UIToolInvocation`; P1 showed every state but an output or an error as running]. A sixth state, `interrupted`, is final too: `settledViews(views)` gives it to a call still `running` once its answer no longer streams. A Stop, an error or a server timeout ends the request and leaves every tool part in the state it had, so such a call would otherwise spin for the rest of the visit [D: X2-13; fixed 2026-10-06 after the X-02 review; F: `ai` 7.0.114 `Chat.makeRequest` sets only the chat's status when a request aborts or fails]. A tool the page runs itself, whose output it adds after the stream ends, shows as interrupted until that output arrives [D: W-P18, 2026-10-06]. The same type is what an eval run records for each call, so a recorded answer shows what a live one shows; P1's second record type goes [D: X2-13, 2026-10-05]. `stringField(value, key)` reads a string field of an input or an output, for a label.
- **The chip** (`components/trace/tool-call.tsx`). `ToolCall` shows the call's label and its state (a spinner while it runs; words for every state but done) and, once opened, its input, then its output or its error, as JSON (`JsonBlock`, marked `lang="en"` and wrapping on a phone, section 5.9). `ToolCallList(views, streaming)` lists an answer's chips in order, settled once the answer no longer streams, so a call cut off says "Not finished" ("Não concluída") with no spinner, its input still a click away [D: W-P16, 2026-10-06]. The trigger is a 44 px target on touch screens. `data-tool` and `data-tool-state` are what the e2e reads.
- **Labels** [D: X2-13, X2-22, 2026-10-05]. A chip's label is the project's: `toolLabel(view, t)` in the project-owned `lib/i18n/messages.ts`, from the project's own keys, and the shell's `toolCall.generic` ("Tool: {name}") for a tool it does not name. The chip adds the call's state after its label ("Working", "Waiting for approval", "The tool failed", "Denied", "Not finished"), so a label names the call, as a noun, and never says what the call did, and it leaves out a field the input has not streamed yet: the sample's reads "Item lookup: ITM-0042" ("Consulta do item ITM-0042"), and "Item lookup" ("Consulta de item") before the id arrives [D: W-16, 2026-10-06; P: W-P22 for the words]. The shell's chips read `toolLabel`, so every project keeps the export (section 5.8). A project's other words in the trace, such as a check's label, come in as props. Corrected 2026-10-06 (rule 6): the sample's "Looked up item {id}" and the shell's "Called {name}" said the call had run, so a running chip read "Looked up item ITM-0042 · Working" and a denied one claimed a call that never ran.
- **The answer's text** (`lib/trace/message-text.ts`) [D: X2-13; fixed 2026-10-06 after the X-02 review]. Each model call of an answer is a step that streams its own text parts. `messageText(message)` joins a step's parts as they are, as the SDK joins a step's text, and puts a blank line between the steps that hold text, so a sentence a model writes before a tool call and the answer after it never run together. The default renderer, the history the route sends the model (section 5.8, step 3) and the sample eval's recorded reply (section 5.11) all read it, so a recorded answer shows what a live one shows [F: until then the renderer and the route joined the parts with nothing, and the eval with a blank line]. The renderer still shows the whole text first and the chips after it, rather than text, chip and text in order, which would break the renderer contract's first `div` (section 5.8) [D: W-P19, 2026-10-06].
- **`hasTextOrTools`** (`lib/chat/ui.ts`): visible text or a tool call. It is the `hasContent` of a renderer that shows a chip for each call, so an answer shows its call while the tool runs, before any text (section 5.8). The typing dots (`showTypingIndicator`) still show while the answer streams with no visible text and no call running: once a call is over its chip stops moving, and the next step's first word may be seconds away, so something on screen always says more is coming [D: W-16, 2026-10-06].
- **The trace's metadata** (`lib/trace/trace.ts`) [D: X2-16, 2026-10-05]. `TraceMetadata { usage, latencyMs }`: the tokens of every model call of the answer (`TokenUsage`, with `null` for a count the provider did not report) and the answer's whole milliseconds on the server. `traceMetadataOnFinish(started)` is `toUIMessageStream`'s `messageMetadata`: it sends both with the finish chunk and nothing with any other. `traceMetadataOf(message)` reads them back as data, `null` for what has not arrived, next to any metadata of the project's own [F: P1 `lib/support/pipeline.ts` sends the same with its finish chunk]. `Check { id, ok, detail? }` is one condition an eval scored an answer by; `detail` holds data, never prose.
- **The blocks** (`components/trace/blocks.tsx`): `Block` and `Facts`; `ToolCallsBlock` (the chips of an answer that is over, so none spins, or "No tool was called."); `UsageBlock` (input, output and total tokens, then the latency in seconds, each "not reported" when missing; `data-testid="usage"`); `ChecksBlock` (the verdict, then each check named by the project's `checkLabel(id)`, its state for screen readers, and a failure's data marked `lang="en"`); `VerdictBadge` (`data-verdict`), whose pass and fail texts each reach 4.5:1 on their own tint (WCAG 1.4.3), as `components/trace/trace.test.ts` computes from the theme's colors [D: W-16, 2026-10-06]. A page arranges them; the template shows them on the recorded per-case page [D: X2-19, 2026-10-05].
- **The template's own chat** [D: X2-13, 2026-10-05]. The route offers the project's tools, the sample `lookUpItem` of `lib/tools.ts` (project-owned): a lookup of a fictional item by its id ("ITM-" and four digits) [D: W-P1, 2026-10-06], with `zod` for its input. Chat's default renderer shows the answer's text, then a chip for each tool call, then the caption, and with it Chat's default `hasContent` is `hasTextOrTools`, so the template's wrapper still passes no renderer of its own (section 5.8). In mock mode a message that names an item, such as "What is the status of item ITM-0042?", gets the call's chip and the answer "Item ITM-0042 (Brass desk lamp) is available." (section 5.2). The route does not send the trace's metadata yet: the template shows the trace on recorded answers only, and a project that shows it under live answers adds `messageMetadata: traceMetadataOnFinish(started)` [D: W-P13, 2026-10-06].
- **No dollar cost** [D: X2-03, 2026-10-05]. Tokens are the measured stand-in, and dollars stay on the Gateway dashboard, as in P1 [D: P1 D8]. A cost measured by the Gateway for each answer waits for its trigger, P4's router stretch, after a runtime check (section 10).
- **What stays in P1**: the retrieved passages block, which moves with the RAG code when P3 starts [D: Q6, 2026-10-01]; the hand-off card; the trace under each live answer, for an "X-03" after P2 [D: X2-06, 2026-10-05].

### 5.11 The eval core [D: X2-01, X2-17, X2-18, X2-20, 2026-10-05]

From P1, whose number is a server eval: frozen cases asked once each to the model, scored by script with no LLM judge, and a mock run checked in CI [F: P1 `scripts/eval.ts`, `lib/eval/*`, `lib/inbox/run.ts`]. The generic parts are shell-owned: `lib/eval/**` but the project's `lib/eval/project.ts` and its test, and `scripts/eval.ts`. None imports `lib/chat/` or `lib/rag/`, so a project without a chat keeps them (section 9, step 6b): `tests/shell-imports.test.ts` checks it in every project (a `lib/rag/` file is a project module, which no shell file may import), and `tests/chat-boundary.test.ts` in the template.

- **Commands** (section 7.1). `AI_MOCK=1 pnpm eval` re-records the mock run, `measurements/eval-mock.json`, at no cost. `AI_MOCK=1 pnpm eval --check`, which CI runs after the tests (section 7.3), runs the mock and fails unless every case's answer and score equal the committed mock run's; it writes nothing, so the build that follows shows the committed run. `AI_MODEL=<provider/model> pnpm eval` is a real run, by hand and with Felipe's OK, since it spends money; it authenticates as section 6 says.
- **The rules P1 learned** [F: P1 `scripts/eval.ts`, commit `cb97fb5`]. Before any case is asked: the frozen set's SHA-256 must equal the one recorded; `--check` refuses real mode, and any other argument is refused, so a typo never re-records; a real run refuses to overwrite a good run of the same day (section 7.5's paths); and a real run reads its commit from git, so it records the commit it started at and a git failure costs no request. `.env.local` loads before `lib/ai/model.ts`, which reads the environment when it loads. A real run that stops early writes its own `.aborted.json` and fails. Since 2026-10-06 the run also stops right after a case it cannot use, never after every case is paid for: an answer that failed, a scorer that throws, or a tally that is not whole units with `0 <= passed <= total` and `total >= 1` (`lib/eval/run.ts`); and when the summary or the project's extra data fail after the last case, the answers go to the `.aborted.json` too. The commit's "with local changes" ignores the eval's own files (`measurements/eval-*.json`, the mock run, an earlier run and an aborted one), so a run after an aborted one is not labelled dirty [D: X2-17; fixed 2026-10-06 after the X-02 review]. `lib/eval/command.ts` holds this flow with its inputs passed in, so each rule has a unit test, and `scripts/eval.ts` only loads the environment and the modules (`tests/eval-script.test.ts`).
- **The project's part** (`lib/eval/project.ts`, project-owned) is the `EVAL_PROJECT` export, an `EvalProject<Case, Result, Extra>`: `runCase(case, { model })` runs one case once and returns `{ result }`, or `{ abortReason }` for an answer that failed or was cut, which stops the run; `score(case, result)`, pure, returns `{ pass, tally: { passed, total }, checks, label? }`; `headline(numbers)` is README line 1's sentence; `volatileKeys` names the result's keys that differ between two mock runs of the same answers; and the optional `extra(results)` is the project's own data about the run, such as an index's hash. A case is `{ id, group }` plus the project's fields, and a result is `{ toolCalls, usage }` (section 5.10) plus the project's fields. `collectUIMessage(stream)` (`lib/eval/run.ts`) turns a chat pipeline's stream into the finished answer as the chat holds it, or into the reason to stop.
- **The run's file** (`lib/eval/record.ts`): `EvalRun<Result, Extra> { date, aborted, abortReason, mock, model, commit, caseSet { path, sha256, frozenOn, n }, results, summary, extra? }`. Each of its results holds the case's id, group and send time, its score, the project's result, and the latency the runner measures around `runCase`. A mock run records `commit: null`, and the check ignores the commit anyway, so the mock run never needs re-recording for a new commit alone [D: X2-18, 2026-10-05; F: P1 re-recorded its mock run four times only to refresh its commit, `f49dfd6`, `9dc512e`, `b992f62`, `4872023`].
- **The summary** (`lib/eval/summary.ts`). The headline is the share of scored units that passed, `tally.passed / tally.total`, with a seeded 95% percentile bootstrap that resamples whole cases (`lib/eval/stats.ts`, #2's statistics as P1 used them). A case that passes or fails as a whole is one unit, as in P1; a case of several units, such as a document's fields or a change's planted bugs, is a cluster the bootstrap keeps together [P: inference from P3's and P4's ROADMAP rows]. When every case scored the same, or there is a single case, the bootstrap's resamples never vary and its interval is a point ("95% CI 100–100%" for 24 of 24), which claims a certainty the cases cannot give. Then the interval is the Wilson 95% score interval of the rate, labelled with its method; otherwise the bootstrap stays, so the numbers compare with #2's and P1's [D: W-15, 2026-10-06]. Its trials are the cases, not the units, as in the bootstrap [P: W-P21]: 24 of 24 gives 86–100%, 1 of 1 gives 21–100%, 0 of 24 gives 0–14%. **Known limit of the fallback** [F: a probe through `summarizeResults` and `headlineNumbers`, 2026-10-06]: the two methods meet at a step, so a perfect run's lower bound can sit below that of a run one unit worse. For one-unit cases the step is small and goes either way: 24 of 24 gives 86–100%, while 23 of 24 gives a lower bound of 83%, 87% or 88%, depending on which case failed, since the seeded resamples go by position. For cases of several units it is large: 10 cases of 8 units each, every unit right, give 72–100% (Wilson over 10 cases), while 79 of 80, one unit wrong, give 96–100% (bootstrap), so the run that fixes its last unit prints a lower bound that falls from 96% to 72%. Counting the units as Wilson's trials (80 of 80 gives 95–100%) would keep that step small; it is part of W-P21. The summary records `interval.method`, `"bootstrap"` (with its resamples and seed) or `"wilson"` (with its number of cases). The summary also holds the cases passed, each group in the set's order, the failed ids, the tokens and the latency. **Known limit:** a case with no unit to score (`total: 0`, such as a change with no planted bug) stops the run right after it, and its aborted file keeps the cases before it; trigger: P4's design [D: W-P14, 2026-10-06; reworded the same day after the X-02 review, which found the refusal came only after every case was paid for].
- **The mock check** (`lib/eval/check.ts`) compares, case by case, the verdict, the label, the tally, the checks and each key of the result but the volatile ones; the run's date and commit and each case's send time and latency never count. It proves the scorer and the pipeline, not the model.
- **Labels are recorded once**: a run's labels and checks are written with it, and no page recomputes them. A scorer change ships with a new mock run, which `lib/eval/mock-run.test.ts` enforces by re-scoring the committed answers; a real run stays as recorded. Tests over a recorded run pick their examples by property, never by case id, so they hold when a real run replaces the mock one [F: P1 commits `af52583`, `f231eeb`, `fe1ae94`].
- **The shown run** (`lib/eval/runs.ts`): the newest finished `measurements/<metric>-YYYY-MM-DD.json`, else the metric's mock run, found by the metric's name rather than a fixed `eval-`; an aborted run, or one without a summary, is never shown. Server-only: a page reads it at build time and passes it to client components as data, labelled by `runLabel` of `lib/eval/view.ts` (section 5.12).
- **README lines** (`lib/eval/readme.ts`): line 1 is `# <PRODUCT_NAME> — <headline> (95% CI <low>–<high>%)`, with `, Wilson score` after the numbers when the interval is Wilson's [P: W-P20]; the first line of "How it's measured" gives n, the groups, the model, the day, the commit, each group's passes, the failures, the median time and tokens per case, and the raw-data link (section 8) [D: W-P4, 2026-10-06]. A project's own facts, such as how its cases reach the model or what it checks by hand, go on the README's next lines, by hand. A mock run's lines only show the format.
- **The sample** [D: X2-20, 2026-10-05], project-owned and replaced at import (section 9, step 6): `measurements/cases.json`, three frozen cases [D: W-P2, 2026-10-06], one through the sample tool `lookUpItem` (section 5.10) and two that need no tool, each passing when its answer calls exactly the expected tools and its reply holds the expected phrases; `measurements/cases.sha256`; and the mock run, in which all three pass. Its `runCase` calls the model with `TOOLS` and the limits of `lib/ai/limits.ts`, not through `lib/chat/`, so it survives step 6b; a chat project runs its cases through its chat's own pipeline instead, so its eval measures what a visitor gets. `.prettierignore` keeps the cases and the runs byte for byte.

### 5.12 The app shell and the Evals pages [D: X2-04, X2-09, X2-12, X2-19, X2-21, X2-22, 2026-10-05]

From P1, whose desk frames its pages and whose Evals page reads the eval's run [F: P1 `components/desk/desk-shell.tsx`, `components/evals/evals-view.tsx`, `lib/evals/`]. The frame, the views and the view model are shell-owned; the layout and the pages, which name the project's pages and words, are the project's (section 5.8).

- **Routes** [D: X2-09]. `/` stays the full-page chat, outside the shell (section 5.6), and links to no shell page: from `/` a visitor reaches `/evals` only by its URL, while the shell's nav links back to `/` [D: W-P6, 2026-10-06]. The project-owned `app/(shell)/layout.tsx` wraps `/evals` and `/evals/[case]`. Both read the shown run (section 5.11) at build time; `/evals/[case]` builds one page per case of the run and sets `dynamicParams = false`, so any other id is a 404 and no deployed route reads `measurements/`. `lib/eval/runs.ts` therefore marks its two file reads `turbopackIgnore`; without the marks the build traced the whole repo into the server's output [F: `next build` 16.3.6 warned "Dynamic filesystem access causes tracing of the whole project" until then]. A 404 there logs Next's internal `NoFallbackError` on the server once [F: `next start` 16.3.6, the e2e's log].
- **`AppShell`** (`components/app-shell/app-shell.tsx`) [D: X2-12]: props `brand { icon, tagline? }`, `nav`, `actions?`, `banner?` and `children`, plus the header's values. It renders the nav, held open from md up and on a phone a sheet opened by a 44 px button in the header; then the site header, the banner (`role="note"`), the page in `<main>`, and the footer. From lg up the frame fills the window and the page scrolls inside it, so a page's columns can scroll on their own; below lg the window scrolls. A nav item is `{ href, label, icon }`, marked `aria-current="page"` on its path and below it, `/` on itself only (`components/app-shell/nav.ts`). It imports nothing of the chat, so a project without a chat keeps it (`tests/chat-boundary.test.ts`). The template's layout names two pages, the chat and Evals, a brand line and a banner that says the data is the template's sample, in words of the project's own `site` keys [D: W-P3, 2026-10-06].
- **The header's values.** `siteHeaderProps()` (`lib/site-header.ts`, shell-owned, server-only) gives `modelLabel`, `isMock` and `commit` (section 5.6). The chat page, the shell's layout and the non-chat page of section 9 step 6b read it, where each wrote the three values before.
- **Words in every language** [D: X2-22]. A server layout or page cannot know the locale, which the client resolves (section 5.9), nor pass a client component a function. So it passes the project's words as `Localized` values, `Record<Locale, string>`, read from the dictionary by `localized((t) => …)` (`lib/i18n/localized.ts`, shell-owned), which throws on an entry missing or empty in any locale, so the build fails instead of a page showing a blank. The shell's components show the current locale's text and read only shell keys (`appShell`, `run`, `evals`). The template's own words are `site` and `evalText` in `lib/i18n/messages.ts`.
- **Page titles** [D: X2-12; fixed 2026-10-06 after the X-02 review; D: W-P17, 2026-10-06]. Next's route announcer speaks a client-side navigation to screen readers only when the document's title changes [F: `next` 16.3.6 `app-router-announcer.js`], and WCAG 2.4.2 asks each page for a title of its own. A page's title is `pageTitle(name)`, "<name> · <product>" (`components/app-shell/page-title.ts`), and the root layout's `title.template` is the same function with Next's `%s`, so a page that names itself in its metadata, as the Evals page and each case's page do, is served with its English title, and one that does not, such as the chat, keeps the product's name. On the client, `usePageTitle((t) => …)` (`components/app-shell/use-page-title.ts`) sets the title in the interface language. React writes the served title back when it hydrates the head after the page's effect, and a navigation's new head can land after it too, so while a page is shown the hook replaces its served title again whenever it returns, and leaves any other page's title alone [F: the e2e of 2026-10-06]. A project's page in the shell names itself the same way.
- **The primitives** [D: X2-12; F: P1 commit `1658e41`]: `sidebar`, `sheet` and what the sidebar imports (`input`, `separator`, `skeleton`, `tooltip`, `hooks/use-mobile.ts`), with `card` and `table` for the Evals page, as P1's shadcn CLI generated them, with P1's three edits: `SheetContent` takes `keepMounted`, `Sidebar` takes the phone sheet's `mobileTitle` and `mobileDescription`, and `use-mobile` reads the media query through `useSyncExternalStore`. Three more edits here: the sidebar writes no `sidebar_state` cookie, which nothing read; its phone sheet renders no close button, which the generated file hid with CSS and labelled "Close"; and it has no Ctrl+B or Cmd+B shortcut, which called `preventDefault` and toggled a sidebar the app shell holds open, so it only took the key from the browser and from bold in a text field (`e2e/evals.spec.ts`) [D: W-16, 2026-10-06]. Their English defaults never show: the app shell passes the dictionary's title and description, and renders neither `SidebarTrigger` nor `SidebarRail` ("Toggle Sidebar"). They stay template base, as the other primitives (section 5.8). `tabs`, `select`, `popover` and `scroll-area` stay in P1, since nothing here uses them.
- **The view model** (`lib/eval/view.ts`, shell-owned) [D: X2-19]. On the server, `evalsView(shown, EVALS_PAGE)` and `caseView(shown, id, EVALS_PAGE)` turn the shown run into the data the client views show; `runLabel(run)`, moved here from `lib/eval/runs.ts` so a client view may import it, labels the run. `evalsHeadline` and `supportingText` write the numbers in the interface language. Nothing is recomputed: every number and label comes from the run's file (section 5.11). The project supplies `EVALS_PAGE`, an `EvalsPage`, in `lib/eval/project.ts`: the headline sentence (in English, README line 1's: the template's `EVAL_PROJECT.headline` formats `evalText.headline`), how a case is scored, the groups' and the checks' labels, the Evals page's path, `caseHref(id)`, its own supporting rows, and for a chat case the question and the recorded answer.
- **The Evals page** (`components/evals/evals-view.tsx`), in fixed sections: the run's label (its day, model and commit, and for a mock run a badge and a note); the headline; each group's pass count; the supporting data; the cases, a row each with its group and verdict, linking through `caseHref(id)`; and the run's details (day, model, commit, the case set with the first 12 characters of its SHA-256, the interval's method and the raw data's link, `REPO_URL/blob/main/<file>`). A real run's headline is the project's sentence, then its 95% CI and the cases passed; a Wilson interval is labelled on that line, "(Wilson score)", and the run's details say why the bootstrap gave way to it [P: W-P20]; its supporting data are the median and the slowest latency, the median tokens per case and the run's tokens, then the project's rows; its rows add each case's latency and tokens.
- **The mock gate** [D: X2-04, 2026-10-05]. A mock run shows its pass counts and no measured number: its headline is the statement "Mock run: 3 of 3 mock answers passed the grader. No measurement yet." [F: P1 `lib/evals/headline.ts`], with no rate, interval or method, no supporting data, no latency or token column and no commit. The template only ever holds a mock run, so `lib/eval/view.test.ts` builds a real run's page from a fixture.
- **A case's page** (`components/evals/case-view.tsx`): a link back to all cases; the case's id, its group and the run's label; the question and the recorded answer, marked `lang="en"` (section 5.9); then the trace of section 5.10: `ChecksBlock` with the project's labels, `ToolCallsBlock`, and `UsageBlock`. For a mock run the usage block says that a mock run measures no tokens and no latency, in place of the mock's figures [D: W-P5, 2026-10-06].
- **Client imports** [D: X2-21]. `tests/client-imports.test.ts` follows every value import of each `"use client"` module through the repo and fails on a Node built-in or on `lib/ai/model.ts`, which throws in a browser; a client module names a server module's types with `import type` only (an `import { type A }` counts as a value import). It travels with the shell.
- **What stays in P1**: the inbox, its list, detail and aside grid and its tabs, the outcome matrix and chips, the drawer and `/try` [D: X2-05, X2-06, 2026-10-05].

## 6. Environment variables (`.env.example`)

| Variable | Required | Vercel environments [D: U-04, 2026-09-28] | Purpose |
|---|---|---|---|
| `AI_MOCK` | no | Preview only, set to `1`, so preview deploys cost nothing. Never Production | `1` = use the mock model. CI and keyless local runs (`pnpm dev:mock`) set it. Forbidden in production (throws). |
| `AI_MODEL` | yes, unless mock | Production | `"provider/model"` string for the AI Gateway |
| `AI_GATEWAY_API_KEY` | local real-model runs | none: deployments use OIDC | Gateway auth outside Vercel; on Vercel, OIDC is used automatically (see 5.1). Instead of a key, a local real run such as `pnpm eval` (5.11) may use the OIDC token that `vercel env pull .env.local` writes (git-ignored); it pulls Development's variables, so `AI_MODEL` goes in the command, and the token expires, so a later run pulls it again [D: X2-27, 2026-10-05; F: P1 spec §7, rollout step 2] |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or the `UPSTASH_REDIS_REST_*` pair) | no | Production only, injected by the Upstash for Redis integration (5.3) [D: U-02, 2026-09-28] | Enables the rate limiter (see 5.3). Empty = off. |
| `RATE_LIMIT_PER_HOUR` | no | Production, only to change the default [D: U-P2, 2026-09-28] | Default 20 |

**Environments** [D: U-04, 2026-09-28; F: #1 spec §3.2, "Deploy environments"]:

- Development gets no Upstash variables, so local runs, including after `vercel env pull`, never touch the production rate-limit store. Preview gets none either, so preview traffic never shares production's per-IP counters; with `AI_MOCK=1` it calls no model anyway.
- In the dashboard, tick only the environments in the table. With the CLI, `vercel env add <name> production` scopes a plain variable. The Upstash integration needs `vercel integration add <integration> -e production`: without `-e` it connects Production, Preview and Development, then runs `vercel env pull` [F: vercel CLI 59.15.1 `integration add --help`; vercel.com/docs/integrations/install-an-integration/product-integration].
- Existing deployments do not get new or changed variables, so redeploy after any change [F: vercel.com/docs/integrations/install-an-integration/product-integration, updated 2026-09-17].

**Local runs without a `.env` file.** `pnpm dev` with no `.env` fails the missing-`AI_MODEL` guard. So the scripts `dev:mock` (`AI_MOCK=1 next dev`) and the README "Run it" line set `AI_MOCK=1` explicitly [P].

## 7. Quality gates

### 7.1 Scripts and lint [P]

| Script | Command |
|---|---|
| `dev` | `next dev` |
| `dev:mock` | `AI_MOCK=1 next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint .` — the Next 16 CLI has no `lint` command [F: Next.js CLI reference, command table] |
| `format` | `prettier --write .` |
| `typecheck` | `next typegen && tsc --noEmit` — `next-env.d.ts` and route types are generated, not committed [F: Next.js TypeScript docs, `next typegen`] |
| `test` | `vitest run` |
| `e2e` | `playwright test` |
| `eval` | `tsx scripts/eval.ts` — the eval of section 5.11; `tsx` 4.23.15 is P1's pin [D: X2-17, 2026-10-05; F: P1 `package.json`] |

**Provider-import rule.** In `eslint.config.mjs`, `no-restricted-imports` blocks the pattern group `['@ai-sdk/*', '!@ai-sdk/react', '!@ai-sdk/provider', '!@ai-sdk/provider-utils']` everywhere except `lib/ai/model.ts`. CI enforces it in the `lint` step. Model ids live only in env vars; the README and measurement files may name the model.

**Interface-text rule** [D: V-09, 2026-09-29; D: X2-24, 2026-10-05]. `react/jsx-no-literals` applies to `components/**` except `components/ui/**`, with the allowed strings `EN`, `PT`, `Felipe Rêgo` and `·`, so interface text comes from the dictionaries (section 5.9) and the language switch cannot miss it. With `noStrings: true` and `ignoreProps: true` it sees a child's text, bare or in braces (`{"text"}`, `` {`text`} ``, `{"a " + b}`), but not props, nor a string inside another expression (`{ok ? "a" : "b"}`); until 2026-10-05 it saw bare text only. The shadcn/ui primitives hold no interface text, and `app/` is outside the rule, so the non-chat page's "Replace this page." passes (section 9, step 6b). `tests/eslint-jsx-literals.test.ts` pins the rule.

### 7.2 Testing

**Vitest, node environment.** Pure logic is unit-tested; UI behaviour is covered by Playwright.

- This changes D-sec1 (CLAUDE.md rule 6). Section 1 approved "Vitest + Testing Library". D-S-18, approved later for project #1, removes jsdom component tests.
- Applying D-S-18 to the template means `@testing-library/*` and `jsdom` are not installed [P].
- Trigger to revisit: the first project with UI logic that can be neither extracted into a pure function nor covered by Playwright.

**File naming** [P]:

- Vitest files are `*.test.ts`, next to their module or in `tests/`.
- Playwright files live under `e2e/` as `*.spec.ts`, or `*.measure.ts` for measurement (section 7.5). Shared e2e code lives in `e2e/helpers/`.
- `vitest.config.mts` sets `environment: 'node'`, `include: ['**/*.test.ts']`, `exclude: [...configDefaults.exclude, 'e2e/**', '.next/**']`, and the `@/` alias through `resolve.alias`.
- Vitest's default include also matches `*.spec.ts` [F: Vitest defaults, via context7 during the spec review], so the config narrows it.
- Whether Vitest reads tsconfig `paths` by itself is UNVERIFIED; setting the alias explicitly makes it moot.

**Template unit tests** [P]:

- Without Upstash env, `rateLimit` always returns `{ ok: true }` and logs once.
- With env (Upstash mocked), the limiter is built with `slidingWindow(20, '1 h')` keyed by IP, and a denial maps to `{ ok: false, retryAfterSeconds }`.
- `rateLimitResponse` returns 429 with the text and `Retry-After`.
- A fresh import of `lib/ai/model.ts` (`vi.resetModules()` + `await import()`) rejects:
  - with `AI_MOCK=1` + `VERCEL_ENV=production`
  - with `AI_MOCK` unset and no `AI_MODEL`
- Only `REDIS_URL` or only `KV_URL` leaves the limiter off [D: U-02, 2026-09-28].
- `guardModelRoute` [D: U-01, 2026-09-28], with #1's route cases ported:
  - a `text/plain` POST gets 415 with the exact text, and its body is never read (`bodyUsed === false`)
  - a request with no Content-Type gets 415
  - `application/json`, `application/json; charset=utf-8` and `Application/JSON` pass
  - a 429 comes before the Content-Type check, and a request the 415 turns away was still counted by the limiter
- `lib/measure/record.ts`: the UTC day, the good and `.aborted.json` paths, the metric-name check, and the no-overwrite rule [D: U-05, 2026-09-28]; per-run metric names (7.5) [D: U-P4, 2026-09-28].
- `playwright.config.ts`: `retries: 0` and `trace: "retain-on-failure"`, even with `CI` set; the `measure` project and no `webServer` only when `MEASURE_URL` is set [D: U-05, U-06, 2026-09-28]; `RATE_LIMIT_PER_HOUR: "20"` in the `webServer` env [D: V-10, 2026-09-29].

**Unit tests that came with X-01** [D: V-10, 2026-09-29]. The shell's tests moved or were rebuilt with the code (X-01 design §6):

- `lib/project.test.ts`: `PROJECT_SLUG` equals the `package.json` `name`, and `REPO_URL` ends with `/${PROJECT_SLUG}` [D: V-03, 2026-09-29].
- `lib/i18n/locale.test.ts`: locale resolution, `requestLocale`, `interfaceLanguageLine`, the storage key.
- `lib/i18n/messages.test.ts`: no empty value; the same keys and placeholders in both locales; `format`; the shell text equal to the approved text; shell and project top-level keys disjoint. It reads no project key by name, so a project's own checks (#1's prompt count, #2's prompt order) stay in the project.
- `lib/chat/ui.test.ts`, with `hasContent` cases for `regenerateSlot`, `showTypingIndicator` and `announcement`, and since X-02 `isComposingKey` and `isSendDoubleClick` (section 5.8) [D: X2-24, 2026-10-05], and the typing dots after a call is over and before the next step's text (section 5.10) [D: W-16, 2026-10-06]; `hooks/use-stick-to-bottom.test.ts`.
- `lib/chat/validate.test.ts` and `tests/api-chat-route.test.ts` (with `tests/helpers/sse.ts`), ported from #1, plus the whole history reaching the model, and since the X-02 review an answer's steps reaching it a blank line apart. Their boundary cases come from the constants of `lib/chat/limits.ts` and `lib/chat/config.ts`, not from literals, so they stay meaningful when a project changes a limit [P: V-P4].
- `lib/chat/instructions.test.ts`: the no-Markdown rule, the language rule, the interface line last.
- `lib/chat/limits.test.ts`: `MAX_ASSISTANT_CHARS` fits an honest answer at `MAX_OUTPUT_TOKENS`, read from `lib/ai/limits.ts`, and stays near it (section 5.8). `lib/ai/limits.test.ts`: the model-call limits are positive integers, and `MAX_STEPS` leaves room for a tool call and the answer after it (section 5.1) [D: X2-14, 2026-10-05].
- `lib/ai/mock.test.ts` and `lib/ai/mock-steps.test.ts`: the stream parts, the step machine and the shell's scenarios of section 5.2, driven by the tests' own scenarios, never the project's. `lib/ai/mock-scenarios.test.ts` (project-owned, like the file it tests): the template's cues and answers, with the sample tool run through `streamText` within `MAX_STEPS`. `tests/api-chat-route.test.ts` also checks that no suggested prompt leads the mock to a tool call [D: X2-15, 2026-10-05].
- `lib/trace/tool-view.test.ts`: every SDK tool state folds into its view state, with a denied call final and never running; a call still running once its answer is over settles as interrupted [D: X2-13; fixed 2026-10-06 after the X-02 review]; dynamic parts; the views survive JSON. `lib/trace/message-text.test.ts`: a step's text parts as they are, and each step's text a blank line apart. `lib/trace/trace.test.ts`: the finish helper sends the tokens of every step and the latency on the finish chunk only, through `streamText` and `toUIMessageStream`, and `traceMetadataOf` reads them back or gives `null`. `lib/i18n/display.test.ts`: numbers in both locales. `lib/chat/ui.test.ts` also covers `hasTextOrTools` (section 5.10) [D: X2-13, X2-16, X2-22, 2026-10-05].
- `lib/tools.test.ts` (project-owned, like the file it tests): the sample lookup, the mock's cue reading every sample id, the sample question answered through `streamText` within `MAX_STEPS`, and a label of its own for every tool in both languages, so no chip of the project's falls back to "Tool: {name}"; the sample's label in every state the chip shows, and with no id while the input has none yet [D: W-16, 2026-10-06]. `tests/api-chat-route.test.ts` also checks that the route offers the project's tools, runs the sample tool and streams the answer from its result, stops a model that keeps calling tools at `MAX_STEPS`, and accepts a history that holds a tool call while sending the model only its text [D: X2-13, 2026-10-05; F: P1's route tests].
- **Server renders.** `components/chat/chat.test.ts` (Chat's `header` seam, and its default `hasContent` for the default renderer and for one of the project's own [D: W-16, 2026-10-06]), `components/chat/plain-text-message.test.ts` (the default renderer: text, each step's a blank line apart, chips, caption, and a call cut off by the end of the answer shown as not finished) and `components/trace/trace.test.ts` (the chip in each state, its data, a list that no longer streams with no spinner, the trace blocks, and the verdict badge's contrast, computed from the theme's colors [D: W-16, 2026-10-06]) read a component's server render, `react-dom/server`'s `renderToStaticMarkup`, the English prerender, in node with no DOM: what a part shows, not what a click does. A click stays with Playwright, and neither jsdom nor Testing Library comes back [D: X2-10, X2-13, X2-16, 2026-10-05].
- **The eval** (section 5.11) [D: X2-17, X2-18, X2-20, 2026-10-05]. `lib/eval/*.test.ts`: the statistics, with the tests that came with them; the summary over units and cases, and its Wilson interval for 24 of 24, 1 of 1 and 0 of n, a normal run keeping the bootstrap; the README lines; the mock-run compare, with volatile keys; the frozen set's hash and shape, and the committed set's recorded hash; the runner's order, its stop rule (an answer that failed, a scorer that throws, a tally it cannot count) and `collectUIMessage`; the run picker by metric, against a temporary folder; each rule of the command, before any case runs, the commit read first, the aborted file after a summary that fails, and the dirty check against a temporary git repository [D: X2-17; fixed 2026-10-06 after the X-02 review]; and the committed mock run, re-scored by the project's scorer (`lib/eval/mock-run.test.ts`). `tests/eval-script.test.ts`: the script loads `.env.local` before anything that reaches `lib/ai/model.ts`. `lib/eval/project.test.ts` (project-owned, like the file it tests): the sample's cases, its scorer, and `runCase` through the mock.
- **The app shell and the Evals pages** (section 5.12) [D: X2-04, X2-12, X2-19, X2-21, 2026-10-05]. `lib/eval/view.test.ts`: the view model of a mock run (the pass counts, no measured number, the D9 statement) and of a fixture real run (the headline's numbers and method from the summary, the supporting rows, each case's latency and tokens), the run's label, a case's page, and the numbers in both languages. `lib/site-header.test.ts`: the header's values, `local` for an unset or empty commit. `lib/i18n/localized.test.ts`: every locale's entry, and a missing one refused. `components/app-shell/nav.test.ts`: which nav item is current. `components/app-shell/page-title.test.ts`: a page's title and the root layout's template agree. `lib/i18n/display.test.ts` also covers `formatDay`, and `formatDateTime` [D: X2-22, 2026-10-05]. `lib/eval/project.test.ts` (project-owned) also checks that `EVALS_PAGE` labels every group and check in both languages and that its English headline is README line 1's. `tests/client-imports.test.ts`: no client module reaches a Node built-in or `lib/ai/model.ts` through a value import.
- `tests/vercel-config.test.ts` (section 5.1) and `tests/eslint-jsx-literals.test.ts` (section 7.1).
- `tests/shell-imports.test.ts`, which travels with the shell (section 5.8). It reads imports with TypeScript's parser, so a comment that names `lib/chat/` is not an import. It also checks that a shell file reads only the shell's keys of the dictionary (section 5.9) [D: X2-22, 2026-10-05]. Its helper, `tests/helpers/repo-files.ts`, lists the repo's tracked and unignored files and the shell files, the trace's and the app shell's among them [D: X2-21, 2026-10-05].

**Template-only guards** [D: V-10, V-11, 2026-09-29]. They are deleted at import (section 9, step 1), because in a project they would fail on expected code: #2's renderer and measurement import the shell from outside the chat paths, and later projects will name #1 or #2 (X-01 design §4.1).

- `tests/chat-boundary.test.ts`: nothing outside the chat paths (the files section 9, step 6b deletes) imports them, except `app/page.tsx`. It proves the removal recipe. It also checks that nothing else imports `@ai-sdk/react`, which the recipe removes, and that every path the recipe deletes exists [P: V-P6]. It reads the `rm` commands of section 9, steps 1 and 6b.1, out of this spec [P: V-P9], and checks that every folder they name comes from an `rm -r`, so a lost flag fails [D: X2-24, 2026-10-05]. It also reads the owner table of section 5.8 and checks it against the lists in code (section 5.8) [D: X2-21, 2026-10-05], and that the Project row names the test beside each file it names [D: W-16, 2026-10-06].
- `tests/no-project-strings.test.ts`: a case-sensitive list of product and feature strings of #1, #2 and P1 (product names, repo slugs, "AI SDK Core", "First token", P1's store brand, help center, folders, tool names and eval unit, and the like), over the files outside `docs/`, excluding itself. Ordinary words P1 uses, such as "store" or "customer", stay usable [D: X2-23, 2026-10-05; D: W-P10, 2026-10-06 for the list]. No personal data goes in the list.
- `tests/shell-comments.test.ts`: no decision or proposal id (regex `\b(?:X-01(?:<wrap>|\s*)[PQ]\d+|X\d-\d+|[A-Z](?:-[A-Za-z]+)?-\d+|[A-Z]-[A-Za-z]+\d+|DR\d+)\b`, where `<wrap>` is a line break and the next line's comment marker; it catches R-07, D-S-22, D-chat-2, D-sec1, U-P1, V-P7, W-01, DR1, the X-01 design's own items such as "X-01 P7", even wrapped across a comment line, and the X-02 design's X2-01, with `X-01` and `X-02` as the exceptions; ES6 or MP4 pass) and no project spec ("delta spec", "#1 spec", "P1 spec") in the code. The id and project-spec checks cover every code file outside `docs/`, not only the shell files [P: V-P6; D: X2-23, X2-24, 2026-10-05]. Every file outside `docs/`, configs and `.env.example` included, names the document of each section it cites: "template spec §N" (or "Template spec §N" at a sentence's start), or "X-01 design §N", its precedent, with a comment's line break allowed anywhere inside the citation. Code moved by X-02 cites the template spec only, since step 1 deletes the X-02 design [D: W-P9, W-16, 2026-10-06]. Corrected 2026-10-06 (rule 6): the named-section check ran over shell files only and accepted "X-02 design §N".

**Playwright** [P]:

- `testDir: 'e2e'`, with a `chromium` project (Desktop Chrome), plus a `measure` project only when `MEASURE_URL` is set (section 7.5) [D: U-05, 2026-09-28].
- `retries: 0` and `trace: 'retain-on-failure'`: a flaky test fails instead of passing on a retry, and every failure keeps its trace, which "on-first-retry" would not record without retries. A project that needs a retry scopes it to one describe, as #1 does for its calibration test [D: U-06, 2026-09-28; F: #1 spec §14 A-17].
- `webServer.command` is `pnpm start` when `process.env.CI` is set, because CI step 10 has already built with `AI_MOCK=1`. Locally it is `pnpm build && pnpm start`.
- `webServer.env` sets `AI_MOCK=1` and sets the Upstash variables to `''`, so e2e never uses a real limiter even when a local `.env*` file holds them. Process env takes precedence over `.env` files [F: @next/env 16.3.6 fills only keys that are undefined in process.env]. `webServer.timeout` is `180_000`, and `reuseExistingServer` is `!process.env.CI`. The e2e server listens on port 3100, so it never reuses a dev server on 3000.
- `webServer.env` also sets `RATE_LIMIT_PER_HOUR: "20"`: the e2e literals that show the hourly limit (the rate note, the 429 text) assume the default, and a local `.env*` value must not change the page a local run builds [D: V-10, 2026-09-29].
- Both paths run against a production build, not `next dev`, so first-compile time never pollutes latency assertions [P: lifts D-S-12 into the template].
- The template ships these specs [D: V-10, 2026-09-29 for the last three]:
  - the smoke spec: the page renders, the mock badge is visible in the header, the header's `data-commit` holds the build's commit or `local` (what a measurement records, section 7.5), and `/api/health` returns `mock: true` [D: X2-11, X2-24, 2026-10-05 for the header scope and `data-commit`]
  - `measure-guards.spec.ts`: the measurement guards of section 7.5, against the mock build and in the test's own output folder [D: U-05, 2026-09-28]
  - `i18n.spec.ts`, the site in both languages. It waits on `data-hydrated` and reads only the header, the switch and the footer, so a non-chat project keeps it. It covers #2's site-level language tests: the served HTML stays English, with the project's metadata; `?lang=`; the switch; a stored choice across a reload; blocked storage; the switch removing only `lang`, with no reload and no router request; a `?lang=` alone never stored. It also checks that the switch ends the header, and the 44 px targets at 375 px [P: V-P7 for what it adds to #2's], and since X-02 that the pt-BR scan skips English marked `lang="en"`, and only that (section 5.9) [D: X2-22, 2026-10-05].
  - `chat.spec.ts`, the chat: #2's version of each test the two projects share, with #1's history body for Regenerate, a second send that posts `[user, assistant, user]`, a unique `[[error]]` text, and #1's `MAX_MESSAGES` cap test instead of #2's "no message cap". It adds the checks neither project had: "Response complete" and the English "Response stopped", an Esc another handler already handled, PageUp, a stop (PageUp, an upward wheel or a touch move) that the last pin's queued scroll event does not undo, a rotation that never moves a followed view up (scroll anchoring is off while following) [D: X-01 Q5; F: X-01 design §4.2], and Jump, Retry and the footer links at 44 px on a 375 × 812 touch screen. Since 2026-09-30 it also pins a follow-up after an answer longer than `MAX_ASSISTANT_CHARS` [P: V-P8], the composer's focus after New chat at the message cap (mouse and keyboard), a double-click on Send, and the view staying at the bottom through a rotation or a smaller view. Since X-02 it also pins the composer of section 5.8: Enter and Esc inside an IME composition and in Safari's order (`compositionend`, then the key with `keyCode` 229) neither send nor stop; a click on Stop past 500 ms after the send stops, even as the second click of a chain; and a draft typed while the answer that reaches the cap streams keeps the focus and the draft, under the visible cap text that describes the composer [D: X2-24, 2026-10-05]. Since the X-02 review it also pins Esc in a panel (section 5.8): a chat hidden while it streams ignores Esc and stops on it once shown again, and an Esc that a document listener added after the send handles does not stop [D: W-16, 2026-10-06]. No template test reads `data-ttft-ms`.
  - `chat-i18n.spec.ts`, the chat in both languages, with #1's history-mode body test.
  - `evals.spec.ts`, the Evals page and a case's page [D: X2-04, X2-12, X2-19, 2026-10-05]: the header's contract and the nav inside the shell; the run's label; for the mock run the D9 statement, with no rate, interval, method, supporting data, latency or token count; each group's pass count; a row per case linking to its page; the run's details and the raw data's link; a case's question, answer, checks, tool chips and usage block (the mock statement); a 404 for an id the run does not hold; no English interface text in Portuguese; on a 375 × 812 touch screen no sideways scroll, 44 px targets and the nav's sheet, in both languages; and each page's title, served in English, set in Portuguese on the client, and announced after a link [D: X2-12; fixed 2026-10-06 after the X-02 review]. What each page should show comes from the shown run through the view model, and the cases are picked by property, so it holds after a real run; every path it opens or expects is `EVALS_PAGE`'s `evalsHref` or `caseHref`, and on a case's page it expects the Evals item current only when the case's path is below the Evals page's, so it holds wherever a project puts its pages. It also checks that the app shell leaves Ctrl+B and Cmd+B to the browser [D: W-16, 2026-10-06]. The case the trace tests open is one with a tool call when the run holds one, else the first case, and the chips checked are the ones it has, none included, so an eval that calls no tool keeps the spec (corrected 2026-10-06, rule 6: it required a case with a tool call, which step 6's project without a tool and a non-chat project do not have). It reads nothing of the chat, so a non-chat project keeps it.
  - `chat-tools.spec.ts`, a tool call in the chat [D: X2-13, 2026-10-05]: the chip after the answer's text, its input and output a click away; an answer that is only a tool call still shown, with Regenerate; a follow-up that posts the call in the history and gets its answer; the chip in Portuguese with its data marked English; a call cut off by an error, a server timeout or Stop shown as not finished, with no spinner [D: X2-13; fixed 2026-10-06 after the X-02 review]; while the answer streams, its text, a running call's chip or the typing dots always show [D: W-16, 2026-10-06]; a 44 px target and no sideways scroll on a 375 × 812 touch screen. It reads the project's tool literals from `fixtures.ts`.
- Shared e2e code lives in `e2e/helpers/`: `i18n.ts` (the header, switch and footer locators and the language checks; a non-chat project keeps it), `chat.ts` (the chat locators, faked SSE answers, the posted body, the waits) and the project-owned `fixtures.ts` (the prompt literals in both languages, the full default answer, the 429 texts, the empty-state text and the rate notes, the sample tool's question, labels, data and answer, and `CHAT_PATH`, the route the chat specs open, section 5.8) [P: V-P7 for the split; D: X2-11, 2026-10-05 for `CHAT_PATH`]. The chat locators search the whole page, so New chat is found in the site header or in a bar of the project's own [D: W-16, 2026-10-06].

### 7.3 CI (`.github/workflows/ci.yml`) [D-sec1]

**Triggers:** push to `main` and pull requests.

**Steps:**

1. checkout
2. pnpm setup (`pnpm/action-setup`, with the version from the `packageManager` field)
3. Node 24 with the pnpm cache
4. `pnpm install --frozen-lockfile`
5. `lint`
6. `typecheck`
7. `test`
8. `pnpm eval --check`, the mock eval (section 5.11) [D: X2-26, 2026-10-05]
9. `pnpm exec playwright install --with-deps chromium`
10. `build`
11. `e2e`

**Environment:** `AI_MOCK=1` at the job level, and no secrets are referenced [D-sec1].

The Playwright HTML report is uploaded as an artifact on failure [P]. The CI badge goes on README line 3 (section 8) [D-sec1].

### 7.4 Deploy [D-sec1]

- Vercel Git integration: every PR gets a preview URL, and `main` deploys to production.
- Preview deploys run the mock model (`AI_MOCK=1` in Preview only) and have no rate-limit store; only production calls the model (section 6) [D: U-04, 2026-09-28].
- The template repo itself is **not** deployed [P]. Only generated projects are.

### 7.5 Measurement [D: U-05, 2026-09-28]

Every project publishes one measured number (section 1). The pattern comes from #1 [F: #1 spec §5.2, §5.4 and §14 A-16; `portfolio/ROADMAP.md` (Felipe's workspace, not public), "Lessons to carry forward", item 5]:

- **Two kinds of number** [D: X2-17, 2026-10-05]. A latency number is measured in the browser against the deployed demo, by the rules of this section. An accuracy number is measured by the server eval of section 5.11, P1's pattern: a script asks each frozen case to the model from a local machine, with no browser and no stated location, and records the model from `MODEL_LABEL` and the commit from git, not from a page header. The rules on the raw file (committed, an aborted run in its own file, no good file overwritten, no number typed by hand) hold for both. Corrected 2026-10-05 (rule 6): this section described the browser pattern only.
- **A latency number: against the deployed demo, from one stated location.** It is never measured on a local or mock build. `MEASURE_LOCATION` (e.g. `'Recife, home fibre'`) is required and is published with the number. It is measured in the browser, as #1 did. The command, the guards, several runs and the quota below are the browser measurement's, and the server eval has its own (section 5.11); the rules on the raw file hold for both [D: X2-27, 2026-10-05]. Corrected 2026-10-05 (rule 6): these bullets read as rules for every number, which the server eval breaks on purpose (it runs from a local machine, records the model and commit without a page, and calls no route).
- **Command:**

  ```
  MEASURE_URL=<deployed URL> MEASURE_LOCATION='<city, connection>' pnpm exec playwright test --project=measure
  ```

  The `measure` project exists only when `MEASURE_URL` is set. It runs `*.measure.ts` only, against `MEASURE_URL`, with no retries, one worker and no local `webServer`. CI never sets `MEASURE_URL`, so it never runs a measurement.
- **Guards before any request is spent.** `startMeasurement` in `e2e/helpers/measure.ts` checks, cheapest first:
  1. `MEASURE_LOCATION` is set
  2. `MEASURE_URL` is set
  3. no good file exists for today (it could not be saved anyway)
  4. the deployed page is not in mock mode (`data-mock` on the header, section 5.6) and names a model

  It records the model and commit from the page header, never from a flag, plus the user agent, browser version and platform. The server eval records them from `MODEL_LABEL` and git instead (section 5.11).
- **The raw JSON is committed.** `saveMeasurement` writes `measurements/<metric>-YYYY-MM-DD.json` (paths from `lib/measure/record.ts`), and the file is committed together with the README lines it produced. The eval's command writes a real run to the same paths, under the same rules, and a mock run to `measurements/eval-mock.json` (section 5.11).
- **An aborted run** (a 429, a failed request; for the eval, also a case its scorer cannot count, or a summary that fails after the last case, section 5.11) writes `measurements/<metric>-YYYY-MM-DD-HHMMSS.aborted.json`, prints no README lines, and fails the test or the script. The time stamp is the run's start, so two aborted runs never collide.
- **A good file is never overwritten.** A second good run of the same metric on the same day refuses to write; rename or delete the first file on purpose.
- **Several runs** [D: U-P4, 2026-09-28]. A metric measured over several runs (e.g. #2, `rag-citations` spec §11, three runs in separate rate-limit hours) saves each run under its own metric name, e.g. `citations-run-1`, which `measurementPath` accepts. Guard 3 and the no-overwrite rule then apply to each run. The project's own script writes the aggregate `measurements/<metric>-YYYY-MM-DD.json` through `saveMeasurement`, under the same rule.
- **No number is typed by hand.** The project's `*.measure.ts` prints the README lines (line 1 and the first line of "How it's measured", section 8) from the record it just wrote, and `pnpm eval` prints an eval's (section 5.11).
- **What stays in each project:** the metric name, the requests themselves, the statistics (median, intervals and so on), the record's fields beyond the shared metadata, and the README lines. The eval's statistics, record and README lines are the shell's, with the project's part in `lib/eval/project.ts` (section 5.11) [D: X2-17, 2026-10-05].
- **Quota.** Every request of a browser measurement counts against the hourly rate limit, so a run fits in one hour and is kept apart from manual checks [F: #1 spec §5.2]. The server eval calls the model from the script, outside any route, so the rate limit never sees it; the Gateway budget of section 9 step 4 still bounds it.

## 8. README skeleton [D-sec1]

It must fit one screen: about 40 lines at most [P]. The measured number goes on line 1.

```markdown
# <Project name> — <headline metric sentence with the number>

[![CI](<CI badge URL>)](<Actions URL>) · **[Live demo](<demo URL>)** · Part of the [feliperrego.com](https://feliperrego.com) portfolio

## Problem
<2–3 sentences>

## Decisions
- **<decision>** instead of <discarded alternative>: <why, 1 line>
- **<decision>** instead of <discarded alternative>: <why, 1 line>

## How it's measured
<definition, command, caveats — 2–4 lines, link to raw data>

## Run it
`pnpm install && pnpm dev:mock` (no API key needed)

## Stack
Next.js · AI SDK · AI Gateway · <project-specific>
```

Line 1 and the first line of "How it's measured" are printed by the measurement run (section 7.5), or by `pnpm eval` for an eval's number (section 5.11), never typed by hand [D: U-05, 2026-09-28; D: X2-17, 2026-10-05].

## 9. Creating a project from the template [P; amended by U-01..U-04 and U-07, 2026-09-28, by V-01, V-03, V-04 and V-11, 2026-09-29, by W-02, W-03, W-04, W-06, W-08, W-11 and W-13, 2026-10-05, and by W-16 and W-17, 2026-10-06]

1. **Repo** [D: U-07, 2026-09-28; D: V-11, 2026-09-29; D: X2-21, 2026-10-05; F: #1 plan, commit `30a35dd`]. Start the project repo locally with its own spec (and plan) committed. Import the template at a known commit, delete the template's own docs (its spec and plan, the X-01 design and plan, and the X-02 design) and its three template-only guards (section 7.2), and commit the import alone, so the template commit is on record. The project spec links to the template repo instead of the deleted docs. `tests/chat-boundary.test.ts` checks that every path this command and step 6b.1 name exists, that this command names every file under `docs/` [P: V-P9], and that every folder either command names is removed with `rm -r` [D: X2-24, 2026-10-05].

   ```bash
   git -C <template checkout> archive <template sha> | tar -x -C .
   rm docs/specs/2026-09-25-ai-portfolio-template-design.md docs/plans/2026-09-25-ai-portfolio-template.md \
     docs/specs/2026-09-29-chat-shell-extraction-design.md docs/plans/2026-09-29-chat-shell-extraction.md \
     docs/specs/2026-10-05-desk-and-eval-extraction-design.md \
     tests/chat-boundary.test.ts tests/no-project-strings.test.ts tests/shell-comments.test.ts
   pnpm install
   git add -A && git commit -m "build: import ai-portfolio-template at <template sha>"
   ```

   `git archive` exports tracked files only, so no local `.env*` file, `node_modules` or build output comes along. `tests/helpers/repo-files.ts` stays: the travelling `tests/shell-imports.test.ts` uses it. When `main` is ready, publish it: `gh repo create feliperrego/<name> --public --source . --remote origin --push`. Felipe runs this command himself: in P1, Claude Code's auto mode blocked the agent's attempt [D: X2-27, 2026-10-05; F: P1 spec §7, step 1]. This is the path #1 used; it replaces `gh repo create --template`.
2. Import the repo into Vercel and set `AI_MODEL` for **Production**, **before** the first deploy. The missing-`AI_MODEL` guard fails the build otherwise. Set `AI_MOCK=1` for **Preview** (section 6). Also set `ENABLE_EXPERIMENTAL_COREPACK=1`, for Production and Preview since both build [D: U-P3, 2026-09-28], so Vercel uses the `packageManager` pnpm version instead of guessing from the lockfile [F: vercel.com/docs/builds/configure-a-build#corepack], and check the pnpm version in the first build log. Afterwards, check each variable's environments under the project's environment variables settings against section 6.
3. **Rate-limit store** [D: U-02, U-04, 2026-09-28]. Add **Upstash for Redis** from the Vercel Marketplace, not "Redis", with no custom prefix, connected to **Production only** (sections 5.3 and 6). With the CLI, that is `vercel integration add <integration> -e production`; `vercel integration discover upstash` should list the integration's name (UNVERIFIED).
4. **Gateway account** [D: U-03, 2026-09-28]. Set up once per Vercel team, and check it for each new project:
   - **A card on file.** Without one, the Gateway answers 403 `customer_verification_required`: a valid payment method is required before using even the free credits [F: vercel.com/docs/ai-gateway/faq, updated 2026-09-13; #1's first two requests got a 403, #1 spec §3.2].
   - **Paid credits when the model is not in the free tier.** The free tier includes a subset of models; the others need purchased credits, and buying credits ends the monthly free credit [F: vercel.com/docs/ai-gateway/pricing, updated 2026-09-08, and the FAQ; #1's model was refused until Felipe bought credits].
   - **Auto top-up off.** It is off by default; keep it off [F: pricing page; #1 spec §3.2].
   - **A project budget.** Budgets can be set per team, project, API key or member [F: pricing page and FAQ]. This settles the question this step used to leave UNVERIFIED. Felipe sets the new project's budget by hand [D-chat-1, D-sec1].
5. Redeploy, because existing deployments do not get new or changed variables [F: vercel.com/docs/integrations/install-an-integration/product-integration, updated 2026-09-17]. Then `curl <production URL>/api/health` must show `"rateLimit": "upstash"` and `"mock": false`.
6. In the new repo:
   - set the project's identity in `lib/project.ts` (`PRODUCT_NAME`, `PRODUCT_DESCRIPTION`, `PROJECT_SLUG`, `REPO_URL`) and the `package.json` `name`, which must equal `PROJECT_SLUG` (`lib/project.test.ts` checks it). The footer's repo link, the layout's `title` and `description` (browser tabs and link previews), the header's h1, `RATE_LIMIT_PREFIX` and the locale storage key follow from it [D: V-03, 2026-09-29]. This replaces three items set by hand until X-01: the repo URL constant in `components/footer.tsx`, the metadata in `app/layout.tsx` and the prefix in `lib/rate-limit.ts`; it changes T-12 and T-19.
   - a chat project edits the project-owned files of section 5.8: the limits in `lib/ai/limits.ts` and `lib/chat/limits.ts` (set in the project's own spec, section 5.1) [D: X2-14, 2026-10-05], the instructions in `lib/chat/instructions.ts`, its strings in `lib/i18n/messages.ts`, the props it passes in `components/app-chat.tsx`, the route, `app/page.tsx` and `e2e/helpers/fixtures.ts`. It leaves the shell-owned files alone, or changes them on purpose [D: V-04, 2026-09-29].
   - a project without a chat runs step 6b instead [D: V-01, 2026-09-29].
   - replace the template's mock cues and answers in `lib/ai/mock-scenarios.ts` with the project's own, keeping the `MOCK_SCENARIOS` export (section 5.2) [D: X2-15, 2026-10-05], and its test, `lib/ai/mock-scenarios.test.ts`, whose cases are the sample's, with tests of the project's cues (section 5.8) [D: W-16, 2026-10-06].
   - replace the sample tool in `lib/tools.ts` with the project's tools, name each one in `toolLabel` from the project's own keys (`lib/i18n/messages.ts`, keeping the export; a label names the call, section 5.10) and give it a mock cue. Replace the sample's cases in `lib/tools.test.ts` with the project's, keeping its check that every tool has a label of its own (section 5.8) [D: W-16, 2026-10-06]. Update the tool literals of `e2e/helpers/fixtures.ts` and the cases of `tests/api-chat-route.test.ts` that name the sample tool (its run, the stop at `MAX_STEPS`, a history that holds a call). A project with no tool sets `TOOLS` to `{}` and deletes `e2e/chat-tools.spec.ts` and those route cases; the route's "offers the model the project's tools" case still holds (section 5.10) [D: X2-13, 2026-10-05].
   - name the project's pages, brand mark and banner in `app/(shell)/layout.tsx`, with their words in `site` of `lib/i18n/messages.ts`, and its eval's words in `evalText` and `EVALS_PAGE` (`lib/eval/project.ts`): the headline sentence, how a case is scored, a label for every group and check, and each case's page (section 5.12) [D: X2-12, X2-19, 2026-10-05].
   - replace the eval sample with the project's eval (section 5.11) [D: X2-17, X2-20, 2026-10-05]: its cases in `measurements/cases.json`, frozen before the first run, with their SHA-256 in `measurements/cases.sha256` (`cd measurements && shasum -a 256 cases.json > cases.sha256`); `EVAL_PROJECT` in `lib/eval/project.ts` and its test; then `AI_MOCK=1 pnpm eval` re-records `measurements/eval-mock.json`, which is committed with them.
   - fill in the README
   - confirm every `streamText` / `generateText` call passes `maxOutputTokens`, the `MAX_OUTPUT_TOKENS` of `lib/ai/limits.ts` (section 5.1) [D: X2-14, 2026-10-05]
   - confirm every route that calls a model starts with `guardModelRoute(req)` and returns its response when there is one (section 5.7) [D: U-01, 2026-09-28]. It runs the rate limit first, then the 415 for non-JSON bodies, both before the body is read. The 415 saves the model call, that is, the Gateway spend; it does not save the visitor's hourly budget, because the rate limit runs first.

   **6b. A project without a chat** runs this removal recipe [D: V-01, 2026-09-29; D: X-01 P18]. It was dry-run on 2026-09-30 and was green only with the corrections DR1–DR3, which Felipe approved on 2026-09-30 [D: DR1–DR3, 2026-09-30; F: X-01 design §11]. X-02 dry-ran it again on 2026-10-05, with the shell, the trace and the eval core it keeps: green as written, every gate of step 6b.5 [D: X2-25, 2026-10-05; F: X-02 design §9]. On 2026-10-06, with step 4's page moved into the app shell, it was dry-run once more on the tree of the X-02 review's fixes: green, every gate [D: W-P8, 2026-10-06; F: X-02 design §9].

   1. Delete the chat:

      ```bash
      rm -r components/chat/ components/app-chat.tsx hooks/use-stick-to-bottom.ts \
        hooks/use-stick-to-bottom.test.ts lib/chat/ app/api/chat/ components/ui/alert.tsx \
        components/ui/textarea.tsx tests/api-chat-route.test.ts tests/helpers/sse.ts \
        tests/vercel-config.test.ts e2e/chat*.spec.ts e2e/helpers/chat.ts e2e/helpers/fixtures.ts
      ```

   2. `pnpm remove @ai-sdk/react`, and set `vercel.json` back to `{}`, since the chat route's entry is all it holds [P: DR1].
   3. In `lib/i18n/messages.ts`, drop `prompts` and `empty` from `ProjectMessages` and from each locale of `projectMessages`, as below. `toolLabels` and the `toolLabel` export stay: the shell's chips read `toolLabel`, and the trace shows the project's tool calls without a chat (section 5.10) [D: X2-13, X2-25, 2026-10-05]; so do `site` and `evalText`, the app shell's and the Evals pages' words (section 5.12). Until X-02 this step left `Record<never, never>`, with each locale `{}`; lint rejects a `{}` type (`@typescript-eslint/no-empty-object-type`), so a project that drops its last key uses that form [P: DR2]. No kept test reads the dropped keys: in the template only the chat e2e reads the prompts, through the fixtures deleted in step 6b.1. Corrected 2026-10-05 (rule 6), before the dry run X2-25 asks for.

      ```ts
      export type ProjectMessages = {
        /** Each of the project's tools as its chip names it (toolLabel below), as a noun. */
        toolLabels: { lookUpItem: string; lookUpItemWithId: string };
        /** The project's words in the app shell (app/(shell)/layout.tsx, template spec §5.12). */
        site: { home: string; tagline: string; banner: string };
        /** The eval's words on the Evals pages (EVALS_PAGE in lib/eval/project.ts). */
        evalText: {
          headline: string;
          about: string;
          groups: Record<string, string>;
          checks: Record<string, string>;
        };
      };
      ```

      Each locale of `projectMessages` drops the same two keys and keeps the rest; `site.home` then names the page that replaces the chat [D: X2-12, X2-25, 2026-10-05].

   4. Put the home page in the app shell [D: W-P8, 2026-10-06]: delete `app/page.tsx` and write the non-chat page as `app/(shell)/page.tsx`. The layout of section 5.12 frames it with the site header, its values from `siteHeaderProps()`, the nav, the banner, `<main>` and the footer, and the nav already links to it as `site.home`, so from `/` a visitor reaches the Evals page through the nav. This changes DR3, whose page stood outside the shell with a `SiteHeader`, a `<main>` and a `Footer` of its own [D: DR3, 2026-09-30]: both variants passed every gate of step 5 in the X-02 dry run of 2026-10-05, and this one again on 2026-10-06 (X-02 design §9) [F]. `tests/chat-boundary.test.ts` checks that this `rm` names exactly the page.

      ```bash
      rm app/page.tsx
      ```

      ```tsx
      /**
       * The non-chat page (template spec §9 step 6b), inside the app shell of app/(shell)/layout.tsx,
       * which renders the header, the nav, the banner, <main> and the footer. Project-owned.
       */
      export default function Home() {
        return <p className="p-4">Replace this page.</p>;
      }
      ```

   5. Run lint, typecheck, test, `pnpm eval --check`, build and e2e [D: X2-25, 2026-10-05].

   What stays: i18n, the site header, the footer, the mock model, the model-call limits of `lib/ai/limits.ts` [D: X2-14, 2026-10-05], the trace and the project's tools of `lib/tools.ts` (section 5.10) [D: X2-13, X2-25, 2026-10-05], the eval core and its sample, which import nothing of the chat (section 5.11) [D: X2-17, X2-25, 2026-10-05], the app shell, which frames the home page too (step 4) [D: W-P8, 2026-10-06], and the Evals pages with `e2e/evals.spec.ts` (section 5.12) [D: X2-12, X2-25, 2026-10-05], `tests/shell-imports.test.ts`, `tests/client-imports.test.ts` and the site i18n e2e. After step 6b.2, `package.json`, `pnpm-lock.yaml` and `vercel.json` equal the template's before X-01 [F: X-01 design §11], but for `zod`, which the sample tool uses, and `tsx`, with its `esbuild` and the `eval` script (X-02) [F: X-02 design §9]. The shell dictionary keeps its chat keys: it is shell-owned, `lib/i18n/messages.test.ts` pins it whole, and the page shows none of them.
7. After the project's first rate-limited route is deployed, send 21 requests with `Content-Type: application/json` from one IP within an hour, in an hour not used for other manual checks. The 21st must return 429 with the demo-limit text and `Retry-After`. Record it in that project's manual checks. Without that header each request gets a 415, but it is still counted (section 5.3).

## 10. Out of scope

| Item | Trigger to revisit |
|---|---|
| Auth, database, persistence [D-sec1] | The first project whose skill requires it; add it in that project, not in the template |
| i18n [D-sec1] | **Done by X-01** [D: V-02, 2026-09-29]: the template ships EN/pt-BR (section 5.9). **Superseded 2026-09-28** [D: U-08, 2026-09-28]. It was "Never, since the decision is English-only [D-chat-1]"; #1 and #2 now ship an EN/pt-BR interface switch in their own code [F: #1 spec §14 A-21 (D-chat-2), #2 spec §9 (D-chat-3)]. It moves into the template with the chat shell (the chat-shell row below) |
| ADR folder [D-sec1] | A project has more than 2 decisions worth recording; until then they live in the README "Decisions" section |
| Syncing template improvements into existing projects [D-chat-1: accepted trade-off of 1 repo per project] | The same fix has been hand-applied to 3 or more projects; then consider a shared npm package |
| Observability, tracing, cost dashboards | P1 builds a trace panel, and X-02, between P1 and P2, moves it into the template [D: Q7, 2026-10-01]: **done by X-02** with tool calls, tokens and latency, and no dollar cost (section 5.10). A cost measured by the Gateway for each answer: trigger, P4's router stretch, after a runtime check that a `streamText` result exposes the generation id and that the OIDC token may read it [D: X2-03, 2026-10-05]. The row said "(tools, tokens, cost, latency)" until 2026-10-05. A cross-demo dashboard is dropped; trigger: two of the new projects are live and recording usage [D: Q2, 2026-10-01]. Remapped 2026-10-01: the roadmap's old #12 became a trace panel in every project (ROADMAP); the trigger was "The observability portfolio project starts (#12 in the D-chat-1 list)" |
| Shared chat components (the chat shell) and i18n | **Done by X-01** [D: V-01, V-02, 2026-09-29]: the shell and i18n are in the template (sections 5.8, 5.9); #1 and #2 keep their own copies (section 14). **Trigger fired with #2** [D: U-08, 2026-09-28]. It was "A second chat project needs the same component; then extract it", and #2 is that project. Now: when #2 (`rag-citations`) ships, before the next chat project (#6) starts, extract the shared chat shell and i18n into the template, with #1 and #2 as the two references. Until then #2 copies #1's shell [D: X-01 in the rag-citations spec, 2026-09-28] |
| Markdown rendering | A second chat project needs it; then extract it. Split from the row above on 2026-09-28, since X-01 does not cover it. **Not fired by P1** (checked 2026-10-05): P1 renders only #2's inline code spans, and its instructions forbid Markdown [F: P1 `components/rag/inline-code.tsx`, `lib/chat/instructions.ts`; D: X2-27, 2026-10-05] |
| #1's per-answer timing caption (time to first token) and per-request timing hooks in `Chat` [D: V-12, 2026-09-29] | A second project wants a per-answer time-to-first-token caption, which the browser times. #2 dropped the caption on purpose [D: X-01 Q6]. **Restated 2026-10-05**: P1 shows each live answer's latency from the server's message metadata, with no `Chat` hook [F: P1 `lib/support/pipeline.ts`, `components/support/answer-analysis.tsx`], and since X-02 the template has that metadata (`traceMetadataOnFinish`, section 5.10). So a per-answer latency needs no hook; the row keeps only the time to first token and the hooks. It said "wants a per-answer timing caption" until then [D: X2-27, 2026-10-05] |
| Other `Chat` seams: extra request-body fields beyond `locale` (**answered on 2026-10-05**: they need no seam, since they go through `transport`, section 5.8 [D: X2-10, 2026-10-05]), and `useChat` options such as client-side tool handling (`onToolCall`) or tool approval [D: V-12, 2026-09-29] | A project needs one; for tool handling, when P2's design starts. Until then a project edits its copy of the shell (section 5.8). Remapped 2026-10-01: the roadmap's old #7 became P2's approve/reject card (ROADMAP) [D: Q2, 2026-10-01]. Since 2026-10-05: P2 builds the approval card and its `useChat` seams, and X-03, after P2 ships and before P4, which reuses them, extracts them [D: X2-06, 2026-10-05] |
| Tool results in the history: `validateAndClean` keeps only text parts (section 5.8) [D: V-12, 2026-09-29] | P2's design [D: X2-02, 2026-10-05]; X-03 extracts what P2 builds [D: X2-06, 2026-10-05]. **Answered for P1 on 2026-10-05**: P1's design kept the text-only history, so a follow-up about an order calls the tool again [F: P1 spec §4, P-07], and X-02 reads "tool parts in the history" as rendering them, which it moved (section 5.10) [D: X2-02, 2026-10-05]. The trigger was "P1's design decides whether to keep them; X-02, between P1 and P2, moves into the template the 'tool parts in the history' that P1 builds" [D: Q7, 2026-10-01]. Remapped 2026-10-01: the roadmap's old #6 became P2, and P1, built first, is now the next project with a chat (ROADMAP) [D: Q2, Q3, 2026-10-01] |
| Embeddings in the template [D: V-12, 2026-09-29] | P3 starts: they move into the template then; until then P1 copies them from #2, with #2's citations and verifier [D: Q6, 2026-10-01]. #2's R-08 kept them in #2 "until a third project needs them" [D: #2's R-08]; X-01 moves i18n only. Remapped 2026-10-01: the roadmap's old #4 was dropped and #14 became P3's Search screen (ROADMAP) [D: Q2, 2026-10-01]; the trigger was "A project other than #2 needs embeddings (likely #4 or #14 [P: inference])" |
| The pieces X-02 left in P1 (X-02 design §3) [D: X2-05, X2-06, 2026-10-05]: the drawer, `/try` and the persona picker; the list, detail and aside grid, the tabs, the recorded-run list and thread, the live per-answer trace and P1's README test; the outcome matrix; the timeouts and the safe error text, which leave with `lib/chat/` at section 9 step 6b | P2 copies the drawer and the store from P1 [D: X2-05, 2026-10-05]. X-03, after P2 ships and before P4, extracts what P2 also uses: the grid, the tabs, the recorded runs, the live trace, the README test, and the drawer if P2 keeps one [D: X2-06, 2026-10-05]. The outcome matrix: a second project wants one. The timeouts and the safe error text: P3 starts, the first project to run step 6b [P: X-02 design §3]. The store's data and formatters, the hand-off card, the outcome taxonomy, the score rules and the brand never move [D: Q4, 2026-10-01] |
| Server locale routing and browser-language detection [D: V-12, 2026-09-29] | Unchanged: the trigger of #1's delta spec T-26 |
| Testing Library / jsdom | See section 7.2 |

## 11. Acceptance criteria

1. `pnpm install && pnpm dev:mock` serves the chat page with the mock badge, the EN/PT switch and a footer linking to https://feliperrego.com, with no `.env` file, and a suggested prompt streams the mock answer word by word [D: V-01, 2026-09-29]. Until X-01 this criterion named the placeholder page.
2. `pnpm lint && pnpm typecheck && pnpm test && pnpm eval --check && pnpm build && pnpm e2e` pass locally with `AI_MOCK=1` [D: X2-26, 2026-10-05 for `eval --check`].
3. CI is green on the first push, with no repository secrets configured.
4. `AI_MOCK=1 VERCEL_ENV=production pnpm build` exits non-zero with the guard's message. The build evaluates `app/page.tsx`, which imports `lib/ai/model.ts`; confirm this at scaffold. The unit test in section 7.2 also covers the guard.
5. Without Upstash env vars, `rateLimit` always allows and logs once. With env vars, the unit test (Upstash mocked) checks that the limiter uses a sliding window of `RATE_LIMIT_PER_HOUR` per hour keyed by client IP, and that a denial maps to `{ ok: false, retryAfterSeconds }`. The real 21st-request denial is checked once by hand on the first deployed project (section 9, step 7, recorded in that project's manual checks).
6. Importing an `@ai-sdk/<provider>` package outside `lib/ai/model.ts`, statically or with dynamic `import()`, fails `pnpm lint`. `@ai-sdk/react`, `@ai-sdk/provider` and `@ai-sdk/provider-utils` (and their subpaths) are allowed.
7. The GitHub repo `feliperrego/ai-portfolio-template` is marked as a template [D-sec1], public [P], and MIT-licensed [D-sec1].
8. The README follows section 8, with the placeholders in angle brackets.
9. `guardModelRoute` returns the 429 before the 415, and the 415 for any non-JSON Content-Type, without reading the body; `lib/http.test.ts` covers it [D: U-01, 2026-09-28].
10. Without `MEASURE_URL`, Playwright has only the `chromium` project, served by the local mock build. With it, a `measure` project runs `*.measure.ts` against that URL with no local server. The guards of section 7.5 refuse a missing `MEASURE_LOCATION` and a page in mock mode before any request is spent; `e2e/measure-guards.spec.ts` covers them [D: U-05, 2026-09-28].

## 12. Proposals to confirm

These are mostly software choices, where my proposals err less than on domain rules. Items T-01 and T-02 are closer to Felipe's own judgement.

| ID | Proposal | Section |
|---|---|---|
| T-01 | Target 1–3 days per project; D-chat-1 only fixed "small, few skills" | 1 |
| T-02 | The template repo is public | 11 |
| T-03 | Flat folders, no `src/` | 4 |
| T-04 | Scaffold via `create-next-app@16.3.6` + `shadcn init` | 4 |
| T-05 | `IS_MOCK` export; only `AI_MOCK=1` enables mock mode | 5.1 |
| T-06 | The production mock guard and the missing-`AI_MODEL` guard both throw at module load (lifts D-S-15) | 5.1 |
| T-07 | `createMockModel` options and defaults (600 ms, 30 ms, one word per chunk; lifts D-S-12) | 5.2 |
| T-08 | Per-request mock behaviour lives in `doStream`, so `getModel()` takes no arguments | 5.2 |
| T-09 | Sliding window; `RATE_LIMIT_PER_HOUR` override; the `rateLimitResponse` helper and its wording | 5.3 |
| T-10 | The limiter fails open on a Redis error | 5.3 |
| T-11 | `/api/health` with a `rateLimit` field | 5.4 |
| T-12 | Repo URL as a constant in `footer.tsx`; pages place the footer themselves | 5.5 |
| T-13 | Header data attributes in the template (lifts D-S-14) | 5.6 |
| T-14 | `dev:mock` script | 6 |
| T-15 | ESLint rule blocking provider imports outside `model.ts` | 7.1 |
| T-16 | No Testing Library / jsdom in the template (lifts D-S-18; changes D-sec1) | 7.2 |
| T-17 | Vitest/Playwright naming, config and `webServer` setup; e2e on a production build (lifts D-S-12) | 7.2 |
| T-18 | README "one screen" = about 40 lines at most | 8 |
| T-19 | Project creation steps, including deleting the template spec from new repos | 9 |
| T-20 | Success criteria as written | 1 |
| T-21 | The template repo itself is not deployed | 7.4 |

Reply in the form "todas ok exceto T-04 e T-09".

## 13. Amendments from projects #1 and #2 (2026-09-28)

Projects #1 (`streaming-chat`, shipped) and #2 (`rag-citations`, in design) showed that some statements above were wrong, incomplete or stale. Felipe approved the changes below on 2026-09-28 ("todas ok"). The sections above were corrected in place, and each section a change touched carries its `[D: U-xx, 2026-09-28]` tag (in section 9, the heading covers the steps); this list records what changed and why (CLAUDE.md rule 6).

| ID | Change | Why | Sections |
|---|---|---|---|
| U-01 | `lib/http.ts`: `isJsonRequest`, `unsupportedMediaTypeResponse` and `guardModelRoute` (rate limit, then 415, body never read), with #1's route tests ported, plus `Application/JSON`, `bodyUsed` after a 415, and the 429 before the 415. The wording is corrected in `lib/rate-limit.ts`, 5.3 and 9 step 6: the 415 saves the model call (the Gateway spend), not the visitor's hourly budget, because the rate limit runs first | #1 added the 415 in its chat route and checked it in production, but its comment said the 415 saved "the rate-limit budget" | 4, 5.3, 5.7, 7.2, 9, 11 |
| U-02 | Pick "Upstash for Redis", not "Redis", with no custom prefix. The integration injects five variables; the limiter reads only the REST pair, and a test pins that `REDIS_URL` or `KV_URL` alone leave it off | The spec named two of the five variables, and did not warn that "Redis" is a separate, TCP product | 5.3, 6, 7.2, 9 step 3, `.env.example` |
| U-03 | A "Gateway account" step (card on file, paid credits, auto top-up off, a project budget), and the known limit that Stop does not save tokens through the Gateway | #1 got two 403s before its first answer, and its Gateway log shows an aborted generation completed and billed (#1 spec §14 A-20) | 5.1, 9 step 4 |
| U-04 | An environment column: `AI_MODEL` in Production, `AI_MOCK=1` in Preview only, Upstash in Production only, no Upstash in Development. `-e production` with the CLI; redeploy after any variable change | #1 decided its environments on 2026-09-28. The spec gave no scope, and the CLI connects all three environments by default | 5.3, 6, 7.4, 9 steps 2, 3 and 5 |
| U-05 | The measurement pattern: a `measure` Playwright project that exists only with `MEASURE_URL`; `lib/measure/record.ts` (day, path, `.aborted.json`, no-overwrite rule); `e2e/helpers/measure.ts` (guards and file writing); section 7.5 | #1 built it for its TTFT number, and every project publishes one number. Statistics and README lines stay in each project | 4, 7.2, 7.5, 8, 11 |
| U-06 | Playwright `retries: 0` and `trace: "retain-on-failure"` | #1 A-17: a retry lets a flaky test pass unnoticed, and without retries "on-first-retry" records nothing | 7.2 |
| U-07 | Section 9 step 1 is the path #1 used: `git archive` of a template commit into a repo that already holds the project spec, then `gh repo create --source . --push`. The template's own spec and plan are deleted at import | #1 did not use `gh repo create --template` (#1 plan, commit `30a35dd`) | 1, 9 steps 1 and 6 |
| U-08 | Section 10: the "i18n: never" row is superseded, and the shared chat components row's trigger has fired. The chat shell and i18n move into the template when #2 ships, before #6 starts [D: X-01] | #1 and #2 ship an EN/pt-BR switch, and #2 is the second chat project | 2, 10 |

Left as they were:

- #1 keeps its own copies of these fixes. The "syncing template improvements" row of section 10 (the same fix hand-applied to 3 or more projects) has not fired.
- `docs/plans/2026-09-25-ai-portfolio-template.md` records how the template was first built. Its expected test counts describe that build and were not updated.
- The proposals table of section 12 is the record of the 2026-09-25 approval.

**Added by this amendment, approved 2026-09-28** ("todas ok"). Applying U-01..U-08 added these proposals; Felipe approved all four, and they are cited as `[D: U-Px, 2026-09-28]`. Each is tagged where it appears.

| ID | Proposal | Section |
|---|---|---|
| U-P1 | `guardModelRoute` also guards routes that pay for embedding calls, not only text generation | 5.7 |
| U-P2 | `RATE_LIMIT_PER_HOUR` is set in Production only, and only to change the default of 20 | 6 |
| U-P3 | `ENABLE_EXPERIMENTAL_COREPACK=1` is set for Production and Preview, since both build | 9 step 2 |
| U-P4 | A metric measured over several runs names each run apart (e.g. `citations-run-1`), and the project's script writes the aggregate file through `saveMeasurement`. #2 has 3 runs planned (`rag-citations` spec §11); its plan should adopt this once approved | 7.2, 7.5 |

## 14. Amendment X-01 (2026-09-29)

X-01 moves the chat shell and i18n of projects #1 (`streaming-chat`) and #2 (`rag-citations`) into the template [D: X-01]. Its design, `docs/specs/2026-09-29-chat-shell-extraction-design.md`, was approved by Felipe on 2026-09-29 ("todas ok"): its questions Q1–Q7 and proposals P1–P23. Its removal recipe was dry-run on 2026-09-30 (X-01 design §11). The sections above were changed in place, and each section a change touched carries its `[D: V-xx, 2026-09-29]` tag (in section 9, the heading covers the steps). This list records what changed and why (CLAUDE.md rule 6). The V ids are new; the "X-01 items" column names the design items each one carries out.

| ID | Change | Why | X-01 items | Sections |
|---|---|---|---|---|
| V-01 | The template's `/` is a working chat in mock mode, and the chat route, `validateAndClean` and the mock scenarios come with it. The default page's text is Q7's placeholder copy. The old placeholder page becomes the non-chat page of a removal recipe (section 9, step 6b), which a non-chat project runs | Every chat project copied the shell by hand: #2 copied #1's and adapted it. With the chat in the template, the template's own CI runs the shell as a project receives it. Without the route and the mock, the page cannot stream and the shell's tests cannot run | Q1 (option A), Q4, Q7, P18 | 4, 5.6, 5.8, 9 steps 6 and 6b, 10, 11 |
| V-02 | EN/pt-BR in the template: locale resolution, `LocaleProvider` in the layout with the `data-hydrated` signal, the switch, the typed dictionary split into shell and project keys, `format()`, and the line that tells the model the interface language. Every project ships the switch, non-chat ones included. Decision 6 now keeps English for the README, docs and commits only, and decision 11 drops "no i18n" | #1 and #2 carry the same machinery, apart from comments, the storage key and #2's `LOCALES` | Q2, P3, P4, P5 | 2, 4, 5.5, 5.6, 5.9, 10 |
| V-03 | `lib/project.ts` is the one identity file (`PRODUCT_NAME`, `PRODUCT_DESCRIPTION`, `PROJECT_SLUG`, `REPO_URL`), with the `package.json` `name` equal to `PROJECT_SLUG` and a test that ties them. The footer URL, the layout metadata, `RATE_LIMIT_PREFIX`, the locale storage key and the h1 read from it. This changes T-12 (the repo URL leaves `footer.tsx`) and step 6's footer, layout and prefix items (T-19). The separate-counters ruling of section 5.3 stays | One place to edit at creation instead of three files, and the storage key needs the slug too | P1 | 4, 5.3, 5.5, 7.2, 9 step 6 |
| V-04 | File ownership: shell-owned, project-owned and template-only files (section 5.8) | A project must know which files it edits and which it leaves alone, so a diff against the template shows only deliberate shell changes | P2 | 5.5, 5.8, 9 step 6 |
| V-05 | `Chat`'s props (`transport`, `maxMessages`, `renderAssistant`, `hasContent`, `empty`), with `hasContent` read in all four places and generic helpers in `lib/chat/ui.ts`; the renderer contract; the project-owned client wrapper `components/app-chat.tsx`; the header's `actions` slot, with `ml-auto` on its wrapper | #1 and #2 differ exactly there: headed prompt groups or a flat grid, a timing caption or citations, the whole history or the latest message | P4, P6, P7, P8 | 5.6, 5.8 |
| V-06 | History mode by default: `useChat`'s own transport posts the whole history, and `MAX_MESSAGES` caps it on the client and the route from one constant, whatever the transport; `null` opts out. The project-owned `lib/chat/limits.ts` holds `MAX_OUTPUT_TOKENS`, `MAX_MESSAGES` and `MAX_ASSISTANT_CHARS`, with a test tying the last to the token cap | #6 and #7 are multi-turn agents. Section 5.1 already had each project set its token cap | Q3, P7, P9 | 5.1, 5.8 |
| V-07 | `createMockModel()` without options returns #1's scenario mock (default answer, `[[slow]]`, `[[error]]`), with its timing as literals, so nothing in `lib/ai/` imports `lib/chat/` | The default page streams in mock mode, and the shell's e2e needs the slow and failing answers. The mock must survive the removal recipe | Q4, P11 | 4, 5.2 |
| V-08 | Default instructions in the project-owned `lib/chat/instructions.ts`: #1's plain-text and length rules, the language rule of D-chat-2, then the interface-language line | The default renderer shows raw text, and every project ships the switch (Q2) | P10 | 5.8 |
| V-09 | `react/jsx-no-literals` on `components/**` except `components/ui/**`, with its test | A string typed in JSX is one the language switch misses | P12 | 7.1 |
| V-10 | The shell's tests move or are rebuilt with the code: the unit tests, `tests/shell-imports.test.ts` (travels with the shell), three template-only guards, and the e2e split into site i18n, chat i18n and chat, with shared helpers and project-owned fixtures. The new assertions cover what neither project tested. `vercel.json` turns on cancellation for the chat route, pinned by #2's test, and `playwright.config.ts` pins `RATE_LIMIT_PER_HOUR` | The shell is worth moving only with the tests that pin it. The guards prove the removal recipe and keep project strings out of the template | P13, P14, P15, P16, P17 | 4, 5.1, 5.2, 5.5, 5.8, 7.2 |
| V-11 | The import also deletes the X-01 design, its plan and the three template-only guards | In a project the guards fail on expected code (section 7.2) | P21 | 7.2, 9 step 1 |
| V-12 | Section 10 marks the i18n and chat-shell rows done, and adds rows for #1's timing caption, the other `Chat` seams, tool results in the history, embeddings, and server locale routing. #1 and #2 get no code changes | Each item left out needs a trigger (CLAUDE.md rule 5). Each project is a one-time copy of the template (sections 2 and 9), and section 13 already has #1 keep its own copies of template fixes | Q5, Q6, P19 | 10, 14 |

Left as they were:

- Section 13 stays as written: it is the dated record of 2026-09-28, when #2 was in design. Section 12 stays as the record of the 2026-09-25 approval; T-12 and T-19 now read as V-03 changed them.
- The README skeleton (section 8) does not change: nothing chat-specific belongs in it.
- #1 and #2 get no code changes, only one dated status line each, in their own repos [D: V-12, 2026-09-29; D: X-01 Q5]. A real bug found in shared code is fixed here and hand-applied to #1 or #2 only if their visitors can hit it; each such fix counts toward the sync row of section 10.
- The X-01 design stays the record of the decision: its options, its risks and the dry run of its §11.
- P20 (the CI budget), P22 (these doc updates and the status lines outside the template) and P23 (the order of work) changed no section above: they governed the work itself (X-01 design §7, §8).

Pending, each with its trigger:

- **CI time after X-01.** Measured on 2026-09-30 with X-01 design §8's command: run 36777831142 on `e2b5bad`, 4:43, against the 1:04 baseline on `460c07a` and inside the 10-minute budget [F]. The first run on `main`, 36747216937 on `d333861`, failed one e2e and is not a timing (X-01 design §11). Done.
- **The autoscroll fix in #1 and #2.** The prototype's review found a race in the shell's `hooks/use-stick-to-bottom.ts`, copied from #2, whose stop and scroll logic #1 shares: a stop intent that came between the last pin and that pin's scroll event was undone by the event, so PageUp, an upward wheel or a touch move could fail to stop the view while an answer streamed. The template's hook fixes it (X-01 design §4.2). The same hook also lost following when a rotation rewrapped the text above the view, through Chromium's scroll anchoring; the template turns anchoring off while following (X-01 design §11, 2026-09-30), and the hand-fix for #1 and #2 includes it. The e2e hit the race in 18 of 144 PageUp runs on six parallel workers, and in 1 of 3 full one-worker runs [F: prototype logs, 2026-09-30]; that visitors of #1 and #2 can hit it too is an inference [P: inference]. Felipe's answer (2026-09-30, "aplica"): #1 and #2 get the fix by hand, each through a short plan after X-01 ships (X-01 plan, Task 10 step 4), and each counts toward the sync row of section 10 [D]. Trigger: X-01 on `main`. Done on 2026-09-30, with the scroll-anchoring fix: #1 at `5a2dfc0` and #2 at `fec8a21`, each with its own e2e [F: those repos' specs].
- **The assistant-text cut in #1.** The prototype's review-focus tests found that a follow-up after an answer longer than `MAX_ASSISTANT_CHARS` got a 400 that Retry repeated, and the template now cuts that text instead (section 5.8 item 3) [P: V-P8]. #1 at `ac79b2d` has the same 400 and the same 10,092-character `[[slow]]` answer, so its Preview deployments, which run the mock, hit it every time; #2 posts only the latest message, so it does not [F: read-only check, 2026-09-30]. That #1's production visitors hit it needs a real answer above about 5.9 characters per token at the cap [P: inference]. Felipe's answer (2026-09-30, "aplica"): #1 gets the fix by hand, together with the focus after New chat at the cap (section 7.2's cap tests), in the same short plan [D]. Trigger: X-01 on `main`. Done on 2026-09-30 in #1 at `5a2dfc0`, with the focus fix. The cap-placeholder finding stays as is there until P1's design: Felipe answered (a) to #1's T-28 [D: T-28, 2026-09-30]. P1's design did not take it up; X-02 fixed the template's composer (the first minor finding below), and #1 keeps its own [D: X2-07, X2-24, 2026-10-05]. Remapped 2026-10-01: the roadmap's old #6 became P2, and P1, built first, is now the next project with a chat (ROADMAP) [D: Q2, Q3, 2026-10-01].
- **Comments outside the shell.** `tests/shell-comments.test.ts` checks that every "spec §N" names its document only in shell files, because the template's own files, such as `lib/rate-limit.ts`, use "spec §N" for this spec. A leftover "spec §N" from #1 or #2 in a ported non-shell file would pass. Trigger: the next amendment of this spec decides whether template code must always write "template spec §N". **Fired with X-02, answered in part** (2026-10-05): code moved into the template cites "template spec §N" only [D: X2-23, 2026-10-05]. **Answered in full on 2026-10-06**: Felipe approved W-P9, so the check runs over every file outside `docs/`, configs and `.env.example` included, and the template's own files cite "template spec §N" (section 7.2) [D: W-P9, 2026-10-06]. Done.
- **The removal recipe after the dry run.** `tests/chat-boundary.test.ts` sees only imports, so after the dry runs of X-01 design §11 (2026-09-30) and X-02 design §9 (2026-10-05 and 2026-10-06) nothing in CI keeps §9 step 6b green. Corrected 2026-10-05 (rule 6): it said "the one dry run". Trigger: P3, the first project without a chat, runs the recipe (P4 if the two swap); if it needs a change the dry run missed, add a CI job that runs the recipe on a copy. Remapped 2026-10-01: the roadmap's old #3 became part of P1, which has a chat; P3 and P4 have none, and P3 is built after P1 and P2 (ROADMAP) [D: Q1, Q2, Q3, 2026-10-01].
- **Minor findings of the X-01 final review** (2026-09-30), none Critical or Important [F: the review; P: each fix]. Trigger for all of them: P1's design, the next project that uses the chat, reviews this list before it starts, unless a finding's own trigger comes first. Remapped 2026-10-01: the roadmap's old #6 became P2, and P1, built first, is now the next project with a chat (ROADMAP) [D: Q2, Q3, 2026-10-01]. **Reviewed by X-02 on 2026-10-05**: P1's design did not review the list, and P1's `components/chat/composer.tsx` equals the template's before X-02 [F: P1 spec; `diff` against `95ea920`], so X-02 did, with the verdicts below (X-02 design §2.8) [D: X2-24, 2026-10-05].
  - A draft typed while the answer that reaches the cap streams hides the cap placeholder, and disabling the composer drops the focus; show the cap text as visible text tied to the composer by `aria-describedby`. #1 has the same behaviour, so its hand-fix plan (X-01 plan, Task 10 step 4) decides it first. **Done by X-02** at `1716029` (section 5.8, the composer).
  - Safari fires `compositionend` before the Enter that confirms an IME candidate, so Chinese, Japanese or Korean input can send a half-composed message, and an Esc that cancels a composition can stop an answer; track composition in the composer and treat `keyCode` 229 as composing. **Done by X-02** at `1716029` (section 5.8).
  - The Send double-click guard (`event.detail > 1`) also ignores later clicks on Stop in the same click chain; limit it to about 500 ms after the send. **Done by X-02** at `1716029` (section 5.8).
  - The default length rule says "150 to 250 words" whatever the token cap; below about 360 tokens it asks for more than the cap allows. Own trigger: a project sets `MAX_OUTPUT_TOKENS` below 360. **Not fired** (2026-10-05): P1 keeps 1024 tokens [F: P1 `lib/chat/limits.ts`], and so does the template's `lib/ai/limits.ts`.
  - `react/jsx-no-literals` catches bare JSX text but not `{"text"}`; `noStrings: true, ignoreProps: true` with `·` added to the allowed strings closes it. **Done by X-02** at `5483c70` (section 7.1).
  - No test reads `header[data-commit]` on the real page, though measurements rely on it; one assertion in the smoke test would pin it. **Done by X-02** at `dd1c5ff` (section 7.2, the smoke spec).
  - `tests/shell-comments.test.ts` lets the X-01 design's own ids through (`[D: X-01 P7]`), and its two-letter alternative flags `ES6` or `MP4`; narrow it to `DR\d+` and flag `X-01 [PQ]\d+`. **Done by X-02** at `5483c70`, which flags the X-02 design's ids too (section 7.2).
  - `tests/chat-boundary.test.ts` reads the `rm` operands but not their flags, so a lost `-r` in step 6b.1 would pass; check that every folder operand comes from an `rm -r`. **Done by X-02** at `5483c70` (section 7.2).
  - Section 5.8 does not say who owns the chat tests when a project changes a `Chat` seam (a latest-message transport, `maxMessages={null}`); such a project must edit the history-mode tests. **Done by X-02** at `1716029` (section 5.8, who owns the chat tests).

**Added while applying X-01, approved by Felipe on 2026-09-30 ("todas ok").** DR1–DR3 are the dry run's corrections to the recipe, with the same ids as in X-01 design §11. V-P1..V-P9 are details that the design left open and this spec now states; V-P8 and V-P9 come from the prototype's review-focus tests of 2026-09-30. They are cited as `[D: DRn, 2026-09-30]` and `[D: V-Pn, 2026-09-30]`; the `[P]` tags stay in place as a record.

| ID | Proposal | Section |
|---|---|---|
| DR1 | Step 6b.2 sets `vercel.json` back to `{}`, the template's file before X-01, rather than `{ "functions": {} }` | 9 step 6b |
| DR2 | Step 6b.3 makes `ProjectMessages` a `Record<never, never>`, since lint rejects a `{}` type | 9 step 6b |
| DR3 | Step 6b.4 carries the non-chat page's code: the placeholder page, with its comment citing that step | 9 step 6b |
| V-P1 | The signatures the design named without types: `requestLocale(body: unknown): Locale \| undefined`, `interfaceLanguageLine(locale: Locale \| undefined): string \| null`, `buildInstructions({ locale }: { locale?: Locale }): string`, and `AssistantRenderer<M>` | 5.8, 5.9 |
| V-P2 | `data-hydrated` is set only once the page shows the client's locale, so it means "the page is in its final language" | 5.9 |
| V-P3 | The limits test allows 4 to 6 characters per output token, and the instructions' length ceiling follows `MAX_OUTPUT_TOKENS` (0.7 words per token, rounded down to a multiple of 50) | 5.8 |
| V-P4 | The validate and route tests read their boundaries from the limits instead of #1's literals, so the validate test also imports `./limits` and `./config`. This corrects X-01 design §4.2, which said it imports only `./validate` | 7.2 |
| V-P5 | `tests/shell-imports.test.ts` also lets shell files import `components/ui/**` and `lib/utils.ts`, and counts any other repo file as a project module | 5.8 |
| V-P6 | The template-only guards check more than the design named: `chat-boundary` also checks `@ai-sdk/react` and that the recipe's paths exist; `shell-comments` runs its id and project-spec checks over every code file outside `docs/` | 7.2 |
| V-P7 | The e2e helpers split into `i18n.ts`, which a non-chat project keeps, and `chat.ts`; `fixtures.ts` also holds the empty-state text and the rate notes; `i18n.spec.ts` adds to #2's site tests the `data-hydrated` check, the switch at the right end, the phone test, and the no-reload, no-router-request check | 7.2 |
| V-P8 | `validateAndClean` cuts an assistant text over `MAX_ASSISTANT_CHARS` to its last `MAX_ASSISTANT_CHARS` characters instead of answering 400, so a follow-up after a longer honest answer gets an answer; it keeps the end, for "continue" after a cut answer, rather than the start | 5.8 |
| V-P9 | `tests/chat-boundary.test.ts` reads the `rm` commands of steps 1 and 6b.1 out of this spec: every path they name exists, step 1 names every file under `docs/`, and step 6b.1 names exactly the chat paths the test guards | 9 steps 1, 6b; 7.2 |

## 15. Amendment X-02 (2026-10-05)

X-02 moves into the template the shared shell that P1 (`support-assistant`) built: the app shell, the chat in a panel, tool calls rendered in the history, the trace, the Evals pages and the eval core [D: Q7, 2026-10-01; D: X2-01, 2026-10-05]. Its design, `docs/specs/2026-10-05-desk-and-eval-extraction-design.md`, was approved by Felipe on 2026-10-05 ("ok para todos"): its proposals X2-01..X2-29. It was built on the branch `x02` on 2026-10-05, in green commits from `5483c70` to the one that adds this section, and its removal recipe was dry-run the same day (X-02 design §9). The fixes of its review followed on 2026-10-06 (W-14..W-17). The sections above were changed in place as each piece landed, and each change carries the tag of the design item it carries out, `[D: X2-nn, 2026-10-05]` (in section 9, the heading names the W ids). This list records what changed and why (CLAUDE.md rule 6). The W ids are new; the "X-02 items" column names the design items each one carries out. The X-02 design §7 calls this section "§14"; it is section 15 because section 14 is X-01's amendment, and each amendment has its own section.

| ID | Change | Why | X-02 items | Sections |
|---|---|---|---|---|
| W-01 | `Chat` takes `header?(newChat)`, so a chat in a panel puts New chat in its own bar; extra request-body fields go through `transport`, with no seam; the chat e2e opens `CHAT_PATH` of the project-owned fixtures; the smoke test reads the header's `data-commit`; the known limits of a chat in a panel | P1's chat sits in a drawer with its own bar, which took an edit of the shell (P1 commit `08d5ee3`), and P1 sent its persona through `transport` | X2-10, X2-11, X2-28 | 5.8, 7.2, 10 |
| W-02 | The app shell: `AppShell` with its nav, brand, actions and banner, `siteHeaderProps()` with `local` for an empty commit, and the sidebar's primitives with P1's edits and two more. `/` stays the full-page chat; the project-owned `app/(shell)/` frames `/evals` and `/evals/[case]` | P1's desk frames its pages; the header's three values were written three times, and an empty commit variable gave an empty `data-commit` | X2-09, X2-12 | 4, 5.6, 5.8, 5.12, 9 steps 6 and 6b |
| W-03 | Tool calls rendered in the history: `ToolView` in five states, with the SDK's approval states and a final `denied`, the one type a live answer and a recorded one share; the chip, the JSON block and `hasTextOrTools`, now `Chat`'s default `hasContent` under a default renderer that shows the chips; the project's `toolLabel`; the sample tool `lookUpItem` in the project-owned `lib/tools.ts`, with `zod`, which the chat route offers with `stopWhen`. The history sent to the model stays text only | P1 renders tool calls but sends a text-only history (P1's P-07); an approval state would have shown as running forever | X2-02, X2-13 | 3, 4, 5.2, 5.8, 5.9, 5.10, 7.2, 9 steps 6 and 6b, 10 |
| W-04 | `MAX_OUTPUT_TOKENS` and `MAX_STEPS` move to the project-owned `lib/ai/limits.ts`. The mock streams tool calls: the step machine, `[[slow]]`, `[[error]]` and the default answer in the shell-owned `lib/ai/mock-steps.ts`, how a step streams in `lib/ai/mock.ts`, now shell-owned, and the project's cues in `lib/ai/mock-scenarios.ts` behind `MOCK_SCENARIOS`. The shell's mock tests pass scenarios of their own | Step 6b deleted the token cap with `lib/chat/`; P1's mock calls tools over several steps, and P1 had to rename a scenario the template's tests named | X2-14, X2-15 | 4, 5.1, 5.2, 5.8, 7.2, 9 steps 6 and 6b |
| W-05 | The trace: `TraceMetadata` (`TokenUsage`, with `null` for a count not reported, and the latency), its finish helper and its reader, `Check`, and the usage, tool-calls and checks blocks with the verdict badge. No dollar cost: tokens are the measured stand-in, and a cost the Gateway measures waits for P4's router stretch | P1's Analysis panel shows tokens and latency and no cost; dollars stay on the Gateway dashboard [D: P1 D8] | X2-03, X2-16 | 5.10, 7.2, 10 |
| W-06 | The eval core: the shell-owned `lib/eval/` (record, cases, run, stats, summary, check, runs, readme, command, view) and `scripts/eval.ts`, with the rules P1 learned; `pnpm eval`, and `pnpm eval --check` in CI after the tests; the project's part in `lib/eval/project.ts`; a mock run records no commit; the sample (three cases, their hash, the mock run, `.prettierignore`); `tsx`. The core imports neither `lib/chat/` nor `lib/rag/` | P1's number is a server eval whose rules P1 learned run by run, and P1 re-recorded its mock run four times only to refresh its commit; P3 and P4, which have no chat, need the core too | X2-01, X2-17, X2-18, X2-20, X2-26 | 3, 4, 5.8, 5.11, 6, 7.1, 7.2, 7.3, 7.5, 8, 9 steps 6 and 6b, 11 |
| W-07 | The Evals page and a case's page: fixed sections, a slot for supporting rows, `caseHref`, the view model in `lib/eval/view.ts`, one static page per case with `dynamicParams = false`, the mock gate (the D9 statement and the pass counts only), and `e2e/evals.spec.ts` | P1's Evals page; the template only ever holds a mock run, and a mock number must never read as a measurement (ROADMAP, "only measured numbers") | X2-04, X2-19 | 4, 5.11, 5.12, 7.2 |
| W-08 | Ownership and guards: the new files in the owner table, which `tests/chat-boundary.test.ts` now checks against the lists in code; "template base" named; the project modules the shell reads and the dictionary keys a shell file reads, checked by `tests/shell-imports.test.ts`; `tests/client-imports.test.ts`; the template-only guards extended (the designs' ids, P1's strings, the `rm -r` flags, the X-02 design in step 1's `rm`); code moved into the template cites "template spec §N" only | Every new file needs an owner; a Node module in a client bundle breaks the build; P1's names and spec citations must not leak into the template | X2-21, X2-23 | 4, 5.8, 5.12, 7.2, 9 step 1 |
| W-09 | i18n: the shell keys `toolCall`, `trace`, `appShell`, `run` and `evals`; a project's words reach the shell as props, as `Localized` values from a server page, or through `toolLabel`; `lib/i18n/display.ts` and `lib/i18n/localized.ts`; recorded English marked `lang="en"`, which the pt-BR scan skips, pinned by its own e2e | P1's dictionary mixed generic and store words under the same top-level keys; a server page cannot know the locale | X2-22 | 5.9, 5.12, 7.2 |
| W-10 | The X-01 final review's minor findings: 1, 2 and 3 fixed in the composer (the cap line, the IME keys, the Stop guard), 5 in the JSX literal rule, 6 in the smoke test, 7 and 8 in the guards, and 9 as the rule on who owns the chat tests; 4 keeps its own trigger | Their trigger, P1's design, passed without reviewing them | X2-24 | 5.8, 7.1, 7.2, 14 |
| W-11 | The removal recipe keeps the shell, the trace, the tools, the eval core and the Evals pages: step 6b.3 keeps `toolLabels`, `site` and `evalText`, 6b.4's page reads `siteHeaderProps()`, and 6b.5 runs `pnpm eval --check`. The dry run was green as written | P3 and P4 have no chat but keep what X-02 brings | X2-25 | 9 step 6b, 14 |
| W-12 | What stays in P1, and when it moves: the drawer, the grid, the tabs, the recorded runs, the live per-answer trace, the README test and the outcome matrix; X-03 comes after P2 ships and before P4 | Each has one user so far, and a shape with one user waits | X2-05, X2-06 | 5.10, 5.12, 10 |
| W-13 | The OIDC path for a local real run (`vercel env pull .env.local`) in sections 5.1 and 6 and `.env.example`; section 7.5's browser rules scoped, with the server eval beside them; section 8's lines also printed by `pnpm eval`; Felipe runs `gh repo create` himself; the section 10 rows P1 answered; section 14's pending items marked; dated notes in the ROADMAP and the X-01 design | P1 ran its real calls through the OIDC token and measured with a server eval, and Claude Code's auto mode blocked the agent's `gh repo create` [F: P1 spec §7] | X2-27 | 5.1, 6, 7.5, 8, 9 step 1, 10, 14, `.env.example` |
| W-14 | The X-02 review's fixes (2026-10-06): a tool call still running when its answer ends settles as `interrupted`, "Not finished", with no spinner; `messageText` (`lib/trace/message-text.ts`) puts each step's text a blank line apart in the chat, in the history the route sends and in the eval's recorded reply; each Evals page has its own title, served in English and set in the interface language, so Next announces a client-side navigation; the Evals e2e opens a case with no tool call when the run has none | The review found a call that spun for the rest of the visit after a Stop, an error or a timeout; a sentence before a tool call and the answer after it run together into one; one title for every page, so no navigation was announced (WCAG 2.4.2); and an e2e that a project whose eval calls no tool could not pass | X2-12, X2-13 | 4, 5.8, 5.10, 5.12, 7.2 |
| W-15 | The X-02 review's minor findings on the eval, and Felipe's answer on its interval (2026-10-06): a run stops right after a case whose score it cannot use (a scorer that throws, or a tally that is not whole units with `0 <= passed <= total` and `total >= 1`), and its aborted file keeps the cases before it; a summary or extra data that fail after the last case write the aborted file too; a real run reads its commit before any case, and the eval's own files never mark the tree as changed; when the bootstrap's resamples never vary, the interval is the Wilson 95% score interval, named on README line 1, on the Evals page and in the summary, and the bootstrap stays otherwise | The review found that a bad tally, a scorer error, a failing summary or a git failure threw only after every case was paid for, and wrote nothing; that an aborted run left in the tree labelled the next good run "with local changes"; and that 24 of 24 printed "95% CI 100–100%". Felipe chose the Wilson fallback, labelled, keeping the bootstrap for comparability with #2 and P1 | X2-17 | 5.11, 5.12, 7.2, 7.5 |
| W-16 | The X-02 review's other minor findings, with Felipe's answer to them (2026-10-06, "todas ok"): the owner table names the project's tests, and "template base" is defined without them or the files step 6b deletes; the Evals e2e reads the project's paths; `Chat`'s default `hasContent` follows the renderer; the chat e2e finds New chat anywhere on the page; the comment guard flags an X-01 item wrapped across a line and an "X-02 design §N" citation; the sidebar's Ctrl+B and Cmd+B shortcut is gone; the fail badge's text reaches AA contrast; the typing dots show after a call is over and before the next step's text; a tool's label names the call and reads with every state; Esc ignores a chat that is not rendered and runs after a dialog's own handler, P1's fix `f734536`; `.env.example` names the template spec | The review found that section 5.8 put the sample's tests in a class every project keeps; an e2e that failed where a project put its case pages or its New chat; a default that changed under a project's own renderer; two citation shapes the guard let through; a shortcut that took the browser's key; a 4:1 badge; a gap with no sign that the answer was still coming; labels that claimed a call a denial never ran; and the Esc bug that X2-29's check found in P1 | X2-10, X2-12, X2-13, X2-19, X2-21, X2-23, X2-28, X2-29 | 5.8, 5.10, 5.12, 7.2, 9 steps 6 and 6b, 15, `.env.example` |
| W-17 | Felipe's answers to W-P8 and W-P9 (2026-10-06), applied: step 6b.4 writes the non-chat home page inside the app shell, dry-run green again; the check that a cited section names its document runs over every file outside `docs/`, and the template's own code, CI workflow and `.env.example` write "template spec §N" | The two approved proposals that changed files | X2-23, X2-25 | 4, 5.6, 7.2, 9 step 6b, 14, `.env.example` |

Left as they were:

- Sections 12, 13 and 14 stay the dated records of their approvals. Section 14's pending items, which X-02 answered, carry their verdicts in place, each dated 2026-10-05.
- The README skeleton (section 8) does not change, and the template's `README.md` is still the skeleton: `pnpm eval` prints its line 1 and the first line of "How it's measured", as a measurement run does.
- P1, #1 and #2 get no code changes [D: X2-07, 2026-10-05]; P1's status line is pending below. A real bug found in a shared piece is fixed here and hand-applied to P1 only where its visitors can hit it, counting toward the sync row of section 10 [D: V-12, 2026-09-29].
- The X-02 design stays the record of the decision: its scope, what stays in P1 and when it moves (its §3), its risks and the dry run of its §9.
- X2-08 (the light process, with the dry run kept) and the design's order of work changed no section above: they governed the work itself.

Pending, each with its trigger:

- **X-02 on `main`.** The branch `x02` is local: the agent never merges or pushes. Felipe merges and pushes it, and P2 then imports the template at that commit (section 9, step 1). Trigger: before P2's design starts.
- **CI time after X-02.** X-02 adds `pnpm eval --check` to CI and grows the e2e suite from 63 tests at the design's commit (`95ea920`) to 81, to 87 with the review's fixes, and to 91 with its minor findings [F: the gate runs of 2026-10-05 and 2026-10-06]. The budget is 10 minutes [D: X-01 P20], against X-01's 4:43 (section 14). Trigger: the first CI run on GitHub after X-02 reaches `main`; measure it with X-01 design §8's command and record it here. P1, with its own e2e and eval check, took 4 min 36 s on its first CI run [F: P1 spec §7]. *Measured on 2026-10-06: run 37475059011 on `75c443f`, 5:39 from the job's start to its end (`pnpm eval --check` 3 of 3, 91 e2e in 4.1 min), inside the budget [F].*
- **P1's status line** [D: X2-07, 2026-10-05]. P1's spec gets one dated line ("X-02 moved these pieces into the template at `<sha>`; this repo keeps its own copies"). Not done: X-02 left P1's repo untouched. Trigger: X-02 on `main`, whose commit the line names. *Done on 2026-10-06 in P1's spec §7 (P1 commit `87b66a0`, local until P1's next push), naming `75c443f` and X2-29's result.*
- **P1's drawer check** [D: X2-29, 2026-10-05]: one e2e in P1 checks whether a drawer closed by an outside click keeps streaming, with a fix in P1 only if it reproduces. **Done in P1 on 2026-10-06**: it reproduced (an Esc on the page stopped the hidden answer), and found a second effect, an Esc in the open drawer that stopped the answer and closed the drawer too; P1 fixed both at `f734536`, and the template ported the fix (W-16, section 5.8) [F: P1 commit `f734536`].
- "Comments outside the shell" and "The removal recipe after the dry run" stay in section 14, with X-02's notes.

**Added while applying X-02, to confirm.** Applying X-02 added the proposals below. Felipe approved W-P1 to W-P19 on 2026-10-06 ("todas ok"): each is now tagged `[D: W-Pn, 2026-10-06]` where it appears (W-P15 appears only here), and W-P8 and W-P9 were applied the same day (W-17). W-P20, W-P21 and W-P22 wait for his answer, each tagged `[P: W-Pn]` where it appears; reply in the form "todas ok exceto W-P21". W-P1 to W-P8 are about what visitors see and the recipe's scope, where my proposals miss more often; W-P9 to W-P15 are software choices. The review's fixes (W-14) added W-P16 to W-P19 on 2026-10-06: W-P16, W-P17 and W-P19 are what visitors see, W-P18 a software limit. The review's minor findings on the eval (W-15) added W-P20, what visitors see, and W-P21, a statistics choice, the same day; W-P21 now also shows the step between the two intervals, which the review measured after it was first asked. Its other minor findings (W-16) added W-P22, what visitors see.

| ID | Proposal | Section |
|---|---|---|
| W-P1 | The template's sample is a lookup of fictional items: the tool `lookUpItem`, ids of "ITM-" and four digits, three items in `lib/tools.ts`. In the chat, "What is the status of item ITM-0042?" shows the call's chip, then "Item ITM-0042 (Brass desk lamp) is available."; every project replaces it at import | 5.2, 5.10 |
| W-P2 | The sample's three cases: c01, a lookup, "Is item ITM-0108 available to borrow?", which expects `lookUpItem` and "on loan"; c02, a general question, "Why does a chat show its answer while it is still being written?", which expects "stream"; c03, a general question, "What is the benefit of seeing an answer before it is complete?", which expects "stop". The expected phrases were chosen so the mock's fixed answers pass, as the set's `about` says; no real model has answered them | 5.11 |
| W-P3 | The app shell's layout and words in the template, in both languages: two pages, "Chat" and Evals; the tagline "Sample pages to replace" ("Páginas de exemplo para substituir"); a banner saying that the cases, the run and the items are placeholders a project replaces; the Evals page's text on how a case is scored; and the labels "Item lookup", "General question", "Called exactly the expected tools" and "Holds every expected phrase". The shell's own lines reuse P1's, with "ticket" read as "case" | 5.12 |
| W-P4 | The generic first line of "How it's measured" that `pnpm eval` prints: P1's, without "through the chat's own pipeline on the server" and "Portuguese is checked by hand, not measured", which a project writes by hand on the lines after it | 5.11 |
| W-P5 | X2-04 on a case's page: for a mock run the usage block keeps its place and says "A mock run measures no tokens and no latency." instead of the mock's figures | 5.12 |
| W-P6 | The template's `/` links to no shell page: from `/` a visitor reaches `/evals` only by its URL, while the shell's nav links back to `/`. P2's design chooses its own home page and nav. The other option is an "Evals" link among the chat header's actions | 5.12 |
| W-P7 | At the message cap the cap text is a visible line above the composer; the composer stays focused, dimmed and read-only, keeps a draft typed while the last answer streamed, and New chat keeps that draft, ready to send | 5.8 |
| W-P8 | Step 6b.4 writes a non-chat project's home page inside the app shell, as `app/(shell)/page.tsx`, so its nav reaches the Evals page. This changes part of DR3; both variants passed every gate in the X-02 dry run. Applied on 2026-10-06 (W-17), and dry-run green again | 9 step 6b |
| W-P9 | The check that a cited section names its document runs over all the template's code, not only the shell files, and the template's other files write "template spec §N": a script found 20 unnamed citations in 12 such files on 2026-10-05, one of them a "template spec" broken across a line. This answers section 14's "Comments outside the shell". Applied on 2026-10-06 (W-17), over every file outside `docs/`, `.env.example` and the CI workflow included | 7.2, 14 |
| W-P10 | The P1 strings `tests/no-project-strings.test.ts` bans: the slug, the store's brand, its help center in both languages and as a path, "Try as a customer" in both languages, P1's folders, component and tool names, `data-hand-off` and "ticket". The ordinary words "customer", "store", "persona" and "hand-off" stay usable | 7.2 |
| W-P11 | Known limit: the mock's step machine reads only JSON tool results, as P1's did, so after a tool's error or a denied approval it starts over from the user message and may call the tool again until `MAX_STEPS`. Trigger: P2's design, which brings the approval states | 5.2 |
| W-P12 | Known limit: `keyCode` 229 always counts as composing, so a phone keyboard that reports Enter that way would get a newline and send with the Send button; whether any does is unchecked. Trigger: a report from a phone, or P2's design if its visitors type on phones | 5.8 |
| W-P13 | The template's chat route sends no trace metadata: the template shows the trace on recorded answers only, and a project that wants it under live answers adds one `messageMetadata` line. X-03 extracts P1's live trace [D: X2-06, 2026-10-05] | 5.10 |
| W-P14 | Known limit: a case with no unit to score (`total: 0`, such as a change with no planted bug) stops the run right after it, and its aborted file keeps the cases before it. Trigger: P4's design. Reworded 2026-10-06 (W-15): it read "is refused", and the refusal came only after every case was paid for | 5.11 |
| W-P15 | P1's composer, equal to the template's before X-02, keeps the three behaviours X-02 fixed (Safari's IME keys, the focus lost at the cap, a Stop click swallowed after a slow double-click). No hand-fix now; trigger: a report from a P1 visitor, or the next change to P1's composer. The other option is one short P1 plan that ports the three fixes, counted toward the sync row | 15 |
| W-P16 | A tool call still running when its answer ends (a Stop, an error banner, a server timeout) shows "Not finished" ("Não concluída") with a dashed circle and no spinner; its input stays a click away | 5.10 |
| W-P17 | A page's title is "<name> · <product>": "Evals" ("Avaliações") and "Case c01" ("Caso c01"), served in English and set in the interface language on the client; the chat keeps the product's name. The 404 page keeps Next's default page and the product's name: it is reached by typing a URL, never by a link of the template. Trigger for the 404: a project page that links to a page that may be missing, or a project's own not-found page | 5.12 |
| W-P18 | Known limit: a tool the page runs itself (no `execute` on the server), whose output the page adds after the stream ends, shows as not finished until that output arrives. Trigger: the first project with such a tool, at its design (P2's, if it has one) | 5.10 |
| W-P19 | The default renderer keeps the whole text first and the chips after it, each step's text a blank line apart, instead of text, chip and text in their order, which would move the answer's text out of the renderer contract's first `div` that the chat e2e reads. Trigger: a real model's answer where the order misleads, or P2's design | 5.10 |
| W-P20 | The Wilson interval is named where its numbers are: README line 1 reads "(95% CI 86–100%, Wilson score)" and the Evals page "95% CI 86–100% (Wilson score)" ("IC de 95%: 86–100% (escore de Wilson)"), and the run's details say "Wilson score interval over cases: every case scored the same, so the bootstrap's resamples did not vary" ("Intervalo de escore de Wilson sobre os casos: todos os casos tiveram o mesmo resultado, então as reamostragens do bootstrap não variaram"). The bootstrap's line stays as #2's and P1's, with its method in the run's details and the project's own README lines | 5.11, 5.12 |
| W-P21 | The Wilson interval counts the cases as its trials, not the units, at the run's rate: units cluster by case, as the bootstrap assumes. For one-unit cases, as in the sample, P1 and P2, both counts are the same; for 10 documents of 8 fields each, every field right, it gives 72–100% where the units would give 95–100%. The two methods meet at a step, so a perfect run's lower bound can sit below that of a run one unit worse: for one-unit cases the step is small and goes either way (24 of 24 gives 86–100%; 23 of 24 a lower bound of 83%, 87% or 88%, depending on which case failed), while 79 of 80 fields in 10 documents give 96–100% and 80 of 80 give 72–100%. The other option is the units as Wilson's trials in the fallback (80 of 80 gives 95–100%), which keeps that step small but counts a case's units as independent, which the bootstrap does not | 5.11 |
| W-P22 | A chip's label names the call, as a noun, and reads correctly with every state word after it: the sample's "Item lookup: ITM-0042" ("Consulta do item ITM-0042"), "Item lookup" ("Consulta de item") while the input holds no id yet, and the shell's "Tool: {name}" ("Ferramenta: {name}") for a tool the project does not name, under the key `toolCall.generic`, which replaces `toolCall.called` | 5.10 |
