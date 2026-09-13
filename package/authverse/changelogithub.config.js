export default {
  emojis: false,
  contributors: true,
  types: {
    feat: { title: "Features" },
    fix: { title: "Bug Fixes" },
    test: { title: "Tests" },
    refactor: { title: "Refactor" },
    docs: { title: "Documentation" },
    ci: { title: "CI" },
  },
  commitUrlFormat: "{{host}}/{{owner}}/{{repository}}/commit/{{hash}}",
  compareUrlFormat:
    "{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}",
};
