import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ========= Price utilities ========= */

type MoneyV2 = { amount: string | number; currencyCode?: string };
type PriceInput = number | string | MoneyV2 | null | undefined;

type FormatOpts = {
  currency?: string;                    // Fallback if not present on MoneyV2. e.g. 'USD'
  locale?: string;                      // e.g. 'en-US' (defaults to runtime locale)
  currencyDisplay?: "symbol" | "code" | "name"; // How to display currency
  minimumFractionDigits?: number;       // defaults 2
  maximumFractionDigits?: number;       // defaults 2
  fallback?: string;                    // defaults "$0.00"
};

function isMoneyV2(v: unknown): v is MoneyV2 {
  return !!v && typeof v === "object" && "amount" in (v as any);
}

// Parses a string like "$1,234.50 USD" or "1.234,50" to a number.
// Keeps it simple: strip everything except digits, minus, and dot.
function toNumber(value: string | number): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function normalizeMoney(
  input: PriceInput,
  opts?: { currency?: string }
): { amount: number; currency: string } | null {
  if (input == null || input === "") return null;

  if (isMoneyV2(input)) {
    const amount = toNumber(input.amount);
    const currency = (input.currencyCode ?? opts?.currency ?? "USD").toUpperCase();
    if (amount == null) return null;
    return { amount, currency };
  }

  if (typeof input === "number") {
    return Number.isFinite(input)
      ? { amount: input, currency: (opts?.currency ?? "USD").toUpperCase() }
      : null;
  }

  if (typeof input === "string") {
    const amount = toNumber(input);
    // Try to extract a 3-letter currency code from the string, else fallback
    const codeMatch = input.match(/\b([A-Z]{3})\b/);
    const currency = (codeMatch?.[1] ?? opts?.currency ?? "USD").toUpperCase();
    return amount == null ? null : { amount, currency };
  }

  return null;
}

function fmt(
  amount: number,
  currency: string,
  {
    locale,
    currencyDisplay = "symbol",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  }: Omit<FormatOpts, "currency" | "fallback"> = {}
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch {
    // If Intl fails (bad currency code), fall back
    return amount.toFixed(Math.max(minimumFractionDigits, 0));
  }
}

/**
 * Formats a single price value in a locale/currency-correct way.
 */
export function formatPrice(input: PriceInput, options?: FormatOpts): string {
  const fallback = options?.fallback ?? "$0.00";
  const normalized = normalizeMoney(input, { currency: options?.currency });
  if (!normalized) return fallback;
  return fmt(normalized.amount, normalized.currency, options);
}

/**
 * Extracts the numeric value (no formatting) from any price input.
 */
export function getPriceValue(input: PriceInput): number {
  const normalized = normalizeMoney(input);
  return normalized ? normalized.amount : 0;
}

/**
 * Formats a price range like “$12.00 – $24.00”, collapsing if equal (“$12.00”).
 */
export function formatPriceRange(
  min: PriceInput,
  max: PriceInput,
  options?: FormatOpts
): string {
  const a = normalizeMoney(min, { currency: options?.currency });
  const b = normalizeMoney(max, { currency: options?.currency });

  // If one is missing, fall back to the other; if both missing, use fallback
  if (!a && !b) return options?.fallback ?? "$0.00";
  if (a && !b) return fmt(a.amount, a.currency, options);
  if (!a && b) return fmt(b.amount, b.currency, options);

  // If both present but currencies differ, show both fully
  if (a!.currency !== b!.currency) {
    return `${fmt(a!.amount, a!.currency, options)} – ${fmt(b!.amount, b!.currency, options)}`;
  }

  // Same currency
  if (a!.amount === b!.amount) {
    return fmt(a!.amount, a!.currency, options);
  }
  const currency = a!.currency; // same as b!.currency
  const left = fmt(a!.amount, currency, options);
  const right = fmt(b!.amount, currency, options);
  return `${left} – ${right}`;
}

/**
 * Formats a pair of prices (price + compareAtPrice) and computes the discount.
 * Returns:
 *  - price: formatted current price
 *  - compareAt: formatted compare-at price (or null)
 *  - discountPercent: integer percent off (or null)
 */
export function formatPriceWithCompare(
  price: PriceInput,
  compareAtPrice?: PriceInput,
  options?: FormatOpts
): { price: string; compareAt: string | null; discountPercent: number | null } {
  const p = normalizeMoney(price, { currency: options?.currency });
  const c = compareAtPrice ? normalizeMoney(compareAtPrice, { currency: options?.currency }) : null;

  if (!p) {
    const fallback = options?.fallback ?? "$0.00";
    return { price: fallback, compareAt: null, discountPercent: null };
  }

  const priceStr = fmt(p.amount, p.currency, options);

  if (!c || c.amount <= p.amount || c.currency !== p.currency) {
    return { price: priceStr, compareAt: null, discountPercent: null };
  }

  const compareStr = fmt(c.amount, c.currency, options);
  const discountPercent = Math.round(((c.amount - p.amount) / c.amount) * 100);

  return { price: priceStr, compareAt: compareStr, discountPercent };
}

/* ========= Examples ========= */
// formatPrice({ amount: "19.5", currencyCode: "USD" }) => "$19.50"
// formatPrice("94.99", { currency: "USD" }) => "$94.99"
// getPriceValue("$1,234.56 USD") => 1234.56
// formatPriceRange({ amount: "12", currencyCode: "USD" }, { amount: "24", currencyCode: "USD" }) => "$12.00 – $24.00"
// formatPriceWithCompare(19.5, 29, { currency: "USD" }) => { price: "$19.50", compareAt: "$29.00", discountPercent: 33 }
