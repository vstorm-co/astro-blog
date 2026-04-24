# AGENTS.md

Instructions for AI agents (Claude, GPT, Gemini, etc.) working in this repository.

## Project Overview

Astro 5 + MDX personal blog template with a built-in local admin panel. Static output deployed to Vercel.

## Environment

- **Package manager**: Bun (`bun install`, `bun run dev`, `bun run build`)
- **Node alternative**: Node 20+ with npm also works, but Bun is preferred
- **Build verification**: Always run `bun run build` after changes — it must exit with 0 errors

## Repository Structure

```
src/
  data/blog/          ← MDX blog posts (one file = one post, filename = slug)
  components/blog/    ← 30+ custom Astro components for use in MDX
  components/admin/   ← Admin panel (React + plain CSS, isolated)
  components/layout/  ← Header, Footer
  components/home/    ← Home page sections (Hero, FeaturedStrip, LatestPosts)
  components/post/    ← Post page components (Datetime, etc.)
  layouts/            ← BaseLayout, BlogLayout
  pages/              ← Astro file-based routes
  lib/admin/          ← Vite plugin for admin API
  i18n/               ← (unused in this template)
  site.config.ts      ← Single source of truth for site identity and settings
  content.config.ts   ← Astro content collection schemas
public/
  images/             ← Static image assets
  fonts/              ← Web fonts (if any)
```

## Blog Post Rules

1. Files live in `src/data/blog/` with `.mdx` extension
2. Filename (without `.mdx`) becomes the URL slug — keep it lowercase and hyphen-separated
3. Required frontmatter: `title`, `pubDate`
4. Images go in `public/images/blog/[slug]/` and are referenced as `/images/blog/[slug]/file.png`
5. Import custom components after the frontmatter block, before prose
6. Always start headings at `##` — the layout renders the title as `<h1>`

## Frontmatter Schema

```yaml
title: string           # required, ≤120 chars
description: string     # ≤160 chars recommended for SEO
pubDate: YYYY-MM-DD     # required
updatedDate: YYYY-MM-DD # optional
author: string          # defaults to SITE.author
tags: string[]          # lowercase, hyphenated
heroImage: string       # root-relative path, e.g. /images/blog/slug/hero.png
draft: boolean          # true = hidden in production
featured: boolean       # true = shown in featured strip on homepage
```

## Custom MDX Components

All components live in `src/components/blog/`. Import pattern:

```mdx
import Callout from "@/components/blog/Callout.astro";
```

Key components and their props:

- `<Callout type="info|warn|success|danger" title="optional">` — highlighted box
- `<Steps items={[{ title, body }]}` — numbered steps
- `<Figure src="/..." alt="..." caption="...">` — image with caption
- `<FileTree items={[{ label, children?, note? }]}>` — directory tree
- `<InfoCard title="..." icon="emoji" href="/optional">` — card with optional link
- `<TwoColumn leftTitle="..." rightTitle="...">` with `<Fragment slot="left|right">` — side-by-side
- `<Terminal>` — styled terminal block
- `<Timeline items={[{ date, title, body }]}>` — chronological list
- `<PullQuote author="...">` — large pull quote
- `<Stat value="..." label="..." trend="up|down">` — highlighted metric
- `<Badge tone="default|success|warn|danger">` — inline status badge
- `<Kbd>` — keyboard key
- `<Details summary="...">` — collapsible section
- `<Testimonial quote="..." name="..." role="..." avatar="/...">` — testimonial card
- `<Bookmark href="..." title="..." description="..." domain="...">` — link card
- `<Divider />` — visual separator

## Code Style

- TypeScript everywhere (`.ts`, `.tsx`, `.astro`)
- Astro components: `<style>` blocks are scoped by default
- Admin CSS: plain CSS only, all classes prefixed `ap-`, no Tailwind
- Site styles: Tailwind 4 + CSS custom properties for theming
- No comments unless the WHY is non-obvious
- No `console.log` in committed code

## What NOT to Do

- Do not add i18n to blog posts (this template is single-language)
- Do not import site Tailwind styles into admin components — admin has its own isolated CSS
- Do not use `display: none` for theme-related elements — the inline script in BaseLayout handles theme before React mounts
- Do not edit `bun.lock` manually
- Do not add `pages` collection entries — only `blog` collection is used

## Testing Changes

```bash
bun run build   # must exit 0
bun run dev     # check http://localhost:4321 and http://localhost:4321/admin/
```

There are no automated tests. Manual verification is the standard.
