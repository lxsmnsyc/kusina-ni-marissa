import type { Localized } from "./schema";

export const languages = { tl: "Tagalog", en: "English" } as const;

export type Lang = keyof typeof languages;

/** The language that the site uses at `/`. English pages are under `/en`. */
export const defaultLang: Lang = "tl";

/** The base path of the pages in a language, such as "/" or "/en/". */
export function langBase(lang: Lang): string {
  const base = import.meta.env.BASE_URL;
  return lang === defaultLang ? base : `${base}${lang}/`;
}

/** The language of a path, from its first segment. */
export function langOf(pathname: string): Lang {
  const rest = pathname.slice(import.meta.env.BASE_URL.length);
  return rest === "en" || rest.startsWith("en/") ? "en" : "tl";
}

/** The same path in another language. */
export function switchLang(pathname: string, to: Lang): string {
  return `${langBase(to)}${pathname.slice(langBase(langOf(pathname)).length)}`;
}

/** Picks the reader's language, falling back to the other one. */
export function text(value: Localized, lang: Lang): string;
export function text(value: Localized | undefined, lang: Lang): string | undefined;
export function text(value: Localized | undefined, lang: Lang): string | undefined {
  if (value === undefined || typeof value === "string") return value;
  return value[lang] ?? value.tl ?? value.en;
}

const en = {
  siteName: "Kusina ni Marissa",
  recipeCount: (count: number) => (count === 1 ? "1 recipe" : `${count} recipes`),
  language: "Language",
  footer: "Cooked by Marissa, with love. Recipes collected for family and friends.",
  heroEyebrow: "Home cooking",
  heroTitle: "Recipes from Marissa's kitchen",
  heroLede:
    "Home cooking written down so it can be cooked again. Search by dish or by what is in the pantry.",
  searchLabel: "Search recipes",
  searchPlaceholder: "Search adobo, gata, calamansi…",
  categories: "Categories",
  tags: "Tags",
  all: "All",
  noRecipes: "No recipes yet.",
  noMatch: "No recipes match that yet.",
  clearSearch: "Clear search",
  back: "← All recipes",
  prep: "Prep",
  cook: "Cook",
  serves: "Serves",
  makes: "Makes",
  ingredients: "Ingredients",
  method: "Method",
  notes: "Marissa's notes",
  source: "Source",
  servings: "Servings",
  fewerServings: "Fewer servings",
  moreServings: "More servings",
  markStep: (step: number) => `Mark step ${step} done`,
  notFoundEyebrow: "Not here",
  notFoundTitle: "That recipe is not in the kitchen.",
  notFoundBack: "Back to all recipes",
  minutes: "min",
  hours: "hr",
};

const tl: typeof en = {
  siteName: "Kusina ni Marissa",
  recipeCount: (count: number) => `${count} resipe`,
  language: "Wika",
  footer: "Luto ni Marissa, may pagmamahal. Mga resipeng tinipon para sa pamilya at kaibigan.",
  heroEyebrow: "Lutong bahay",
  heroTitle: "Mga resipe mula sa kusina ni Marissa",
  heroLede:
    "Mga lutong bahay na isinulat para maluto muli. Maghanap ayon sa putahe o sa sangkap na mayroon ka.",
  searchLabel: "Maghanap ng resipe",
  searchPlaceholder: "Hanapin ang adobo, gata, calamansi…",
  categories: "Mga kategorya",
  tags: "Mga tag",
  all: "Lahat",
  noRecipes: "Wala pang resipe.",
  noMatch: "Walang tugmang resipe.",
  clearSearch: "Burahin ang paghahanap",
  back: "← Lahat ng resipe",
  prep: "Paghahanda",
  cook: "Pagluluto",
  serves: "Para sa",
  makes: "Dami",
  ingredients: "Mga sangkap",
  method: "Paraan ng pagluluto",
  notes: "Tala ni Marissa",
  source: "Pinagmulan",
  servings: "Bilang ng kakain",
  fewerServings: "Bawasan",
  moreServings: "Dagdagan",
  markStep: (step: number) => `Tapos na ang hakbang ${step}`,
  notFoundEyebrow: "Wala dito",
  notFoundTitle: "Wala sa kusina ang resipeng iyan.",
  notFoundBack: "Bumalik sa lahat ng resipe",
  minutes: "minuto",
  hours: "oras",
};

const messages = { en, tl };

export type Messages = typeof en;

/** UI strings of a language. */
export function t(lang: Lang): Messages {
  return messages[lang];
}
