import { HeaderLookup } from "../utils/header.lookup.js";
import { MatchResult } from "../types/types.js";
export class HeaderMatcher {
  constructor(private readonly lookup: HeaderLookup) {}

  match(headers: string[]): MatchResult {
    const mapping: Record<string, string> = {};
    const unmatched: string[] = [];

    for (const header of headers) {
      const target = this.lookup.get(header);

      if (target) {
        mapping[header] = target;
      } else {
        unmatched.push(header);
      }
    }

    return {
      mapping,
      unmatched,
    };
  }
}
