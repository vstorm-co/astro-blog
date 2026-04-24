import type { APIContext } from "astro";
import { SITE } from "@/site.config";

export async function GET({ site }: APIContext) {
  const origin = (site ?? new URL(SITE.website)).origin;
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /admin/",
    "Disallow: /api/admin/",
    "",
    `Sitemap: ${origin}/sitemap-index.xml`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
