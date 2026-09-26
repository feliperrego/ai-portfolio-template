# AI Portfolio Template — Design

- Status: approved by Felipe on 2026-09-25 ("specs ok, todas ok"). This covers every proposal in the confirmation table (T-01..T-21) and the rest of the document; the `[P]` tags stay in place as a record of what started as a proposal. Cite this approval as **D-spec**.
- Date: 2026-09-25
- Author: Felipe Rêgo (design drafted with Claude)
- Related: `streaming-chat` spec (project #1), the first project generated from this template

## How to read this document

Every claim carries its source:

- `[F]` — fact checked against documentation or package metadata. The source is noted.
- `[D]` — decision already taken by Felipe. The reference points to where.
- `[P]` — proposal not yet confirmed. The `[P]` items that most need Felipe's answer are collected in section 12; the rest are software details, marked `[P]` where they appear.
- `UNVERIFIED` — something to confirm at implementation before relying on it.

Decision references:

- **D-chat-1**: design conversation of 2026-09-24/25. It chose the stack, the repo layout (template + one repo per project), the provider, abuse protection, language, the chat UI approach, and the portfolio list. The list's decisions: many **small** projects, each validating few skills; every project ships a live demo and one measured number; project #1 is the streaming chat, whose number is time to first token; RAG, evals, tools, MCP, prompt-injection tests, routing and observability are separate projects; start with the template and project #1. The list itself exists only in the conversation; trigger to write it down: the portfolio grid on feliperrego.com is built.
- **D-sec1**: approval of "Section 1: the template", 2026-09-25.
- **D-S-xx**: the block approval "todas ok" of items S-01..S-24, 2026-09-25. These were approved for project #1. Wherever this spec lifts one into the template, the lift is `[P]`.
- **#1 API check**: the `[F: v7 check]` pass of the streaming-chat spec, 2026-09-25. It checked the AI SDK docs (context7, ai-sdk.dev) and the `ai@7.0.114` / `@ai-sdk/react@4.0.117` source.

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

1. A new project repo is created from the template with `gh repo create --template`.
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
| 6 | Everything in English: README, UI, commits, docs | [D-chat-1] |
| 7 | Chat UIs are built by hand on shadcn/ui primitives, not AI Elements | [D-chat-1] |
| 8 | CI never spends money and needs no secret: e2e runs against a mock model | [D-sec1] |
| 9 | Vercel Git deploy with a preview per PR | [D-sec1] |
| 10 | README skeleton that fits one screen, with the measured number first (section 8) | [D-sec1] |
| 11 | No auth, no database, no i18n, no ADR folder in the template | [D-sec1] |

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

```
.
├── app/
│   ├── layout.tsx            # root layout, fonts, globals.css
│   ├── globals.css           # Tailwind v4 (@import "tailwindcss")
│   ├── page.tsx              # placeholder landing: header with model label + mock badge, then <Footer/>
│   └── api/health/route.ts   # GET → { ok, model, mock, rateLimit }
├── components/
│   ├── footer.tsx            # links: feliperrego.com + this repo
│   └── ui/                   # shadcn/ui components, added on demand
├── lib/
│   ├── ai/
│   │   ├── model.ts          # the ONLY place that decides model and mock mode
│   │   └── mock.ts           # mock model factory (MockLanguageModelV4)
│   └── rate-limit.ts         # per-IP limiter + 429 response helper
├── tests/                    # Vitest tests that span modules (e.g. routes); unit tests may also sit next to their module
├── e2e/
│   └── smoke.spec.ts         # Playwright smoke test
├── .github/workflows/ci.yml
├── docs/specs/               # this file lives here
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
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json             # "strict": true
├── vitest.config.mts
└── vercel.json               # empty object; projects add per-route settings
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
- Every `streamText` / `generateText` call passes `maxOutputTokens` [D-sec1]. Each project sets the value in its own spec. This is a review rule, checked at section 9, step 6.
- `lib/ai/model.ts` is server-only: client components receive `IS_MOCK` / `MODEL_LABEL` as props.

**Gateway authentication:** `AI_GATEWAY_API_KEY` wins when set (local runs). Otherwise the AI SDK uses Vercel OIDC, which is automatic on Vercel deployments [F: vercel.com/docs/ai-gateway/authentication-and-byok and `@ai-sdk/gateway` 4.0.94 source, checked 2026-09-25].

### 5.2 `lib/ai/mock.ts`

```ts
export function createMockModel(options?: {
  initialDelayInMs?: number;
  chunkDelayInMs?: number;
  chunks?: string[];
}): MockLanguageModelV4;
```

- It is built on `MockLanguageModelV4` from `ai/test` and `simulateReadableStream` from `ai` [F: ai-sdk.dev/docs/ai-sdk-core/testing].
- **Defaults** [P]:
  - `initialDelayInMs: 600` [P: lifts D-S-12's calibration anchor into the template]
  - `chunkDelayInMs: 30`
  - `chunks`: a fixed ~120-word English paragraph, one word plus its trailing space per chunk
- **Stream parts:** `text-start` / `text-delta { id, delta }` / `text-end` / `finish { finishReason: { unified, raw }, usage }` [F: #1 API check].
- **Per-request behaviour.** A project that needs it chooses it inside the mock's `doStream(options)`, reading `options.prompt`. So `getModel()` never takes arguments, and projects extend `lib/ai/mock.ts` (or files it imports) instead of editing `model.ts` [P].
- **Test access.** Tests read `doStreamCalls` from the returned instance [F: #1 API check].

### 5.3 `lib/rate-limit.ts` [D-chat-1, D-sec1]

```ts
export const RATE_LIMIT_PER_HOUR: number; // env RATE_LIMIT_PER_HOUR, default 20
export const RATE_LIMIT_ENABLED: boolean; // true when the Upstash env vars are present
export const RATE_LIMIT_PREFIX: string; // "ai-portfolio-template"; each project sets its own
export async function rateLimit(req: Request): Promise<
  | { ok: true }
  | { ok: false; retryAfterSeconds?: number }
>;
export function rateLimitResponse(result: { ok: false; retryAfterSeconds?: number }): Response;
```

**Limiter.**

- Built with `Ratelimit.slidingWindow(RATE_LIMIT_PER_HOUR, '1 h')` and keyed by client IP [D-chat-1 for 20/hour; P for the sliding window and the env override].
- A denial `{ success: false, reset }` maps to `{ ok: false, retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) }`, or `{ ok: false }` when that is not a finite number [P]. `reset` is an epoch timestamp in ms [F: @upstash/ratelimit 2.2.0 `.d.ts`].
- The Upstash key prefix is `RATE_LIMIT_PREFIX`, so demos sharing one Upstash database keep separate counters [P, final-review ruling].
- **Client IP** [P]: `ipAddress(req)` from `@vercel/functions`, falling back to the first `x-forwarded-for` entry, then to `'unknown'`. `ipAddress` reads only `x-real-ip`, which Vercel sets and local runs lack, so the fallback is needed [F: @vercel/functions 3.9.9 source].

**`rateLimitResponse`** returns `429 text/plain` with `Demo limit reached: ${RATE_LIMIT_PER_HOUR} messages per hour. Try again later.`, plus `Retry-After` when it is known [D-sec1 for the friendly 429; P for the helper and the wording].

**Redis env missing or empty** (local dev and CI): `RATE_LIMIT_ENABLED` is false, `rateLimit` always returns `{ ok: true }` [D-sec1], and it logs once [P]. Empty strings count as missing, so the e2e `webServer` can switch the limiter off (section 7.2).

**Redis error at runtime:** it returns `{ ok: true }` and calls `console.error` [P]. This needs a `try/catch`: Upstash `limit()` rejects when Redis throws, and only fails open by itself on its 5 s timeout [F: @upstash/ratelimit 2.2.0 source]. A broken limiter must not take the demo down; the Gateway spend cap is the backstop [D-chat-1].

**Env var names.** The Vercel Marketplace Upstash integration injects `KV_REST_API_URL` / `KV_REST_API_TOKEN`, and `@upstash/redis` also reads `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` [F: Upstash docs and @upstash/redis 1.39.0 source]. The limiter accepts either pair. To inspect a project's variables, use `vercel env pull .env.vercel`, a file Next.js does not load, so local runs never hit the production Redis; then delete it.

### 5.4 `app/api/health/route.ts` [P]

- `GET` returns `{ ok: true, model: MODEL_LABEL, mock: IS_MOCK, rateLimit: RATE_LIMIT_ENABLED ? 'upstash' : 'off' }`.
- It does not call the model.
- It has two jobs:
  - the e2e smoke test uses it
  - the deploy check in section 9 uses it to prove the limiter is really on in production

### 5.5 `components/footer.tsx`

- It links to `https://feliperrego.com` and to the repo URL [D-sec1].
- The repo URL is a constant in `footer.tsx`, set to the template's own URL; each project edits it (section 9) [P].
- Pages place `<Footer/>` themselves, so full-height layouts can include it inside their column [P].

