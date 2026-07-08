import { parse } from "csv-parse/sync";
import { IParser } from "./parser.interface.js";

export class CSVParser implements IParser {
  async parse(buffer: Buffer): Promise<Record<string, unknown>[]> {
    const rows = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, unknown>[];

    return rows;
  }
}
