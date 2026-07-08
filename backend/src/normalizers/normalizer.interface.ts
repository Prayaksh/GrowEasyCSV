export interface INormalizer<T> {
  normalize(rows: T[]): T[];
}