### 5.6 `app/page.tsx` (placeholder)

- **Header.** The header element shows `MODEL_LABEL` and, in mock mode, a "Mock model" badge. It carries these attributes [P: lifts D-S-14 into the template]:
  - `data-model={MODEL_LABEL}`
  - `data-commit={process.env.VERCEL_GIT_COMMIT_SHA ?? 'local'}`
  - `data-mock={IS_MOCK ? '' : undefined}`
- `data-mock` exists **only** in mock mode. Never pass a boolean: React renders `data-mock={false}` as the string `"false"`.
- One line: "Replace this page."
- `<Footer/>` goes last.
- Projects overwrite this file.

## 6. Environment variables (`.env.example`)

| Variable | Required | Purpose |
|---|---|---|
| `AI_MOCK` | no | `1` = use the mock model. CI and keyless local runs set it. Forbidden in production (throws). |
| `AI_MODEL` | yes, unless mock | `"provider/model"` string for the AI Gateway |
| `AI_GATEWAY_API_KEY` | local real-model runs | Gateway auth outside Vercel; on Vercel, OIDC is used automatically (see 5.1) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or the `UPSTASH_REDIS_REST_*` pair) | no | Enables the rate limiter (see 5.3). Empty = off. |
| `RATE_LIMIT_PER_HOUR` | no | Default 20 |

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

