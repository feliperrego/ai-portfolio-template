# AI Portfolio Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `ai-portfolio-template` repo so that every small AI portfolio project starts with model access, a mock model, abuse protection, tests, CI and a README skeleton already in place.

**Architecture:** This is a Next.js 16 App Router app.

- `lib/ai/model.ts` is the single place that decides between a real AI Gateway model (a `"provider/model"` string) and a mock model built on `MockLanguageModelV4`.
- `lib/rate-limit.ts` wraps Upstash Ratelimit (20 requests/hour per IP). It turns itself off when the Redis env vars are absent, and it lets the request through if Redis fails.
- A placeholder page and `/api/health` expose the mode, so the Playwright smoke test and the deploy checks can read it.

**Tech Stack:** Next.js 16.3.6, React 19, TypeScript (strict), pnpm, Tailwind CSS v4, shadcn/ui 4.21.0, AI SDK `ai@7.0.114`, `@upstash/ratelimit@2.2.0`, `@upstash/redis@1.39.0`, `@vercel/functions@3.9.9`, Vitest 5.0.2 + Vite 8.3.1, Playwright 1.63.0, GitHub Actions.

**Spec:** `docs/specs/2026-09-25-ai-portfolio-template-design.md` (approved 2026-09-25, "D-spec"). Read it alongside this plan. Section numbers below ("spec §5.3") refer to it.

**Working directory for every command:** `/Users/felipe/Projetos/Pessoal/ai-portfolio-template`

## Global Constraints

