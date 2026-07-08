import { Row } from "../types/types.js";
import { HeaderMapping } from "../types/types.js";
export class MappingService {
  apply(rows: Row[], mapping: HeaderMapping): Row[] {
    console.log("MappingService.apply initiateed");
    return rows.map((row) => {
      const mapped: Row = {};
      for (const [sourceHeader, value] of Object.entries(row)) {
        const targetHeader = mapping[sourceHeader];
        if (!targetHeader) {
          continue;
        }
        mapped[targetHeader] = value;
      }
      return mapped;
    });
  }
}
