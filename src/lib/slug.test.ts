import { describe, it, expect } from "vitest";
import { toSlug, isValidSlug } from "./slug";

describe("toSlug", () => {
  it("lowercases and hyphenates", () => {
    expect(toSlug("Hello World")).toBe("hello-world");
  });

  it("strips leading/trailing whitespace", () => {
    expect(toSlug("  My Post  ")).toBe("my-post");
  });

  it("deburrs accented characters", () => {
    expect(toSlug("Café au lait")).toBe("cafe-au-lait");
  });

  it("removes punctuation", () => {
    expect(toSlug("What's new? (2026)")).toBe("whats-new-2026");
  });
});

describe("isValidSlug", () => {
  it("accepts valid slugs", () => {
    expect(isValidSlug("hello-world")).toBe(true);
    expect(isValidSlug("post-123")).toBe(true);
    expect(isValidSlug("a")).toBe(true);
  });

  it("rejects slugs starting with a hyphen", () => {
    expect(isValidSlug("-bad")).toBe(false);
  });

  it("rejects slugs with uppercase", () => {
    expect(isValidSlug("Hello")).toBe(false);
  });

  it("rejects slugs with underscores", () => {
    expect(isValidSlug("my_post")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidSlug("")).toBe(false);
  });
});
