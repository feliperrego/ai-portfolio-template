import type { Locale } from "./locale";

/**
 * How the screens write numbers in the interface language (template spec §5.9). Data keeps its
 * own form; only what a screen shows is formatted here. Pure and client-safe.
 */

/** A number with the locale's separators, rounded to `digits` decimals. */
export function formatNumber(value: number, locale: Locale, digits = 0): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Milliseconds as seconds with one decimal. */
export function formatSeconds(ms: number, locale: Locale): string {
  return formatNumber(ms / 1000, locale, 1);
}
