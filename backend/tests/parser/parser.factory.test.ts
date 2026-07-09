import { describe, expect, it } from "vitest";
import { ParserFactory } from "../../src/parsers/parser.factory.js";
import { CSVParser } from "../../src/parsers/csv.parser.js";
import { ExcelParser } from "../../src/parsers/excel.parser.js";

describe("ParserFactory", () => {
  it("creates csv parser", () => {
    expect(ParserFactory.create("file.csv")).toBeInstanceOf(CSVParser);
  });

  it("creates xlsx parser", () => {
    expect(ParserFactory.create("file.xlsx")).toBeInstanceOf(ExcelParser);
  });

  it("creates xls parser", () => {
    expect(ParserFactory.create("file.xls")).toBeInstanceOf(ExcelParser);
  });

  it("supports uppercase extensions", () => {
    expect(ParserFactory.create("FILE.CSV")).toBeInstanceOf(CSVParser);
  });

  it("throws for unsupported extension", () => {
    expect(() => ParserFactory.create("file.pdf")).toThrow(
      "Unsupported file type: .pdf",
    );
  });

  it("throws when filename has no extension", () => {
    expect(() => ParserFactory.create("file")).toThrow();
  });
});
