import { describe, expect, it } from "vitest";

import { FingerprintService } from "../../src/services/cache/fingerprint.service.js";

describe("FingerprintService", () => {
  const service = new FingerprintService();

  it("generates deterministic fingerprint", () => {
    expect(service.generate(["Name", "Email"])).toBe(
      service.generate(["Name", "Email"]),
    );
  });

  it("ignores header order", () => {
    expect(service.generate(["Name", "Email"])).toBe(
      service.generate(["Email", "Name"]),
    );
  });

  it("changes when headers change", () => {
    expect(service.generate(["Name"])).not.toBe(service.generate(["Email"]));
  });

  it("includes cache prefix", () => {
    expect(service.generate(["Email"])).toContain("crm:mapping:v1:");
  });
});
