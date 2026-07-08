export interface IParser<T = Record<string, unknown>> {
  parse(buffer: Buffer): Promise<T[]>;
}
