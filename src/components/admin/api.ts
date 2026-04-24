export type Collection = "blog";

export interface PostSummary {
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
}

export interface PostContent {
  collection: Collection;
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

export interface ComponentMeta {
  name: string;
  label: string;
  description: string;
  snippet: string;
  preview: string;
}

export interface ImageEntry {
  name: string;
  url: string;
}

export interface ImageGroup {
  key: string;
  label: string;
  kind: "blog" | "public";
  slug?: string;
  images: ImageEntry[];
}

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listPosts: () => json<PostSummary[]>("/api/admin/posts"),
  readPost: (c: Collection, slug: string) => json<PostContent>(`/api/admin/posts/${c}/${slug}`),
  savePost: (c: Collection, slug: string, body: { frontmatter: Record<string, unknown>; content: string }) =>
    json<{ path: string }>(`/api/admin/posts/${c}/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  createPost: (body: { collection: Collection; slug: string; frontmatter: Record<string, unknown>; content: string }) =>
    json<{ path: string }>("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  deletePost: (c: Collection, slug: string) =>
    json<{ ok: true }>(`/api/admin/posts/${c}/${slug}`, { method: "DELETE" }),
  renamePost: (c: Collection, slug: string, newSlug: string) =>
    json<{ path: string }>(`/api/admin/posts/${c}/${slug}/rename`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newSlug }),
    }),
  listComponents: () => json<ComponentMeta[]>("/api/admin/components"),
  listAllImageGroups: () => json<ImageGroup[]>("/api/admin/images"),
  deleteImage: (slug: string, name: string) =>
    json<{ ok: true }>(`/api/admin/images/${slug}/${name}`, { method: "DELETE" }),
  uploadImage: async (slug: string, file: File): Promise<ImageEntry> => {
    const data = await fileToBase64(file);
    return json<ImageEntry>("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, filename: file.name, data }),
    });
  },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      const i = r.indexOf(",");
      resolve(i >= 0 ? r.slice(i + 1) : r);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
