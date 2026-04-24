import type { SocialLink } from "./types";
import { SITE } from "./site.config";

/**
 * Edit this list — delete providers you don't use, add your handles.
 * Icon names map to components in src/components/icons/ (see icons/index.ts).
 */
export const SOCIALS: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/your-handle",
    linkTitle: `${SITE.title} on GitHub`,
    icon: "github",
  },
  {
    name: "X",
    href: "https://x.com/your-handle",
    linkTitle: `${SITE.title} on X`,
    icon: "x",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/your-handle/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: "linkedin",
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `Subscribe to ${SITE.title} via RSS`,
    icon: "rss",
  },
];

/**
 * Share targets rendered at the bottom of each post.
 * The `{url}` and `{title}` tokens are replaced at render time.
 */
export const SHARE_LINKS: SocialLink[] = [
  {
    name: "X",
    href: "https://x.com/intent/post?url={url}&text={title}",
    linkTitle: "Share on X",
    icon: "x",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/sharing/share-offsite/?url={url}",
    linkTitle: "Share on LinkedIn",
    icon: "linkedin",
  },
  {
    name: "Email",
    href: "mailto:?subject={title}&body={url}",
    linkTitle: "Share via email",
    icon: "mail",
  },
];
