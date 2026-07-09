import { describe, expect, it } from "vitest";

import { HeaderMatcher } from "../../src/services/matcher.service.js";
import { HeaderLookup } from "../../src/utils/header.lookup.js";

describe("HeaderMatcher", () => {
  const matcher = new HeaderMatcher(new HeaderLookup());

  it("matches known headers", () => {
    expect(matcher.match(["Name", "Email"])).toEqual({
      mapping: {
        Name: "name",
        Email: "email",
      },
      unmatched: [],
    });
  });

  it("returns unmatched headers", () => {
    expect(matcher.match(["Foo"])).toEqual({
      mapping: {},
      unmatched: ["Foo"],
    });
  });

  it("handles mixed headers", () => {
    expect(matcher.match(["Name", "Foo", "Email"])).toEqual({
      mapping: {
        Name: "name",
        Email: "email",
      },
      unmatched: ["Foo"],
    });
  });

  it("returns empty mapping when nothing matches", () => {
    expect(matcher.match(["ABC", "XYZ"])).toEqual({
      mapping: {},
      unmatched: ["ABC", "XYZ"],
    });
  });

  it("returns empty unmatched when everything matches", () => {
    const result = matcher.match(["Email", "Company"]);

    expect(result.unmatched).toEqual([]);
  });
});
