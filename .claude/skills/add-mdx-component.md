# Skill: Add MDX Component

Create a new custom Astro component for use in MDX blog posts.

## What to ask before starting

1. **Component name** — PascalCase, e.g. `PricingTable`
2. **Purpose** — what does it render? What problem does it solve?
3. **Props** — what data does it accept?
4. **Slot or props-driven?** — does content go via `<slot />` (for rich children) or purely via props (for data)?

## File location

```
src/components/blog/ComponentName.astro
```

## Required metadata comments

Every blog component must include these comments at the top of the template (after the frontmatter `---` block). The admin panel reads them to populate the Components panel:

```astro
{/* @mdx-label Human Readable Name */}
{/* @mdx-description One sentence. What it does, when to use it. */}
{/* @mdx-snippet
<ComponentName prop="value">
  Slot content here.
</ComponentName>
*/}
{/* @mdx-preview
<div style="...inline preview HTML...">
  <!-- Hardcoded preview that looks like the rendered component -->
  <!-- Use only inline styles — no class names or external CSS -->
  <!-- Keep it under ~100px tall so it fits the components panel card -->
</div>
*/}
```

Rules for the preview:
- Inline styles only — no `class`, no `style` tags, no external CSS references
- Use the admin dark palette: bg `#0e0e11`, borders `#27272a`, text `#fafafa` / `#a1a1aa`
- Accent colour: `#7c5cff`
- Keep it representative but simple — one example is enough

## Component structure template

```astro
---
export interface Props {
  // define all props with types and optional markers
  title: string;
  variant?: "default" | "compact";
}
const { title, variant = "default" } = Astro.props;
---
{/* @mdx-label Component Label */}
{/* @mdx-description What it does. */}
{/* @mdx-snippet
<ComponentName title="Example title" />
*/}
{/* @mdx-preview
<div style="padding:12px;background:#0e0e11;border:1px solid #27272a;border-radius:8px">
  <p style="margin:0;font-size:13px;color:#fafafa">Preview content</p>
</div>
*/}

<div class="component-root">
  <slot />
</div>

<style>
  .component-root {
    /* use CSS custom properties from the site theme */
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
  }
</style>
```

## CSS conventions

- Use CSS custom properties for colours — never hardcode hex values in component styles
- Available variables: `--color-text`, `--color-text-secondary`, `--color-text-tertiary`, `--color-accent`, `--color-bg`, `--color-surface`, `--color-surface-hover`, `--color-border`, `--color-border-hover`
- Light mode overrides go in `:root[data-theme="light"] .your-class { }` selectors
- Astro `<style>` is scoped by default — use `:global()` only for child elements set via `<slot>` or `innerHTML`
- Standard margin for block components: `margin: 1.5rem 0`

## After creating the component

1. Run `bun run build` — must pass with 0 errors
2. Import and use it in a post to verify it renders correctly
3. Check both dark and light modes
4. Verify the preview in the admin panel Components tab looks reasonable

## Example: simple component with slot

```astro
---
export interface Props {
  label: string;
  tone?: "neutral" | "positive" | "negative";
}
const { label, tone = "neutral" } = Astro.props;
const colors = {
  neutral: { bg: "rgba(113,113,122,0.1)", border: "#52525b", text: "#a1a1aa" },
  positive: { bg: "rgba(16,185,129,0.08)", border: "#10b981", text: "#34d399" },
  negative: { bg: "rgba(244,63,94,0.08)", border: "#f43f5e", text: "#fb7185" },
};
const c = colors[tone];
---
{/* @mdx-label Verdict */}
{/* @mdx-description Final verdict box with a label and optional rich content. */}
{/* @mdx-snippet
<Verdict label="Bottom line" tone="positive">
  Your conclusion here.
</Verdict>
*/}
{/* @mdx-preview
<div style="padding:12px 16px;background:rgba(16,185,129,0.08);border:1px solid #10b981;border-radius:8px">
  <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#10b981">Bottom line</p>
  <p style="margin:0;font-size:12px;color:#a1a1aa">Your conclusion here.</p>
</div>
*/}

<div class="verdict" style={`background:${c.bg};border-color:${c.border};color:${c.text}`}>
  <p class="verdict-label">{label}</p>
  <div class="verdict-body"><slot /></div>
</div>

<style>
  .verdict {
    padding: 0.85rem 1rem;
    margin: 1.5rem 0;
    border-radius: 10px;
    border: 1px solid;
  }
  .verdict-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 0.4rem;
  }
  .verdict-body > :global(p) { margin: 0.25rem 0; }
  .verdict-body > :global(p):first-child { margin-top: 0; }
  .verdict-body > :global(p):last-child { margin-bottom: 0; }
</style>
```
