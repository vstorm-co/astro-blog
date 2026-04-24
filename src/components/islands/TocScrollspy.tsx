import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  depth: number;
}

interface Props {
  headings: Heading[];
}

export default function TocScrollspy({ headings }: Props) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = headings.map((h) => h.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (visible.length > 0 && visible[0]) setActive(visible[0]);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <ol>
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.depth - 2) * 12}px` }}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              style={{ fontWeight: active === h.id ? 500 : undefined }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
