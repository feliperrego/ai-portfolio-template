# X-01: the chat shell and i18n move into the template — design

- **Status:** approved by Felipe on 2026-09-29 ("todas ok"): Q1–Q7 and P1–P23 of §10, and the rest of the document. The `[P]` tags stay in place as a record of what started as a proposal; later documents cite these items as `[D: X-01 Qn]` or `[D: X-01 Pn]`. Built on the branch `x01` on 2026-09-30 (§11, Execution).
- **Decision it carries out:** X-01, option (a), approved 2026-09-28 in `rag-citations` spec §17: "extract the shared shell and i18n into the template **when #2 ships, before the next chat project (#6) starts**, using #1 and #2 as the two references" [D: X-01]. #2 shipped on 2026-09-29, so the trigger has fired [F: `portfolio/ROADMAP.md`].
- **How it was prepared:** read-only maps of this template (`460c07a`), `streaming-chat` (`cd14c10`) and `rag-citations` (`4a8b268`), a file-by-file diff of #1 against #2, a design synthesis and a completeness critic. Draft v1 was then reviewed by three independent reviewers (facts, feasibility, rules), each finding checked by a skeptic; the findings that held are applied in this v2.

| Tag | Meaning |
|---|---|
| `[F]` | Read in the repos, their docs or package types; the source is named. |
| `[D]` | Decided by Felipe; the reference is named. |
| `[P]` | Proposal of mine, not yet confirmed; §10 gathers every one for one answer. An estimate or inference is tagged `[P: estimate]` or `[P: inference]`; it is not a decision and needs no answer. |

My proposals miss more often on what visitors see and on scope (the Q items) than on the software (the P items).

## 1. What moves, in one paragraph

Today every chat project copies the shell by hand: #2 copied #1's and adapted it [F: `rag-citations` history]. After X-01 the template's `/` is a working chat in mock mode, with no API key: the composer, Send/Stop, Esc, Regenerate/Retry, the stopped and cut-off labels, the 429 and generic banners, autoscroll with "Jump to latest", New chat, the screen-reader status line and the EN/pt-BR switch [P]. A project edits only the project-owned files of §4.1: its identity (`lib/project.ts` and the `package.json` `name`), strings, instructions, limits, client wrapper, chat route, page and e2e fixtures. It leaves the shell-owned files alone [P]. Non-chat projects run a short removal recipe (§5).

## 2. Goal and non-goals

