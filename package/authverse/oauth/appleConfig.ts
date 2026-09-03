export const APPLE_IMPORT = `import { importPKCS8, SignJWT } from "jose";
`;

export const APPLE_CLIENT_SECRET_FUNCTION = `async function generateAppleClientSecret() {
  const now = Math.floor(Date.now() / 1000);
  const key = await importPKCS8(
    process.env.APPLE_PRIVATE_KEY!.replace(/\\\\n/g, "\\n"),
    "ES256",
  );
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_KEY_ID! })
    .setIssuer(process.env.APPLE_TEAM_ID!)
    .setSubject(process.env.APPLE_CLIENT_ID!)
    .setAudience("https://appleid.apple.com")
    .setIssuedAt(now)
    .setExpirationTime(now + 180 * 24 * 60 * 60)
    .sign(key);
}
`;

export const APPLE_PROVIDER_ENTRY = `    apple: async () => ({
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: await generateAppleClientSecret(),
      appBundleIdentifier: process.env.APPLE_BUNDLE_ID,
    }),`;

export const APPLE_ENV_VARS = `\n\n# Apple OAuth\nAPPLE_CLIENT_ID=\nAPPLE_TEAM_ID=\nAPPLE_KEY_ID=\nAPPLE_PRIVATE_KEY=\nAPPLE_BUNDLE_ID=\n`;

export const APPLE_ORIGIN = "https://appleid.apple.com";

export const APPLE_ENV_VAR_NAMES = [
  "APPLE_CLIENT_ID",
  "APPLE_TEAM_ID",
  "APPLE_KEY_ID",
  "APPLE_PRIVATE_KEY",
  "APPLE_BUNDLE_ID",
];
