import { useState, useEffect, useRef } from "react";

interface SearchResult {
  url: string;
  meta: { title?: string };
  excerpt: string;
}

interface PagefindResult {
  url: string;
  meta: () => Promise<{ title?: string }>;
  excerpt: () => Promise<string>;
}

interface Pagefind {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

declare global {
  interface Window {
    pagefind?: Pagefind;
  }
}

export default function SearchUI() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (!window.pagefind) {
      const pfUrl = "/pagefind/pagefind.js";
      import(/* @vite-ignore */ pfUrl).then((pf: Pagefind) => {
        window.pagefind = pf;
      });
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      if (!window.pagefind) return;
      setLoading(true);
      const { results: raw } = await window.pagefind.search(query);
      const hydrated = await Promise.all(
        raw.slice(0, 10).map(async (r) => ({
          url: r.url,
          meta: await r.meta(),
          excerpt: await r.excerpt(),
        })),
      );
      setResults(hydrated);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-ui">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts…"
        aria-label="Search"
        className="search-input"
      />
      {loading && <p className="search-status">Searching…</p>}
      {!loading && query && results.length === 0 && (
        <p className="search-status">No results for "{query}"</p>
      )}
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((r) => (
            <li key={r.url}>
              <a href={r.url}>
                <strong>{r.meta.title ?? r.url}</strong>
                <span dangerouslySetInnerHTML={{ __html: r.excerpt }} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
