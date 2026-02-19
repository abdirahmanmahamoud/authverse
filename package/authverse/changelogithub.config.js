export default {
  emojis: false,
  contributors: true,
  types: {
    feat: { title: "Features" },
    fix: { title: "Bug Fixes" },
    test: { title: "Tests" },
  },
  commitUrlFormat: "{{host}}/{{owner}}/{{repository}}/commit/{{hash}}",
  compareUrlFormat:
    "{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}",
};
