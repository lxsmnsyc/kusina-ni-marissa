import type { CategoryKey } from "./categories";
import type { Localized, Recipe, RecipeData } from "./schema";

// Each .yml file is parsed and validated by the recipe plugin in vite.config.ts.
const modules = import.meta.glob<RecipeData>("../recipes/*.yml", {
  eager: true,
  import: "default",
});

export const recipes: readonly Recipe[] = Object.entries(modules)
  .map(([path, recipe]) => ({
    ...recipe,
    slug: path.slice(path.lastIndexOf("/") + 1, -".yml".length),
  }))
  .toSorted(
    (a, b) => (b.addedOn ?? "").localeCompare(a.addedOn ?? "") || a.slug.localeCompare(b.slug),
  );

const bySlug = new Map(recipes.map((recipe) => [recipe.slug, recipe]));

export function getRecipe(slug: string | undefined): Recipe | undefined {
  return slug ? bySlug.get(slug) : undefined;
}

/** Categories that have at least one recipe. */
export function usedCategories(all: readonly Recipe[]): Set<CategoryKey> {
  return new Set(all.map((recipe) => recipe.category));
}

/** Every tag in use, sorted alphabetically. */
export function allTags(all: readonly Recipe[]): string[] {
  return [...new Set(all.flatMap((recipe) => recipe.tags ?? []))].toSorted((a, b) =>
    a.localeCompare(b),
  );
}

/** Both languages, so a search matches whichever one the reader types in. */
function allText(value: Localized | undefined): string[] {
  if (value === undefined) return [];
  return typeof value === "string" ? [value] : [value.tl ?? "", value.en ?? ""];
}

function haystack(recipe: Recipe): string {
  return [
    ...allText(recipe.title),
    ...allText(recipe.subtitle),
    ...allText(recipe.summary),
    ...(recipe.tags ?? []),
    ...recipe.ingredients.flatMap((group) => group.items.flatMap((item) => allText(item.item))),
  ]
    .join(" ")
    .toLowerCase();
}

const haystacks = new Map(recipes.map((recipe) => [recipe.slug, haystack(recipe)]));

export function filterRecipes(
  all: readonly Recipe[],
  query: string,
  category: string | undefined,
  tag: string | undefined,
): Recipe[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return all.filter(
    (recipe) =>
      (!category || recipe.category === category) &&
      (!tag || recipe.tags?.includes(tag)) &&
      words.every((word) => haystacks.get(recipe.slug)?.includes(word)),
  );
}
