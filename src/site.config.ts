import type { NavItem, CTA } from "./types";

/**
 * Single source of truth for site-wide configuration.
 * Every template-user-facing knob lives here.
 */
export const SITE = {
  // Identity
  website: "https://example.com",
  title: "My Blog",
  author: "Jane Doe",
  description: "Thoughts, essays, and experiments on building software.",
  locale: "en-US",
  timezone: "UTC",

  // Brand
  accent: "#7c5cff",
  favicon: "/favicon.svg",
  ogImageDefault: "/og-default.png",

  // Navigation
  nav: [
    { label: "Blog", href: "/posts/" },
    { label: "Tags", href: "/tags/" },
    { label: "About", href: "/about/" },
  ] satisfies NavItem[],

  // Listing
  postsOnHome: 9,
  postsPerPage: 20,
  rssItemLimit: 50,
  rssIncludeFullContent: false,

  // Scheduled posts — posts whose pubDate is within this window of "now"
  // are treated as already published, absorbing minor clock drift.
  scheduledPostGraceMs: 15 * 60 * 1000,

  // Hero (home page)
  hero: {
    title: "Notes from the field",
    subtitle: "Essays on building things that last.",
    ctas: [
      { label: "Read latest", href: "/posts/", variant: "primary", external: false },
      { label: "Subscribe", href: "/rss.xml", variant: "ghost", external: false },
    ] satisfies CTA[],
  },

  // Feature flags (tree-shake or tree-keep)
  features: {
    search: false,
    archive: true,
    dynamicOg: false,
    editPost: false,
    adminPanel: true,
    lightAndDarkMode: true,
  },

  // Edit-on-GitHub link (rendered on posts when features.editPost is true)
  editPost: {
    text: "Edit this post on GitHub",
    baseUrl: "https://github.com/your/repo/edit/main/",
  },
} as const;

export type Site = typeof SITE;
