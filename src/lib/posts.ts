import { getCollection, type CollectionEntry } from "astro:content";
import { SITE } from "@/site.config";
import { toSlug } from "./slug";

export type Post = CollectionEntry<"blog">;

/**
 * True if a post should appear in production output.
 * Drafts are always hidden in prod; future-dated posts are hidden
 * until `pubDate` - scheduledPostGraceMs <= now.
 */
export function isPublished(p: Post, now = new Date()): boolean {
  if (p.data.draft) return false;
  const cutoff = now.getTime() + SITE.scheduledPostGraceMs;
  return p.data.pubDate.getTime() <= cutoff;
}

/**
 * All posts eligible for rendering, sorted newest-first.
 * In dev: returns everything so authors can preview drafts and scheduled posts.
 * In prod: filters strictly.
 */
export async function getAllPosts(): Promise<Post[]> {
  const all = await getCollection("blog");
  const filtered = import.meta.env.PROD ? all.filter((p) => isPublished(p)) : all;
  return filtered.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.data.featured);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const normalized = toSlug(tag);
  return (await getAllPosts()).filter((p) =>
    p.data.tags.some((t) => toSlug(t) === normalized),
  );
}

export async function getAllTags(): Promise<Array<{ tag: string; slug: string; count: number }>> {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const p of await getAllPosts()) {
    for (const t of p.data.tags) {
      const slug = toSlug(t);
      const entry = counts.get(slug);
      if (entry) entry.count += 1;
      else counts.set(slug, { tag: t, count: 1 });
    }
  }
  return [...counts.entries()]
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getAdjacent(posts: Post[], slug: string): { prev: Post | null; next: Post | null } {
  const i = posts.findIndex((p) => p.id === slug);
  if (i === -1) return { prev: null, next: null };
  // Posts are sorted newest-first: "next" is at lower index, "prev" is at higher.
  return { prev: posts[i + 1] ?? null, next: posts[i - 1] ?? null };
}

export function readingTimeMinutes(body: string | undefined): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function isScheduled(p: Post, now = new Date()): boolean {
  return !p.data.draft && p.data.pubDate.getTime() > now.getTime() + SITE.scheduledPostGraceMs;
}
