import type { Plugin, ViteDevServer } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.resolve(process.cwd(), "src/data/blog");
const PAGES_DIR = path.resolve(process.cwd(), "src/data/pages");
const IMAGES_DIR = path.resolve(process.cwd(), "public/images/blog");
const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const COMPONENTS_DIR = path.resolve(process.cwd(), "src/components/blog");

const IMAGE_EXT_RE = /\.(png|jpe?g|webp|avif|svg|gif|ico)$/i;
const PUBLIC_IGNORE = new Set(["_astro", "pagefind", "site.webmanifest"]);

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

type Collection = "blog" | "pages";
const COLLECTIONS: Collection[] = ["blog", "pages"];

function collectionDir(c: Collection): string {
  return c === "blog" ? BLOG_DIR : PAGES_DIR;
}

function safeSlug(slug: string): string {
  const n = path.posix.normalize(slug).replace(/^\/+/, "");
  if (n.includes("..") || path.isAbsolute(n)) throw new Error("Invalid slug");
  return n;
}

function postPath(c: Collection, slug: string): string {
  return path.join(collectionDir(c), `${safeSlug(slug)}.mdx`);
}

async function readJson<T>(req: import("http").IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? (JSON.parse(raw) as T) : ({} as T));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: import("http").ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

const notFound = (res: import("http").ServerResponse) => sendJson(res, 404, { error: "Not found" });
const bad = (res: import("http").ServerResponse, msg: string) => sendJson(res, 400, { error: msg });

async function listPosts() {
  const out: Array<{
    collection: Collection;
    slug: string;
    title: string;
    description: string;
    pubDate: string | null;
    updatedDate: string | null;
    tags: string[];
    draft: boolean;
    featured: boolean;
    path: string;
  }> = [];
  for (const c of COLLECTIONS) {
    const dir = collectionDir(c);
    let entries: string[] = [];
    try {
      entries = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.endsWith(".mdx") && !entry.endsWith(".md")) continue;
      if (entry.startsWith("_")) continue;
      const filePath = path.join(dir, entry);
      const raw = await fs.readFile(filePath, "utf8");
      const { data } = matter(raw);
      const slug = entry.replace(/\.(mdx|md)$/, "");
      out.push({
        collection: c,
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        pubDate: data.pubDate ? new Date(data.pubDate).toISOString() : null,
        updatedDate: data.updatedDate ? new Date(data.updatedDate).toISOString() : null,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        draft: Boolean(data.draft ?? false),
        featured: Boolean(data.featured ?? false),
        path: path.relative(process.cwd(), filePath),
      });
    }
  }
  out.sort((a, b) => (b.pubDate ?? "").localeCompare(a.pubDate ?? ""));
  return out;
}

async function readPost(c: Collection, slug: string) {
  const raw = await fs.readFile(postPath(c, slug), "utf8");
  const { data, content } = matter(raw);
  const frontmatter: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v instanceof Date) frontmatter[k] = v.toISOString().slice(0, 10);
    else frontmatter[k] = v;
  }
  return { collection: c, slug, frontmatter, content };
}

