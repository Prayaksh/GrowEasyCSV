import { describe, expect, it } from "vitest";
import { HeaderNormalizer } from "../../src/normalizers/header.normalizer.js";

describe("HeaderNormalizer", () => {
  const normalizer = new HeaderNormalizer();

  describe("clean()", () => {
    it("should lowercase headers", () => {
      expect(normalizer.clean("EMAIL")).toBe("email");
    });

    it("should trim whitespace", () => {
      expect(normalizer.clean("   Email   ")).toBe("email");
    });

    it("should replace spaces with underscores", () => {
      expect(normalizer.clean("Email Address")).toBe("email_address");
    });

    it("should replace hyphens with underscores", () => {
      expect(normalizer.clean("Lead-Owner")).toBe("lead_owner");
    });

    it("should replace slashes with underscores", () => {
      expect(normalizer.clean("Lead/Owner")).toBe("lead_owner");
    });

    it("should remove brackets", () => {
      expect(normalizer.clean("Phone(Number)")).toBe("phone_number");
    });

    it("should collapse multiple spaces", () => {
      expect(normalizer.clean("Lead     Owner")).toBe("lead_owner");
    });

    it("should remove punctuation", () => {
      expect(normalizer.clean("Phone#")).toBe("phone");
    });

    it("should remove leading/trailing underscores", () => {
      expect(normalizer.clean("__Email__")).toBe("email");
    });
  });

  describe("normalize()", () => {
    it("should map aliases to canonical fields", () => {
      const rows = [
        {
          "Email Address": "john@test.com",
          "Company Name": "Google",
        },
      ];

      expect(normalizer.normalize(rows)).toEqual([
        {
          email: "john@test.com",
          company: "Google",
        },
      ]);
    });

    it("should normalize unknown headers", () => {
      const rows = [
        {
          "Custom Field": "abc",
        },
      ];

      expect(normalizer.normalize(rows)).toEqual([
        {
          custom_field: "abc",
        },
      ]);
    });

    it("should preserve values", () => {
      const rows = [
        {
          Name: "John",
          Email: "john@test.com",
        },
      ];

      expect(normalizer.normalize(rows)[0].name).toBe("John");
      expect(normalizer.normalize(rows)[0].email).toBe("john@test.com");
    });

    it("should normalize multiple rows", () => {
      const rows = [{ Email: "a@test.com" }, { Email: "b@test.com" }];

      expect(normalizer.normalize(rows)).toHaveLength(2);
    });
  });
});
