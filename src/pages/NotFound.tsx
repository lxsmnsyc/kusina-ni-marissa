import { t } from "../lib/i18n";
import { paths } from "../router";

export default function NotFound() {
  return (
    <section class="not-found">
      <p class="hero-eyebrow">{t().notFoundEyebrow}</p>
      <h1 class="hero-title">{t().notFoundTitle}</h1>
      <p>
        <a href={paths()}>{t().notFoundBack}</a>
      </p>
    </section>
  );
}