### 7.2 Testing

**Vitest, node environment.** Pure logic is unit-tested; UI behaviour is covered by Playwright.

- This changes D-sec1 (CLAUDE.md rule 6). Section 1 approved "Vitest + Testing Library". D-S-18, approved later for project #1, removes jsdom component tests.
- Applying D-S-18 to the template means `@testing-library/*` and `jsdom` are not installed [P].
- Trigger to revisit: the first project with UI logic that can be neither extracted into a pure function nor covered by Playwright.

**File naming** [P]:

- Vitest files are `*.test.ts`, next to their module or in `tests/`.
- Playwright files live under `e2e/` as `*.spec.ts`, or `*.measure.ts` for measurement.
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

**Playwright** [P]:

- `testDir: 'e2e'`, with one `chromium` project (Desktop Chrome).
- `webServer.command` is `pnpm start` when `process.env.CI` is set, because CI step 9 has already built with `AI_MOCK=1`. Locally it is `pnpm build && pnpm start`.
- `webServer.env` sets `AI_MOCK=1` and sets the Upstash variables to `''`, so e2e never uses a real limiter even when a local `.env*` file holds them. Process env takes precedence over `.env` files [F: @next/env 16.3.6 fills only keys that are undefined in process.env]. `webServer.timeout` is `180_000`, and `reuseExistingServer` is `!process.env.CI`. The e2e server listens on port 3100, so it never reuses a dev server on 3000.
- Both paths run against a production build, not `next dev`, so first-compile time never pollutes latency assertions [P: lifts D-S-12 into the template].
- The template ships one smoke spec: the page renders, the mock badge is visible, and `/api/health` returns `mock: true`.

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
- The template repo itself is **not** deployed [P]. Only generated projects are.

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

## 9. Creating a project from the template [P]

