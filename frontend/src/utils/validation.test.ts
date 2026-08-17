import { describe, it, expect } from "bun:test";
import { validateEmail } from "./validation";

describe("validateEmail", () => {
  it("accepts well-formed email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("first.last@sub.domain.se")).toBe(true);
  });

  it("rejects malformed email addresses", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("no-at-sign")).toBe(false);
    expect(validateEmail("missing@domain")).toBe(false);
    expect(validateEmail("spaces @example.com")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
  });
});
