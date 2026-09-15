import { describe, it, expect, vi, beforeEach } from "vitest";
import { Plugins } from "../cli/plugins.js";
import { getFramework } from "../utils/framework.js";
import { emailOtpNext } from "../plugin/emailOtpNext.js";
import { emailOtpTanstackStart } from "../plugin/emailOtpTanstackStart.js";

vi.mock("../utils/framework.js");
vi.mock("../plugin/emailOtpNext.js");
vi.mock("../plugin/emailOtpTanstackStart.js");

describe("Plugins CLI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should run emailOtpNext for Next.js with email-otp", async () => {
    vi.mocked(getFramework).mockResolvedValue({
      framework: "Next js",
      error: null,
    });

    await Plugins({ plugins: "email-otp" });

    expect(emailOtpNext).toHaveBeenCalled();
  });

  it("should run emailOtpTanstackStart for Tanstack Start with email-otp", async () => {
    vi.mocked(getFramework).mockResolvedValue({
      framework: "tanstack start",
      error: null,
    });

    await Plugins({ plugins: "email-otp" });

    expect(emailOtpTanstackStart).toHaveBeenCalled();
  });

  it("should log error for invalid plugin", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    vi.mocked(getFramework).mockResolvedValue({
      framework: "Next js",
      error: null,
    });

    await Plugins({ plugins: "invalid" });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Invalid plugin"),
    );
  });

  it("should log error when framework detection fails", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    vi.mocked(getFramework).mockResolvedValue({
      framework: null,
      error: "No framework supported authverse",
    });

    await Plugins({ plugins: "email-otp" });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No framework supported authverse"),
    );
  });
});
