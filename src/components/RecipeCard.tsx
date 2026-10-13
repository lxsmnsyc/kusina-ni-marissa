import { For, Show } from "solid-js";
import { categories } from "../lib/categories";
import type { Recipe } from "../lib/schema";
import { lang, text } from "../lib/i18n";
import { formatMinutes } from "../lib/format";
import { paths } from "../router";
import RecipeImage from "./RecipeImage";

export default function RecipeCard(props: { recipe: Recipe }) {
  const total = () => (props.recipe.prepMinutes ?? 0) + (props.recipe.cookMinutes ?? 0);

  return (
    <a class="card" href={paths.recipe(props.recipe.slug)}>
      <RecipeImage recipe={props.recipe} class="card-image" />
      <div class="card-body">
        <span class="card-category">{categories[props.recipe.category][lang()]}</span>
        <h3 class="card-title">{text(props.recipe.title)}</h3>
        <Show when={props.recipe.subtitle}>
          <p class="card-subtitle">{text(props.recipe.subtitle)}</p>
        </Show>
        <p class="card-summary">{text(props.recipe.summary)}</p>
        <Show when={total() > 0 || props.recipe.tags?.length}>
          <p class="card-meta">
            <Show when={total() > 0}>
              <span>{formatMinutes(total())}</span>
            </Show>
            <For each={props.recipe.tags}>{(tag) => <span class="card-tag">#{tag}</span>}</For>
          </p>
        </Show>
      </div>
    </a>
  );
}
