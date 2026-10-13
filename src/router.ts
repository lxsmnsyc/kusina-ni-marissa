import { createRouter } from "@solidjs/router";
import Home from "./pages/Home";
import RecipePage from "./pages/Recipe";
import NotFound from "./pages/NotFound";

export const Router = createRouter({
  base: import.meta.env.BASE_URL.replace(/\/$/, ""),
  routes: [
    { path: "/", component: Home },
    { path: "/recipe/:slug", component: RecipePage },
    { path: "*404", component: NotFound },
  ],
});

export const { paths } = Router;
