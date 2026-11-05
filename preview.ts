// Serves the static build in dist/client, as a static host does.
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const root = path.join(import.meta.dirname, "dist/client");
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".json": "application/json",
};

const http = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  for (const candidate of [pathname, path.join(pathname, "index.html")]) {
    const file = path.join(root, path.normalize(candidate));
    if (!file.startsWith(root)) break;
    try {
      // oxlint-disable-next-line no-await-in-loop -- The first file that exists wins.
      const body = await readFile(file);
      response.setHeader("content-type", types[path.extname(file)] ?? "application/octet-stream");
      response.end(body);
      return;
    } catch {
      // Not this one.
    }
  }
  response.statusCode = 404;
  response.setHeader("content-type", types[".html"]!);
  response.end(await readFile(path.join(root, "404.html")));
});

const port = Number(process.env.PORT ?? 4173);
http.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
