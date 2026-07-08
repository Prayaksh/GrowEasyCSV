import { generateText, Output } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

import { AIProvider } from "./provider.interface.js";
import { PromptBuilder } from "../prompts/prompt.builder.js";

const openrouter = createOpenRouter({
  apiKey: process.env.AI_API_KEY!,
});

const model = openrouter.languageModel(
  process.env.AI_MODEL ?? "openrouter/free",
);
const CRMFieldSchema = z.enum([
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description",
]);

const HeaderMappingSchema = z.record(z.string(), CRMFieldSchema);

export class FallbackProvider implements AIProvider {
  async inferMapping(
    headers: string[],
    rows: Record<string, unknown>[],
  ): Promise<Record<string, string>> {
    const prompt = PromptBuilder.build(headers, rows);

    try {
      const { output } = await generateText({
        model,
        prompt,
        output: Output.object({
          schema: HeaderMappingSchema,
        }),
        temperature: 0,
      });

      return output;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to infer header mapping: ${error.message}`);
      }

      throw new Error("Failed to infer header mapping.");
    }
  }
}
