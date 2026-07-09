import { describe, expect, it } from "vitest";
import { HeaderLookup } from "../../src/utils/header.lookup.ts";

describe("HeaderLookup", () => {
  const lookup = new HeaderLookup();

  it("finds builtin aliases", () => {
    expect(lookup.get("Email Address")).toBe("email");
  });

  it("returns undefined for unknown headers", () => {
    expect(lookup.get("abcdef")).toBeUndefined();
  });

  it("learns new aliases", () => {
    lookup.learn("Employer", "company");

    expect(lookup.get("Employer")).toBe("company");
  });

  it("normalizes learned aliases", () => {
    lookup.learn("Sales Rep", "lead_owner");

    expect(lookup.get(" sales_rep ")).toBe("lead_owner");
  });

  it("has() works", () => {
    expect(lookup.has("Email")).toBe(true);
  });
});
