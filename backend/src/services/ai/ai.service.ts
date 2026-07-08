import { AIFactory } from "./ai.factory.js";

export class AIService {
  private provider = AIFactory.create();

  async inferMapping(headers: any, rows: any) {
    return this.provider.inferMapping(headers, rows);
  }
}
