export default {
  emojis: false,
  contributors: true,
  types: {
    feat: { title: "Features" },
    fix: { title: "Bug Fixes" },
    perf: { title: "Performance" },
    refactor: { title: "Refactoring" },
    test: { title: "Tests" },
    docs: { title: "Documentation" },
  },
  commitUrlFormat: "{{host}}/{{owner}}/{{repository}}/commit/{{hash}}",
  compareUrlFormat:
    "{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}",
};
