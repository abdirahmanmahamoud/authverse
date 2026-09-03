import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { AppleNext } from "../oauth/AppleNext.js";
import { AppleTanstackStart } from "../oauth/AppleTanstackStart.js";
import { packageManager } from "../utils/packageManager.js";
import { APPLE_ORIGIN, APPLE_ENV_VAR_NAMES } from "../oauth/appleConfig.js";

vi.mock("../utils/packageManager.js");

const NEXT_AUTH_TEMPLATE = `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { nextCookies } from "better-auth/next-js";

const connectionString = \`\${process.env.DATABASE_URL}\`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
`;

const TANSTACK_AUTH_TEMPLATE = `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const connectionString = \`\${process.env.DATABASE_URL}\`;
const adapter = new PrismaPg({ connectionString });

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma || new PrismaClient({ adapter });
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
});
`;

const TANSTACK_AUTH_TEMPLATE_WITH_TRUSTED = `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const connectionString = \`\${process.env.DATABASE_URL}\`;
const adapter = new PrismaPg({ connectionString });

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma || new PrismaClient({ adapter });
export const auth = betterAuth({
  trustedOrigins: ["https://caramel-fade-auth.com"],
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
});
`;

const TANSTACK_AUTH_TEMPLATE_WITH_SOCIAL = `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const connectionString = \`\${process.env.DATABASE_URL}\`;
const adapter = new PrismaPg({ connectionString });

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma || new PrismaClient({ adapter });
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
});
`;

