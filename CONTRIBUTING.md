# Contributing

Thanks for your interest in improving astro-blog. This doc explains how to get set up and what we expect in a pull request.

## TL;DR

```bash
bun install
bun run dev
# open http://localhost:4321/admin/ to use the editor
```

## Prerequisites

- **Bun** ≥ 1.0 (primary) or **Node** ≥ 20.
- Git.

## Project structure

Deep dive in [`notes/01-architecture.md`](./notes/01-architecture.md). Highlights:

```
src/
├─ site.config.ts           # identity, nav, features, branding (edit this first)
├─ socials.ts               # SOCIALS + SHARE_LINKS
├─ content.config.ts        # Zod schemas for collections
├─ data/
│  ├─ blog/                 # MDX posts
│  └─ pages/                # About, Uses, Now, …
├─ layouts/
├─ components/
│  ├─ blog/                 # MDX palette (self-registering via @mdx-snippet)
│  ├─ admin/                # dev-only admin panel
│  ├─ islands/              # React islands (theme toggle, search, …)
│  ├─ home/ post/ layout/   # site components
├─ lib/
│  ├─ admin/                # Vite dev middleware
│  └─ posts.ts              # content helpers
├─ pages/                   # routes
└─ styles/
```

## Running locally

```bash
bun install
bun run dev       # http://localhost:4321
bun run build     # production build, runs astro check first
bun run preview   # serve dist/
bun run new-post "My title"
```

## Admin panel

`/admin/` is dev-only. It's a React split-pane editor for MDX posts with autosave, component palette, and image uploads. In production builds the route returns a "dev-only" notice and all `/api/admin/*` endpoints are rewritten to 404 by the host configs in `vercel.json` / `netlify.toml` / `public/_headers`.

Do not expose `bun run dev` to the internet — the admin API is not authenticated.

## Commit style

[Conventional Commits](https://www.conventionalcommits.org/). Examples:

```
feat(blog): add Timeline component
fix(admin): preserve scroll on iframe reload
docs: rewrite the "first 10 minutes" section
chore(deps): bump astro to 5.18
```

Scopes in use: `site`, `admin`, `blog`, `theme`, `seo`, `build`, `ci`, `docs`, `deps`.

## Proposing changes

- **Typo / small doc fix:** PR directly.
- **Bug fix:** include a reproduction in the PR description.
- **New feature / new component / new page:** open an issue or discussion first. The template is deliberately minimal — we err on the side of *not* adding. See the anti-goals in [`notes/00-overview.md`](./notes/00-overview.md).

## Writing an MDX component for the palette

1. Drop an `.astro` file in `src/components/blog/`.
2. Include three JSX-style comments anywhere in the template:

   ```astro
   {/* @mdx-label YourComponent */}
   {/* @mdx-description Short one-line description. */}
   {/* @mdx-snippet
   <YourComponent prop="example">
     Body
   </YourComponent>
   */}
   ```

3. The admin panel picks it up automatically — no code registration needed.

## Running checks

```bash
bun run check          # astro check (types + content schema)
bun run build          # full build (also runs check)
```

Before opening a PR:

- [ ] `bun run check` passes.
- [ ] `bun run build` passes.
- [ ] If you changed UI, you tested in both light and dark modes.
- [ ] If you added a component, it's used in `src/data/blog/example-post.mdx` so the QA fixture covers it.

## Security

See [`SECURITY.md`](./SECURITY.md). Do not open public issues for security problems.

## License

By submitting a PR you agree to license your contribution under the [MIT License](./LICENSE).
