# AI Portfolio Template — Design

- Status: approved by Felipe on 2026-09-25 ("specs ok, todas ok"). This covers every proposal in the confirmation table (T-01..T-21) and the rest of the document; the `[P]` tags stay in place as a record of what started as a proposal. Cite this approval as **D-spec**.
- Amended: 2026-09-28, by the lessons of projects #1 and #2 (U-01..U-08), approved by Felipe ("todas ok"). Section 13 lists them; each section they changed carries its `[D: U-xx, 2026-09-28]` tag. The proposals the amendment added, U-P1..U-P4, were approved the same day (end of section 13).
- Amended: 2026-09-29, by X-01 (V-01..V-12): the chat shell and i18n of #1 and #2 move into the template. Felipe approved the X-01 design on 2026-09-29 ("todas ok"). Section 14 lists the changes; each section they changed carries its `[D: V-xx, 2026-09-29]` tag. The proposals added while applying it, DR1–DR3 and V-P1..V-P7, are not confirmed yet (end of section 14).
- Date: 2026-09-25
- Author: Felipe Rêgo (design drafted with Claude)
- Related: `streaming-chat` spec (project #1), the first project generated from this template; `rag-citations` spec (project #2); the X-01 design, `docs/specs/2026-09-29-chat-shell-extraction-design.md`, cited as "X-01 design"

## How to read this document

Every claim carries its source:

- `[F]` — fact checked against documentation or package metadata. The source is noted.
- `[D]` — decision already taken by Felipe. The reference points to where.
- `[P]` — proposal not yet confirmed. The `[P]` items that most need Felipe's answer are collected in section 12, those the 2026-09-28 amendment added at the end of section 13, and those added while applying X-01 at the end of section 14; the rest are software details, marked `[P]` where they appear.
- `UNVERIFIED` — something to confirm at implementation before relying on it.

Decision references:

- **D-chat-1**: design conversation of 2026-09-24/25. It chose the stack, the repo layout (template + one repo per project), the provider, abuse protection, language, the chat UI approach, and the portfolio list. The list's decisions: many **small** projects, each validating few skills; every project ships a live demo and one measured number; project #1 is the streaming chat, whose number is time to first token; RAG, evals, tools, MCP, prompt-injection tests, routing and observability are separate projects; start with the template and project #1. The list was written down on 2026-09-28 in `portfolio/ROADMAP.md`, in Felipe's workspace, not public; the portfolio grid on feliperrego.com, not built yet, is to be built from it.
- **D-sec1**: approval of "Section 1: the template", 2026-09-25.
- **D-S-xx**: the block approval "todas ok" of items S-01..S-24, 2026-09-25. These were approved for project #1. Wherever this spec lifts one into the template, the lift is `[P]`.
- **#1 API check**: the `[F: v7 check]` pass of the streaming-chat spec, 2026-09-25. It checked the AI SDK docs (context7, ai-sdk.dev) and the `ai@7.0.114` / `@ai-sdk/react@4.0.117` source.
- **U-xx**: Felipe's block approval "todas ok" of 2026-09-28 of the lessons from projects #1 and #2 (section 13). Cited as `[D: U-xx, 2026-09-28]`.
- **X-01**: a decision of the `rag-citations` spec (project #2), 2026-09-28, option (a): when to move the shared chat shell and i18n into the template (section 10). Carried out by the amendment of section 14.
- **V-xx**: the changes of the X-01 design (`docs/specs/2026-09-29-chat-shell-extraction-design.md`), which Felipe approved with "todas ok" on 2026-09-29: its questions Q1–Q7 and proposals P1–P23. The V ids are new; section 14 names the design items each one carries out. Cited as `[D: V-xx, 2026-09-29]`, and a design item as `[D: X-01 Qn]` or `[D: X-01 Pn]`.

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
| `pnpm` | 12.6.0 |

Platform:

- Node 24 [D-sec1]. It is also the default for new Vercel projects, and `engines.node: "24.x"` pins it [F: vercel.com/docs/functions/runtimes/node-js/node-js-versions, checked 2026-09-25].
- pnpm [D-sec1]. The template pins the locally installed pnpm 9.15.0 in `packageManager` rather than the latest (12.6.0) [P, D-spec final-review ruling]. Trigger to upgrade: Felipe upgrades pnpm globally; then bump `packageManager`, re-run every gate, and commit.
- Exact versions are pinned in `package.json` at scaffold time [P].

## 4. What the template contains

The `lib/http.ts`, `lib/measure/`, `e2e/helpers/measure.ts` and `e2e/measure-guards.spec.ts` entries, and the `measure` project in `playwright.config.ts`, came with the 2026-09-28 amendment [D: U-01, U-05, 2026-09-28]. The chat, i18n and identity entries (`app/api/chat/`, `components/chat/`, `components/i18n/`, `components/app-chat.tsx`, `components/site-header.tsx`, `hooks/`, `lib/chat/`, `lib/i18n/`, `lib/project.ts`, `lib/ai/mock-scenarios.ts`, the chat and i18n e2e files) and the `vercel.json` entry came with X-01 [D: V-01, V-02, V-03, V-07, V-10, 2026-09-29]. Section 5.8 says who owns each file.

```
.
├── app/
│   ├── layout.tsx            # root layout: fonts, globals.css, metadata from lib/project.ts, <LocaleProvider>
│   ├── globals.css           # Tailwind v4 (@import "tailwindcss")
│   ├── page.tsx              # the chat page: <AppChat/>, then <Footer/> (5.6); a non-chat project replaces it (9, step 6b)
│   └── api/
│       ├── chat/route.ts     # POST: guardModelRoute, validateAndClean, streamText (5.8)
│       └── health/route.ts   # GET → { ok, model, mock, rateLimit }
├── components/
│   ├── app-chat.tsx          # the project's client wrapper: passes Chat's props (5.8)
│   ├── chat/                 # the chat shell: chat, message-list, plain-text-message, composer, empty-state (5.8)
│   ├── i18n/                 # locale-provider, language-switch (5.9)
│   ├── site-header.tsx       # model label, mock badge, data-* attributes, page actions, EN/PT switch (5.6)
│   ├── footer.tsx            # links: feliperrego.com + this repo (5.5)
│   └── ui/                   # shadcn/ui components, added on demand (button, alert, textarea)
├── hooks/
│   └── use-stick-to-bottom.ts # autoscroll that follows the stream, with "Jump to latest"
├── lib/
│   ├── ai/
│   │   ├── model.ts          # the ONLY place that decides model and mock mode
│   │   ├── mock.ts           # mock model factory (MockLanguageModelV4)
│   │   └── mock-scenarios.ts # default answer, [[slow]], [[error]] (5.2)
│   ├── chat/
│   │   ├── config.ts         # the shell's values: MAX_USER_CHARS, timeouts, scroll threshold
│   │   ├── limits.ts         # the project's limits: MAX_OUTPUT_TOKENS, MAX_MESSAGES, MAX_ASSISTANT_CHARS
│   │   ├── instructions.ts   # the model's instructions
│   │   ├── validate.ts       # validateAndClean: the history the route accepts
│   │   ├── errors.ts         # the safe error text sent instead of a raw error
│   │   └── ui.ts             # pure helpers of the chat UI
│   ├── i18n/
│   │   ├── locale.ts         # LOCALES, locale resolution, storage key, requestLocale, interfaceLanguageLine
│   │   ├── format.ts         # format(): fills {name} placeholders
│   │   ├── shell-messages.ts # the shell's text, EN and pt-BR
│   │   └── messages.ts       # the project's text, composed with the shell's
│   ├── measure/
│   │   └── record.ts         # measurement file paths + the no-overwrite rule (7.5)
│   ├── http.ts               # guardModelRoute: rate limit, then 415 for non-JSON (5.7)
│   ├── project.ts            # the project's identity: name, description, slug, repo URL (9, step 6)
│   ├── rate-limit.ts         # per-IP limiter + 429 response helper
│   └── utils.ts              # cn() for shadcn/ui
├── tests/                    # Vitest tests that span modules (routes, configs, guards) and their helpers; unit tests may also sit next to their module
├── e2e/
│   ├── helpers/
│   │   ├── chat.ts           # chat locators, faked SSE answers, waits
│   │   ├── fixtures.ts       # the project's e2e literals: prompts, default answer, 429 texts
│   │   ├── i18n.ts           # header, switch and footer locators, language checks
│   │   └── measure.ts        # measurement guards + file writing (7.5)
│   ├── chat.spec.ts          # the chat
│   ├── chat-i18n.spec.ts     # the chat in both languages
│   ├── i18n.spec.ts          # the site in both languages; kept by non-chat projects
│   ├── measure-guards.spec.ts # checks the measurement guards against the mock build
│   └── smoke.spec.ts         # Playwright smoke test
├── .github/workflows/ci.yml
├── docs/                     # this spec, the X-01 design and their plans; deleted at import (9, step 1)
├── .env.example
├── .gitignore
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
- Every `streamText` / `generateText` call passes `maxOutputTokens` [D-sec1]. Each project sets the value in its own spec. This is a review rule, checked at section 9, step 6. The chat's value is `MAX_OUTPUT_TOKENS` in `lib/chat/limits.ts`, a file the project owns (1024 in the template), and the chat route passes it (section 5.8) [D: V-06, 2026-09-29].
- `lib/ai/model.ts` is server-only: client components receive `IS_MOCK` / `MODEL_LABEL` as props.

**Gateway authentication:** `AI_GATEWAY_API_KEY` wins when set (local runs). Otherwise the AI SDK uses Vercel OIDC, which is automatic on Vercel deployments [F: vercel.com/docs/ai-gateway/authentication-and-byok and `@ai-sdk/gateway` 4.0.94 source, checked 2026-09-25].

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
- **Without options**, which is how `lib/ai/model.ts` calls it, it returns the scenario mock of `lib/ai/mock-scenarios.ts`, ported from #1 [D: V-07, 2026-09-29]. Each `doStream` call reads the last user message of the prompt and picks one scenario:
  - `[[error]]`: three words, then an `error` stream part. This happens only the first time the server process sees that exact text, so Retry with the same text streams the default answer; an e2e test that sends it makes its text unique (`randomUUID()`).
  - `[[slow]]`: 300 short lines, far taller than an 800 px viewport, for the Stop and autoscroll tests.
  - anything else: the default answer, a fixed ~120-word English paragraph, one word plus its trailing space per chunk.
- **With options**, every call streams the same chunks. **Defaults** [P]:
  - `initialDelayInMs: 600` [P: lifts D-S-12's calibration anchor into the template]
  - `chunkDelayInMs: 30`
  - `chunks`: the default answer, one word plus its trailing space per chunk

  The scenario mock uses the same 600 ms and 30 ms, written as literals [D: V-07, 2026-09-29].
- **Nothing in `lib/ai/` imports `lib/chat/`**, so the mock survives the removal recipe of a non-chat project (section 9, step 6b). `tests/shell-imports.test.ts` checks it [D: V-07, V-10, 2026-09-29].
- **Stream parts:** `text-start` / `text-delta { id, delta }` / `text-end` / `finish { finishReason: { unified, raw }, usage }`, and `error` for `[[error]]` [F: #1 API check].
- **Per-request behaviour.** A project that needs it chooses it inside the mock's `doStream(options)`, reading `options.prompt`, as the scenario mock does. So `getModel()` never takes arguments, and projects extend `lib/ai/mock.ts` (or files it imports) instead of editing `model.ts` [P].
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
- **The non-chat page.** Until X-01 this file was a placeholder: the header, one line ("Replace this page.") and `<Footer/>`. That page is now the one a non-chat project puts here, with the code in section 9, step 6b.
- **Header.** `components/site-header.tsx` shows `MODEL_LABEL` and, in mock mode, a "Mock model" badge. It carries these attributes [P: lifts D-S-14 into the template]:
  - `data-model={MODEL_LABEL}`
  - `data-commit={process.env.VERCEL_GIT_COMMIT_SHA ?? 'local'}`
  - `data-mock={IS_MOCK ? '' : undefined}`
- `data-mock` exists **only** in mock mode. Never pass a boolean: React renders `data-mock={false}` as the string `"false"`.
- The header also holds a visually hidden `<h1>` with `PRODUCT_NAME` (untranslated), an `actions` slot for page actions such as the chat's New chat, and the EN/PT switch (section 5.9). `ml-auto` sits on the wrapper around the actions and the switch, so the switch stays at the right end with or without actions. It is a client component: its text comes from the dictionary, and a server page passes the server-only values as props [D: V-02, V-05, 2026-09-29].

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

**Who owns which file** [D: V-04, 2026-09-29]:

| Owner | Files | Rule |
|---|---|---|
| Shell | `components/chat/**`, `components/i18n/**`, `components/site-header.tsx`, `components/footer.tsx`, `hooks/use-stick-to-bottom.ts`, `lib/chat/{ui,config,errors,validate}.ts`, `lib/i18n/{locale,format,shell-messages}.ts` | A project edits them only to change the shell, so `git diff --no-index` against the template shows only deliberate changes |
| Project | `lib/project.ts`, `lib/chat/limits.ts`, `lib/chat/instructions.ts`, `lib/i18n/messages.ts`, `components/app-chat.tsx`, `app/api/chat/route.ts`, `app/page.tsx`, `e2e/helpers/fixtures.ts`, the `package.json` `name` | Edited freely (section 9, step 6) |
| Template only | `docs/` (this spec, the X-01 design and their plans), `tests/chat-boundary.test.ts`, `tests/no-project-strings.test.ts`, `tests/shell-comments.test.ts` | Deleted at import (section 9, step 1) |

A shell file imports no project module except `lib/project.ts`, `lib/chat/limits.ts` and `lib/i18n/messages.ts`, and nothing in `lib/ai/` imports `lib/chat/`. `tests/shell-imports.test.ts` checks both and travels with the shell: it holds in any project that leaves the shell alone [D: V-10, 2026-09-29]. It counts `components/ui/**` and `lib/utils.ts` as primitives a shell file may import, and any other repo file as a project module [P: V-P5].

**`Chat`'s props** (`components/chat/chat.tsx`) [D: V-05, 2026-09-29]. `Chat<M extends UIMessage = UIMessage>` is generic over the message type.

| Prop | Default | What it is for |
|---|---|---|
| `modelLabel`, `isMock`, `commit`, `rateLimitPerHour` | required | Server-only values (sections 5.1, 5.3), passed down by the page |
| `empty: { title; intro?; groups: { heading?; prompts }[] }` | required | The empty state, in the current locale. A group with a heading renders a labelled section (#1's two groups); one group without a heading is a flat grid (#2) |
| `transport?` | `useChat`'s own: a POST to `/api/chat` with the whole history | A project that posts only the latest message passes its own |
| `maxMessages?: number \| null` | `MAX_MESSAGES`, whatever the transport | At the cap the composer locks until New chat. `null` turns the cap off, for a transport that posts only the latest message. A custom transport alone never turns it off: `new DefaultChatTransport({ api, body, headers })` still posts the history [F: `@ai-sdk/react` 4.0.117 `use-chat.ts`] |
| `renderAssistant?(message, { streaming, caption })` | plain text (`components/chat/plain-text-message.tsx`) | A caption, citations, tool steps |
| `hasContent?(message)` | `hasVisibleText` | Whether an assistant message has anything to show |

- **The client wrapper.** A server page cannot pass functions to a client component, so `app/page.tsx` renders the project-owned client component `components/app-chat.tsx`, which passes these props. The template's wrapper passes only its own text and keeps every default [D: X-01 P8].
- **`hasContent` is read in four places**: the list's filter that hides an assistant message with nothing to show, the Regenerate slot, the typing indicator and the "Response complete" announcement. The last three are pure helpers in `lib/chat/ui.ts` (`regenerateSlot`, `showTypingIndicator` and `announcement`), typed `<M extends UIMessage>(…, hasContent: (m: M) => boolean = hasVisibleText)`, so a predicate typed on a project's message type passes `strict` [F: TypeScript `strictFunctionTypes`]. With the list's filter alone on `hasVisibleText`, a tool-only last message would stay hidden and get neither Regenerate nor the stopped row.
- **Renderer contract**: the root carries `data-message-role="assistant"`, its first child `div` is the answer text, and `caption` goes last. It holds in #1 and #2 [F: X-01 design §4.3]. The type is `AssistantRenderer<M> = (message: M, options: { streaming: boolean; caption: ReactNode }) => ReactNode`, and `MessageList` gives each call its key [P: V-P1].
- **What tests and measurements read**: the header's `data-model`, `data-commit` and `data-mock` (section 5.6), `[data-message-role]`, the alert slot, the `role="status"` line, the log named "Conversation", and 44 px targets at 375 px on touch devices.
- **Deferred seams.** Per-request timing hooks, extra request-body fields beyond `locale`, and `useChat` options such as tool approval are not props. Until its trigger fires (section 10), a project that needs one edits its copy of the shell.

**Requests: history mode** [D: V-06, 2026-09-29; D: X-01 Q3]. `useChat`'s own transport posts the whole history, and `MAX_MESSAGES` caps it on both sides: the client stops at it, and the route rejects one more message. #1 posted the history; #2 posted only the latest message. The template takes #1's mode because #6 and #7 are multi-turn agents.

**Limits.** The project's limits live in `lib/chat/limits.ts` (project-owned): `MAX_OUTPUT_TOKENS` (1024), `MAX_MESSAGES` (20) and `MAX_ASSISTANT_CHARS` (6000). Section 5.1 has each project set its token cap in its own spec, and `MAX_ASSISTANT_CHARS` is sized from that cap [F: #1 spec, C-09], so `lib/chat/limits.test.ts` ties the two [D: V-06, 2026-09-29]; the test allows 4 to 6 characters per output token [P: V-P3]. The shell's own values live in `lib/chat/config.ts` (shell-owned): `MAX_USER_CHARS` (2000, the composer's `maxLength`), the first-chunk and between-chunk timeouts (20 s and 15 s) and the autoscroll threshold.

**The route** (`app/api/chat/route.ts`, project-owned), in order [D: V-01, V-06, 2026-09-29]:

1. `guardModelRoute(req)`: the 429, then the 415, before the body is read (section 5.7).
2. `req.json()`, or a 400.
3. `validateAndClean(body)` (`lib/chat/validate.ts`, from #1, logic unchanged). It accepts user and assistant messages only, user text parts only, at least one user message, at most `MAX_MESSAGES` messages, user text up to `MAX_USER_CHARS` and assistant text up to `MAX_ASSISTANT_CHARS`; anything else gets a 400 with a plain-text reason. It then rebuilds each message as one text part, so a forged body cannot pass provider options to the model. **Known limit for #6:** non-text assistant parts are dropped, so tool results leave the history (section 10).
4. `requestLocale(body)`: exactly `"en"` or `"pt-BR"`; any other value is ignored, never a 400 (section 5.9).
5. `streamText` with `buildInstructions({ locale })`, `maxOutputTokens: MAX_OUTPUT_TOKENS`, `abortSignal: req.signal` and the two timeouts. A raw model error is logged once on the server, and the client gets the safe text of `lib/chat/errors.ts`; no reasoning part reaches the client.

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
- **Dictionary** [D: X-01 P5]. `lib/i18n/shell-messages.ts` (shell-owned) holds the shell's keys, `header`, `composer`, `list`, `chat`, `errors`, `status` and `footer`, with #1's approved text in both locales. `lib/i18n/messages.ts` (project-owned) holds the project's keys (the template's `empty.{title, subtitle}` and `prompts`) and builds each locale as `{ ...shellMessages[locale], ...projectMessages[locale] }`, typed `Record<Locale, Messages>`. The two share no top-level key: with one in common, the project's spread would replace the whole shell object. Shell components read only shell keys; project text reaches them through props. `{name}` marks where `format()` inserts a value.
- **The model.** The client sends `locale` with each request, and the route reads it with `requestLocale`. `interfaceLanguageLine` ends the instructions ("Interface language: English." or "Interface language: Portuguese (Brazil)."), and the language rule of section 5.8 falls back to it. It adds nothing without a valid locale.
- **The switch.** `components/i18n/language-switch.tsx` is a client component in the header (section 5.6). EN and PT are 44 × 44 px on touch devices.
- **Interface text in components** comes only from the dictionaries; the lint rule of section 7.1 enforces it.

## 6. Environment variables (`.env.example`)

| Variable | Required | Vercel environments [D: U-04, 2026-09-28] | Purpose |
|---|---|---|---|
| `AI_MOCK` | no | Preview only, set to `1`, so preview deploys cost nothing. Never Production | `1` = use the mock model. CI and keyless local runs (`pnpm dev:mock`) set it. Forbidden in production (throws). |
| `AI_MODEL` | yes, unless mock | Production | `"provider/model"` string for the AI Gateway |
| `AI_GATEWAY_API_KEY` | local real-model runs | none: deployments use OIDC | Gateway auth outside Vercel; on Vercel, OIDC is used automatically (see 5.1) |
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

**Provider-import rule.** In `eslint.config.mjs`, `no-restricted-imports` blocks the pattern group `['@ai-sdk/*', '!@ai-sdk/react', '!@ai-sdk/provider', '!@ai-sdk/provider-utils']` everywhere except `lib/ai/model.ts`. CI enforces it in the `lint` step. Model ids live only in env vars; the README and measurement files may name the model.

**Interface-text rule** [D: V-09, 2026-09-29]. `react/jsx-no-literals` applies to `components/**` except `components/ui/**`, with the allowed strings `EN`, `PT` and `Felipe Rêgo`, so interface text comes from the dictionaries (section 5.9) and the language switch cannot miss it. It sees JSX text only. The shadcn/ui primitives hold no interface text, and `app/` is outside the rule, so the non-chat page's "Replace this page." passes (section 9, step 6b). `tests/eslint-jsx-literals.test.ts` pins the rule.

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
- `lib/chat/ui.test.ts`, with `hasContent` cases for `regenerateSlot`, `showTypingIndicator` and `announcement`; `hooks/use-stick-to-bottom.test.ts`.
- `lib/chat/validate.test.ts` and `tests/api-chat-route.test.ts` (with `tests/helpers/sse.ts`), ported from #1, plus the whole history reaching the model. Their boundary cases come from the constants of `lib/chat/limits.ts` and `lib/chat/config.ts`, not from literals, so they stay meaningful when a project changes a limit [P: V-P4].
- `lib/chat/instructions.test.ts`: the no-Markdown rule, the language rule, the interface line last.
- `lib/chat/limits.test.ts`: `MAX_ASSISTANT_CHARS` fits an honest answer at `MAX_OUTPUT_TOKENS` and stays near it (section 5.8).
- `lib/ai/mock.test.ts`: the scenarios of section 5.2.
- `tests/vercel-config.test.ts` (section 5.1) and `tests/eslint-jsx-literals.test.ts` (section 7.1).
- `tests/shell-imports.test.ts`, which travels with the shell (section 5.8). It reads imports with TypeScript's parser, so a comment that names `lib/chat/` is not an import. Its helper, `tests/helpers/repo-files.ts`, lists the repo's tracked and unignored files and the shell files.

**Template-only guards** [D: V-10, V-11, 2026-09-29]. They are deleted at import (section 9, step 1), because in a project they would fail on expected code: #2's renderer and measurement import the shell from outside the chat paths, and later projects will name #1 or #2 (X-01 design §4.1).

- `tests/chat-boundary.test.ts`: nothing outside the chat paths (the files section 9, step 6b deletes) imports them, except `app/page.tsx`. It proves the removal recipe. It also checks that nothing else imports `@ai-sdk/react`, which the recipe removes, and that every path the recipe deletes exists [P: V-P6].
- `tests/no-project-strings.test.ts`: a case-sensitive list of product and feature strings of #1 and #2 (product names, repo slugs, "AI SDK Core", "First token" and the like), over the files outside `docs/`, excluding itself. No personal data goes in the list.
- `tests/shell-comments.test.ts`: no decision or proposal id (regex `\b[A-Z](?:-[A-Za-z]+)?-\d+\b`, with `X-01` as the one exception) and no project spec ("delta spec", "#1 spec", "#2 spec") in the code. In a shell file, a cited section names its document: "template spec §N" or "X-01 design §N". The id and project-spec checks cover every code file outside `docs/`, not only the shell files [P: V-P6].

**Playwright** [P]:

- `testDir: 'e2e'`, with a `chromium` project (Desktop Chrome), plus a `measure` project only when `MEASURE_URL` is set (section 7.5) [D: U-05, 2026-09-28].
- `retries: 0` and `trace: 'retain-on-failure'`: a flaky test fails instead of passing on a retry, and every failure keeps its trace, which "on-first-retry" would not record without retries. A project that needs a retry scopes it to one describe, as #1 does for its calibration test [D: U-06, 2026-09-28; F: #1 spec §14 A-17].
- `webServer.command` is `pnpm start` when `process.env.CI` is set, because CI step 9 has already built with `AI_MOCK=1`. Locally it is `pnpm build && pnpm start`.
- `webServer.env` sets `AI_MOCK=1` and sets the Upstash variables to `''`, so e2e never uses a real limiter even when a local `.env*` file holds them. Process env takes precedence over `.env` files [F: @next/env 16.3.6 fills only keys that are undefined in process.env]. `webServer.timeout` is `180_000`, and `reuseExistingServer` is `!process.env.CI`. The e2e server listens on port 3100, so it never reuses a dev server on 3000.
- `webServer.env` also sets `RATE_LIMIT_PER_HOUR: "20"`: the e2e literals that show the hourly limit (the rate note, the 429 text) assume the default, and a local `.env*` value must not change the page a local run builds [D: V-10, 2026-09-29].
- Both paths run against a production build, not `next dev`, so first-compile time never pollutes latency assertions [P: lifts D-S-12 into the template].
- The template ships these specs [D: V-10, 2026-09-29 for the last three]:
  - the smoke spec: the page renders, the mock badge is visible, and `/api/health` returns `mock: true`
  - `measure-guards.spec.ts`: the measurement guards of section 7.5, against the mock build and in the test's own output folder [D: U-05, 2026-09-28]
  - `i18n.spec.ts`, the site in both languages. It waits on `data-hydrated` and reads only the header, the switch and the footer, so a non-chat project keeps it. It covers #2's site-level language tests: the served HTML stays English, with the project's metadata; `?lang=`; the switch; a stored choice across a reload; blocked storage; the switch removing only `lang`, with no reload and no router request; a `?lang=` alone never stored. It also checks that the switch ends the header, and the 44 px targets at 375 px [P: V-P7 for what it adds to #2's].
  - `chat.spec.ts`, the chat: #2's version of each test the two projects share, with #1's history body for Regenerate, a second send that posts `[user, assistant, user]`, a unique `[[error]]` text, and #1's `MAX_MESSAGES` cap test instead of #2's "no message cap". It adds the checks neither project had: "Response complete" and the English "Response stopped", an Esc another handler already handled, PageUp, a stop (PageUp, an upward wheel or a touch move) that the last pin's queued scroll event does not undo [D: X-01 Q5; F: X-01 design §4.2], and Jump, Retry and the footer links at 44 px on a 375 × 812 touch screen. No template test reads `data-ttft-ms`.
  - `chat-i18n.spec.ts`, the chat in both languages, with #1's history-mode body test.
- Shared e2e code lives in `e2e/helpers/`: `i18n.ts` (the header, switch and footer locators and the language checks; a non-chat project keeps it), `chat.ts` (the chat locators, faked SSE answers, the posted body, the waits) and the project-owned `fixtures.ts` (the prompt literals in both languages, the full default answer, the 429 texts, the empty-state text and the rate notes) [P: V-P7 for the split].

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
8. `pnpm exec playwright install --with-deps chromium`
9. `build`
10. `e2e`

**Environment:** `AI_MOCK=1` at the job level, and no secrets are referenced [D-sec1].

The Playwright HTML report is uploaded as an artifact on failure [P]. The CI badge goes on README line 3 (section 8) [D-sec1].

### 7.4 Deploy [D-sec1]

- Vercel Git integration: every PR gets a preview URL, and `main` deploys to production.
- Preview deploys run the mock model (`AI_MOCK=1` in Preview only) and have no rate-limit store; only production calls the model (section 6) [D: U-04, 2026-09-28].
- The template repo itself is **not** deployed [P]. Only generated projects are.

### 7.5 Measurement [D: U-05, 2026-09-28]

Every project publishes one measured number (section 1). The pattern comes from #1 [F: #1 spec §5.2, §5.4 and §14 A-16; `portfolio/ROADMAP.md` (Felipe's workspace, not public), "Lessons to carry forward", item 5]:

- **Against the deployed demo, from one stated location.** The number is never measured on a local or mock build. `MEASURE_LOCATION` (e.g. `'Recife, home fibre'`) is required and is published with the number. A latency number is measured in the browser, as #1 did.
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

  It records the model and commit from the page header, never from a flag, plus the user agent, browser version and platform.
- **The raw JSON is committed.** `saveMeasurement` writes `measurements/<metric>-YYYY-MM-DD.json` (paths from `lib/measure/record.ts`), and the file is committed together with the README lines it produced.
- **An aborted run** (a 429, a failed request) writes `measurements/<metric>-YYYY-MM-DD-HHMMSS.aborted.json`, prints no README lines, and fails the test. The time stamp is the run's start, so two aborted runs never collide.
- **A good file is never overwritten.** A second good run of the same metric on the same day refuses to write; rename or delete the first file on purpose.
- **Several runs** [D: U-P4, 2026-09-28]. A metric measured over several runs (e.g. #2, `rag-citations` spec §11, three runs in separate rate-limit hours) saves each run under its own metric name, e.g. `citations-run-1`, which `measurementPath` accepts. Guard 3 and the no-overwrite rule then apply to each run. The project's own script writes the aggregate `measurements/<metric>-YYYY-MM-DD.json` through `saveMeasurement`, under the same rule.
- **No number is typed by hand.** The project's `*.measure.ts` prints the README lines (line 1 and the first line of "How it's measured", section 8) from the record it just wrote.
- **What stays in each project:** the metric name, the requests themselves, the statistics (median, intervals and so on), the record's fields beyond the shared metadata, and the README lines.
- **Quota.** Every measured request counts against the hourly rate limit, so a run fits in one hour and is kept apart from manual checks [F: #1 spec §5.2].

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

Line 1 and the first line of "How it's measured" are printed by the measurement run (section 7.5), never typed by hand [D: U-05, 2026-09-28].

## 9. Creating a project from the template [P; amended by U-01..U-04 and U-07, 2026-09-28, and by V-01, V-03, V-04 and V-11, 2026-09-29]

1. **Repo** [D: U-07, 2026-09-28; D: V-11, 2026-09-29; F: #1 plan, commit `30a35dd`]. Start the project repo locally with its own spec (and plan) committed. Import the template at a known commit, delete the template's own docs (its spec and plan, and the X-01 design and plan) and its three template-only guards (section 7.2), and commit the import alone, so the template commit is on record. The project spec links to the template repo instead of the deleted docs.

   ```bash
   git -C <template checkout> archive <template sha> | tar -x -C .
   rm docs/specs/2026-09-25-ai-portfolio-template-design.md docs/plans/2026-09-25-ai-portfolio-template.md \
     docs/specs/2026-09-29-chat-shell-extraction-design.md docs/plans/2026-09-29-chat-shell-extraction.md \
     tests/chat-boundary.test.ts tests/no-project-strings.test.ts tests/shell-comments.test.ts
   pnpm install
   git add -A && git commit -m "build: import ai-portfolio-template at <template sha>"
   ```

   `git archive` exports tracked files only, so no local `.env*` file, `node_modules` or build output comes along. `tests/helpers/repo-files.ts` stays: the travelling `tests/shell-imports.test.ts` uses it. When `main` is ready, publish it: `gh repo create feliperrego/<name> --public --source . --remote origin --push`. This is the path #1 used; it replaces `gh repo create --template`.
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
   - a chat project edits the project-owned files of section 5.8: the limits in `lib/chat/limits.ts` (set in the project's own spec, section 5.1), the instructions in `lib/chat/instructions.ts`, its strings in `lib/i18n/messages.ts`, the props it passes in `components/app-chat.tsx`, the route, `app/page.tsx` and `e2e/helpers/fixtures.ts`. It leaves the shell-owned files alone, or changes them on purpose [D: V-04, 2026-09-29].
   - a project without a chat runs step 6b instead [D: V-01, 2026-09-29].
   - fill in the README
   - confirm every `streamText` / `generateText` call passes `maxOutputTokens`
   - confirm every route that calls a model starts with `guardModelRoute(req)` and returns its response when there is one (section 5.7) [D: U-01, 2026-09-28]. It runs the rate limit first, then the 415 for non-JSON bodies, both before the body is read. The 415 saves the model call, that is, the Gateway spend; it does not save the visitor's hourly budget, because the rate limit runs first.

   **6b. A project without a chat** runs this removal recipe [D: V-01, 2026-09-29; D: X-01 P18]. It was dry-run on 2026-09-30 and was green only with the corrections DR1–DR3, which are not confirmed yet [P: DR1–DR3; F: X-01 design §11].

   1. Delete the chat:

      ```bash
      rm -r components/chat/ components/app-chat.tsx hooks/use-stick-to-bottom.ts \
        hooks/use-stick-to-bottom.test.ts lib/chat/ app/api/chat/ components/ui/alert.tsx \
        components/ui/textarea.tsx tests/api-chat-route.test.ts tests/helpers/sse.ts \
        tests/vercel-config.test.ts e2e/chat*.spec.ts e2e/helpers/chat.ts e2e/helpers/fixtures.ts
      ```

   2. `pnpm remove @ai-sdk/react`, and set `vercel.json` back to `{}`, since the chat route's entry is all it holds [P: DR1].
   3. In `lib/i18n/messages.ts`, drop `prompts` and `empty`: `ProjectMessages` becomes `Record<never, never>` and each locale of `projectMessages` becomes `{}`, as below. Lint rejects a `{}` type (`@typescript-eslint/no-empty-object-type`); once the project adds its own keys, the type becomes an object type again [P: DR2]. No kept test reads the dropped keys: in the template only the chat e2e reads the prompts, through the fixtures deleted in step 6b.1.

      ```ts
      export type ProjectMessages = Record<never, never>;

      export const projectMessages: Record<Locale, ProjectMessages> = {
        en: {},
        "pt-BR": {},
      };
      ```

   4. Replace `app/page.tsx` with the non-chat page: `SiteHeader`, `<main>`, `Footer` [P: DR3].

      ```tsx
      import { Footer } from "@/components/footer";
      import { SiteHeader } from "@/components/site-header";
      import { IS_MOCK, MODEL_LABEL } from "@/lib/ai/model";

      /**
       * The non-chat page (template spec §9 step 6b). Project-owned. lib/ai/model.ts is server-only,
       * so its values reach the client header as props.
       */
      export default function Home() {
        return (
          <div className="flex min-h-dvh flex-col">
            <SiteHeader
              modelLabel={MODEL_LABEL}
              isMock={IS_MOCK}
              commit={process.env.VERCEL_GIT_COMMIT_SHA ?? "local"}
            />
            <main className="flex-1 p-4">
              <p>Replace this page.</p>
            </main>
            <Footer />
          </div>
        );
      }
      ```

   5. Run lint, typecheck, test, build and e2e.

   What stays: i18n, the site header, the footer, the mock model, `tests/shell-imports.test.ts` and the site i18n e2e. After step 6b.2, `package.json`, `pnpm-lock.yaml` and `vercel.json` equal the template's before X-01 [F: X-01 design §11]. The shell dictionary keeps its chat keys: it is shell-owned, `lib/i18n/messages.test.ts` pins it whole, and the page shows none of them.
7. After the project's first rate-limited route is deployed, send 21 requests with `Content-Type: application/json` from one IP within an hour, in an hour not used for other manual checks. The 21st must return 429 with the demo-limit text and `Retry-After`. Record it in that project's manual checks. Without that header each request gets a 415, but it is still counted (section 5.3).

## 10. Out of scope

| Item | Trigger to revisit |
|---|---|
| Auth, database, persistence [D-sec1] | The first project whose skill requires it; add it in that project, not in the template |
| i18n [D-sec1] | **Done by X-01** [D: V-02, 2026-09-29]: the template ships EN/pt-BR (section 5.9). **Superseded 2026-09-28** [D: U-08, 2026-09-28]. It was "Never, since the decision is English-only [D-chat-1]"; #1 and #2 now ship an EN/pt-BR interface switch in their own code [F: #1 spec §14 A-21 (D-chat-2), #2 spec §9 (D-chat-3)]. It moves into the template with the chat shell (the chat-shell row below) |
| ADR folder [D-sec1] | A project has more than 2 decisions worth recording; until then they live in the README "Decisions" section |
| Syncing template improvements into existing projects [D-chat-1: accepted trade-off of 1 repo per project] | The same fix has been hand-applied to 3 or more projects; then consider a shared npm package |
| Observability, tracing, cost dashboards | The observability portfolio project starts (#12 in the D-chat-1 list) |
| Shared chat components (the chat shell) and i18n | **Done by X-01** [D: V-01, V-02, 2026-09-29]: the shell and i18n are in the template (sections 5.8, 5.9); #1 and #2 keep their own copies (section 14). **Trigger fired with #2** [D: U-08, 2026-09-28]. It was "A second chat project needs the same component; then extract it", and #2 is that project. Now: when #2 (`rag-citations`) ships, before the next chat project (#6) starts, extract the shared chat shell and i18n into the template, with #1 and #2 as the two references. Until then #2 copies #1's shell [D: X-01 in the rag-citations spec, 2026-09-28] |
| Markdown rendering | A second chat project needs it; then extract it. Split from the row above on 2026-09-28, since X-01 does not cover it |
| #1's per-answer timing caption (time to first token) and per-request timing hooks in `Chat` [D: V-12, 2026-09-29] | A second project wants a per-answer timing caption. #2 dropped the caption on purpose [D: X-01 Q6] |
| Other `Chat` seams: extra request-body fields beyond `locale`, and `useChat` options such as client-side tool handling (`onToolCall`) or tool approval [D: V-12, 2026-09-29] | A project needs one; for tool handling, when #7's design starts. Until then a project edits its copy of the shell (section 5.8) |
| Tool results in the history: `validateAndClean` keeps only text parts (section 5.8) [D: V-12, 2026-09-29] | #6's design decides whether to keep them |
| Embeddings in the template [D: V-12, 2026-09-29] | A project other than #2 needs embeddings (likely #4 or #14 [P: inference]). They stay in #2 until a third project needs them [D: #2's R-08]; X-01 moves i18n only |
| Server locale routing and browser-language detection [D: V-12, 2026-09-29] | Unchanged: the trigger of #1's delta spec T-26 |
| Testing Library / jsdom | See section 7.2 |

## 11. Acceptance criteria

1. `pnpm install && pnpm dev:mock` serves the chat page with the mock badge, the EN/PT switch and a footer linking to https://feliperrego.com, with no `.env` file, and a suggested prompt streams the mock answer word by word [D: V-01, 2026-09-29]. Until X-01 this criterion named the placeholder page.
2. `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e` pass locally with `AI_MOCK=1`.
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

- **CI time after X-01.** The budget is the whole job under 10 minutes, against a baseline of 1:04 on `460c07a` (X-01 design §8). Trigger: the first CI run of X-01 on the template's `main`; X-01 design §11 records it with §8's command.
- **The autoscroll fix in #1 and #2.** The prototype's review found a race in the shell's `hooks/use-stick-to-bottom.ts`, copied from #2, whose stop and scroll logic #1 shares: a stop intent that came between the last pin and that pin's scroll event was undone by the event, so PageUp, an upward wheel or a touch move could fail to stop the view while an answer streamed. The template's hook fixes it (X-01 design §4.2). The e2e hit the race in 18 of 144 PageUp runs on six parallel workers, and in 1 of 3 full one-worker runs [F: prototype logs, 2026-09-30]; that visitors of #1 and #2 can hit it too is an inference [P: inference]. Under the rule above, Felipe decides whether #1 and #2 get the fix by hand; each one that does counts toward the sync row of section 10. Trigger: his answer to this section's proposals.

**Added while applying X-01, not confirmed yet.** DR1–DR3 are the dry run's corrections to the recipe, with the same ids as in X-01 design §11. V-P1..V-P7 are details that the design left open and this spec now states. Answer format: "todas ok exceto DR2 e V-P4". These are software details, where my proposals miss less often than on what visitors see.

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

