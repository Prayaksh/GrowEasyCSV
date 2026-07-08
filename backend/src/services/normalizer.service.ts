import { HeaderNormalizer } from "../normalizers/header.normalizer.js";
import { ValueNormalizer } from "../normalizers/value.normalizer.js";

export class NormalizerService {
  private headerNormalizer;
  private valueNormalizer;

  constructor() {
    this.headerNormalizer = new HeaderNormalizer();
    this.valueNormalizer = new ValueNormalizer();
  }

  normalize(rows: Record<string, unknown>[]) {
    let normalized = this.headerNormalizer.normalize(rows);

    normalized = this.valueNormalizer.normalize(normalized);

    return normalized;
  }
}
