import { describe, expect, it } from "vitest";

import { CRMValidator } from "../../src/services/validator.service.js";

describe("CRMValidator", () => {
  const validator = new CRMValidator();

  it("accepts row with email", () => {
    expect(
      validator.isValid({
        email: "john@test.com",
      } as any),
    ).toBe(true);
  });

  it("accepts row with phone", () => {
    expect(
      validator.isValid({
        mobile_without_country_code: "9999999999",
      } as any),
    ).toBe(true);
  });

  it("accepts row with both", () => {
    expect(
      validator.isValid({
        email: "john@test.com",
        mobile_without_country_code: "999",
      } as any),
    ).toBe(true);
  });

  it("rejects row with neither", () => {
    expect(validator.isValid({} as any)).toBe(false);
  });

  it("rejects blank email and phone", () => {
    expect(
      validator.isValid({
        email: "   ",
        mobile_without_country_code: "",
      } as any),
    ).toBe(false);
  });
});
