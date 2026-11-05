import type { Ingredient } from "./schema";
import { t, text, type Lang } from "./i18n";

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
  "bar",
  "big can",
  "bottle",
  "box",
  "bunch",
  "can",
  "clove",
  "cup",
  "finger-length piece",
  "glass",
  "head",
  "jar",
  "loaf",
  "pack",
  "piece",
  "pouch",
  "slab",
  "slice",
  "small box",
  "small bunch",
  "small can",
  "small pack",
  "stalk",
  "stick",
  "tetra brick",
  "thumb-sized piece",
]);

/** "box" becomes "boxes", "loaf" becomes "loaves", and other units take an "s". */
function plural(unit: string): string {
  if (/(x|ch|sh|s)$/.test(unit)) return `${unit}es`;
  if (unit.endsWith("loaf")) return `${unit.slice(0, -1)}ves`;
  return `${unit}s`;
}

/** English units are pluralized; Tagalog units do not change. */
export function formatUnit(unit: string, amount: number, lang: Lang): string {
  return lang === "en" && amount > 1 && countable.has(unit) ? plural(unit) : unit;
}

export function formatIngredientAmount(ingredient: Ingredient, scale: number, lang: Lang): string {
  if (ingredient.amount === undefined) return "";
  const [min, max] =
    typeof ingredient.amount === "number"
      ? [ingredient.amount * scale, undefined]
      : ingredient.amount.map((value) => value * scale);
  const amount =
    max === undefined ? formatAmount(min) : `${formatAmount(min)}–${formatAmount(max)}`;
  const unit = text(ingredient.unit, lang);
  return unit ? `${amount} ${formatUnit(unit, max ?? min, lang)}` : amount;
}

export function formatMinutes(total: number, lang: Lang): string {
  const { hours: hr, minutes: min } = t(lang);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (!hours) return `${minutes} ${min}`;
  return minutes ? `${hours} ${hr} ${minutes} ${min}` : `${hours} ${hr}`;
}
