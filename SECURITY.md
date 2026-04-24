# Security Policy

## Supported versions

Only the latest minor version of the template receives security fixes. If you've forked from an older version, please update.

## Reporting a vulnerability

**Please do not open a public issue.**

Use GitHub's private security advisory form at:

  https://github.com/vstorm-co/astro-blog/security/advisories/new

Or email the maintainer(s) at `security@vstorm.co`.

Please include:

- A description of the vulnerability.
- Steps to reproduce (or a proof of concept).
- The version or commit hash of the template you tested.
- Your assessment of the impact.

## Response time

- **Acknowledgement:** within 72 hours.
- **Triage and initial assessment:** within 1 week.
- **Fix and release timeline:** communicated after triage.

## Scope

### In scope

- MDX rendering pipeline (remark/rehype plugin vulnerabilities).
- Build artifacts produced by `bun run build`.
- Admin panel — although bound to loopback in dev only, report anything that would let a local attacker escape the project directory or execute arbitrary code.
- Default host configurations (`vercel.json`, `netlify.toml`, `public/_headers`).

### Out of scope

- Third-party integrations you add yourself (analytics, comments).
- Custom host configurations you override.
- The **example content** in `src/data/blog/` — it is illustrative only.
- User-provided MDX. If you accept untrusted MDX, that's a reader-trust decision outside the template's control.