- Everything is in English: code, UI text, README, commit messages (spec §2 row 6).
- Commit messages follow Conventional Commits and never include `Co-Authored-By` or any AI attribution line (Felipe's global rule).
- **Nothing is pushed to GitHub, and nothing is deployed, without Felipe's explicit OK in chat.** Task 9 is the only task that pushes, and it starts by asking.
- CI never references a secret and never calls a real model: `AI_MOCK=1` at job level (spec §7.3).
- No file other than `lib/ai/model.ts` imports an `@ai-sdk/<provider>` package; `@ai-sdk/react`, `@ai-sdk/provider` and `@ai-sdk/provider-utils` are allowed everywhere (spec §7.1).
- Every `streamText` / `generateText` call passes `maxOutputTokens` (spec §5.1). The template itself makes no model calls.
- Only `AI_MOCK === "1"` enables mock mode (spec §5.1).
- Rate limit: default 20 per rolling hour per client IP, overridable with `RATE_LIMIT_PER_HOUR` (spec §5.3).
- 429 body, verbatim: `Demo limit reached: ${RATE_LIMIT_PER_HOUR} messages per hour. Try again later.` (spec §5.3).
- Node 24, pnpm (local version 9.15.0, recorded in `packageManager`), exact versions pinned with `pnpm add -E` (spec §3).
- Code style follows the scaffold: double quotes, semicolons, 2-space indent.
- Vitest 5 defaults to `clearMocks: true`. Tests must not rely on `vi.fn()` call history that was recorded at module import time. Record such values in `vi.hoisted` state instead.

## Review Focus

These are the inputs most likely to bite a real user that the spec implies but does not spell out. Each line has a test in the owning task.

1. **`AI_MOCK` set to something other than `"1"`** (`"true"`, `"0"`, `""`). This must mean real mode, never a silent mock in production. Test: Task 3, `only "1" enables mock mode`.
2. **Upstash env present but empty, or only half set** (for example a `.env.local` copied from `.env.example`). The limiter must be off with no crash, and never half-configured. Tests: Task 4, `is off when the env vars are empty strings` and `is off when only the URL is set`.
3. **Redis unreachable or misconfigured at runtime.** Upstash `limit()` rejects rather than failing open. The request must still be served, and the error must be logged. Test: Task 4, `allows the request and logs when Upstash throws`.
4. **Client IP headers.** Locally there is no `x-real-ip`; `x-forwarded-for` may list several IPs with spaces; both can be missing. The key must be the real client IP where one exists, and `"unknown"` otherwise. Test: Task 4, `keys by x-real-ip, then the first x-forwarded-for entry, then "unknown"`.
5. **A `reset` time already in the past, or not a finite number.** `Retry-After` must be at least 1 second, or omitted, and never `0`, negative or `NaN`. Tests: Task 4, `clamps Retry-After to at least 1 second` and `omits Retry-After when reset is not a finite number`.

---

### Task 1: Scaffold the Next.js app with shadcn/ui

**Files:**
- Create (by CLI): `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/favicon.ico`, `components.json`, `lib/utils.ts`, `components/ui/button.tsx`
- Delete (scaffold leftovers): `public/*.svg`, the scaffold `README.md`
- Modify: `app/layout.tsx`, `.gitignore`, `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: a building Next.js app with the `@/*` path alias pointing to the repo root (tsconfig `"paths": { "@/*": ["./*"] }`), shadcn/ui initialised (`components.json`, `cn` from `lib/utils.ts`), and scripts `dev`, `build`, `start`, `lint`.

- [ ] **Step 1: Confirm the folder only holds allowed entries**

Run: `ls -A`
Expected: `.git` and `docs` only. `create-next-app` refuses any folder that has other files; `.git` and `docs` are on its allow-list.

- [ ] **Step 2: Scaffold into the repo root**

Run:
```bash
pnpm dlx create-next-app@16.3.6 . --ts --eslint --tailwind --app --no-src-dir --import-alias "@/*" --use-pnpm --no-react-compiler --no-agents-md --disable-git --yes
```
Expected: it ends with "Success!", runs `pnpm install`, and prints "Types generated successfully". `package.json` has `"packageManager": "pnpm@9.15.0"`.

- [ ] **Step 3: Initialise shadcn/ui with the default preset**

Run: `pnpm dlx shadcn@4.21.0 init -d`
Expected: creates `components.json`, `lib/utils.ts` and `components/ui/button.tsx`, and rewrites the top of `app/globals.css` to `@import "tailwindcss"; @import "tw-animate-css"; @import "shadcn/tailwind.css";`.

- [ ] **Step 4: Fix the font variable that shadcn init breaks**

shadcn rewrites `--font-sans: var(--font-geist-sans)` to `--font-sans: var(--font-sans)` but leaves `layout.tsx` alone. That creates a self-reference, so Geist never applies. Replace `app/layout.tsx` entirely with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Portfolio Template",
  description: "Starter for small AI portfolio projects by Felipe Rêgo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Remove scaffold leftovers**

Run: `rm -f public/*.svg README.md`
(`app/page.tsx` is replaced in Task 6, and `README.md` is rewritten in Task 8.)

- [ ] **Step 6: Extend `.gitignore`**

Append these lines to the end of `.gitignore`:

```
# keep the env template
!.env.example

# test output
/playwright-report/
/test-results/
```

The scaffold's `.gitignore` already ignores `.env*` and `next-env.d.ts`. Keep both rules.

- [ ] **Step 7: Pin Node and add the remaining scripts**

In `package.json`, add these entries alongside the existing ones:

```json
  "engines": {
    "node": "24.x"
  },
```

and set `"scripts"` to exactly:

```json
  "scripts": {
    "dev": "next dev",
    "dev:mock": "AI_MOCK=1 next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "next typegen && tsc --noEmit",
    "test": "vitest run",
    "e2e": "playwright test"
  },
```

`vitest`, `playwright` and `prettier` are installed in later tasks. Only `dev`, `build`, `start`, `lint` and `typecheck` must work now.

- [ ] **Step 8: Install Prettier**

Run: `pnpm add -D -E prettier@3`
Expected: `prettier` appears in `devDependencies` with an exact version.

- [ ] **Step 9: Verify the scaffold builds and lints**

Run: `pnpm lint && pnpm typecheck && pnpm build`
Expected: all three exit 0. The build lists the route `/`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "build: scaffold Next.js 16 app with Tailwind v4 and shadcn/ui"
```

---

### Task 2: Test setup and the mock model (`lib/ai/mock.ts`)

**Files:**
- Create: `vitest.config.ts`, `lib/ai/mock.ts`
- Test: `lib/ai/mock.test.ts`

**Interfaces:**
- Consumes: the `@/*` alias from Task 1.
- Produces:
  - `export type MockModelOptions = { initialDelayInMs?: number; chunkDelayInMs?: number; chunks?: string[] }`
  - `export type MockStreamPart` (the V4 stream-part union, derived from `MockLanguageModelV4`)
  - `export const DEFAULT_MOCK_TEXT: string`
  - `export function toWordChunks(text: string): string[]`
  - `export function buildStreamParts(chunks: string[]): MockStreamPart[]`
  - `export function createMockModel(options?: MockModelOptions): MockLanguageModelV4`, with defaults `initialDelayInMs: 600`, `chunkDelayInMs: 30`, `chunks: toWordChunks(DEFAULT_MOCK_TEXT)`

- [ ] **Step 1: Install the AI SDK and Vitest**

Run:
```bash
pnpm add -E ai@7.0.114
pnpm add -D -E vitest@5.0.2 vite@8.3.1
```
Vitest 5 requires `vite` as a peer dependency, which is why it is installed explicitly.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: [...configDefaults.exclude, "e2e/**", ".next/**"],
  },
});
```

- [ ] **Step 3: Write the failing test `lib/ai/mock.test.ts`**

```ts
import { streamText } from "ai";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_MOCK_TEXT,
  buildStreamParts,
  createMockModel,
  toWordChunks,
} from "./mock";

describe("toWordChunks", () => {
  it("splits into one word plus its trailing whitespace per chunk", () => {
    expect(toWordChunks("Hello  big world")).toEqual(["Hello  ", "big ", "world"]);
  });

  it("returns no chunks for empty or whitespace-only text", () => {
    expect(toWordChunks("")).toEqual([]);
    expect(toWordChunks("   ")).toEqual([]);
  });
});

describe("buildStreamParts", () => {
  it("wraps text deltas between text-start/text-end and ends with finish", () => {
    const parts = buildStreamParts(["a ", "b"]);
    expect(parts.map((p) => p.type)).toEqual([
      "text-start",
      "text-delta",
      "text-delta",
      "text-end",
      "finish",
    ]);
  });
});

describe("createMockModel", () => {
  it("streams the default ~120-word paragraph", async () => {
    const model = createMockModel({ initialDelayInMs: 0, chunkDelayInMs: 0 });
    const result = streamText({ model, prompt: "hi", maxOutputTokens: 100 });
    expect(await result.text).toBe(DEFAULT_MOCK_TEXT);
    expect(toWordChunks(DEFAULT_MOCK_TEXT).length).toBeGreaterThanOrEqual(100);
  });

  it("streams custom chunks in order", async () => {
    const model = createMockModel({
      initialDelayInMs: 0,
      chunkDelayInMs: 0,
      chunks: ["one ", "two ", "three"],
    });
    const parts: string[] = [];
    const result = streamText({ model, prompt: "hi", maxOutputTokens: 100 });
    for await (const part of result.textStream) parts.push(part);
    expect(parts.join("")).toBe("one two three");
  });

  it("waits initialDelayInMs before the first text", async () => {
    const model = createMockModel({
      initialDelayInMs: 80,
      chunkDelayInMs: 0,
      chunks: ["x"],
    });
    const started = performance.now();
    const result = streamText({ model, prompt: "hi", maxOutputTokens: 100 });
    for await (const part of result.textStream) {
      expect(part).toBe("x");
      break;
    }
    expect(performance.now() - started).toBeGreaterThanOrEqual(75);
  });

  it("serves a fresh stream on every call and records call options", async () => {
    const model = createMockModel({ initialDelayInMs: 0, chunkDelayInMs: 0, chunks: ["ok"] });
    const controller = new AbortController();
    const first = streamText({
      model,
      prompt: "a",
      maxOutputTokens: 123,
      abortSignal: controller.signal,
    });
    const second = streamText({ model, prompt: "b", maxOutputTokens: 100 });
    expect(await first.text).toBe("ok");
    expect(await second.text).toBe("ok");
    expect(model.doStreamCalls).toHaveLength(2);
    expect(model.doStreamCalls[0].maxOutputTokens).toBe(123);
    expect(model.doStreamCalls[0].abortSignal).toBe(controller.signal);
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `pnpm test lib/ai/mock.test.ts`
Expected: FAIL. `./mock` cannot be resolved.

- [ ] **Step 5: Implement `lib/ai/mock.ts`**

```ts
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";

type MockStreamResult = Awaited<ReturnType<MockLanguageModelV4["doStream"]>>;

/** One part of a V4 model stream (text-start, text-delta, text-end, finish, error, ...). */
export type MockStreamPart =
  MockStreamResult["stream"] extends ReadableStream<infer T> ? T : never;

export type MockModelOptions = {
  initialDelayInMs?: number;
  chunkDelayInMs?: number;
  chunks?: string[];
};

export const DEFAULT_MOCK_TEXT =
  "Streaming lets an answer appear while it is still being written. " +
  "Instead of waiting for the whole response, the interface shows each word " +
  "as soon as the model produces it. That makes a slow answer feel fast, and " +
  "it gives the reader a chance to stop early when the answer is already good " +
  "enough, or clearly going in the wrong direction. This paragraph comes from " +
  "the mock model in the portfolio template. It is split into one chunk per " +
  "word, with a short delay before the first chunk and a small gap between the " +
  "rest, so tests and demos can exercise streaming, stopping, and time to " +
  "first token without calling a real model or spending any money. Nothing " +
  "here was generated; it is the same text every time, which keeps every test " +
  "run predictable.";

/** Splits text into one word plus its trailing whitespace per chunk. */
export function toWordChunks(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}

export function buildStreamParts(chunks: string[]): MockStreamPart[] {
  const id = "text-1";
  return [
    { type: "text-start", id },
    ...chunks.map((delta): MockStreamPart => ({ type: "text-delta", id, delta })),
    { type: "text-end", id },
    {
      type: "finish",
      finishReason: { unified: "stop", raw: undefined },
      usage: {
        inputTokens: { total: 0, noCache: 0, cacheRead: undefined, cacheWrite: undefined },
        outputTokens: { total: chunks.length, text: chunks.length, reasoning: undefined },
      },
    },
  ];
}

/**
 * A deterministic model for CI, local runs without a key, and tests.
 * Projects that need per-request behaviour choose it inside doStream(options)
 * by reading options.prompt, so getModel() never takes arguments (spec §5.2).
 */
export function createMockModel(options: MockModelOptions = {}): MockLanguageModelV4 {
  const {
    initialDelayInMs = 600,
    chunkDelayInMs = 30,
    chunks = toWordChunks(DEFAULT_MOCK_TEXT),
  } = options;

  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: buildStreamParts(chunks),
        initialDelayInMs,
        chunkDelayInMs,
      }),
    }),
  });
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm test lib/ai/mock.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts lib/ai/mock.ts lib/ai/mock.test.ts package.json pnpm-lock.yaml
git commit -m "feat(ai): add deterministic mock model for tests and keyless runs"
```

---

### Task 3: Model selection and guards (`lib/ai/model.ts`)

**Files:**
- Create: `lib/ai/model.ts`
- Test: `lib/ai/model.test.ts`

**Interfaces:**
- Consumes: `createMockModel()` from `lib/ai/mock.ts` (Task 2).
- Produces:
  - `export const IS_MOCK: boolean` — `process.env.AI_MOCK === "1"`
  - `export const MODEL_LABEL: string` — the trimmed `AI_MODEL`, or `"mock"`
  - `export function getModel(): LanguageModel` — the model string in real mode, a `MockLanguageModelV4` in mock mode
  - Throws at module load when `AI_MOCK=1` with `VERCEL_ENV=production`, and when `AI_MODEL` is missing or blank in real mode.

- [ ] **Step 1: Write the failing test `lib/ai/model.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// model.ts reads the environment when it is first imported, so every test
// sets the env and then imports a fresh copy of the module.
async function loadModel(env: Record<string, string | undefined>) {
  vi.stubEnv("AI_MOCK", undefined);
  vi.stubEnv("AI_MODEL", undefined);
  vi.stubEnv("VERCEL_ENV", undefined);
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  return import("./model");
}

