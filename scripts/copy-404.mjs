// Unknown URLs are not rewritten to the SPA in vercel.json, so Vercel serves
// dist/404.html with a real 404 status. It's the same app shell — the router
// renders the NotFound page — just without the 200 of a soft 404.
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
