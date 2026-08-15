import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("Nestwell browser icon configuration", () => {
  it("declares the crescent icon for tabs and iOS home screens", () => {
    const template = readFileSync(path.join(projectRoot, "client", "index.html"), "utf8");
    expect(template).toContain('rel="icon" href="/favicon.ico"');
    expect(template).toContain('rel="apple-touch-icon"');
    expect(template).toMatch(/rel="icon" type="image\/png" sizes="512x512"/);
  });

  it("ships a real multi-size .ico asset in the served public directory", () => {
    const icon = readFileSync(path.join(projectRoot, "client", "public", "favicon.ico"));
    // ICO header: reserved 0x0000, type 0x0001, followed by the image count.
    expect(icon.readUInt16LE(0)).toBe(0);
    expect(icon.readUInt16LE(2)).toBe(1);
    expect(icon.readUInt16LE(4)).toBeGreaterThan(1);
  });

  it("uses a hosted logo asset for the configured site branding", () => {
    const logo = process.env.VITE_APP_LOGO ?? "";
    expect(logo).toMatch(/^\/manus-storage\/.+\.png$/);
  });
});
