import { describe, expect, it } from "vitest";
import { CRMRecordNormalizer } from "../../src/normalizers/crm.normalizer.js";

describe("CRMRecordNormalizer", () => {
  const normalizer = new CRMRecordNormalizer();

  it("should normalize valid dates", () => {
    const rows = normalizer.normalize([
      {
        created_at: "2024-01-01",
      } as any,
    ]);

    expect(rows[0].created_at).toContain("2024-01-01");
  });

  it("should null invalid dates", () => {
    const rows = normalizer.normalize([
      {
        created_at: "abc",
      } as any,
    ]);

    expect(rows[0].created_at).toBeNull();
  });

  it("should keep first email", () => {
    const rows = normalizer.normalize([
      {
        email: "a@test.com,b@test.com",
      } as any,
    ]);

    expect(rows[0].email).toBe("a@test.com");
  });

  it("should append extra emails to crm note", () => {
    const rows = normalizer.normalize([
      {
        email: "a@test.com,b@test.com,c@test.com",
      } as any,
    ]);

    expect(rows[0].crm_note).toContain("Additional Emails");
  });

  it("should keep first phone", () => {
    const rows = normalizer.normalize([
      {
        mobile_without_country_code: "111,222",
      } as any,
    ]);

    expect(rows[0].mobile_without_country_code).toBe("111");
  });

  it("should append extra phones to note", () => {
    const rows = normalizer.normalize([
      {
        mobile_without_country_code: "111,222,333",
      } as any,
    ]);

    expect(rows[0].crm_note).toContain("Additional Phones");
  });

  it("should preserve existing note while appending", () => {
    const rows = normalizer.normalize([
      {
        crm_note: "Original",
        email: "a@test.com,b@test.com",
      } as any,
    ]);

    expect(rows[0].crm_note).toContain("Original");
    expect(rows[0].crm_note).toContain("Additional Emails");
  });

  it("should normalize newlines", () => {
    const rows = normalizer.normalize([
      {
        crm_note: "Hello\nWorld",
      } as any,
    ]);

    expect(rows[0].crm_note).toBe("Hello\\nWorld");
  });

  it("should null invalid crm status", () => {
    const rows = normalizer.normalize([
      {
        crm_status: "INVALID_STATUS",
      } as any,
    ]);

    expect(rows[0].crm_status).toBeNull();
  });

  it("should null invalid data source", () => {
    const rows = normalizer.normalize([
      {
        data_source: "INVALID_SOURCE",
      } as any,
    ]);

    expect(rows[0].data_source).toBeNull();
  });

  it("should preserve valid email", () => {
    const rows = normalizer.normalize([
      {
        email: "john@test.com",
      } as any,
    ]);

    expect(rows[0].email).toBe("john@test.com");
    expect(rows[0].crm_note).toBeUndefined();
  });

  it("should preserve valid phone", () => {
    const rows = normalizer.normalize([
      {
        mobile_without_country_code: "9999999999",
      } as any,
    ]);

    expect(rows[0].mobile_without_country_code).toBe("9999999999");
  });

  it("should normalize multiple records", () => {
    expect(normalizer.normalize([{} as any, {} as any])).toHaveLength(2);
  });
});
