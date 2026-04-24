import { SITE } from "@/site.config";

export interface JsonLd {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.title,
    url: SITE.website,
    description: SITE.description,
    inLanguage: SITE.locale,
    ...(SITE.features.search
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE.website}/search/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }
      : {}),
  };
}

export interface BlogPostingArgs {
  title: string;
  description: string;
  url: string;
  author: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
}

export function blogPostingSchema(p: BlogPostingArgs): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    url: p.url,
    mainEntityOfPage: p.url,
    author: { "@type": "Person", name: p.author },
    publisher: {
      "@type": "Organization",
      name: SITE.title,
      url: SITE.website,
    },
    datePublished: p.datePublished.toISOString(),
    dateModified: (p.dateModified ?? p.datePublished).toISOString(),
    inLanguage: SITE.locale,
    ...(p.image ? { image: p.image } : {}),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
