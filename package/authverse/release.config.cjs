module.exports = {
  branches: [
    "main",
    {
      name: "beta",
      prerelease: "beta",
    },
    {
      name: "canary",
      prerelease: "canary",
    },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        pkgRoot: "package/authverse",
        tarballDir: "dist",
      },
    ],
    "@semantic-release/github",
  ],
};
