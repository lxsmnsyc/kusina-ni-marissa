import { createEffect, createSignal, For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { categories } from "../lib/categories";
import type { Ingredient, Recipe } from "../lib/schema";
import { lang, t, text } from "../lib/i18n";
import { getRecipe } from "../lib/recipes";
import { formatIngredientAmount, formatMinutes } from "../lib/format";
import { paths } from "../router";
import RecipeImage from "../components/RecipeImage";
import NotFound from "./NotFound";

export default function RecipePage() {
  const params = useParams<{ slug: string }>();

  return (
    <Show when={getRecipe(params.slug)} fallback={<NotFound />}>
      {(recipe) => <RecipeView recipe={recipe()} />}
    </Show>
  );
}

function RecipeView(props: { recipe: Recipe }) {
  // Both reset when the recipe changes.
  const [servings, setServings] = createSignal(() => props.recipe.servings ?? 0);
  const [done, setDone] = createSignal(() => {
    void props.recipe.slug;
    return new Set<string>();
  });

  const scale = () => (props.recipe.servings ? servings() / props.recipe.servings : 1);
  const toggle = (key: string) =>
    setDone((previous) => {
      const next = new Set(previous);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  createEffect(
    () => `${text(props.recipe.title)} · ${t().siteName}`,
    (title) => {
      document.title = title;
    },
  );

  return (
    <article class="recipe">
      <a class="back" href={paths()}>
        {t().back}
      </a>

      <header class="recipe-header">
        <div class="recipe-heading">
          <a class="recipe-category" href={`${paths()}?c=${props.recipe.category}`}>
            {categories[props.recipe.category][lang()]}
          </a>
          <h1 class="recipe-title">{text(props.recipe.title)}</h1>
          <Show when={props.recipe.subtitle}>
            <p class="recipe-subtitle">{text(props.recipe.subtitle)}</p>
          </Show>
          <p class="recipe-summary">{text(props.recipe.summary)}</p>

          <dl class="facts">
            <Show when={props.recipe.prepMinutes}>
              {(minutes) => (
                <div>
                  <dt>{t().prep}</dt>
                  <dd>{formatMinutes(minutes())}</dd>
                </div>
              )}
            </Show>
            <Show when={props.recipe.cookMinutes}>
              {(minutes) => (
                <div>
                  <dt>{t().cook}</dt>
                  <dd>{formatMinutes(minutes())}</dd>
                </div>
              )}
            </Show>
            <Show when={props.recipe.servings}>
              <div>
                <dt>{t().serves}</dt>
                <dd>{servings()}</dd>
              </div>
            </Show>
            <Show when={props.recipe.yield}>
              <div>
                <dt>{t().makes}</dt>
                <dd>{text(props.recipe.yield)}</dd>
              </div>
            </Show>
          </dl>

          <Show when={props.recipe.tags?.length}>
            <ul class="tags">
              <For each={props.recipe.tags}>
                {(tag) => (
                  <li>
                    <a class="tag" href={`${paths()}?t=${encodeURIComponent(tag)}`}>
                      #{tag}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
        <RecipeImage recipe={props.recipe} class="recipe-image" />
      </header>

      <ReviewNotes review={props.recipe.review} />

      <div class="recipe-body">
        <section class="ingredients" aria-labelledby="ingredients-heading">
          <div class="section-head">
            <h2 id="ingredients-heading">{t().ingredients}</h2>
            <Show when={props.recipe.servings}>
              <div class="scaler" role="group" aria-label={t().servings}>
                <button
                  type="button"
                  aria-label={t().fewerServings}
                  disabled={servings() <= 1}
                  onClick={() => setServings((count) => Math.max(1, count - 1))}
                >
                  −
                </button>
                <output aria-live="polite">{servings()}</output>
                <button
                  type="button"
                  aria-label={t().moreServings}
                  onClick={() => setServings((count) => count + 1)}
                >
                  +
                </button>
              </div>
            </Show>
          </div>

          <For each={props.recipe.ingredients}>
            {(group, groupIndex) => (
              <>
                <Show when={group.title}>
                  <h3 class="group-title">{text(group.title)}</h3>
                </Show>
                <ul class="ingredient-list">
                  <For each={group.items}>
                    {(item, index) => {
                      const key = () => `i${groupIndex()}-${index()}`;
                      return (
                        <li>
                          <label class={{ checked: done().has(key()) }}>
                            <input
                              type="checkbox"
                              checked={done().has(key())}
                              onChange={() => toggle(key())}
                            />
                            <IngredientLine item={item} scale={scale()} />
                          </label>
                        </li>
                      );
                    }}
                  </For>
                </ul>
              </>
            )}
          </For>
        </section>

        <section class="method" aria-labelledby="method-heading">
          <div class="section-head">
            <h2 id="method-heading">{t().method}</h2>
          </div>
          <For each={props.recipe.steps}>
            {(group, groupIndex) => (
              <>
                <Show when={group.title}>
                  <h3 class="group-title">{text(group.title)}</h3>
                </Show>
                <ol class="step-list">
                  <For each={group.steps}>
                    {(step, index) => {
                      const key = () => `s${groupIndex()}-${index()}`;
                      return (
                        <li class={{ checked: done().has(key()) }}>
                          <button
                            type="button"
                            class="step-number"
                            aria-pressed={done().has(key()) ? "true" : "false"}
                            aria-label={t().markStep(index() + 1)}
                            onClick={() => toggle(key())}
                          >
                            {index() + 1}
                          </button>
                          <p>{text(step)}</p>
                        </li>
                      );
                    }}
                  </For>
                </ol>
              </>
            )}
          </For>

          <Show when={props.recipe.notes?.length}>
            <aside class="notes">
              <h2>{t().notes}</h2>
              <ul>
                <For each={props.recipe.notes}>{(note) => <li>{text(note)}</li>}</For>
              </ul>
            </aside>
          </Show>

          <Show when={props.recipe.source}>
            <p class="source">
              {t().source}: {text(props.recipe.source)}
            </p>
          </Show>
        </section>
      </div>
    </article>
  );
}

/** Problems noted while converting the recipe. Dropped from production builds. */
const ReviewNotes = import.meta.env.DEV
  ? (props: { review: string[] | undefined }) => (
      <Show when={props.review?.length}>
        <aside class="review">
          <h2>Review notes (dev only)</h2>
          <ul>
            <For each={props.review}>{(issue) => <li>{issue}</li>}</For>
          </ul>
        </aside>
      </Show>
    )
  : () => null;

function IngredientLine(props: { item: Ingredient; scale: number }) {
  return (
    <span class="ingredient">
      <Show when={formatIngredientAmount(props.item, props.scale)}>
        {(amount) => <strong class="amount">{amount()}</strong>}
      </Show>{" "}
      <span>{text(props.item.item)}</span>
      <Show when={props.item.note}>
        <span class="ingredient-note">, {text(props.item.note)}</span>
      </Show>
    </span>
  );
}
