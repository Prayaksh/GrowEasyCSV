import { HEADER_ALIASES } from "../constants/header.js";
import { HeaderNormalizer } from "../normalizers/header.normalizer.js";

export class HeaderLookup {
  private aliasMap: Map<string, string>;
  private normalizer: HeaderNormalizer;

  constructor(initialAliases: Record<string, string[]> = HEADER_ALIASES) {
    this.normalizer = new HeaderNormalizer();
    this.aliasMap = new Map();
    this.learnMany(initialAliases);
  }

  get(header: string): string | undefined {
    return this.aliasMap.get(this.normalizer.clean(header));
  }

  has(header: string): boolean {
    return this.aliasMap.has(this.normalizer.clean(header));
  }

  learn(header: string, target: string): void {
    this.aliasMap.set(this.normalizer.clean(header), target.trim());
  }

  learnAI(mapping: Record<string, string>) {
    for (const [header, target] of Object.entries(mapping)) {
      this.learn(header, target);
    }
  }

  learnMany(mapping: Record<string, string[]>): void {
    for (const [canonical, aliases] of Object.entries(mapping)) {
      aliases.forEach((alias) => {
        this.learn(alias, canonical);
      });
    }
  }

  all(): Record<string, string> {
    return Object.fromEntries(this.aliasMap);
  }
}
