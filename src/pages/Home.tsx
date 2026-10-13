import { createEffect, createMemo, For, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { categories, categoryKeys, isCategory } from "../lib/categories";
import { lang, t } from "../lib/i18n";
import { allTags, filterRecipes, recipes, usedCategories } from "../lib/recipes";
import RecipeCard from "../components/RecipeCard";

const available = usedCategories(recipes);
const tags = allTags(recipes);

export default function Home() {
  const [search, setSearch] = useSearchParams<{ q: string; c: string; t: string }>();
  const query = () => search.q ?? "";
  const results = createMemo(() => filterRecipes(recipes, query(), search.c, search.t));

  createEffect(
    () => (isCategory(search.c) ? categories[search.c][lang()] : t().siteName),
    (label) => {
      document.title = label === t().siteName ? label : `${label} · ${t().siteName}`;
    },
  );

  return (
    <>
      <section class="hero">
        <p class="hero-eyebrow">{t().heroEyebrow}</p>
        <h1 class="hero-title">{t().heroTitle}</h1>
        <p class="hero-lede">{t().heroLede}</p>
        <label class="search">
          <span class="visually-hidden">{t().searchLabel}</span>
          <input
            type="search"
            placeholder={t().searchPlaceholder}
            value={query()}
            onInput={(event) => setSearch({ q: event.currentTarget.value }, { replace: true })}
          />
        </label>
      </section>

      <nav class="chips" aria-label={t().categories}>
        <button
          type="button"
          class="chip"
          aria-pressed={!search.c ? "true" : "false"}
          onClick={() => setSearch({ c: undefined })}
        >
          {t().all}
        </button>
        <For each={categoryKeys.filter((key) => available.has(key))}>
          {(key) => (
            <button
              type="button"
              class="chip"
              aria-pressed={search.c === key ? "true" : "false"}
              onClick={() => setSearch({ c: search.c === key ? undefined : key })}
            >
              {categories[key][lang()]}
            </button>
          )}
        </For>
      </nav>

      <Show when={tags.length}>
        <nav class="tag-filter" aria-label={t().tags}>
          <For each={tags}>
            {(tag) => (
              <button
                type="button"
                class="tag"
                aria-pressed={search.t === tag ? "true" : "false"}
                onClick={() => setSearch({ t: search.t === tag ? undefined : tag })}
              >
                #{tag}
              </button>
            )}
          </For>
        </nav>
      </Show>

      <Show
        when={results().length}
        fallback={
          <div class="empty">
            <Show when={recipes.length} fallback={<p>{t().noRecipes}</p>}>
              <p>{t().noMatch}</p>
              <button
                type="button"
                class="link-button"
                onClick={() => setSearch({ q: undefined, c: undefined, t: undefined })}
              >
                {t().clearSearch}
              </button>
            </Show>
          </div>
        }
      >
        <div class="grid">
          <For each={results()}>{(recipe) => <RecipeCard recipe={recipe} />}</For>
        </div>
      </Show>
    </>
  );
}
