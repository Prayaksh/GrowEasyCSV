import { describe, expect, it } from "vitest";
import ExcelJS from "exceljs";
import { ExcelParser } from "../../src/parsers/excel.parser.js";

describe("ExcelParser", () => {
  const parser = new ExcelParser();

  async function createWorkbook(rows: unknown[][]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Sheet1");

    rows.forEach((row) => sheet.addRow(row));

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }

  it("parses workbook", async () => {
    const buffer = await createWorkbook([
      ["Name", "Email"],
      ["John", "john@test.com"],
      ["Jane", "jane@test.com"],
    ]);

    const rows = await parser.parse(buffer);

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

  it("returns empty array when worksheet has no rows", async () => {
    const workbook = new ExcelJS.Workbook();

    workbook.addWorksheet("Sheet1");

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    const rows = await parser.parse(buffer);

    expect(rows).toEqual([]);
  });

  it("ignores empty rows", async () => {
    const buffer = await createWorkbook([
      ["Name", "Email"],
      ["John", "john@test.com"],
      [null, null],
      ["Jane", "jane@test.com"],
    ]);

    const rows = await parser.parse(buffer);

    expect(rows).toHaveLength(2);
  });

  it("keeps numbers", async () => {
    const buffer = await createWorkbook([["Age"], [22]]);

    const rows = await parser.parse(buffer);

    expect(rows).toEqual([
      {
        Age: 22,
      },
    ]);
  });

  it("keeps booleans", async () => {
    const buffer = await createWorkbook([["Active"], [true]]);

    const rows = await parser.parse(buffer);

    expect(rows).toEqual([
      {
        Active: true,
      },
    ]);
  });

  it("returns null for empty cells", async () => {
    const buffer = await createWorkbook([
      ["Name", "Email"],
      ["John", null],
    ]);

    const rows = await parser.parse(buffer);

    expect(rows[0]).toEqual({
      Name: "John",
      Email: null,
    });
  });
});
