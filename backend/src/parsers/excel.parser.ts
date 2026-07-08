import ExcelJS from "exceljs";

import { IParser } from "./parser.interface.js";

type ParsedRow = Record<string, unknown>;

export class ExcelParser implements IParser<ParsedRow> {
  async parse(buffer: Buffer): Promise<ParsedRow[]> {
    const workbook = await this.loadWorkbook(buffer);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      return [];
    }

    const rows: ParsedRow[] = [];
    let headers: string[] = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const values = (row.values as ExcelJS.CellValue[]).slice(1);
      if (rowNumber === 1) {
        headers = values.map((value) => String(value ?? "").trim());
        return;
      }
      const rowData: ParsedRow = {};
      headers.forEach((header, index) => {
        if (!header) return;
        rowData[header] = this.getCellValue(values[index]);
      });

      const hasData = Object.values(rowData).some(
        (value) => value !== null && value !== "",
      );

      if (hasData) {
        rows.push(rowData);
      }
    });

    return rows;
  }

  private async loadWorkbook(buffer: Buffer): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(
      buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
    );

    return workbook;
  }

  private getCellValue(cell: ExcelJS.CellValue): unknown {
    if (cell == null) {
      return null;
    }

    if (typeof cell === "object" && "result" in cell) {
      return cell.result ?? null;
    }

    if (typeof cell === "object" && "text" in cell) {
      return cell.text;
    }

    if (typeof cell === "object" && "richText" in cell) {
      return cell.richText.map((part) => part.text).join("");
    }

    return cell;
  }
}
