export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
}

export interface SocialLink {
  name: string;
  href: string;
  linkTitle: string;
  icon: string;
}
