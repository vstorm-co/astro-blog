import { useEffect, useRef, useState } from "react";
import type { Collection } from "./api";

export interface NewPostDialogProps {
  onCancel: () => void;
  onCreate: (values: {
    collection: Collection;
    slug: string;
    title: string;
    description: string;
  }) => Promise<void>;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function NewPostDialog({ onCancel, onCreate }: NewPostDialogProps) {
  const collection: Collection = "blog";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const autoSlug = slug || slugify(title);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title || !autoSlug) return;
    setBusy(true);
    setError(null);
    try {
      await onCreate({ collection, slug: autoSlug, title, description });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="ap-modal-backdrop"
      role="presentation"
      onClick={onCancel}
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
    >
      <form className="ap-modal" onSubmit={submit}>
        <h2>New entry</h2>
        <div className="ap-form-row">
          <label htmlFor="np-title">Title</label>
          <input
            id="np-title"
            ref={titleRef}
            className="ap-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="ap-form-row">
          <label htmlFor="np-slug">Slug</label>
          <input
            id="np-slug"
            className="ap-input"
            value={slug}
            placeholder={slugify(title) || "my-post"}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="ap-form-row">
          <label htmlFor="np-desc">Description</label>
          <textarea
            id="np-desc"
            className="ap-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <div className="ap-error">{error}</div>}
        <div className="ap-modal-actions">
          <button type="button" className="ap-btn" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="ap-btn ap-btn-primary" disabled={busy || !title}>
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
