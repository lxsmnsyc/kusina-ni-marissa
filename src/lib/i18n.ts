import { createSignal } from "solid-js";
import type { Localized } from "./schema";

export const languages = { tl: "Tagalog", en: "English" } as const;

export type Lang = keyof typeof languages;

const storageKey = "lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "tl" || saved === "en") return saved;
  } catch {
    // Storage can be blocked; fall through to the browser language.
  }
  return /^(tl|fil)\b/i.test(navigator.language) ? "tl" : "en";
}

export const [lang, setLangSignal] = createSignal<Lang>(initialLang());

export function setLang(next: Lang) {
  setLangSignal(next);
  try {
    localStorage.setItem(storageKey, next);
  } catch {
    // Not saved; the choice still applies for this visit.
  }
}

/** Picks the reader's language, falling back to the other one. */
export function text(value: Localized): string;
export function text(value: Localized | undefined): string | undefined;
export function text(value: Localized | undefined): string | undefined {
  if (value === undefined || typeof value === "string") return value;
  return value[lang()] ?? value.tl ?? value.en;
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

/** UI strings for the current language. Read inside JSX or a memo so it tracks. */
export function t() {
  return messages[lang()];
}
