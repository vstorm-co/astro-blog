# Skill: Write Blog Post

Write a complete, publication-ready MDX blog post for this template.

## What to ask the user before starting

If not provided in the request, ask for:
1. **Topic / title** — what is the post about?
2. **Audience** — who is reading this? (developers, beginners, practitioners)
3. **Angle** — tutorial, opinion, reference, case study, or explainer?
4. **Approximate length** — short (~500w), medium (~1000w), long (~2000w+)
5. **Tags** — 2–5 tags for the post
6. **Cover image** — do they have one, or should you use a placeholder?

## Output format

Produce a single `.mdx` file ready to save at `src/data/blog/[slug].mdx`.

## Frontmatter rules

```yaml
---
title: Concise, specific title (aim for 40–60 chars)
description: One clear sentence summarising the value for the reader (120–155 chars)
pubDate: YYYY-MM-DD   # use today's date
author: Jane Doe      # use the name from site.config.ts if known
tags:
  - lowercase-hyphenated
  - tag
heroImage: /images/blog/[slug]/hero.png   # placeholder if no image provided
draft: false
featured: false       # set true only if explicitly requested
---
```

## Import block

After frontmatter, import only the components you actually use in the post. Do not import components and then not use them.

```mdx
import Callout from "@/components/blog/Callout.astro";
import Steps from "@/components/blog/Steps.astro";
// ... etc
```

## Writing guidelines

### Structure
- Open with a hook — one short paragraph that establishes why this matters
- Use `##` headings (never `#` — the layout renders title as h1)
- Each section should have a clear purpose; cut sections that don't add value
- Close with a concrete next step or summary

### Prose
- Active voice, present tense
- Short paragraphs (3–4 sentences max)
- Write for someone who will scan before reading — make headings informative
- No filler phrases ("In this post, we will...", "As you can see...", "It's worth noting that...")

### Code blocks
- Always include a language identifier: ` ```ts `, ` ```bash `, ` ```yaml ` etc.
- Show realistic, runnable code — not pseudo-code unless it's an algorithm explanation
- Add comments only when the code does something non-obvious

### Component usage

Use custom components deliberately — not to decorate, but to improve comprehension:

| Use this | When |
|----------|------|
| `<Callout type="warn">` | The reader must know this before proceeding |
| `<Callout type="info">` | Helpful context that not all readers need |
| `<Steps items={[...]}>` | Sequential process with 2+ steps |
| `<Figure>` | Any image — always preferred over raw `![]()` |
| `<FileTree>` | Showing directory structure |
| `<TwoColumn>` | Side-by-side comparison |
| `<Terminal>` | Shell commands (as opposed to code) |
| `<Stat>` | A single metric that deserves visual emphasis |
| `<Details>` | Supplementary info that would break reading flow if inlined |
| `<InfoCard>` | Linking to a related post or resource |

### Images

For every image that should exist but hasn't been provided yet, insert a placeholder Figure:

```mdx
{/* TODO: Add screenshot of [what to show] */}
<Figure
  src="/images/blog/[slug]/[descriptive-name].png"
  alt="TODO: [description of what this image should show]"
  caption="[What the caption should say once image is added]"
/>
```

Use descriptive filenames: `admin-panel-overview.png`, not `image1.png`.

## Quality checklist before finishing

- [ ] Title is 40–60 chars and specific (not "Introduction to X")
- [ ] Description is 120–155 chars and answers "why should I read this?"
- [ ] All imported components are actually used in the body
- [ ] No heading is `#` (only `##` and below)
- [ ] Every image reference uses `<Figure>` — no raw `![]()`
- [ ] Code blocks have language identifiers
- [ ] Slug in `heroImage` path matches the intended filename
- [ ] No placeholder text left in prose (only in image comments/alts)
