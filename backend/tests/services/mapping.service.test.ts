import { describe, expect, it } from "vitest";
import { MappingService } from "../../src/services/mapping.service.js";

describe("MappingService", () => {
  const service = new MappingService();

  it("maps headers correctly", () => {
    const rows = [
      {
        Name: "John",
        Email: "john@test.com",
      },
    ];

    const mapping = {
      Name: "name",
      Email: "email",
    };

    expect(service.apply(rows, mapping)).toEqual([
      {
        name: "John",
        email: "john@test.com",
      },
    ]);
  });

  it("ignores unmapped fields", () => {
    const rows = [
      {
        Name: "John",
        Age: 22,
      },
    ];

    const mapping = {
      Name: "name",
    };

    expect(service.apply(rows, mapping)).toEqual([
      {
        name: "John",
      },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(service.apply([], {})).toEqual([]);
  });

  it("handles multiple rows", () => {
    const rows = [{ Name: "John" }, { Name: "Jane" }];

    const mapping = {
      Name: "name",
    };

    expect(service.apply(rows, mapping)).toEqual([
      { name: "John" },
      { name: "Jane" },
    ]);
  });

  it("does not mutate original rows", () => {
    const rows = [
      {
        Name: "John",
      },
    ];

    service.apply(rows, {
      Name: "name",
    });

    expect(rows[0]).toEqual({
      Name: "John",
    });
  });
});
