import { describe, expect, it } from "vitest";
import { formatNumber, formatSeconds } from "./display";

// How the screens write numbers in each interface language (template spec §5.9).
describe("display formats", () => {
  it("write counts with the locale's separators", () => {
    expect(formatNumber(12345, "en")).toBe("12,345");
    expect(formatNumber(12345, "pt-BR")).toBe("12.345");
    expect(formatNumber(0, "en")).toBe("0");
  });

  it("round to the given decimals, and keep them", () => {
    expect(formatNumber(0.36788, "en", 3)).toBe("0.368");
    expect(formatNumber(0.36788, "pt-BR", 3)).toBe("0,368");
    expect(formatNumber(2, "en", 1)).toBe("2.0");
    expect(formatNumber(2.6, "en")).toBe("3");
  });

  it("write milliseconds as seconds with one decimal", () => {
    expect(formatSeconds(2841, "en")).toBe("2.8");
    expect(formatSeconds(2841, "pt-BR")).toBe("2,8");
    expect(formatSeconds(42, "en")).toBe("0.0");
    expect(formatSeconds(12_345, "en")).toBe("12.3");
  });
});
