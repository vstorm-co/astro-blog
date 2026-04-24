export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["site", "admin", "blog", "theme", "seo", "build", "ci", "docs", "deps"],
    ],
    "subject-case": [2, "always", "sentence-case"],
  },
};
