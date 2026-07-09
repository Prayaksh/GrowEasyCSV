import { describe, expect, it } from "vitest";
import { CSVParser } from "../../src/parsers/csv.parser.js";

describe("CSVParser", () => {
  const parser = new CSVParser();

  it("parses a valid csv", async () => {
    const csv = Buffer.from(
      `Name,Email
John,john@test.com
Jane,jane@test.com`,
    );

    const rows = await parser.parse(csv);

    expect(rows).toEqual([
      {
        Name: "John",
        Email: "john@test.com",
      },
      {
        Name: "Jane",
        Email: "jane@test.com",
      },
    ]);
  });

  it("returns an empty array for header-only csv", async () => {
    const csv = Buffer.from(`Name,Email`);

    const rows = await parser.parse(csv);

    expect(rows).toEqual([]);
  });

  it("trims whitespace", async () => {
    const csv = Buffer.from(
      `Name,Email
 John  ,  john@test.com `,
    );

    const rows = await parser.parse(csv);

    expect(rows).toEqual([
      {
        Name: "John",
        Email: "john@test.com",
      },
    ]);
  });

  it("skips empty lines", async () => {
    const csv = Buffer.from(
      `Name,Email

John,john@test.com

Jane,jane@test.com`,
    );

    const rows = await parser.parse(csv);

    expect(rows).toHaveLength(2);
  });

  it("throws on malformed csv", async () => {
    const csv = Buffer.from(
      `Name,Email
John`,
    );

    await expect(parser.parse(csv)).rejects.toThrow();
  });
});
