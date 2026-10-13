import { Show } from "solid-js";
import type { Recipe } from "../lib/schema";
import { text } from "../lib/i18n";

/** Shows the recipe photo from `public/`, or a patterned tile with the dish's initial when there is none. */
export default function RecipeImage(props: { recipe: Recipe; class: string }) {
  return (
    <Show
      when={props.recipe.image}
      fallback={
        <div class={[props.class, "image-placeholder"]} aria-hidden="true">
          <span>{text(props.recipe.title).charAt(0)}</span>
        </div>
      }
    >
      {(src) => (
        <img
          class={props.class}
          src={`${import.meta.env.BASE_URL}${src()}`}
          alt={text(props.recipe.title)}
          loading="lazy"
        />
      )}
    </Show>
  );
}