function stringifyPost(frontmatter: Record<string, unknown>, content: string): string {
  const data: Record<string, unknown> = {};
  // Fields that are allowed to be written as empty strings (schema has .optional() or .default(""))
  const keepEmpty = new Set(["description"]);
  for (const [k, v] of Object.entries(frontmatter)) {
    if ((v === "" && !keepEmpty.has(k)) || v === null || v === undefined) continue;
    if (k === "pubDate" || k === "updatedDate") {
      if (v instanceof Date) data[k] = v.toISOString().slice(0, 10);
      else if (typeof v === "string") data[k] = v.slice(0, 10);
      else continue;
    } else {
      data[k] = v;
    }
  }
  let out = matter.stringify(content.startsWith("\n") ? content : `\n${content}`, data);
  out = out.replace(/^(pubDate|updatedDate):\s*['"](\d{4}-\d{2}-\d{2})['"]$/gm, "$1: $2");
  return out;
}

async function savePost(c: Collection, slug: string, frontmatter: Record<string, unknown>, content: string) {
  const filePath = postPath(c, slug);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const out = stringifyPost(frontmatter, content);
  try {
    const existing = await fs.readFile(filePath, "utf8");
    if (existing === out) return { path: path.relative(process.cwd(), filePath), unchanged: true };
  } catch {
    /* file does not exist */
  }
  await fs.writeFile(filePath, out, "utf8");
  return { path: path.relative(process.cwd(), filePath) };
}

async function createPost(c: Collection, slug: string, frontmatter: Record<string, unknown>, content: string) {
  const filePath = postPath(c, slug);
  try {
    await fs.access(filePath);
    throw new Error("Post already exists");
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
  return savePost(c, slug, frontmatter, content);
}

async function deletePost(c: Collection, slug: string) {
  await fs.unlink(postPath(c, slug));
}

async function renamePost(c: Collection, slug: string, newSlug: string) {
  const from = postPath(c, slug);
  const to = postPath(c, newSlug);
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.rename(from, to);
  return { path: path.relative(process.cwd(), to) };
}

async function uploadImage(slug: string, filename: string, dataBase64: string) {
  const safe = safeSlug(slug);
  const dir = path.join(IMAGES_DIR, safe);
  await fs.mkdir(dir, { recursive: true });
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(dir, safeName);
  const buf = Buffer.from(dataBase64, "base64");
  await fs.writeFile(filePath, buf);
  return { name: safeName, url: `/images/blog/${safe}/${safeName}` };
}

async function deleteImage(slug: string, filename: string) {
  const safe = safeSlug(slug);
  const safeName = path.basename(filename);
  await fs.unlink(path.join(IMAGES_DIR, safe, safeName));
}

interface ImageGroup {
  key: string;
  label: string;
  kind: "blog" | "public";
  slug?: string;
  images: Array<{ name: string; url: string }>;
}

async function listAllImageGroups(): Promise<ImageGroup[]> {
  const groups = new Map<string, ImageGroup>();
  async function walk(dir: string, depth = 0): Promise<void> {
    if (depth > 6) return;
    let entries: import("fs").Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      if (depth === 0 && PUBLIC_IGNORE.has(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full, depth + 1);
      } else if (e.isFile() && IMAGE_EXT_RE.test(e.name)) {
        const rel = path.relative(PUBLIC_DIR, full).split(path.sep).join("/");
        const parentRel = path.posix.dirname(rel);
        const groupKey = parentRel === "." ? "(root)" : parentRel;
        if (!groups.has(groupKey)) {
          const blogMatch = groupKey.match(/^images\/blog\/(.+)$/);
          groups.set(groupKey, {
            key: groupKey,
            label: blogMatch ? `blog / ${blogMatch[1]}` : groupKey,
            kind: blogMatch ? "blog" : "public",
            slug: blogMatch?.[1],
            images: [],
          });
        }
        groups.get(groupKey)!.images.push({ name: e.name, url: "/" + rel });
      }
    }
  }
  await walk(PUBLIC_DIR);
  const arr = Array.from(groups.values());
  arr.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "blog" ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
  for (const g of arr) g.images.sort((a, b) => a.name.localeCompare(b.name));
  return arr;
}

async function listComponents() {
  let files: string[] = [];
  try {
    files = await fs.readdir(COMPONENTS_DIR);
  } catch {
    return [];
  }
  const out: Array<{ name: string; label: string; snippet: string; description: string; preview: string }> = [];
  for (const file of files) {
    if (!file.endsWith(".astro") && !file.endsWith(".tsx") && !file.endsWith(".jsx")) continue;
    const raw = await fs.readFile(path.join(COMPONENTS_DIR, file), "utf8");
    const name = file.replace(/\.(astro|tsx|jsx)$/, "");
    const snippetMatch =
      raw.match(/\{\/\*\s*@mdx-snippet([\s\S]*?)\*\/\}/) ||
      raw.match(/<!--\s*@mdx-snippet([\s\S]*?)-->/);
    const labelMatch =
      raw.match(/\{\/\*\s*@mdx-label\s+(.+?)\s*\*\/\}/) ||
      raw.match(/<!--\s*@mdx-label\s+(.+?)\s*-->/);
    const descMatch =
      raw.match(/\{\/\*\s*@mdx-description\s+(.+?)\s*\*\/\}/) ||
      raw.match(/<!--\s*@mdx-description\s+(.+?)\s*-->/);
    const previewMatch =
      raw.match(/\{\/\*\s*@mdx-preview\s*([\s\S]*?)\*\/\}/) ||
      raw.match(/<!--\s*@mdx-preview\s*([\s\S]*?)-->/);
    if (snippetMatch) {
      out.push({
        name,
        label: labelMatch?.[1] ?? name,
        description: descMatch?.[1] ?? "",
        snippet: snippetMatch[1]?.trim() ?? "",
        preview: previewMatch?.[1]?.trim() ?? "",
      });
    }
  }
  out.sort((a, b) => a.label.localeCompare(b.label));
  return out;
}

function isCollection(v: string): v is Collection {
  return (COLLECTIONS as string[]).includes(v);
}

async function handle(req: import("http").IncomingMessage, res: import("http").ServerResponse) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const { pathname } = url;
  const method = req.method ?? "GET";

  if (pathname === "/api/admin/posts" && method === "GET") {
    return sendJson(res, 200, await listPosts());
  }
  if (pathname === "/api/admin/posts" && method === "POST") {
    const body = await readJson<{
      collection: string;
      slug: string;
      frontmatter: Record<string, unknown>;
      content: string;
    }>(req);
    if (!isCollection(body.collection)) return bad(res, "Invalid collection");
    if (!body.slug || !SLUG_RE.test(body.slug)) return bad(res, "Invalid slug");
    try {
      const result = await createPost(body.collection, body.slug, body.frontmatter ?? {}, body.content ?? "");
      return sendJson(res, 201, result);
    } catch (e) {
      return sendJson(res, 409, { error: (e as Error).message });
    }
  }

  const postMatch = pathname.match(/^\/api\/admin\/posts\/(blog|pages)\/(.+?)(\/rename)?$/);
  if (postMatch) {
    const [, col, slug, renameSuffix] = postMatch;
    if (!isCollection(col!)) return bad(res, "Invalid collection");

    if (renameSuffix && method === "POST") {
      const body = await readJson<{ newSlug: string }>(req);
      if (!body.newSlug || !SLUG_RE.test(body.newSlug)) return bad(res, "Invalid slug");
      try {
        return sendJson(res, 200, await renamePost(col, slug!, body.newSlug));
      } catch (e) {
        return sendJson(res, 500, { error: (e as Error).message });
      }
    }
    if (method === "GET") {
      try {
        return sendJson(res, 200, await readPost(col, slug!));
      } catch {
        return notFound(res);
      }
    }
    if (method === "PUT") {
      const body = await readJson<{ frontmatter: Record<string, unknown>; content: string }>(req);
      try {
        return sendJson(res, 200, await savePost(col, slug!, body.frontmatter ?? {}, body.content ?? ""));
      } catch (e) {
        return sendJson(res, 500, { error: (e as Error).message });
      }
    }
    if (method === "DELETE") {
      try {
        await deletePost(col, slug!);
        return sendJson(res, 200, { ok: true });
      } catch (e) {
        return sendJson(res, 500, { error: (e as Error).message });
      }
    }
  }

  if (pathname === "/api/admin/upload" && method === "POST") {
    const body = await readJson<{ slug: string; filename: string; data: string }>(req);
    if (!body.slug || !body.filename || !body.data) return bad(res, "Missing fields");
    try {
      return sendJson(res, 200, await uploadImage(body.slug, body.filename, body.data));
    } catch (e) {
      return sendJson(res, 500, { error: (e as Error).message });
    }
  }

  if (pathname === "/api/admin/images" && method === "GET") {
    try {
      return sendJson(res, 200, await listAllImageGroups());
    } catch (e) {
      return sendJson(res, 500, { error: (e as Error).message });
    }
  }

  const imgMatch = pathname.match(/^\/api\/admin\/images\/([^/]+)\/(.+)$/);
  if (imgMatch && method === "DELETE") {
    const [, slug, filename] = imgMatch;
    try {
      await deleteImage(slug!, filename!);
      return sendJson(res, 200, { ok: true });
    } catch (e) {
      return sendJson(res, 500, { error: (e as Error).message });
    }
  }

  if (pathname === "/api/admin/components" && method === "GET") {
    return sendJson(res, 200, await listComponents());
  }

  return notFound(res);
}

export function adminPlugin(): Plugin {
  return {
    name: "astro-blog-admin",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      // Safety: refuse to register if the dev server is bound to a non-loopback host.
      const host = server.config.server.host;
      if (host && host !== true && host !== "localhost" && host !== "127.0.0.1" && host !== "::1") {
        console.warn(
          `[admin] not binding endpoints — dev server host "${String(host)}" is not loopback`,
        );
        return;
      }
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/admin")) return next();
        try {
          await handle(req, res);
        } catch (e) {
          sendJson(res, 500, { error: (e as Error).message });
        }
      });
    },
  };
}
