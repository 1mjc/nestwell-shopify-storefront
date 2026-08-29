import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("Nestwell browser icon configuration", () => {
  it("declares the supplied Nestwell logo for tabs and iOS home screens", () => {
    const template = readFileSync(path.join(projectRoot, "client", "index.html"), "utf8");
    expect(template).toContain('rel="icon" type="image/png" sizes="512x512" href="/manus-storage/nestwell-logo_8d500958.png"');
    expect(template).toContain('rel="apple-touch-icon" sizes="180x180" href="/manus-storage/nestwell-logo_8d500958.png"');
    expect(template).toContain('<meta name="theme-color" content="#f6f3ed" />');
  });

  it("keeps the legacy favicon fallback asset available for older cached clients", () => {
    const icon = readFileSync(path.join(projectRoot, "client", "public", "favicon.ico"));
    expect(icon.byteLength).toBeGreaterThan(32);
  });

  it("uses a hosted logo asset for the configured site branding", () => {
    const logo = process.env.VITE_APP_LOGO ?? "";
    expect(logo).toBe("/manus-storage/nestwell-logo_8d500958.png");
  });
});
