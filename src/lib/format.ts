import type { Ingredient } from "./schema";
import { lang, t, text } from "./i18n";

const fractions: [number, string][] = [
  [1 / 8, "⅛"],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [3 / 8, "⅜"],
  [1 / 2, "½"],
  [5 / 8, "⅝"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
  [7 / 8, "⅞"],
];

/** Formats an amount using common kitchen fractions, e.g. 1.5 -> "1½". */
export function formatAmount(value: number): string {
  if (value >= 10) return String(Math.round(value));
  const whole = Math.floor(value);
  const rest = value - whole;
  if (rest < 0.06) return String(whole);
  if (rest > 0.94) return String(whole + 1);
  const [, glyph] = fractions.reduce((best, candidate) =>
    Math.abs(candidate[0] - rest) < Math.abs(best[0] - rest) ? candidate : best,
  );
  return whole ? `${whole}${glyph}` : glyph;
}

const countable = new Set([
  "cup",
  "clove",
  "piece",
  "can",
  "small can",
  "pack",
  "bunch",
  "stalk",
  "head",
  "pouch",
  "slice",
]);

/** English units are pluralized; Tagalog units do not change. */
export function formatUnit(unit: string, amount: number): string {
  return lang() === "en" && amount > 1 && countable.has(unit) ? `${unit}s` : unit;
}

export function formatIngredientAmount(ingredient: Ingredient, scale: number): string {
  if (ingredient.amount === undefined) return "";
  const [min, max] =
    typeof ingredient.amount === "number"
      ? [ingredient.amount * scale, undefined]
      : ingredient.amount.map((value) => value * scale);
  const amount =
    max === undefined ? formatAmount(min) : `${formatAmount(min)}–${formatAmount(max)}`;
  const unit = text(ingredient.unit);
  return unit ? `${amount} ${formatUnit(unit, max ?? min)}` : amount;
}

export function formatMinutes(total: number): string {
  const { hours: hr, minutes: min } = t();
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes} ${min}`;
  return minutes ? `${hours} ${hr} ${minutes} ${min}` : `${hours} ${hr}`;
}
