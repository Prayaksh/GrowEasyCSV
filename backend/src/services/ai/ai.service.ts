import { HeaderMapping } from "../../types/types.js";
import { AIFactory } from "./ai.factory.js";

export class AIService {
  private provider = AIFactory.create();

  async inferMapping(
    headers: string[],
    rows: Record<string, unknown>[],
  ): Promise<HeaderMapping> {
    console.log("AIService.inferMapping initated");
    return await this.provider.inferMapping(headers, rows);
  }
}
