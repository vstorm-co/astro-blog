# CLAUDE.md

## Project

Astro 5 + MDX personal blog template with a built-in local admin panel. Static output, deployed to Vercel.

## Commands

```bash
bun run dev      # dev server → http://localhost:4321
bun run build    # production build (must pass, currently ~17 pages)
bun run preview  # preview the production build locally
```

**Always run `bun run build` after making changes** to verify zero errors.

## Key Files

| File | Purpose |
|------|---------|
| `src/site.config.ts` | Site identity, nav links, accent colour, feature flags |
| `src/data/blog/` | MDX blog posts (filename = slug) |
| `src/components/blog/` | Custom MDX components (30+) |
| `src/layouts/BlogLayout.astro` | Blog post page layout |
| `src/layouts/BaseLayout.astro` | Base layout (meta, theme init script) |
| `src/components/layout/Header.astro` | Site-wide navigation + theme toggle |
| `src/components/admin/AdminApp.tsx` | Admin panel React root |
| `src/components/admin/FrontmatterForm.tsx` | Frontmatter editing form |
| `src/components/admin/admin.css` | Admin panel styles (isolated, no Tailwind) |
| `src/lib/admin/vite-plugin.ts` | Vite plugin powering the admin API |
| `src/content.config.ts` | Astro content collection schema |

## Blog Post Frontmatter Schema

```yaml
title: string          # required, max 120 chars
description: string    # optional, max 280 chars — shown in cards and search
pubDate: YYYY-MM-DD    # required
updatedDate: YYYY-MM-DD # optional
author: string         # optional, defaults to SITE.author
tags: string[]         # optional — generates /tags/[tag]/ pages
heroImage: string      # optional, root-relative path to cover image
draft: boolean         # default false — hides from production
featured: boolean      # default false — shows in featured strip on home
ogImage: string        # optional, overrides default OG image
canonicalURL: string   # optional, overrides default canonical URL
```

## Custom MDX Components

Import path: `@/components/blog/ComponentName.astro`

| Component | Purpose |
|-----------|---------|
| `Accordion` | Multi-panel FAQ with animated expand/collapse |
| `Aside` | Lateral note, floats beside prose on wide screens |
| `Badge` | Inline status label (tones: default, success, warn, danger) |
| `BeforeAfter` | Draggable slider comparing two images |
| `Bookmark` | Unfurl-style link card |
| `Callout` | Highlighted box (info, warn, success, danger) |
| `Carousel` | Swipeable image/card slider |
| `CodeGroup` | Tabbed code blocks |
| `Comparison` | Feature comparison table |
| `Details` | Styled collapsible `<details>` |
| `Diff` | Code diff display |
| `Divider` | Visual section separator |
| `Embed` | Lazy iframe (CodePen, StackBlitz, etc.) |
| `Figure` | Image with optional caption |
| `FileTree` | Visual directory tree |
| `Gallery` | Masonry or grid image gallery |
| `ImageZoom` | Click-to-zoom image |
| `InfoCard` | Titled card with optional icon and link |
| `Kbd` | Keyboard key styling |
| `NewsletterCTA` | Email subscribe call-to-action |
| `PullQuote` | Large typographic quote |
| `Stat` | Single highlighted metric with trend |
| `Steps` | Numbered step list |
| `Terminal` | Styled terminal output block |
| `Testimonial` | Quote with avatar, name, and role |
| `Timeline` | Vertical chronological list |
| `TwoColumn` | Side-by-side layout |
| `VideoEmbed` | YouTube/Vimeo lazy embed |
| `VideoLite` | YouTube/Vimeo with poster, loads on click |

## Architecture Notes

- **Astro 5** static output (`output: "static"`)
- **React 19** islands with `client:load` for interactive components (admin, theme toggle)
- **Tailwind CSS 4** via `@tailwindcss/vite` — CSS custom properties for dark/light theming
- **MDX** posts via `@astrojs/mdx` with Expressive Code syntax highlighting
- **Admin panel** is a React SPA on `/admin/` — excluded from sitemap and production navigation
- **Content collections** via `src/content.config.ts` — only the `blog` collection is active
- **Vite** config has `resolve.dedupe: ["react", "react-dom"]` to prevent duplicate React instances

## Admin Panel Architecture

- `vite-plugin.ts` — exposes a REST API at `/_admin/` for CRUD on `.mdx` files and image uploads
- `AdminApp.tsx` — main React component; manages selection, autosave (900ms), and tab state
- `FrontmatterForm.tsx` — controlled form; slug auto-follows title until locked
- `admin.css` — fully isolated CSS (no Tailwind, no site styles); all classes prefixed `ap-`

## Styling Conventions

- Site styles use Tailwind 4 + CSS custom properties (`--color-text`, `--color-accent`, etc.)
- Dark mode: default; light mode applied via `[data-theme="light"]` on `<html>`
- Admin panel uses plain CSS only (`admin.css`) — no Tailwind inside admin components
- Blog component styles are scoped Astro `<style>` blocks

## Image Conventions

- Static images go in `public/images/blog/[post-slug]/`
- Reference with root-relative paths: `/images/blog/my-post/hero.png`
- Use `<Figure>` component instead of raw `![]()` for bordered, captioned images
- Admin panel uploads images to the correct directory automatically
