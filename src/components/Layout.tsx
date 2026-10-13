import { createEffect, For, type ParentComponent } from "solid-js";
import { recipes } from "../lib/recipes";
import { lang, languages, setLang, t, type Lang } from "../lib/i18n";
import { paths } from "../router";

const Layout: ParentComponent = (props) => {
  createEffect(lang, (current) => {
    document.documentElement.lang = current;
  });

  return (
    <div class="shell">
      <header class="site-header">
        <a class="wordmark" href={paths()}>
          <span class="wordmark-small">Kusina ni</span>
          <span class="wordmark-big">Marissa</span>
        </a>
        <div class="header-end">
          <span class="header-count">{t().recipeCount(recipes.length)}</span>
          <div class="lang-switch" role="group" aria-label={t().language}>
            <For each={Object.keys(languages) as Lang[]}>
              {(code) => (
                <button
                  type="button"
                  lang={code}
                  title={languages[code]}
                  aria-pressed={lang() === code ? "true" : "false"}
                  onClick={() => setLang(code)}
                >
                  {code.toUpperCase()}
                </button>
              )}
            </For>
          </div>
        </div>
      </header>
      <main class="site-main">{props.children}</main>
      <footer class="site-footer">
        <p>{t().footer}</p>
      </footer>
    </div>
  );
};

export default Layout;
