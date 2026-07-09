import { describe, expect, it } from "vitest";

import { NormalizerService } from "../../src/services/normalizer.service.js";

describe("NormalizerService", () => {
  const service = new NormalizerService();

  it("normalizes headers and values", () => {
    const rows = [
      {
        "Email Address": "  john@test.com  ",
        "Company Name": " Google ",
      },
    ];

    expect(service.normalize(rows)).toEqual([
      {
        email: "john@test.com",
        company: "Google",
      },
    ]);
  });

  it("converts NA to null", () => {
    const rows = [
      {
        Email: "NA",
      },
    ];

    expect(service.normalize(rows)).toEqual([
      {
        email: null,
      },
    ]);
  });

  it("handles multiple rows", () => {
    const rows = [{ Email: "a@test.com" }, { Email: "b@test.com" }];

    expect(service.normalize(rows)).toHaveLength(2);
  });

  it("returns empty array", () => {
    expect(service.normalize([])).toEqual([]);
  });
});
