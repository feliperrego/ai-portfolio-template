import { describe, expect, it } from "vitest";
import type { CaseRecord } from "./record";
import { BOOTSTRAP, bootstrapInterval } from "./stats";
import { headlineNumbers, summarizeResults } from "./summary";

// The run's summary (template spec §5.11): the headline's rate over scored units with its seeded
// interval over cases, and its supporting data, so no number is typed by hand.

function record(
  id: string,
  group: string,
  pass: boolean,
  overrides: Partial<CaseRecord> = {},
): CaseRecord {
  return {
    id,
    group,
    askedAt: "2026-10-05T14:00:00.000Z",
    pass,
    tally: { passed: pass ? 1 : 0, total: 1 },
    checks: [{ id: "a-check", ok: pass }],
    result: {
      toolCalls: [],
      usage: { inputTokens: 2000, outputTokens: 100, totalTokens: 2100 },
    },
    latencyMs: 3000,
    ...overrides,
  };
}

/** 8 alpha, 6 beta, 5 gamma and 5 delta cases: c02, c09 and c15 fail. */
function records(): CaseRecord[] {
  const groups: [string, number][] = [
    ["alpha", 8],
    ["beta", 6],
    ["gamma", 5],
    ["delta", 5],
  ];
  let n = 0;
  return groups.flatMap(([group, count]) =>
    Array.from({ length: count }, () => {
      n += 1;
      const id = `c${String(n).padStart(2, "0")}`;
      return record(id, group, !["c02", "c09", "c15"].includes(id));
    }),
  );
}

function withUsage(each: CaseRecord, usage: CaseRecord["result"]["usage"]): CaseRecord {
  return { ...each, result: { ...each.result, usage } };
}

describe("summarizeResults", () => {
  it("counts the cases that passed, the rate and the seeded interval over cases", () => {
    const summary = summarizeResults(records());
    expect(summary).toMatchObject({
      cases: 24,
      passed: 21,
      tally: { passed: 21, total: 24 },
      rate: 21 / 24,
    });
    const tallies = records().map(({ tally }) => tally);
    expect(summary.interval).toEqual({
      ...BOOTSTRAP,
      ...bootstrapInterval(tallies, BOOTSTRAP),
    });
    expect(summary.interval.low).toBeLessThan(summary.rate);
    expect(summary.interval.high).toBeGreaterThan(summary.rate);
  });

  it("rates the scored units, not the cases, when a case has several", () => {
    const list = [
      record("c01", "docs", false, { tally: { passed: 3, total: 6 } }),
      record("c02", "docs", true, { tally: { passed: 6, total: 6 } }),
      record("c03", "docs", false, { tally: { passed: 5, total: 6 } }),
    ];
    const summary = summarizeResults(list);
    expect(summary).toMatchObject({
      cases: 3,
      passed: 1,
      tally: { passed: 14, total: 18 },
      rate: 14 / 18,
      groups: [{ group: "docs", cases: 3, passed: 1 }],
    });
    expect(summary.interval).toMatchObject(
      bootstrapInterval(
        list.map(({ tally }) => tally),
        BOOTSTRAP,
      ),
    );
  });

  it("tallies each group in the order its first case comes, and lists the failed cases in order", () => {
    const summary = summarizeResults(records());
    expect(summary.groups).toEqual([
      { group: "alpha", cases: 8, passed: 7 },
      { group: "beta", cases: 6, passed: 5 },
      { group: "gamma", cases: 5, passed: 4 },
      { group: "delta", cases: 5, passed: 5 },
    ]);
    expect(summary.failed).toEqual(["c02", "c09", "c15"]);

    const mixed = [record("c01", "b", true), record("c02", "a", false), record("c03", "b", true)];
    expect(summarizeResults(mixed).groups).toEqual([
      { group: "b", cases: 2, passed: 2 },
      { group: "a", cases: 1, passed: 0 },
    ]);
  });

  it("sums the tokens it was told, and takes the median per case over the cases that reported one", () => {
    const list = records();
    list[2] = withUsage(list[2], null);
    list[3] = withUsage(list[3], {
      inputTokens: 1000,
      outputTokens: null,
      totalTokens: 1000,
    });
    expect(summarizeResults(list).tokens).toEqual({
      input: 22 * 2000 + 1000,
      output: 22 * 100,
      total: 22 * 2100 + 1000,
      medianPerCase: 2100,
    });
    const unreported = records().map((each) => withUsage(each, null));
    expect(summarizeResults(unreported).tokens).toEqual({
      input: 0,
      output: 0,
      total: 0,
      medianPerCase: null,
    });
  });

  it("takes the median and the longest latency", () => {
    const list = records().map((each, i) => ({
      ...each,
      latencyMs: 1000 * (i + 1),
    }));
    expect(summarizeResults(list).latency).toEqual({
      medianMs: 12_500,
      maxMs: 24_000,
    });
  });

  it("rejects a run without cases", () => {
    expect(() => summarizeResults([])).toThrow(RangeError);
  });
});

describe("headlineNumbers", () => {
  it("gives the whole percents and counts of the headline", () => {
    const summary = summarizeResults(records());
    expect(headlineNumbers(summary)).toEqual({
      rate: 88,
      low: Math.round(summary.interval.low * 100),
      high: Math.round(summary.interval.high * 100),
      level: 95,
      passed: 21,
      total: 24,
      cases: 24,
    });
  });

  it("keeps a share under 100% from showing as 100%", () => {
    const summary = summarizeResults(records());
    const almost = {
      ...summary,
      rate: 0.997,
      interval: { ...summary.interval, high: 0.999 },
    };
    expect(headlineNumbers(almost)).toMatchObject({ rate: 99, high: 99 });
  });
});