1. `gh repo create feliperrego/<name> --public --template feliperrego/ai-portfolio-template --clone`
2. Import the repo into Vercel and set `AI_MODEL` on the import screen, **before** the first deploy. The missing-`AI_MODEL` guard fails the build otherwise. Also set `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel uses the `packageManager` pnpm version instead of guessing from the lockfile [F: vercel.com/docs/builds/configure-a-build#corepack], and check the pnpm version in the first build log.
3. Add the Upstash integration.
4. Make sure a monthly AI Gateway spend cap covers the project. Felipe sets it by hand [D-chat-1, D-sec1]. Whether one team-level budget covers every project or each needs its own is UNVERIFIED; check it on the first deploy.
5. Redeploy, because env vars added after a deploy reach only new deployments [P, UNVERIFIED]. Then `curl <production URL>/api/health` must show `"rateLimit": "upstash"` and `"mock": false`.
6. In the new repo:
   - replace `app/page.tsx`
   - set the repo URL constant in `components/footer.tsx`
   - fill in the README
   - add the project spec under `docs/specs/`
   - delete this template spec (the project spec links to the template repo instead)
   - confirm every `streamText` / `generateText` call passes `maxOutputTokens`
   - set `title` and `description` in `app/layout.tsx` metadata (they appear in browser tabs and link previews)
   - set `RATE_LIMIT_PREFIX` in `lib/rate-limit.ts` to the project name
   - confirm every route that calls a model calls `rateLimit(req)` first and returns `rateLimitResponse` on denial
   - delete `docs/plans/` (the template's implementation plan)
7. After the project's first rate-limited route is deployed, send 21 requests from one IP within an hour, in an hour not used for other manual checks. The 21st must return 429 with the demo-limit text and `Retry-After`. Record it in that project's manual checks.

## 10. Out of scope

| Item | Trigger to revisit |
|---|---|
| Auth, database, persistence [D-sec1] | The first project whose skill requires it; add it in that project, not in the template |
| i18n [D-sec1] | Never, since the decision is English-only [D-chat-1] |
| ADR folder [D-sec1] | A project has more than 2 decisions worth recording; until then they live in the README "Decisions" section |
| Syncing template improvements into existing projects [D-chat-1: accepted trade-off of 1 repo per project] | The same fix has been hand-applied to 3 or more projects; then consider a shared npm package |
| Observability, tracing, cost dashboards | The observability portfolio project starts (#12 in the D-chat-1 list) |
| Markdown rendering, shared chat components | A second chat project needs the same component; then extract it |
| Testing Library / jsdom | See section 7.2 |

## 11. Acceptance criteria

1. `pnpm install && pnpm dev:mock` serves the placeholder page with the mock badge and a footer linking to https://feliperrego.com, with no `.env` file.
2. `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e` pass locally with `AI_MOCK=1`.
3. CI is green on the first push, with no repository secrets configured.
4. `AI_MOCK=1 VERCEL_ENV=production pnpm build` exits non-zero with the guard's message. The build evaluates `app/page.tsx`, which imports `lib/ai/model.ts`; confirm this at scaffold. The unit test in section 7.2 also covers the guard.
5. Without Upstash env vars, `rateLimit` always allows and logs once. With env vars, the unit test (Upstash mocked) checks that the limiter uses a sliding window of `RATE_LIMIT_PER_HOUR` per hour keyed by client IP, and that a denial maps to `{ ok: false, retryAfterSeconds }`. The real 21st-request denial is checked once by hand on the first deployed project (section 9, step 7, recorded in that project's manual checks).
6. Importing an `@ai-sdk/<provider>` package outside `lib/ai/model.ts`, statically or with dynamic `import()`, fails `pnpm lint`. `@ai-sdk/react`, `@ai-sdk/provider` and `@ai-sdk/provider-utils` (and their subpaths) are allowed.
7. The GitHub repo `feliperrego/ai-portfolio-template` is marked as a template [D-sec1], public [P], and MIT-licensed [D-sec1].
8. The README follows section 8, with the placeholders in angle brackets.

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
