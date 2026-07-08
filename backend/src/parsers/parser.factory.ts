import path from "path";

import { IParser } from "./parser.interface.js";
import { CSVParser } from "./csv.parser.js";
import { ExcelParser } from "./excel.parser.js";

export class ParserFactory {
  static create(filename: string): IParser {
    const ext = path.extname(filename).toLowerCase();

    switch (ext) {
      case ".csv":
        return new CSVParser();

      case ".xlsx":
      case ".xls":
        return new ExcelParser();

      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }
}
