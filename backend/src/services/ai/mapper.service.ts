import { HeaderMapping } from "../../types/types.js";

export class MappingService {
  apply(rows: Record<string, unknown>[], mapping: HeaderMapping) {
    return rows.map((row) => {
      const mapped: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        const target = mapping[key];
        if (!target) continue;
        mapped[target] = value;
      }
      return mapped;
    });
  }
}
