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
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "fix", release: "patch" },
          { type: "feat", release: "patch" },
          { type: "featMinor", release: "minor" },
          { breaking: true, release: "major" },
        ],
      },
    ],

    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "featMinor", section: "Features" },
          ],
        },
      },
    ],

    "@semantic-release/changelog",

    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        pkgRoot: "./",
      },
    ],

    "@semantic-release/github",

    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        message:
          "chore(release): ${nextRelease.version}\n\n${nextRelease.notes}",
      },
    ],
  ],
};
