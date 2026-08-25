import { describe, expect, it } from "vitest";
import { welcomePopupForTest } from "./LifecycleCapture";

describe("welcome popup frequency policy", () => {
  const now = 1_800_000_000_000;

  it("shows to a new visitor and remains hidden until the stored next-eligible timestamp", () => {
    expect(welcomePopupForTest.shouldDisplayWelcomePopup(null, now)).toBe(true);
    expect(welcomePopupForTest.shouldDisplayWelcomePopup(String(now + welcomePopupForTest.WELCOME_POPUP_DISMISS_MS - 1), now)).toBe(false);
    expect(welcomePopupForTest.shouldDisplayWelcomePopup(String(now + welcomePopupForTest.WELCOME_POPUP_DISMISS_MS), now + welcomePopupForTest.WELCOME_POPUP_DISMISS_MS)).toBe(true);
  });
});