**Goal** [P]:
1. A working, tested chat in the template, in mock mode.
2. The EN/pt-BR machinery: locale resolution (`?lang=` → storage → `en`), the provider, the switch, a typed dictionary with `format()`, and the line that tells the model the interface language. These are identical in #1 and #2 apart from comments, the storage key and #2's `LOCALES` constant, from which #2 derives `Locale` and `isLocale` [F: diff of `lib/i18n/locale.ts`].
3. The contracts that tests and measurements depend on: `header[data-model][data-commit][data-mock]` [F: template §5.6, `e2e/helpers/measure.ts`], `[data-message-role]`, the alert slot, the `role="status"` line, the log named "Conversation", and 44 px targets at 375 px [F: #1 and #2 e2e].
4. The tests that pin all of this, moved or rebuilt with the code.

**Non-goals, each with its trigger** [P unless marked]:

| Out of X-01 | Why | Trigger to revisit |
|---|---|---|
| Markdown rendering | Its own template §10 row [F] | Unchanged: that row's trigger |
| AI Elements | Template §2 [F] | Unchanged |
| Server locale routing, browser-language detection | #1 delta spec, T-26 [F] | Unchanged: T-26 |
| #1's TTFT caption and per-request timing hooks | #2 dropped it on purpose (R-07) [F] | Q6: a second project wants a per-answer timing caption |
| Client-side tool handling (`onToolCall`, tool approval) | No second user yet | P2's design starts. Remapped 2026-10-01: the roadmap's old #7 became P2's approve/reject card (ROADMAP) [D: Q2, 2026-10-01] |
| Extra request-body fields beyond `locale` | No project needs one yet | A project needs one |
| Embeddings | R-08: "Embeddings and i18n stay in #2 until a third project needs them" [D: R-08]; X-01 moves i18n only | P3 starts: they move into the template then; until then P1 copies them from #2, with #2's citations and verifier [D: Q6, 2026-10-01]. Remapped 2026-10-01: the roadmap's old #4 was dropped and #14 became P3's Search screen (ROADMAP) [D: Q2, 2026-10-01]; the trigger was "A project other than #2 needs embeddings (likely #4 or #14 [P: inference])" |
| A shared npm package (option B) | Template §10's sync row fires only after the same fix is hand-applied to 3 projects [F] | Unchanged: that row |

**#1 and #2 get no code changes** [P, Q5]. The template is copied once per project [F: template §2, §9 step 1], and "#1 keeps its own copies" [F: template §13]. They get one dated status line each (§7). A real bug found in shared code is fixed here and hand-applied to #1 or #2 only if their visitors can hit it; each such fix counts toward the §10 sync trigger.

## 3. Options [P]

The cells are my assessment, except where a cell names its source.

| | **A. Starting code, chat as the default page** (recommended) | B. Shared package | C. i18n and primitives only | D. A `chat` branch or second template |
|---|---|---|---|---|
| For a 1–2-day project | A chat project starts with a tested chat; a non-chat one spends minutes on §5 | Every shell change means publish, bump, re-lock | Each chat project repeats #2's copy-and-adapt, tests included | Every base fix must be merged into the branch; they conflict on page, layout, eslint, package, vercel and Playwright config |
| Template CI | Adds #1's and #2's chat and i18n e2e suites, merged; the new duration is measured in §8 [P: estimate] | Package CI plus a host app | Small, but the chat components go untested here | Two lines to keep green |
| Template rules | "One repo per project, created from it" [F: template §2]; "i18n comes in with the chat shell" [F: template §2] | Premature under the sync row [F: template §10] | Does half of X-01 | Two templates in spirit |

A is the only option where the template's own CI runs the shell exactly as a project receives it. Q1 decides it.

## 4. Design (option A)

### 4.1 Who owns which file [P]

- **Shell-owned** (a project edits them only to change the shell, so `git diff --no-index` against the template shows only deliberate changes): `components/chat/**`, `components/i18n/**`, `components/site-header.tsx`, `components/footer.tsx`, `hooks/use-stick-to-bottom.ts`, `lib/chat/{ui,config,errors,validate}.ts`, `lib/i18n/{locale,format,shell-messages}.ts`.
- **Project-owned** (edited freely): `lib/project.ts`, `lib/chat/limits.ts`, `lib/chat/instructions.ts`, `lib/i18n/messages.ts`, `components/app-chat.tsx`, `app/api/chat/route.ts`, `app/page.tsx`, `e2e/helpers/fixtures.ts`, `package.json` `name`.
- **Template-only** (deleted at import by template §9 step 1): this spec, its plan, and the three guards of §6 (`tests/chat-boundary.test.ts`, `tests/no-project-strings.test.ts`, `tests/shell-comments.test.ts`). In a project they would fail on expected code: #2's renderer and measurement import the shell from outside the chat paths [F: #2 `components/rag/assistant-message.tsx:5`, `lib/measure/citation-record.ts:2`, `e2e/citations.spec.ts:10-11`], and P1 will name #2, whose embeddings, citations and verifier it copies [F: `portfolio/ROADMAP.md` Dependencies; D: Q6, 2026-10-01]. Remapped 2026-10-01: this read "#3, #4, #9 and #12 will name #1 or #2"; the roadmap's old #3 became part of P1, #4 was dropped, #9 became P2 and #12 a trace panel in every project (ROADMAP) [D: Q2, 2026-10-01].

### 4.2 Files

**Base rule** [P]: #2 is the base for every file both projects share, because it is the later copy and carries fixes (Esc ignores an event whose default was already prevented; `LOCALES`) [F: diff]. #1 is the base for what #2 removed on purpose: the history request mode, the 20-message cap, `validateAndClean` and the history route [F: diff; #2 S-17]. #1 is also the base for `lib/ai/mock.ts` and `lib/ai/mock-scenarios.ts`, which #2 extended with RAG code (#2's `mock.ts` imports `readPassages` from `@/lib/rag/prompt`) [F: diff].

**Comments** [P]: every comment that cites a #1 or #2 decision is rewritten to cite a section, for example "template spec §5.6" or "X-01 design §4.3". Ids cannot be told apart by shape: #1's delta spec has its own T-19 and T-21, and the template spec has different ones [F: #1 `components/i18n/locale-provider.tsx:16`, `components/chat/chat-header.tsx:41`; template §12]. Unqualified "spec §N" would also point at the wrong template section [F: #2 `components/footer.tsx` "spec §9"; template §7 is Quality gates].

| Path | Action | Base | Change [P] |
|---|---|---|---|
| `lib/project.ts` | new | — | `PRODUCT_NAME`, `PRODUCT_DESCRIPTION`, `PROJECT_SLUG`, `REPO_URL`. The footer URL, layout metadata, `RATE_LIMIT_PREFIX`, the storage key and the h1 read from here. This changes T-12 and two §9 step 6 items of T-19 [D: D-spec]; see P1 |
| `lib/i18n/locale.ts` | new | #2 | `LOCALE_STORAGE_KEY = \`${PROJECT_SLUG}:locale\``; adds `requestLocale(body)` and `interfaceLanguageLine(locale)`, identical today in #1 and #2 [F: #1 and #2 `app/api/chat/route.ts`, #1 `lib/chat/profile.ts`, #2 `lib/rag/prompt.ts`] |
| `lib/i18n/format.ts` | new | #1 = #2 | `format()` moves out of the strings file |
| `lib/i18n/shell-messages.ts` | new | #2's shared keys + #1's `composer.capPlaceholder` | Keys in §4.4 |
| `lib/i18n/messages.ts` | new, project-owned | #2's shape | Composition in §4.4 |
| `components/i18n/locale-provider.tsx` | new | #2 | Also sets `data-hydrated` on `<html>` after its effect runs, a signal for tests that does not depend on the chat. Today it only sets `lang` [F: #2 `locale-provider.tsx`] |
| `components/i18n/language-switch.tsx` | new (moved) | #2 `components/chat/` | Adds `"use client"`. Today it has none and runs on the client only because the `"use client"` `chat.tsx` imports the header that imports it [F: #2 `language-switch.tsx:1`, `chat-header.tsx:2`, `chat.tsx:1,6`] |
| `components/site-header.tsx` | new | #2 `chat-header.tsx` | Adds `"use client"` (same reason). h1 from `PRODUCT_NAME`; New chat becomes an `actions?: ReactNode` prop. `ml-auto` sits on the New chat button today [F: #2 `chat-header.tsx:38`]; it moves to a wrapper around `actions` and the switch, so the switch stays at the right end without actions. Keeps `data-model`, `data-commit`, `data-mock` |
| `components/footer.tsx` | replace | #2 | `REPO_URL` from `lib/project.ts` |
| `app/layout.tsx` | change | template | Metadata from `lib/project.ts`; `<LocaleProvider>` wraps the body; keeps `<html lang="en">` [F: #1 and #2] |
| `app/page.tsx` | replace | #2 | Server page: `<AppChat …/>` and `<Footer/>` |
| `components/app-chat.tsx` | new, project-owned | — | `"use client"` wrapper that passes the seams of §4.3. A server page cannot pass function props to a client component [F: Next 16 docs, "server and client boundary"] |
| `components/chat/chat.tsx` | new | #2 | Generic over the message type; the seams of §4.3; #1's cap logic behind `maxMessages`; drops `RagUIMessage` and `chatTransport`; the announcement moves to `lib/chat/ui.ts` |
| `components/chat/message-list.tsx` | new | #2 | `renderAssistant` and `hasContent` replace the fixed `AssistantMessage` and `hasVisibleText` |
| `components/chat/plain-text-message.tsx` | new | #1's assistant markup | Default renderer; no `data-ttft-ms` |
| `components/chat/composer.tsx` | new | #1 | Keeps the cap placeholder |
| `components/chat/empty-state.tsx` | new | #1's headed groups + #2's flat grid | Props `title`, `intro?`, `groups`; a group with a heading renders a labelled section |
| `components/ui/alert.tsx`, `textarea.tsx` | new | #1 = #2 | none |
| `hooks/use-stick-to-bottom.ts` + test | new | #2 | comments only. Corrected 2026-09-30 (rule 6): the prototype's review found a race in #2's stop logic, which #1 shares [F: `git diff --no-index`, comments only]. The last pin's scroll event fires at the next rendering step; when a stop intent (PageUp, an upward wheel, a touch move) came first, that event resumed following and the stop was lost. The template's copy records the position at each stop intent and resumes only on a move down, pinned by `e2e/chat.spec.ts` [D: X-01 Q5, "a real bug found in shared code is fixed here"]. Whether #1 and #2 get it: template spec §14, "Pending" |
| `lib/chat/ui.ts` + test | new | #2 | Generic helpers with an optional `hasContent` predicate; adds `announcement(...)`, moved from `chat.tsx` (§4.3) |
| `lib/chat/config.ts` | new | #2, minus `MAX_OUTPUT_TOKENS` | Shell values only: `MAX_USER_CHARS`, the two timeouts, `SCROLL_THRESHOLD_PX`. #2's copy holds exactly these plus the token cap; #1's also holds the instructions, the prompts and the mock delay [F] |
| `lib/chat/limits.ts` | new, project-owned | #1 values | `MAX_OUTPUT_TOKENS` (1024), `MAX_MESSAGES` (20), `MAX_ASSISTANT_CHARS` (6000). Template §5.1 has each project set the token cap in its own spec [F], and `MAX_ASSISTANT_CHARS` is sized from the token cap [F: #1 spec, C-09] |
| `lib/chat/errors.ts` | new | #1 = #2 | none |
| `lib/chat/validate.ts` + test | new | #1 | Imports `MAX_MESSAGES` and `MAX_ASSISTANT_CHARS` from `./limits` and `MAX_USER_CHARS` from `./config`, since §4.2 splits them [F: #1 `validate.ts:2` imports all three from `./config`]; logic unchanged (history mode, text-only rebuild). #1's test imports only `./validate` [F]. Corrected 2026-09-30 (rule 6): the template's test also imports `./limits` and `./config`, so its boundary cases follow the project's limits [P: template spec V-P4]. Corrected again 2026-09-30 (rule 6): the logic changed in one place. An assistant text over `MAX_ASSISTANT_CHARS` is cut to its end instead of rejected, because history mode re-posts an honest answer that ran longer (the `[[slow]]` answer, or a real one cut at the token cap) and the 400 failed every follow-up; template spec §5.8 item 3 has the reason [P: template spec V-P8] |
| `lib/chat/instructions.ts` + test | new, project-owned | #1's shape | Keeps #1's Format paragraph (plain text, no Markdown, because the default renderer shows raw text) and Length paragraph, without the demo-specific wording [F: #1 `lib/chat/config.ts` `SYSTEM_INSTRUCTIONS`]; D-chat-2's rule "answer in the language of the user's message; when unclear, the interface language" [D: #1 delta spec, D-chat-2]; then the interface line. No profile |
| `app/api/chat/route.ts` | new, project-owned | #1 | The 415 and 429 checks go through `guardModelRoute(req)`, as in #2 [F: #2 `route.ts`]; `streamText` options unchanged |
| `vercel.json` + `tests/vercel-config.test.ts` | change + new | #1 = #2 | `supportsCancellation` for the route, pinned by #2's test [F: #2 `vercel.json`, `tests/vercel-config.test.ts`] |
| `lib/ai/mock-scenarios.ts` | new | #1 | Timing as literals (600 ms first chunk, then 30 ms). #1 tests the scenarios inside `lib/ai/mock.test.ts`, which moves with the next row [F] |
| `lib/ai/mock.ts` + test | change | #1 | `createMockModel()` returns the scenario mock (default answer, `[[slow]]`, `[[error]]`), with the test's scenario cases. The 600 ms default is a literal: #1's import of `MOCK_FIRST_TOKEN_DELAY_MS` from `lib/chat/config` is dropped [F: #1 `mock.ts:3`], so nothing in `lib/ai/` imports `lib/chat/` and the mock survives §5 |
| `lib/rate-limit.ts` + test | change | template | `RATE_LIMIT_PREFIX = PROJECT_SLUG`; the separate-counters ruling of template §5.3 stays |
| `eslint.config.mjs` + test | change | #1/#2 | `react/jsx-no-literals` on `components/**` minus `components/ui/**`; allowed strings `EN`, `PT`, `Felipe Rêgo` |
| `playwright.config.ts` + test | change | #2 | `RATE_LIMIT_PER_HOUR: "20"` in the web server env, pinned [F: #2 `playwright.config.ts`, `tests/playwright-config.test.ts`] |
| `package.json`, lockfile | change | #1 = #2 | `@ai-sdk/react` 4.0.117, pinned [F: both] |

### 4.3 Seams of `Chat` [P]

| Prop | Default | #1 would pass | #2 would pass |
|---|---|---|---|
| `modelLabel`, `isMock`, `commit`, `rateLimitPerHour` | — | yes | yes |
| `empty: { title; intro?; groups: { heading?; prompts }[] }` | required | two headed groups | one flat group |
| `transport?` | `useChat`'s default: POST `/api/chat` with the history | default | latest message only (S-17) |
| `maxMessages?: number \| null` | `MAX_MESSAGES`, always, so the client cap and the route's 400 at message 21 come from one constant. A project whose transport posts only the latest message passes `null`. A custom transport alone never turns the cap off: `Chat` only sees whether one was passed, and `new DefaultChatTransport({ api, body, headers })` still posts the history [F: `@ai-sdk/react` 4.0.117 `use-chat.ts`; `ai` 7.0.114 `HttpChatTransportInitOptions`] | 20 | `null` |
| `renderAssistant?(message, { streaming, caption })` | `PlainTextMessage` | adds the TTFT caption | citations and Sources |
| `hasContent?(message)` | `hasVisibleText` | — | — |

- **`hasContent` is used in four places** [F: #2 `message-list.tsx:67`, `lib/chat/ui.ts`, `chat.tsx:150-158`]: the list's filter that hides an assistant message with nothing to show, the regenerate slot, the typing indicator and the "Response complete" announcement. If the filter kept `hasVisibleText`, a tool-only last message would get the "after-answer" slot while staying hidden, and neither Regenerate nor the stopped row would appear. The last three become pure, generic helpers in `lib/chat/ui.ts` (`regenerateSlot`, `showTypingIndicator`, and a new `announcement(...)` returning `complete`, `stopped`, `failed` or null), typed `<M extends UIMessage>(…, hasContent: (m: M) => boolean = hasVisibleText)`: under `strict`, a predicate typed on a project's message type cannot be assigned to one typed on `UIMessage` [F: TypeScript `strictFunctionTypes`]. P1's and P2's tool-only steps need this: AI SDK 7 sends tool calls as tool parts [F: `ai` 7.0.114 types]. Remapped 2026-10-01: the roadmap's old #6 became P2, and P1 has an order-lookup tool (ROADMAP) [D: Q1, Q2, 2026-10-01].
- **Renderer contract:** the root carries `data-message-role="assistant"`, its first child `div` is the answer text, and `caption` goes last. It holds in both projects today [F].
- **Deferred seams**, each an edit to the copied shell until its trigger fires (§2): per-request timing hooks (Q6), extra request-body fields, `useChat` options such as tool approval.
- **Known limit for P1 and P2:** `validateAndClean` drops non-text assistant parts, so tool results leave the history [F: #1 `validate.test.ts`]. P1's design decides whether to keep them; X-02, between P1 and P2, moves into the template the "tool parts in the history" that P1 builds [D: Q7, 2026-10-01]. Remapped 2026-10-01: the roadmap's old #6 became P2; P1, built first, is now the next project with a chat and has an order-lookup tool (ROADMAP) [D: Q1, Q2, Q3, 2026-10-01].

### 4.4 Dictionary [P]

- **Shell keys** (`shell-messages.ts`), with #1's approved text in both locales [F: #2's tests assert it kept that text]: `header.{mockBadge, newChat, language}`, `composer.{label, placeholder, capPlaceholder, send, stop}`, `list.{label, stopped, cutOff, regenerate, stoppedBefore}`, `chat.{jump, retry, rateNote}`, `errors.{generic, limit}`, `status.{complete, stopped, failed}`, `footer.{builtBy, source}`. The rate note moves from `empty.rateNote` to `chat.rateNote`; its text does not change.
- **Project keys** (`messages.ts`): the template defaults `empty.{title, subtitle}` and `prompts`. #1 would add its groups under `empty` and its caption as `ttft.caption`; #2 its sources, citation and refusal strings.
- **Composition:** the shell and project dictionaries share no top-level key. `messages.ts` builds each locale as `{ ...shellMessages[locale], ...projectMessages[locale] }`, typed `Record<Locale, Messages>`. A shared key would let the second spread replace the whole first object [F: object spread semantics].
- Shell components read only shell keys; project text reaches them through props.

### 4.5 The default page [P]

`pnpm dev:mock` serves `/` with the header (model `mock`, the "Mock model" badge, New chat, EN/PT), the empty state (the template title and subtitle, 4 prompts, the rate note), the composer and the footer. A prompt streams the default mock answer word by word; `[[slow]]` and `[[error]]` work as in #1. The copy is Q7. The smoke e2e keeps its assertions; only its title changes.

## 5. Non-chat projects: the removal recipe (new template §9 step 6b) [P]

The dry run of §11 corrected steps 2 to 4 on 2026-09-30 (rule 6). As first written, step 2 read two ways, step 3 failed lint and step 4 gave no code. The corrections are DR1–DR3 in §11, approved by Felipe on 2026-09-30 ("todas ok") [D].

Since 2026-09-30 the recipe lives in template spec §9 step 6b, and that is the text a project follows. There, step 1 is the `rm` command §11 ran, and the page's comment cites that step instead of this section; the two code blocks are otherwise the same (checked by script). This section stays as the text the dry run applied.

1. Delete `components/chat/`, `components/app-chat.tsx`, `hooks/use-stick-to-bottom.ts` and its test, `lib/chat/`, `app/api/chat/`, `components/ui/alert.tsx`, `components/ui/textarea.tsx`, `tests/api-chat-route.test.ts`, `tests/helpers/sse.ts`, `tests/vercel-config.test.ts`, `e2e/chat*.spec.ts`, `e2e/helpers/chat.ts`, `e2e/helpers/fixtures.ts`.
2. `pnpm remove @ai-sdk/react`; set `vercel.json` back to `{}`, since the chat route's entry is all it holds (DR1).
3. In `lib/i18n/messages.ts`, drop `prompts` and `empty`: `ProjectMessages` becomes `Record<never, never>` and each locale of `projectMessages` becomes `{}`, as below. Lint rejects a `{}` type (`@typescript-eslint/no-empty-object-type`); when the project adds its own keys, the type becomes an object type again (DR2). No kept test reads the dropped keys: both projects check prompts in `lib/i18n/messages.test.ts` today (#1 "holds 4 prompts in each group", #2's R-15 order check) [F], and neither check moves; in the template, prompts are read only by the chat e2e through the fixtures, deleted in step 1.

   ```ts
   export type ProjectMessages = Record<never, never>;

   export const projectMessages: Record<Locale, ProjectMessages> = {
     en: {},
     "pt-BR": {},
   };
   ```

4. Replace `app/page.tsx` with the non-chat page: `SiteHeader`, `<main>`, `Footer` (DR3).

   ```tsx
   import { Footer } from "@/components/footer";
   import { SiteHeader } from "@/components/site-header";
   import { IS_MOCK, MODEL_LABEL } from "@/lib/ai/model";

   /**
    * The non-chat page (X-01 design §5). Project-owned. lib/ai/model.ts is server-only, so its values
    * reach the client header as props.
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

What stays: i18n, the site header, the footer, the mock model, and the site i18n e2e. Most remaining roadmap items look non-chat, so most projects would run this recipe [P: inference from the ROADMAP descriptions].

## 6. Tests [P]

**Unit** (Vitest, node only [F: template §7.2, `vitest.config.mts`]):
- Moved: `lib/chat/ui.test.ts` (+ `hasContent` cases for `regenerateSlot`, `showTypingIndicator` and `announcement`), `use-stick-to-bottom.test.ts`, `lib/i18n/locale.test.ts` (+ `requestLocale`, `interfaceLanguageLine`, the storage key), `lib/i18n/messages.test.ts` (no empty values; same keys and placeholders in both locales; `format`; shell text equal to the approved text; shell and project top-level keys disjoint; it reads no project key by name, so #1's prompt count and #2's order check stay behind), `lib/chat/validate.test.ts`, `lib/ai/mock.test.ts`, `tests/api-chat-route.test.ts`, `tests/helpers/sse.ts`, `tests/vercel-config.test.ts`, `tests/playwright-config.test.ts`.
- New: `lib/chat/instructions.test.ts` (the no-Markdown line, the language rule, the interface line last); a limits test tying `MAX_ASSISTANT_CHARS` to `MAX_OUTPUT_TOKENS`; an identity test (`PROJECT_SLUG` equals the `package.json` `name`; `REPO_URL` ends with `/${PROJECT_SLUG}`); `tests/eslint-jsx-literals.test.ts`; `tests/shell-imports.test.ts` (shell files import no project module except `lib/project.ts`, `lib/chat/limits.ts` and `lib/i18n/messages.ts`; `lib/ai/**` imports nothing from `lib/chat/`). The shell-imports test travels with the shell: it holds in any project that leaves the shell alone.
- **Template-only guards** (deleted at import, §4.1):
  - `tests/chat-boundary.test.ts`: nothing outside the chat paths of §5 imports them, except `app/page.tsx`. It proves the removal recipe.
  - `tests/no-project-strings.test.ts`: a case-sensitive list of product and feature strings from #1 and #2 (product names, repo slugs, "AI SDK Core", "First token"), over tracked files outside `docs/`, excluding itself. No personal data goes in the list; #1's profile file is simply never copied.
  - `tests/shell-comments.test.ts`: over shell files, no decision or proposal id (regex `\b[A-Z](?:-[A-Za-z]+)?-\d+\b`, with `X-01` as the one exception (corrected on 2026-09-30, rule 6: the guard was widened in execution; template spec §7.2 gives the pattern it uses)) and no "delta spec", "#1 spec" or "#2 spec". The template's code cites no ids today [F: grep of `components/`, `lib/`, `app/`, `hooks/`].

**E2E** (production build, `AI_MOCK=1`):
- `e2e/helpers/chat.ts` and `e2e/helpers/i18n.ts` (new): the locators and waits that #1 and #2 each declare inline at the top of their specs (`header`, `conversation`, `statusRegion`, `isChatPost`, `sse`, `fulfillSse`, `postedBody`, `englishOnly`), taken from #2 [F: #1 `e2e/chat.spec.ts:41-84`, #2 `e2e/chat.spec.ts:36-79`; #1 has no `e2e/helpers/`].
- `e2e/helpers/fixtures.ts` (project-owned): prompt literals in EN and PT, the full default answer, the 429 texts. It lives in `e2e/helpers/` because two specs import it [D: T-17].
- `e2e/chat.spec.ts`: #2's version of each test the projects share, whose waits never read `data-ttft-ms` [F: #2 `e2e/chat.spec.ts`], with three changes: test 4 keeps #2's flow but asserts #1's history body (`trigger` "regenerate-message", roles `["user"]`, the old answer absent) [F: #1 `e2e/chat.spec.ts:269-274`]; the `[[error]]` test makes its text unique with `randomUUID()`, as #1 does, instead of #2's RAG helper; #1's 20-message cap test, reading `MAX_MESSAGES` from `lib/chat/limits.ts`, replaces #2's "no message cap" test. Plus the 375 × 812 touch test and a new check that a second send posts `[user, assistant, user]`. No template test reads `data-ttft-ms`; #1's TTFT tests stay in #1.
- `e2e/chat-i18n.spec.ts`: #2's chat-side language tests, with the body test taken from #1 (history mode), not #2 (single message) [F: #1 `e2e/i18n.spec.ts:536-570`, #2 `e2e/i18n.spec.ts:546`]; plus "removing `lang` keeps the page", which sends messages.
- `e2e/i18n.spec.ts` (site level, survives the recipe): waits on `data-hydrated`, reads the language from the switch's `aria-pressed`, the badge and the footer, and checks the served HTML with footer text instead of the chat title. Today #2's version waits for the composer's focus and checks the New chat button and the empty-state title [F: #2 `e2e/i18n.spec.ts:173-190, 341`]. Also: the switch stays at the right end on a phone.
- New assertions for gaps: the "Response complete" announcement in any locale (no e2e asserts it today) [F: grep of both `e2e/`]; the English "Response stopped" (both projects assert only the pt-BR one) [F: #1 `e2e/i18n.spec.ts:290`, #2 `:284`]; 44 px footer links, Jump and Retry at 375 px; PageUp stops following; an Esc already handled elsewhere does not stop the answer.

## 7. Docs to update [P]

- **Template spec** (`2026-09-25-ai-portfolio-template-design.md`): a new §14 "Amendment X-01 (<approval date>)" with its own id series, V-01.., each row giving the change, why and the sections touched, like §13; a Decision references entry for V-xx; the header's "Amended" line gets a second entry pointing to §14. §13 stays as written: it is the dated record of 2026-09-28, when #2 was in design. Sections touched: §2 (EN/pt-BR in the template; drop "no i18n"); §4 (file tree; `vercel.json` is no longer empty); §5.1 (`lib/chat/limits.ts`); §5.2 (the scenario mock lives here); §5.3 (`RATE_LIMIT_PREFIX` from `PROJECT_SLUG`; the separate-counters ruling stays); §5.5 (`REPO_URL` moves to `lib/project.ts`, which changes T-12); §5.6 (the page is the chat; the old placeholder becomes the non-chat page); new §5.8 chat shell (ownership, seams, renderer contract, deferred seams) and §5.9 i18n; §7.1 (the lint rule); §7.2 (test lists); §9 step 1 (add this spec, its plan and the three template-only guards to the `rm` list); §9 step 6 (the project-owned files, including `package.json` `name`, which changes T-19's footer and layout items); new §9 step 6b (§5 here); §10 ("i18n" and "shared chat components" rows marked done; new rows for the deferred seams and for embeddings); §11 criterion 1 (a prompt streams the mock answer).
- **Outside the template:**
  - `portfolio/ROADMAP.md`: X-01 done, with the template commit; its line "Everything public is in English: README, UI, commits" is stale since #1's EN/PT switch (rule 6) [F: `portfolio/ROADMAP.md`].
  - `rag-citations` spec §13 cites "template spec §10, line 381", which has moved (rule 6); its §15 row "The chat shell and i18n in the template" gets "Done <date>: moved to the template at `<sha>`; this repo keeps its own copy (template §13)".
  - `streaming-chat` delta spec §2, row on the template's "no i18n": its "The template itself does not change" is stale (rule 6); it gets "Superseded <date> by X-01: the template now carries the shell and i18n, at `<sha>`; this repo keeps its own copy".
- The per-project README skeleton does not change: nothing chat-specific belongs in it [F: template §8].

## 8. Order of work and CI budget [P]

One commit per step, each green before the next:

0. Approve this spec; write the plan.
1. Identity and i18n foundation: `lib/project.ts`, `lib/i18n/*`, `components/i18n/*`, `site-header`, `footer`, layout; the page stays the placeholder, now on `SiteHeader`; unit tests, the lint rule and its test.
2. Server side: limits, config, errors, validate, instructions, the route, the mock scenarios, `vercel.json`; the route and mock tests.
3. Client shell: `@ai-sdk/react`, `components/chat/*`, `app-chat`, the page, `ui.ts`, the hook; the e2e helpers and fixtures, `chat.spec.ts`, `chat-i18n.spec.ts`.
4. Site i18n e2e on `data-hydrated`, and the guards.
5. Removal dry run: §5 in a scratch copy made the way template §9 step 1 makes a project; all checks green; result recorded in §11.
6. Docs (§7), then CI measured again.

**CI budget:** the whole job under 10 minutes, inside the workflow's 20-minute timeout [F: `.github/workflows/ci.yml`]. Baseline, the last green `main` run of each repo, read with `gh run list -R feliperrego/<repo> -w CI -b main -s success -L 1 --json databaseId,headSha,createdAt,updatedAt` on 2026-09-29 [F]: template run 36500743611 (`460c07a`) 1:04; `streaming-chat` run 36472587710 (`cd14c10`) 2:55; `rag-citations` run 36645650182 (`2f76e66`) 4:04. Step 6 runs the same command on the template and records the new run in §11.

Estimate: about one agent-driven day [P: estimate].

## 9. Risks [P: inference]

Each pin is a proposal already in §10.

| Risk | What pins it |
|---|---|
| Freezing an older copy of a file #2 had fixed | The base rule (§4.2), a per-file diff against its source in review, the Esc e2e |
| Project strings or personal data shipped in the template | `no-project-strings`, the lint rule, `shell-comments`; #1's profile never copied |
| Shell wording drifting from #1's approved text | The shell-text equality test in both locales |
| Client cap and server limit disagreeing | One `MAX_MESSAGES` in `lib/chat/limits.ts` for both; a custom transport never turns the cap off. Client: the 20-message e2e (no posted body exceeds the cap; the composer locks). Server: the validate and route tests reject `MAX_MESSAGES + 1`. The `Chat` default itself has no unit test, because Vitest is node-only [F: template §7.2] |
| Hydration or locale regressions from the provider moving into the layout | #2's tests: served HTML stays English, no page errors with storage blocked, `?lang=` |
| The removal recipe breaks a non-chat build | The boundary test and the step 5 dry run |
| Function props from the server page | The client wrapper; the smoke e2e renders `/` |
| CI time | Measured before and after, against the budget |

## 10. Proposals and questions for Felipe

All approved on 2026-09-29 ("todas ok") [D].

**Questions: what visitors see and the scope of X-01.** These are closest to your own judgement.

| ID | Question | My recommendation |
|---|---|---|
| Q1 | Option A: the template's `/` becomes the working mock chat, and non-chat projects (most of the remaining list) run the §5 recipe. The alternatives are keeping the placeholder page (C) or a chat branch (D). | A. |
| Q2 | Every future project, non-chat ones included, ships the EN/pt-BR switch, with default instructions "answer in the user's language, else the interface language" (D-chat-2)? | Yes. |
| Q3 | The default request mode is #1's history mode (full history, 20-message cap), not #2's latest-message-only mode? | History: #6 and #7 are multi-turn agents. |
| Q4 | X-01 also brings the chat route, `validateAndClean` and the mock scenarios, beyond "shell and i18n"? | Yes: without them the default page cannot stream and the shell tests cannot run. |
| Q5 | #1 and #2 get no code changes, only one dated status line each (§7)? | Yes. |
| Q6 | The TTFT caption and per-request timing hooks stay out, with the trigger "a second project wants a per-answer timing caption"? | Yes. |
| Q7 | Placeholder copy, seen only locally and in CI (the template is not deployed [F: template §7.4]). EN: title "Chat with the model"; subtitle "Starting point: replace this text, the prompts and the instructions."; prompts "Explain streaming in one paragraph.", "What can you help me with?", "Write a haiku about testing.", "List three benefits of small projects.". pt-BR: "Converse com o modelo"; "Ponto de partida: troque este texto, os prompts e as instruções."; "Explique streaming em um parágrafo.", "Em que você pode me ajudar?", "Escreva um haicai sobre testes.", "Liste três vantagens de projetos pequenos.". | Accept, or edit the wording. |

**Software proposals.** Answer format: "todas ok exceto P4 e P9". Every P assumes Q1 = A; a "no" reopens them all. Items marked "(Q3)" assume history mode and reopen if Q3 goes to latest-message-only.

| ID | Proposal | Where |
|---|---|---|
| P1 | `lib/project.ts` as the one identity file: the repo URL, layout metadata, rate-limit prefix and storage key derive from it. **Changes T-12** (the repo URL leaves `footer.tsx`) **and two §9 step 6 items of T-19** (footer URL, layout title and description), both approved decisions [D: D-spec]; keeps the separate-counters ruling. With the identity test | §4.2, §6, §7 |
| P2 | The ownership split: shell-owned, project-owned and template-only files | §4.1 |
| P3 | `LocaleProvider` in the layout, with the `data-hydrated` signal | §4.2 |
| P4 | `SiteHeader` and the switch as client components; `actions` prop; the `ml-auto` wrapper; the switch in `components/i18n/` | §4.2 |
| P5 | Dictionary split into shell and project files with disjoint top-level keys; the rate note moves to `chat.rateNote`; `format.ts` | §4.2, §4.4 |
| P6 | The `Chat` seams, with `hasContent` in all four places and generic `ui.ts` helpers, the announcement included | §4.3 |
| P7 | `maxMessages` defaults to `MAX_MESSAGES` whatever the transport; a latest-message-only project opts out with `null` (Q3) | §4.3 |
| P8 | The project-owned client wrapper `components/app-chat.tsx` | §4.2 |
| P9 | Project-owned `lib/chat/limits.ts`, with the test tying the answer length to the token cap | §4.2, §6 |
| P10 | Default instructions keep #1's plain-text and length rules, plus D-chat-2 and the interface line | §4.2 |
| P11 | #2 as the base for shared files; #1 for history mode, the cap, validation, the route and the mock (Q3); comments cite sections, not ids | §4.2 |
| P12 | `jsx-no-literals` on `components/**` minus `components/ui/**`, with its test | §4.2, §6 |
| P13 | The shell-imports test (travels) and the boundary test (template-only) | §6 |
| P14 | The project-strings and shell-comments tests: case-sensitive, excluding themselves, no personal data, template-only | §6 |
| P15 | E2E split into site i18n, chat i18n and chat, with new shared helpers and project-owned fixtures in `e2e/helpers/`; #2's test versions with the three named changes (Q3) | §6 |
| P16 | The new assertions: announcements, 44 px targets, PageUp, handled Esc, the history body of a second send (Q3) | §6 |
| P17 | `vercel.json` cancellation, with #2's test | §4.2 |
| P18 | The removal recipe as template §9 step 6b, dry-run once | §5, §8 |
| P19 | The non-goals and deferred seams with their triggers, embeddings and option B included (the TTFT row is Q6) | §2, §4.3 |
| P20 | CI budget of 10 minutes, baseline and after-change runs recorded with the `gh` command | §8 |
| P21 | This spec, its plan and the three template-only guards join the §9 step 1 `rm` list | §4.1, §6, §7 |
| P22 | The doc updates of §7: template spec §14 (V-01..), the ROADMAP lines, #2's stale citation and status line, #1's status line | §7 |
| P23 | The order of work of §8 | §8 |

## 11. Results

Recorded, dated, as the work happens.

### Removal dry run (2026-09-30)

§8 step 5, run at the commit of §8 step 4 [F: the run's logs].

**Copy.** The branch was extracted into a scratch folder outside the worktree the way template §9 step 1 makes a project. Its `rm` list also took the files P21 adds: this design, its plan and the three template-only guards. `git init` only gives the travelling guard its file list (`git ls-files`); nothing was committed in the copy. Commands, run in the copy:

```bash
git init -q
git -C <template checkout> archive HEAD | tar -x -C .
rm docs/specs/2026-09-25-ai-portfolio-template-design.md docs/plans/2026-09-25-ai-portfolio-template.md
rm docs/specs/2026-09-29-chat-shell-extraction-design.md docs/plans/2026-09-29-chat-shell-extraction.md \
  tests/chat-boundary.test.ts tests/no-project-strings.test.ts tests/shell-comments.test.ts
pnpm install
# §5 step 1
rm -r components/chat/ components/app-chat.tsx hooks/use-stick-to-bottom.ts \
  hooks/use-stick-to-bottom.test.ts lib/chat/ app/api/chat/ components/ui/alert.tsx \
  components/ui/textarea.tsx tests/api-chat-route.test.ts tests/helpers/sse.ts \
  tests/vercel-config.test.ts e2e/chat*.spec.ts e2e/helpers/chat.ts e2e/helpers/fixtures.ts
# §5 step 2
pnpm remove @ai-sdk/react
printf '{}\n' > vercel.json
# §5 steps 3 and 4: the two code blocks of §5, applied by a script that reads them from this file
# §5 step 5, as CI runs it (.github/workflows/ci.yml, with CI=1 as on GitHub Actions)
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
AI_MOCK=1 pnpm test
CI=1 AI_MOCK=1 pnpm build
CI=1 AI_MOCK=1 pnpm e2e
```

**Result: green, with §5 as corrected below** [F].

| Check | Result |
|---|---|
| `pnpm install --frozen-lockfile` | exit 0 |
| `pnpm lint` | exit 0 |
| `pnpm typecheck` | exit 0 |
| `AI_MOCK=1 pnpm test` | 13 files, 178 tests passed: `lib/ai/mock` 21, `lib/ai/model` 7, `lib/http` 11, `lib/i18n/locale` 74, `lib/i18n/messages` 12, `lib/measure/record` 9, `lib/project` 3, `lib/rate-limit` 16, `tests/eslint-jsx-literals` 7, `tests/eslint-provider-imports` 8, `tests/health-route` 2, `tests/playwright-config` 3, `tests/shell-imports` 5 |
| `CI=1 AI_MOCK=1 pnpm build` | exit 0, with no build cache; `/` static, `/api/health` dynamic, no `/api/chat` |
| `CI=1 AI_MOCK=1 pnpm e2e` | 19 passed on 1 worker in 3.0 s: `i18n.spec.ts` 9, `measure-guards.spec.ts` 8, `smoke.spec.ts` 2 |

Also found [F]:
- Before the recipe, the import alone passed lint, typecheck and unit: 20 files, 296 tests: the 317 of §8 step 4 minus the 21 of the three guards it deletes.
- After step 2, `package.json`, `pnpm-lock.yaml` and `vercel.json` are byte-identical to the template's before X-01 (`ca5c9de`).
- This is the first page where the site i18n e2e sees the switch with no page actions (§6). With `ml-auto` removed from the header's wrapper, a mutation made in an earlier copy with the same page and dictionary and then reverted, its two right-end checks fail: 1020.5 px off at desktop and 107.5 px at 375 px.
- `tests/shell-imports.test.ts` passes on its no-chat branch: the i18n shell files only.
- The shell dictionary keeps its chat keys. It is shell-owned, and `lib/i18n/messages.test.ts` pins it whole; the non-chat page shows none of them.
- One kept comment names a deleted file. In `playwright.config.ts`, the comment on the pinned `RATE_LIMIT_PER_HOUR` cites `e2e/helpers/fixtures.ts`. It changes no check. (Corrected on 2026-09-30, rule 6: §8 step 6 did not rewrite it as this line first said; the final review found it, and the comment no longer names the file.)

**§5 as first written was not green** [F]. Step 3 left `export type ProjectMessages = {};`, which `pnpm lint` rejects (`@typescript-eslint/no-empty-object-type`). Step 4 named the page but gave no code, and nothing in the tree holds a non-chat page once §8 step 3 has made `/` the chat. Step 2's "remove the route from `vercel.json`" left `{ "functions": {} }` or `{}`, depending on the reader. §5 now carries these corrections, since approved (below):

| ID | Correction to §5 [P] |
|---|---|
| DR1 | Step 2: `vercel.json` goes back to `{}`, the template's file before X-01 |
| DR2 | Step 3: `ProjectMessages` becomes `Record<never, never>` and each locale `{}`, with the code |
| DR3 | Step 4: the non-chat page's code, which is §8 step 1's placeholder page with its comment rewritten |

Felipe approved DR1–DR3 on 2026-09-30 ("todas ok") [D].

### Execution (2026-09-30) [F]

- The plan ran natively on the local branch `x01`, task by task: each task's tests were written and run red first, and every gate passed before its commit. The dry run of Task 5 was repeated on a fresh copy and matched the record above.
- Two changes beyond the plan. First, in its own commit: the e2e checks of 44 px targets allow 0.01 px of float rounding (`MIN_TARGET_PX` in `e2e/helpers/i18n.ts`). `boundingBox()` measured a 44 px button at 43.99999809 px under the phone emulation, and the phone layout test failed 11 of 30 repeats; with the tolerance it passed 30 of 30.
- Second, a docs commit that records Felipe's answers of 2026-09-30 (DR1–DR3, V-P1..V-P9, and the fixes for #1 and #2).
- The final whole-branch review (three fresh reviewers, each with its own lens) found nothing Critical or Important. Its doc and comment findings were corrected in one commit (rule 6); its other findings are Minor and wait, with triggers, in template spec §14 "Pending".
- The first CI run on `main` after the merge (run 36747216937, `d333861`) failed the rotation test of §6: on the Linux runner the view lost following when the phone turned to landscape mid-answer. Its trace showed the view moving up 24 px, one line, at the rotation: the default question takes two lines on a phone in the runner's fonts and one in landscape, so Chromium's scroll anchoring moved the view up by the line saved, and the poll's layout read let that scroll event reach the hook before the resize observer pinned the view. The hook now turns scroll anchoring off while following and back on while the visitor reads above the bottom (§4.2). A new e2e, "a rotation never moves a followed view up", resizes through CDP together with a layout read and failed 4 of 4 before the fix [F: the run's trace; local runs, 2026-09-30].
- 2026-09-30: the e2e "a rotation never moves a followed view up" gained a check that needs no timing. Its layout read catches the bug only on some runs: the 4 of 4 above were local runs, while the #1 prototype's read caught it in 5 of 10 runs before its fix and the #2 prototype needed an animation frame loop to catch it [F: the #1 and #2 prototype logs, 2026-09-30]. The test now waits for a view that overflows by more than 400 px and, while following, requires the scroll container's computed `overflow-anchor` to be `none`; with the hook's setter removed, that check failed 1 of 1 [F: local run, 2026-09-30]. The timing read stays.
- **CI time after X-01** (§8, P20) [F: `gh run list -R feliperrego/ai-portfolio-template -w CI -b main -s success -L 1`, 2026-09-30]: run 36777831142 on `e2b5bad`, 4:43, against the baseline of 1:04 on `460c07a`; the budget is 10 minutes.
