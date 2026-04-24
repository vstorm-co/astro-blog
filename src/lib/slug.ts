import slugify from "slugify";

export function toSlug(input: string): string {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

export function isValidSlug(input: string): boolean {
  return SLUG_RE.test(input);
}
