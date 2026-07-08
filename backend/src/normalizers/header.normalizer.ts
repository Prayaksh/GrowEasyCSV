import { HEADER_ALIASES } from "../ constants/header.js";

export class HeaderNormalizer {
  private aliasMap: Map<string, string>;

  constructor() {
    this.aliasMap = new Map();

    for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
      aliases.forEach((alias) => {
        this.aliasMap.set(this.clean(alias), canonical);
      });
    }
  }

  normalize(rows: Record<string, unknown>[]) {
    return rows.map((row) => {
      const normalized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        const cleaned = this.clean(key);
        const canonical =
          this.aliasMap.get(cleaned) ?? cleaned.replace(/\s+/g, "_");
        normalized[canonical] = value;
      }

      return normalized;
    });
  }

  private clean(header: string) {
    return header
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");
  }
}