describe("lib/ai/model", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the mock model when AI_MOCK=1", async () => {
    const m = await loadModel({ AI_MOCK: "1" });
    expect(m.IS_MOCK).toBe(true);
    expect(m.MODEL_LABEL).toBe("mock");
    const model = m.getModel();
    expect(typeof model).toBe("object");
    expect((model as { provider: string }).provider).toBe("mock-provider");
  });

  it("returns the trimmed AI_MODEL string in real mode", async () => {
    const m = await loadModel({ AI_MODEL: "  anthropic/test-model \n" });
    expect(m.IS_MOCK).toBe(false);
    expect(m.MODEL_LABEL).toBe("anthropic/test-model");
    expect(m.getModel()).toBe("anthropic/test-model");
  });

  it('only "1" enables mock mode', async () => {
    for (const value of ["true", "0", "", "yes"]) {
      vi.resetModules();
      const m = await loadModel({ AI_MOCK: value, AI_MODEL: "openai/test" });
      expect(m.IS_MOCK).toBe(false);
      expect(m.getModel()).toBe("openai/test");
    }
  });

  it("allows mock mode on preview deployments", async () => {
    const m = await loadModel({ AI_MOCK: "1", VERCEL_ENV: "preview" });
    expect(m.IS_MOCK).toBe(true);
  });

  it("throws at load when AI_MOCK=1 in production", async () => {
    await expect(
      loadModel({ AI_MOCK: "1", VERCEL_ENV: "production" }),
    ).rejects.toThrow(/AI_MOCK=1 is not allowed in production/);
  });

  it("throws at load when AI_MODEL is missing in real mode", async () => {
    await expect(loadModel({})).rejects.toThrow(/AI_MODEL is not set/);
  });

  it("treats a whitespace-only AI_MODEL as missing", async () => {
    await expect(loadModel({ AI_MODEL: "   " })).rejects.toThrow(/AI_MODEL is not set/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test lib/ai/model.test.ts`
Expected: FAIL. `./model` cannot be resolved.

- [ ] **Step 3: Implement `lib/ai/model.ts`**

```ts
import type { LanguageModel } from "ai";
import { createMockModel } from "./mock";

/**
 * The only place that decides which model the app talks to (spec §5.1).
 * Real mode: an AI Gateway "provider/model" string from AI_MODEL.
 * Mock mode (AI_MOCK=1): a deterministic local model; no key, no cost.
 */
export const IS_MOCK = process.env.AI_MOCK === "1";

if (IS_MOCK && process.env.VERCEL_ENV === "production") {
  throw new Error(
    "AI_MOCK=1 is not allowed in production (VERCEL_ENV=production). " +
      "Remove AI_MOCK from the production environment variables.",
  );
}

const configuredModel = process.env.AI_MODEL?.trim();

if (!IS_MOCK && !configuredModel) {
  throw new Error(
    'AI_MODEL is not set. Set it to a "provider/model" string (see .env.example), ' +
      "or set AI_MOCK=1 to use the mock model.",
  );
}

export const MODEL_LABEL: string = IS_MOCK ? "mock" : (configuredModel as string);

export function getModel(): LanguageModel {
  return IS_MOCK ? createMockModel() : MODEL_LABEL;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test lib/ai/model.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/ai/model.ts lib/ai/model.test.ts
git commit -m "feat(ai): select gateway or mock model with production guards"
```

---

### Task 4: Per-IP rate limiter (`lib/rate-limit.ts`)

**Files:**
- Create: `lib/rate-limit.ts`
- Test: `lib/rate-limit.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `export const RATE_LIMIT_PER_HOUR: number` — a positive integer from `RATE_LIMIT_PER_HOUR`, default 20
  - `export const RATE_LIMIT_ENABLED: boolean` — true only when both a URL and a token are non-empty (`UPSTASH_REDIS_REST_URL` or `KV_REST_API_URL`, plus `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_TOKEN`)
  - `export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds?: number }`
  - `export function clientIp(req: Request): string`
  - `export async function rateLimit(req: Request): Promise<RateLimitResult>`
  - `export function rateLimitResponse(result: { ok: false; retryAfterSeconds?: number }): Response`

Verified facts this task relies on:

- `Ratelimit.slidingWindow(tokens, "1 h")` is the Upstash API, and `limit(id)` resolves `{ success, reset, pending, ... }` with `reset` in epoch ms [F: @upstash/ratelimit 2.2.0 `.d.ts`].
- `limit()` **rejects** when Redis throws, so the code must catch [F: dist/index.mjs].
- `ipAddress()` from `@vercel/functions` reads only `x-real-ip` [F: @vercel/functions 3.9.9 headers.js].
- The Vercel Marketplace Upstash integration injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` [F: Upstash docs].

- [ ] **Step 1: Install the dependencies**

Run: `pnpm add -E @upstash/ratelimit@2.2.0 @upstash/redis@1.39.0 @vercel/functions@3.9.9`

- [ ] **Step 2: Write the failing test `lib/rate-limit.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock factories are hoisted above imports, so shared state comes from
// vi.hoisted. Vitest 5 clears mock call history before each test
// (clearMocks: true), so constructor arguments are recorded here instead of
// being read from mock.calls.
const h = vi.hoisted(() => ({
  limit: vi.fn(),
  ratelimitConfig: undefined as unknown,
  slidingArgs: undefined as unknown[] | undefined,
  redisConfig: undefined as unknown,
}));

vi.mock("@upstash/redis", () => {
  function Redis(this: unknown, config: unknown) {
    h.redisConfig = config;
  }
  return { Redis };
});

vi.mock("@upstash/ratelimit", () => {
  function Ratelimit(this: { limit: unknown }, config: unknown) {
    h.ratelimitConfig = config;
    this.limit = h.limit;
  }
  Ratelimit.slidingWindow = (...args: unknown[]) => {
    h.slidingArgs = args;
    return "sliding-window";
  };
  return { Ratelimit };
});

const UPSTASH_ENV = {
  UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "token",
};

async function loadRateLimit(env: Record<string, string | undefined> = {}) {
  for (const name of [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
    "RATE_LIMIT_PER_HOUR",
  ]) {
    vi.stubEnv(name, "");
  }
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  return import("./rate-limit");
}

function request(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/test", { method: "POST", headers });
}

beforeEach(() => {
  vi.resetModules();
  h.limit.mockReset();
  h.ratelimitConfig = undefined;
  h.slidingArgs = undefined;
  h.redisConfig = undefined;
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("when Upstash is not configured", () => {
  it("is off when the env vars are empty strings, allows every request and logs once", async () => {
    const m = await loadRateLimit();
    expect(m.RATE_LIMIT_ENABLED).toBe(false);
    expect(await m.rateLimit(request())).toEqual({ ok: true });
    expect(await m.rateLimit(request())).toEqual({ ok: true });
    expect(h.limit).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledTimes(1);
  });

  it("is off when only the URL is set", async () => {
    const m = await loadRateLimit({ UPSTASH_REDIS_REST_URL: "https://example.upstash.io" });
    expect(m.RATE_LIMIT_ENABLED).toBe(false);
    expect(h.ratelimitConfig).toBeUndefined();
  });
});

describe("when Upstash is configured", () => {
  it("builds a 20-per-hour sliding window with the UPSTASH_* names", async () => {
    const m = await loadRateLimit(UPSTASH_ENV);
    expect(m.RATE_LIMIT_ENABLED).toBe(true);
    expect(m.RATE_LIMIT_PER_HOUR).toBe(20);
    expect(h.slidingArgs).toEqual([20, "1 h"]);
    expect(h.ratelimitConfig).toMatchObject({ limiter: "sliding-window", prefix: "ai-portfolio" });
    expect(h.redisConfig).toEqual({ url: "https://example.upstash.io", token: "token" });
  });

  it("also accepts the KV_REST_API_* names the Vercel integration injects", async () => {
    const m = await loadRateLimit({
      KV_REST_API_URL: "https://kv.upstash.io",
      KV_REST_API_TOKEN: "kv-token",
    });
    expect(m.RATE_LIMIT_ENABLED).toBe(true);
    expect(h.redisConfig).toEqual({ url: "https://kv.upstash.io", token: "kv-token" });
  });

  it("uses RATE_LIMIT_PER_HOUR when it is a positive integer", async () => {
    const m = await loadRateLimit({ ...UPSTASH_ENV, RATE_LIMIT_PER_HOUR: "5" });
    expect(m.RATE_LIMIT_PER_HOUR).toBe(5);
    expect(h.slidingArgs).toEqual([5, "1 h"]);
  });

  it("falls back to 20 for an invalid RATE_LIMIT_PER_HOUR", async () => {
    for (const value of ["abc", "0", "-3", "2.5"]) {
      vi.resetModules();
      const m = await loadRateLimit({ ...UPSTASH_ENV, RATE_LIMIT_PER_HOUR: value });
      expect(m.RATE_LIMIT_PER_HOUR).toBe(20);
    }
  });

  it('keys by x-real-ip, then the first x-forwarded-for entry, then "unknown"', async () => {
    const m = await loadRateLimit(UPSTASH_ENV);
    expect(m.clientIp(request({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }))).toBe(
      "1.1.1.1",
    );
    expect(m.clientIp(request({ "x-forwarded-for": " 3.3.3.3 , 4.4.4.4" }))).toBe("3.3.3.3");
    expect(m.clientIp(request())).toBe("unknown");
  });

  it("allows the request when Upstash says success", async () => {
    const m = await loadRateLimit(UPSTASH_ENV);
    h.limit.mockResolvedValue({
      success: true,
      limit: 20,
      remaining: 19,
      reset: Date.now() + 3_600_000,
      pending: Promise.resolve(),
    });
    expect(await m.rateLimit(request({ "x-real-ip": "1.1.1.1" }))).toEqual({ ok: true });
    expect(h.limit).toHaveBeenCalledWith("1.1.1.1");
  });

  it("denies with retryAfterSeconds rounded up from reset", async () => {
    const m = await loadRateLimit(UPSTASH_ENV);
    vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    h.limit.mockResolvedValue({
      success: false,
      limit: 20,
      remaining: 0,
      reset: 1_059_500,
      pending: Promise.resolve(),
    });
    expect(await m.rateLimit(request())).toEqual({ ok: false, retryAfterSeconds: 60 });
  });

  it("clamps Retry-After to at least 1 second", async () => {
    const m = await loadRateLimit(UPSTASH_ENV);
    vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    h.limit.mockResolvedValue({
      success: false,
      limit: 20,
      remaining: 0,
      reset: 900_000,
      pending: Promise.resolve(),
    });
    expect(await m.rateLimit(request())).toEqual({ ok: false, retryAfterSeconds: 1 });
  });

  it("omits Retry-After when reset is not a finite number", async () => {
    const m = await loadRateLimit(UPSTASH_ENV);
    h.limit.mockResolvedValue({
      success: false,
      limit: 20,
      remaining: 0,
      reset: Number.NaN,
      pending: Promise.resolve(),
    });
    expect(await m.rateLimit(request())).toEqual({ ok: false });
  });

  it("allows the request and logs when Upstash throws", async () => {
    const m = await loadRateLimit(UPSTASH_ENV);
    h.limit.mockRejectedValue(new Error("connection refused"));
    expect(await m.rateLimit(request())).toEqual({ ok: true });
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe("rateLimitResponse", () => {
  it("returns a 429 with the demo-limit text and Retry-After", async () => {
    const m = await loadRateLimit({ RATE_LIMIT_PER_HOUR: "20" });
    const res = m.rateLimitResponse({ ok: false, retryAfterSeconds: 42 });
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("42");
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe(
      "Demo limit reached: 20 messages per hour. Try again later.",
    );
  });

  it("omits Retry-After when it is unknown", async () => {
    const m = await loadRateLimit();
    const res = m.rateLimitResponse({ ok: false });
    expect(res.headers.has("Retry-After")).toBe(false);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test lib/rate-limit.test.ts`
Expected: FAIL. `./rate-limit` cannot be resolved.

- [ ] **Step 4: Implement `lib/rate-limit.ts`**

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions";

/**
 * Per-IP limit for public demos (spec §5.3). Off when the Upstash env vars
 * are missing or empty (local dev, CI). Fails open on Redis errors: the
 * AI Gateway spend cap is the backstop.
 */
const DEFAULT_LIMIT_PER_HOUR = 20;

function readLimitPerHour(): number {
  const raw = process.env.RATE_LIMIT_PER_HOUR?.trim();
  if (!raw || !/^\d+$/.test(raw)) return DEFAULT_LIMIT_PER_HOUR;
  const value = Number(raw);
  return value > 0 ? value : DEFAULT_LIMIT_PER_HOUR;
}

export const RATE_LIMIT_PER_HOUR = readLimitPerHour();

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const RATE_LIMIT_ENABLED = Boolean(redisUrl && redisToken);

const limiter = RATE_LIMIT_ENABLED
  ? new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_PER_HOUR, "1 h"),
      prefix: "ai-portfolio",
    })
  : null;

if (!limiter) {
  console.info("[rate-limit] Upstash env vars are not set; rate limiting is off.");
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds?: number };

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return ipAddress(req) || forwarded || "unknown";
}

export async function rateLimit(req: Request): Promise<RateLimitResult> {
  if (!limiter) return { ok: true };

  try {
    // analytics is off, so `pending` is an already-resolved promise.
    const { success, reset } = await limiter.limit(clientIp(req));
    if (success) return { ok: true };

    const seconds = Math.ceil((reset - Date.now()) / 1000);
    return Number.isFinite(seconds)
      ? { ok: false, retryAfterSeconds: Math.max(1, seconds) }
      : { ok: false };
  } catch (error) {
    console.error("[rate-limit] Upstash request failed; allowing the request.", error);
    return { ok: true };
  }
}

export function rateLimitResponse(result: {
  ok: false;
  retryAfterSeconds?: number;
}): Response {
  const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8" });
  if (result.retryAfterSeconds !== undefined) {
    headers.set("Retry-After", String(result.retryAfterSeconds));
  }
  return new Response(
    `Demo limit reached: ${RATE_LIMIT_PER_HOUR} messages per hour. Try again later.`,
    { status: 429, headers },
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test lib/rate-limit.test.ts`
Expected: PASS, 14 tests.

- [ ] **Step 6: Commit**

```bash
git add lib/rate-limit.ts lib/rate-limit.test.ts package.json pnpm-lock.yaml
git commit -m "feat(rate-limit): add per-IP Upstash limiter with 429 helper"
```

---

### Task 5: ESLint rule blocking provider imports outside `model.ts`

**Files:**
- Modify: `eslint.config.mjs`
- Test: `tests/eslint-provider-imports.test.ts`

**Interfaces:**
- Consumes: the scaffold ESLint config (Task 1).
- Produces: `pnpm lint` fails on `import ... from "@ai-sdk/<provider>"` anywhere except `lib/ai/model.ts`, with the message `Import provider SDKs only in lib/ai/model.ts.`

- [ ] **Step 1: Write the failing test `tests/eslint-provider-imports.test.ts`**

```ts
import path from "node:path";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const eslint = new ESLint({ cwd: process.cwd() });

async function restrictedImportMessages(code: string, file: string) {
  const [result] = await eslint.lintText(code, {
    filePath: path.join(process.cwd(), file),
  });
  return result.messages.filter((m) => m.ruleId === "no-restricted-imports");
}

describe("provider imports", () => {
  it(
    "are rejected outside lib/ai/model.ts",
    async () => {
      const messages = await restrictedImportMessages(
        'import { anthropic } from "@ai-sdk/anthropic";\nexport const m = anthropic;\n',
        "app/provider-check.ts",
      );
      expect(messages).toHaveLength(1);
      expect(messages[0].message).toContain("Import provider SDKs only in lib/ai/model.ts.");
    },
    30_000,
  );

  it(
    "are allowed in lib/ai/model.ts",
    async () => {
      const messages = await restrictedImportMessages(
        'import { anthropic } from "@ai-sdk/anthropic";\nexport const m = anthropic;\n',
        "lib/ai/model.ts",
      );
      expect(messages).toHaveLength(0);
    },
    30_000,
  );

  it(
    "allow @ai-sdk/react, @ai-sdk/provider and @ai-sdk/provider-utils everywhere",
    async () => {
      const messages = await restrictedImportMessages(
        [
          'import { useChat } from "@ai-sdk/react";',
          'import type { LanguageModelV4 } from "@ai-sdk/provider";',
          'import { generateId } from "@ai-sdk/provider-utils";',
          "export const x = [useChat, generateId] as const;",
          "export type Y = LanguageModelV4;",
          "",
        ].join("\n"),
        "components/chat.tsx",
      );
      expect(messages).toHaveLength(0);
    },
    30_000,
  );
});
```

`lintText` only parses the code; it does not resolve the imported packages, so none of them need to be installed.

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/eslint-provider-imports.test.ts`
Expected: FAIL on "are rejected outside lib/ai/model.ts", because 0 messages were found where 1 was expected.

- [ ] **Step 3: Add the rule to `eslint.config.mjs`**

Replace the file with:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Provider SDKs are imported only in lib/ai/model.ts (spec §5.1, §7.1).
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@ai-sdk/*",
                "!@ai-sdk/react",
                "!@ai-sdk/provider",
                "!@ai-sdk/provider-utils",
              ],
              message: "Import provider SDKs only in lib/ai/model.ts.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["lib/ai/model.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Test output:
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
```

- [ ] **Step 4: Run the test and the linter**

Run: `pnpm test tests/eslint-provider-imports.test.ts && pnpm lint && pnpm typecheck`
Expected: 3 tests pass, and `pnpm lint` and `pnpm typecheck` exit 0. ESLint 9 ships its own type declarations. If `pnpm typecheck` still reports that `eslint` has none, run `pnpm add -D -E @types/eslint` and re-run.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.mjs tests/eslint-provider-imports.test.ts
git commit -m "build(lint): restrict provider SDK imports to lib/ai/model.ts"
```

---

### Task 6: Placeholder page, footer and health route

**Files:**
- Create: `components/footer.tsx`, `app/api/health/route.ts`
- Modify: `app/page.tsx` (replace the scaffold page)
- Test: `tests/health-route.test.ts`

**Interfaces:**
- Consumes: `IS_MOCK` and `MODEL_LABEL` from `lib/ai/model.ts` (Task 3); `RATE_LIMIT_ENABLED` from `lib/rate-limit.ts` (Task 4).
- Produces:
  - `export function Footer(): JSX.Element`, with `REPO_URL` as a constant in the file, which each project edits
  - `GET /api/health` → `{ ok: true, model: string, mock: boolean, rateLimit: "upstash" | "off" }`
  - The page `<header>` carries `data-model`, `data-commit`, and `data-mock` (present only in mock mode)

- [ ] **Step 1: Write the failing test `tests/health-route.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadHealth(env: Record<string, string | undefined>) {
  for (const name of [
    "AI_MOCK",
    "AI_MODEL",
    "VERCEL_ENV",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
  ]) {
    vi.stubEnv(name, "");
  }
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  return import("@/app/api/health/route");
}

beforeEach(() => {
  vi.resetModules();
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("GET /api/health", () => {
  it("reports mock mode with the limiter off", async () => {
    const { GET } = await loadHealth({ AI_MOCK: "1" });
    const res = GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, model: "mock", mock: true, rateLimit: "off" });
  });

  it("reports the real model and an active limiter", async () => {
    const { GET } = await loadHealth({
      AI_MODEL: "anthropic/test-model",
      KV_REST_API_URL: "https://kv.upstash.io",
      KV_REST_API_TOKEN: "kv-token",
    });
    expect(await GET().json()).toEqual({
      ok: true,
      model: "anthropic/test-model",
      mock: false,
      rateLimit: "upstash",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test tests/health-route.test.ts`
Expected: FAIL. `@/app/api/health/route` cannot be resolved.

- [ ] **Step 3: Implement `app/api/health/route.ts`**

```ts
import { IS_MOCK, MODEL_LABEL } from "@/lib/ai/model";
import { RATE_LIMIT_ENABLED } from "@/lib/rate-limit";

// Never calls the model. Used by the e2e smoke test and by the deploy check
// in spec §9 (must show rateLimit: "upstash" and mock: false in production).
export function GET() {
  return Response.json({
    ok: true,
    model: MODEL_LABEL,
    mock: IS_MOCK,
    rateLimit: RATE_LIMIT_ENABLED ? "upstash" : "off",
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test tests/health-route.test.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Create `components/footer.tsx`**

```tsx
// Each project generated from the template sets its own repo URL here (spec §9).
const REPO_URL = "https://github.com/feliperrego/ai-portfolio-template";

export function Footer() {
  return (
    <footer className="border-t px-4 py-3 text-center text-sm text-muted-foreground">
      Built by{" "}
      <a href="https://feliperrego.com" className="underline underline-offset-4">
        Felipe Rêgo
      </a>
      {" · "}
      <a href={REPO_URL} className="underline underline-offset-4">
        Source on GitHub
      </a>
    </footer>
  );
}
```

- [ ] **Step 6: Replace `app/page.tsx`**

```tsx
import { Footer } from "@/components/footer";
import { IS_MOCK, MODEL_LABEL } from "@/lib/ai/model";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="flex items-center gap-2 border-b px-4 py-3"
        data-model={MODEL_LABEL}
        data-commit={process.env.VERCEL_GIT_COMMIT_SHA ?? "local"}
        // Present only in mock mode. Never pass a boolean: React renders false as "false".
        data-mock={IS_MOCK ? "" : undefined}
      >
        <span className="font-medium">{MODEL_LABEL}</span>
        {IS_MOCK && (
          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
            Mock model
          </span>
        )}
      </header>
      <main className="flex-1 p-4">
        <p>Replace this page.</p>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 7: Verify the page renders in mock mode**

Run: `pnpm lint && pnpm typecheck && AI_MOCK=1 pnpm build`
Expected: all exit 0.

Then run `pnpm dev:mock` and open http://localhost:3000. Expected: the header shows "mock" and a "Mock model" badge, and the footer links to feliperrego.com. Stop the server.

- [ ] **Step 8: Verify the production guard fails the build**

This is spec acceptance criterion 4.

Run: `AI_MOCK=1 VERCEL_ENV=production pnpm build; echo "exit=$?"`
Expected: a non-zero `exit=` and the message `AI_MOCK=1 is not allowed in production`. If the build does NOT fail, the page is not evaluated at build time. Stop and report this to Felipe; do not weaken the guard.

- [ ] **Step 9: Commit**

```bash
git add app/page.tsx app/api/health/route.ts components/footer.tsx tests/health-route.test.ts
git commit -m "feat: add placeholder page, footer and health route"
```

---

### Task 7: Playwright smoke test

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: the page and `/api/health` from Task 6.
- Produces: `pnpm e2e`, which runs Chromium against a production build in mock mode with the limiter forced off. Later projects add specs under `e2e/`.

- [ ] **Step 1: Install Playwright**

Run:
```bash
pnpm add -D -E @playwright/test@1.63.0
pnpm exec playwright install chromium
```

- [ ] **Step 2: Write `e2e/smoke.spec.ts`**

```ts
import { expect, test } from "@playwright/test";

test("placeholder page shows the mock model and the footer", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header[data-model]");
  await expect(header).toHaveAttribute("data-model", "mock");
  await expect(header).toHaveAttribute("data-mock", "");
  await expect(page.getByText("Mock model")).toBeVisible();
  await expect(page.getByRole("link", { name: "Felipe Rêgo" })).toHaveAttribute(
    "href",
    "https://feliperrego.com",
  );
});

test("health route reports mock mode with the limiter off", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBe(true);
  expect(await res.json()).toEqual({ ok: true, model: "mock", mock: true, rateLimit: "off" });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `pnpm e2e`
Expected: FAIL. Without a config, Playwright has no `baseURL` and no server, so `page.goto("/")` errors.

- [ ] **Step 4: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // CI already ran `pnpm build` with AI_MOCK=1; locally, build first.
    // Both paths serve a production build, never `next dev` (spec §7.2).
    command: process.env.CI ? "pnpm start" : "pnpm build && pnpm start",
    url: `${baseURL}/api/health`,
    // Merged over process.env. Empty Upstash vars force the limiter off even
    // when a local .env* file holds real ones.
    env: {
      AI_MOCK: "1",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      KV_REST_API_URL: "",
      KV_REST_API_TOKEN: "",
    },
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 5: Run the smoke test to verify it passes**

Run: `pnpm e2e`
Expected: 2 passed (chromium).

- [ ] **Step 6: Confirm Vitest ignores the e2e folder**

Run: `pnpm test`
Expected: only `*.test.ts` files run: `lib/ai/mock.test.ts`, `lib/ai/model.test.ts`, `lib/rate-limit.test.ts`, `tests/eslint-provider-imports.test.ts` and `tests/health-route.test.ts`. None of them fail, and `e2e/smoke.spec.ts` is not collected.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts e2e/smoke.spec.ts package.json pnpm-lock.yaml
git commit -m "test(e2e): add Playwright smoke test against a mock-mode production build"
```

---

### Task 8: CI workflow, README, license and env template

**Files:**
- Create: `.github/workflows/ci.yml`, `README.md`, `LICENSE`, `.env.example`, `vercel.json`

**Interfaces:**
- Consumes: the scripts `lint`, `typecheck`, `test`, `build` and `e2e` from earlier tasks.
- Produces: a CI pipeline with no secrets, the README skeleton every project fills in, and `.env.example` documenting every variable.

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    env:
      # Never call a real model and never need a secret in CI (spec §7.3).
      AI_MOCK: "1"
    steps:
      - uses: actions/checkout@v7
      # Reads the pnpm version from package.json "packageManager".
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm build
      - run: pnpm e2e
      - uses: actions/upload-artifact@v7
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

- [ ] **Step 2: Create `.env.example`**

```
# Use the mock model: no API key, no cost. CI sets it; production forbids it.
AI_MOCK=1

# "provider/model" string routed through the Vercel AI Gateway. Required unless AI_MOCK=1.
AI_MODEL=

# Local real-model runs only. On Vercel the AI SDK uses OIDC automatically.
AI_GATEWAY_API_KEY=

# Rate limiter (Upstash Redis). The Vercel Marketplace integration injects the KV_* names;
# UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN work too. Empty = limiter off.
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Requests per hour per IP. Default 20.
RATE_LIMIT_PER_HOUR=20
```

- [ ] **Step 3: Create `vercel.json`**

```json
{}
```

- [ ] **Step 4: Create `LICENSE`**

```
MIT License

Copyright (c) 2026 Felipe Rêgo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 5: Create `README.md` (the skeleton, spec §8)**

````markdown
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
````

- [ ] **Step 6: Run every gate locally, exactly as CI does**

Run:
```bash
AI_MOCK=1 CI=1 sh -c 'pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e'
```
Expected: every command exits 0, and e2e reports 2 passed. With `CI=1`, Playwright runs `pnpm start` against the build from the previous command, the same way CI does.

- [ ] **Step 7: Verify the README fits one screen**

Run: `wc -l README.md`
Expected: 40 lines or fewer (spec T-18).

- [ ] **Step 8: Commit**

```bash
git add .github/workflows/ci.yml .env.example vercel.json LICENSE README.md
git commit -m "ci: add CI workflow, README skeleton, license and env template"
```

---

### Task 9: Publish to GitHub as a template (gated on Felipe's OK)

**Files:** none changed.

**Interfaces:**
- Consumes: the finished local repo.
- Produces: the public GitHub repo `feliperrego/ai-portfolio-template`, marked as a template, with green CI (spec acceptance criteria 3 and 7).

- [ ] **Step 1: Ask Felipe before publishing**

Ask in chat, and wait for an explicit yes: "The template is ready locally and all gates pass. OK to create the public GitHub repo `feliperrego/ai-portfolio-template`, push `main`, and mark it as a template?"

Stop here until the answer is yes.

- [ ] **Step 2: Create the repo and push**

Run: `gh repo create feliperrego/ai-portfolio-template --public --source . --remote origin --push`
Expected: it prints the repo URL, and `main` is pushed.

- [ ] **Step 3: Mark it as a template and set the description**

Run:
```bash
gh repo edit feliperrego/ai-portfolio-template --template --description "Next.js + AI SDK starter for small AI portfolio projects: mock model, per-IP rate limit, zero-secret CI."
```

- [ ] **Step 4: Verify CI is green on the first push**

Run: `gh run watch --repo feliperrego/ai-portfolio-template --exit-status`
Expected: the CI run completes successfully, with no repository secrets configured (spec acceptance criterion 3). If it fails, read the log with `gh run view --log-failed`, fix the problem locally with a new commit, push again, and report the cause to Felipe.

- [ ] **Step 5: Verify the template flag**

Run: `gh repo view feliperrego/ai-portfolio-template --json isTemplate,visibility,licenseInfo`
Expected: `"isTemplate": true`, `"visibility": "PUBLIC"`, and `licenseInfo.key` is `"mit"`.
