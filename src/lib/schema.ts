/**
 * Recipe data format.
 *
 * Each recipe is a YAML file under `src/recipes/`. The file name is the URL
 * slug, so `src/recipes/beef-broccoli.yml` is served at `/recipe/beef-broccoli`.
 * Files are validated against this schema at build time.
 *
 * Any text field can be a plain string, or a map with `tl` and/or `en` keys.
 * When the reader's language is missing, the other language is shown.
 */
import * as v from "valibot";
import { categoryKeys } from "./categories";

const Text = v.pipe(v.string(), v.trim(), v.nonEmpty());

const Localized = v.union([
  Text,
  v.pipe(
    v.strictObject({ tl: v.optional(Text), en: v.optional(Text) }),
    v.check((text) => Boolean(text.tl || text.en), "Needs a tl or en value"),
  ),
]);

const quantity = String.raw`(?:\d+(?:\.\d+)?|(?:\d+\s+)?\d+/\d+)`;
const amountPattern = new RegExp(`^${quantity}(?:\\s*-\\s*${quantity})?$`);

function parseQuantity(text: string): number {
  if (!text.includes("/")) return Number(text);
  const [whole, fraction] = text.includes(" ") ? text.split(/\s+/) : ["0", text];
  const [top, bottom] = fraction.split("/").map(Number);
  return Number(whole) + top / bottom;
}

/** Accepts 0.5, "1/2", "1 1/2", or a range like "6-8" or "1/2-1". Ranges become [min, max]. */
const Amount = v.union(
  [
    v.pipe(v.number(), v.minValue(0)),
    v.pipe(
      v.string(),
      v.trim(),
      v.regex(amountPattern),
      v.transform((text): number | [number, number] => {
        const [min, max] = text.split("-").map((part) => parseQuantity(part.trim()));
        return max === undefined ? min : [min, max];
      }),
    ),
  ],
  'Use a number, a fraction like "1 1/2", or a range like "6-8"',
);

const Ingredient = v.strictObject({
  /** Scales with servings. */
  amount: v.optional(Amount),
  /** e.g. "cup", "tbsp", or { tl: "butil", en: "clove" }. English units are pluralized. */
  unit: v.optional(Localized),
  item: Localized,
  /** Preparation or remark, or a quantity without a number, e.g. "konti". */
  note: v.optional(Localized),
});

const IngredientGroup = v.strictObject({
  title: v.optional(Localized),
  items: v.pipe(v.array(Ingredient), v.nonEmpty()),
});

const StepGroup = v.strictObject({
  title: v.optional(Localized),
  steps: v.pipe(v.array(Localized), v.nonEmpty()),
});

const Minutes = v.pipe(v.number(), v.integer(), v.minValue(0));

export const RecipeSchema = v.strictObject({
  title: Localized,
  /** Alternate name, shown under the title. */
  subtitle: v.optional(Localized),
  /** One or two sentences shown on cards and at the top of the recipe. */
  summary: Localized,
  category: v.picklist(categoryKeys),
  /** Short, lowercase. */
  tags: v.optional(v.array(Text)),
  /** Base servings that ingredient amounts are written for. Enables the scaler. */
  servings: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  /** Free-form yield when servings do not fit, e.g. "1 llanera". */
  yield: v.optional(Localized),
  prepMinutes: v.optional(Minutes),
  cookMinutes: v.optional(Minutes),
  /** Image path relative to `public/`, e.g. "photos/beef-broccoli.jpg". */
  image: v.optional(Text),
  ingredients: v.pipe(v.array(IngredientGroup), v.nonEmpty()),
  steps: v.pipe(v.array(StepGroup), v.nonEmpty()),
  /** Tips, variations, or memories about the dish. */
  notes: v.optional(v.array(Localized)),
  /** Where the recipe came from. */
  source: v.optional(Localized),
  /** Date added. Newest show first. */
  addedOn: v.optional(v.pipe(v.string(), v.isoDate())),
  /** Problems to check with the source. Shown only in dev mode and removed from production builds. */
  review: v.optional(v.array(Text)),
});

export type Localized = v.InferOutput<typeof Localized>;
export type Ingredient = v.InferOutput<typeof Ingredient>;
export type RecipeData = v.InferOutput<typeof RecipeSchema>;
export type Recipe = RecipeData & { slug: string };
