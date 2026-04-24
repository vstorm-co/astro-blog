# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-04-24

### Added

- Astro 5 + MDX + React 19 stack with `output: "static"`
- Local admin panel (dev-only) — CodeMirror 6 editor, live preview iframe, component palette, drag-and-drop image uploads
- 22+ MDX blog components: Callout, Figure, Stat, Steps, Timeline, Terminal, FileTree, Diff, Gallery, Tweet, Bookmark, Comparison, Badge, Kbd, Aside, PullQuote, InfoCard, TwoColumn, Details, Divider, VideoEmbed, CodeGroup
- Dark / light theme toggle with pre-paint init (no FOUC)
- Tag pages with pagination, archive page, about page
- RSS feed, sitemap, `robots.txt` generated at build time
- Pagefind search integration (opt-in via `features.search`)
- Scheduled posts — hidden until `pubDate` is reached
- Hourly rebuild workflow for scheduled posts (`.github/workflows/scheduled-rebuild.yml`)
- Deploy configs for Vercel (`vercel.json`), Netlify (`netlify.toml`), Cloudflare Pages (`_headers` / `_redirects`)
- Security headers pre-configured on all three hosts
- `scripts/new-post.ts` CLI scaffolder
- CI workflow — lint, type-check, build, smoke tests (`.github/workflows/ci.yml`)
- Lighthouse CI workflow with performance budget (`.github/workflows/lighthouse.yml`)
- Release automation via release-please (`.github/workflows/release.yml`)
- Open-source hygiene: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, issue templates, PR template, `CODEOWNERS`, Dependabot config
- ESLint flat config, Prettier, Commitlint, Husky pre-commit hooks
- Vitest test infrastructure with slug utility tests
- Copy-code button island, Pagefind search UI island, TOC scroll-spy island
- `public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/site.webmanifest`
- `twitter:creator` meta tag derived from `SOCIALS`
