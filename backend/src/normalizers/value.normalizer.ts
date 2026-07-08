import { INormalizer } from "./normalizer.interface.js";

type ParsedRow = Record<string, unknown>;

export class ValueNormalizer implements INormalizer<ParsedRow> {
  normalize(rows: ParsedRow[]): ParsedRow[] {
    return rows.map((row) => {
      const normalized: ParsedRow = {};
      for (const [key, value] of Object.entries(row)) {
        normalized[key] = this.normalizeValue(value);
      }

      return normalized;
    });
  }

  private normalizeValue(value: unknown): unknown {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value !== "string") {
      return value;
    }
    let normalized = value.trim();
    normalized = normalized.replace(/\s+/g, " ");
    if (
      normalized === "" ||
      normalized.toLowerCase() === "n/a" ||
      normalized.toLowerCase() === "na" ||
      normalized.toLowerCase() === "null" ||
      normalized.toLowerCase() === "undefined" ||
      normalized === "-"
    ) {
      return null;
    }
    return normalized;
  }
}