describe("Apple provider generation", () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "authverse-apple-"));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
    vi.clearAllMocks();
    vi.mocked(packageManager).mockReturnValue(undefined as never);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function writeFile(relPath: string, content: string) {
    const abs = path.join(tmpDir, relPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
  }

  function readAuth(relPath: string) {
    return fs.readFileSync(path.join(tmpDir, relPath), "utf8");
  }

  it("should generate the Apple provider for Next.js", async () => {
    writeFile("src/lib/auth.ts", NEXT_AUTH_TEMPLATE);
    writeFile(".env", "DATABASE_URL=postgres://local\n");

    await AppleNext();

    const content = readAuth("src/lib/auth.ts");

    // Apple provider generated as an async function
    expect(content).toContain("apple: async () => (");
    expect(content).toContain(
      "clientId: process.env.APPLE_CLIENT_ID as string",
    );
    expect(content).toContain(
      "clientSecret: await generateAppleClientSecret()",
    );

    // jose import + generator function present
    expect(content).toContain('import { importPKCS8, SignJWT } from "jose"');
    expect(content).toContain("async function generateAppleClientSecret()");
    expect(content).toContain(
      '.setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_KEY_ID! })',
    );
    expect(content).toContain(".setIssuer(process.env.APPLE_TEAM_ID!)");
    expect(content).toContain(".setSubject(process.env.APPLE_CLIENT_ID!)");
    expect(content).toContain('.setAudience("https://appleid.apple.com")');
    expect(content).toContain(".setExpirationTime(now + 180 * 24 * 60 * 60)");

    // trustedOrigins includes Apple
    expect(content).toContain(`trustedOrigins: ["https://appleid.apple.com"]`);

    // No static/committed client secret
    expect(content).not.toContain("APPLE_CLIENT_SECRET");
    expect(content).toMatch(/APPLE_PRIVATE_KEY!\.replace\(/);

    // jose installed in the generated project
    expect(packageManager).toHaveBeenCalledWith("jose");

    // env documented
    const env = fs.readFileSync(path.join(tmpDir, ".env"), "utf8");
    for (const v of APPLE_ENV_VAR_NAMES) {
      expect(env).toContain(v);
    }
  });

  it("should generate the Apple provider for Tanstack Start", async () => {
    writeFile("src/lib/auth.ts", TANSTACK_AUTH_TEMPLATE);
    writeFile(".env", "DATABASE_URL=postgres://local\n");

    await AppleTanstackStart();

    const content = readAuth("src/lib/auth.ts");

    expect(content).toContain("apple: async () => (");
    expect(content).toContain(
      "clientSecret: await generateAppleClientSecret()",
    );
    expect(content).toContain('import { importPKCS8, SignJWT } from "jose"');
    expect(content).toContain('trustedOrigins: ["https://appleid.apple.com"]');
    expect(content).not.toContain("APPLE_CLIENT_SECRET");
    expect(packageManager).toHaveBeenCalledWith("jose");
  });

  it("should merge Apple into existing trustedOrigins without removing them", async () => {
    writeFile("src/lib/auth.ts", TANSTACK_AUTH_TEMPLATE_WITH_TRUSTED);
    writeFile(".env", "DATABASE_URL=postgres://local\n");

    await AppleTanstackStart();

    const content = readAuth("src/lib/auth.ts");
    expect(content).toContain('"https://appleid.apple.com"');
    expect(content).toContain('"https://caramel-fade-auth.com"');
    expect(content).toContain(
      'trustedOrigins: ["https://appleid.apple.com", "https://caramel-fade-auth.com"]',
    );
  });

  it("should merge Apple into existing socialProviders without removing them", async () => {
    writeFile("src/lib/auth.ts", TANSTACK_AUTH_TEMPLATE_WITH_SOCIAL);
    writeFile(".env", "DATABASE_URL=postgres://local\n");

    await AppleTanstackStart();

    const content = readAuth("src/lib/auth.ts");
    expect(content).toContain("apple: async () => (");
    expect(content).toContain("google: {");
    expect(content).toContain(
      "clientSecret: await generateAppleClientSecret()",
    );

    // google provider untouched
    expect(content).toContain(
      "clientSecret: process.env.GOOGLE_CLIENT_SECRET as string",
    );
  });

  it("should not duplicate the Apple provider on second run", async () => {
    writeFile("src/lib/auth.ts", NEXT_AUTH_TEMPLATE);
    writeFile(".env", "DATABASE_URL=postgres://local\n");

    await AppleNext();
    const content1 = readAuth("src/lib/auth.ts");

    await AppleNext();
    const content2 = readAuth("src/lib/auth.ts");

    expect(content2).toBe(content1);
    expect((content2.match(/apple: async/g) || []).length).toBe(1);
  });

  describe("generated auth.ts is valid", () => {
    it("should produce a well-formed Better Auth config for Next", async () => {
      writeFile("src/lib/auth.ts", NEXT_AUTH_TEMPLATE);
      writeFile(".env", "DATABASE_URL=postgres://local\n");

      await AppleNext();
      const content = readAuth("src/lib/auth.ts");

      // Balanced braces
      let open = 0;
      let imbalance = false;
      for (const ch of content) {
        if (ch === "{") open++;
        else if (ch === "}") open--;
        if (open < 0) {
          imbalance = true;
          break;
        }
      }
      expect(imbalance).toBe(false);
      expect(open).toBe(0);

      // Well-formed structure mirrors a working provider setup
      expect(content).toMatch(/\nexport const auth = betterAuth\(\{/);
      expect(content).toMatch(/trustedOrigins:\s*\[/);
      expect(content).toMatch(/socialProviders:\s*\{/);
      expect(content).toMatch(
        /\bappBundleIdentifier:\s*process\.env\.APPLE_BUNDLE_ID/,
      );
      expect(content).toContain('from "jose"');
      expect(content).toContain("async function generateAppleClientSecret()");
    });

    it("should not leak raw private key content or a committed secret", async () => {
      writeFile("src/lib/auth.ts", TANSTACK_AUTH_TEMPLATE);
      writeFile(".env", "DATABASE_URL=postgres://local\n");

      await AppleTanstackStart();

      const content = readAuth("src/lib/auth.ts");
      // generator reads from env at runtime; never inlines the key
      expect(content).not.toContain("-----BEGIN PRIVATE KEY-----");
      expect(content).not.toContain("APPLE_CLIENT_SECRET");
    });
  });
});

describe("Apple config module", () => {
  it("should export the required env var names", () => {
    expect(APPLE_ENV_VAR_NAMES).toEqual([
      "APPLE_CLIENT_ID",
      "APPLE_TEAM_ID",
      "APPLE_KEY_ID",
      "APPLE_PRIVATE_KEY",
      "APPLE_BUNDLE_ID",
    ]);
    expect(APPLE_ORIGIN).toBe("https://appleid.apple.com");
  });
});
