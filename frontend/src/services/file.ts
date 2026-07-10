import Papa from "papaparse";
import * as XLSX from "xlsx";

import { LocalPreview } from "@/types";

const PREVIEW_ROWS = 20;

export async function readFilePreview(file: File): Promise<LocalPreview> {
  if (isCSV(file)) {
    return readCSVPreview(file);
  }

  if (isExcel(file)) {
    return readExcelPreview(file);
  }

  throw new Error(
    "Unsupported file format. Please upload a CSV or Excel file.",
  );
}

function isCSV(file: File): boolean {
  return file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
}

function isExcel(file: File): boolean {
  return (
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel" ||
    file.name.toLowerCase().endsWith(".xlsx") ||
    file.name.toLowerCase().endsWith(".xls")
  );
}

function readCSVPreview(file: File): Promise<LocalPreview> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      preview: PREVIEW_ROWS,
      transformHeader: (header) => header.trim(),

      complete(results) {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }

        resolve({
          headers: results.meta.fields ?? [],
          rows: results.data,
        });
      },

      error(error) {
        reject(error);
      },
    });
  });
}

async function readExcelPreview(file: File): Promise<LocalPreview> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  if (workbook.SheetNames.length === 0) {
    throw new Error("The uploaded workbook contains no worksheets.");
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return {
    headers,
    rows: rows.slice(0, PREVIEW_ROWS),
  };
}
