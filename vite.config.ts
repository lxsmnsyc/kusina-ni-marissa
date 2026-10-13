import { defineConfig, type Plugin } from "vite";
import solid from "@solidjs/vite-plugin";
import { parse } from "yaml";
import * as v from "valibot";
import { RecipeSchema } from "./src/lib/schema";

/** Loads recipe .yml files as validated modules. Invalid recipes fail the build. */
function recipes(): Plugin {
  let isBuild = false;
  return {
    name: "recipes",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    transform(code, id) {
      if (!id.endsWith(".yml")) return;
      const result = v.safeParse(RecipeSchema, parse(code));
      if (!result.success) {
        this.error(`Invalid recipe ${id}\n${v.summarize(result.issues)}`);
      }
      const { review, ...recipe } = result.output;
      const output = isBuild ? recipe : { ...recipe, review };
      return { code: `export default ${JSON.stringify(output)};`, map: null };
    },
  };
}

export default defineConfig({
  plugins: [recipes(), solid()],
});
