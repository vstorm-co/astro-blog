import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/site.config";

export async function GET(context: APIContext) {
  const posts = (await getAllPosts()).slice(0, SITE.rssItemLimit);
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.website,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.description,
      link: `/posts/${p.id}/`,
      categories: p.data.tags,
      author: p.data.author,
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
}
