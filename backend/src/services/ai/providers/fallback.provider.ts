import { generateText, Output } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

import { AIProvider } from "./provider.interface.js";
import { PromptBuilder } from "../prompts/prompt.builder.js";
import { aiConfig } from "../ai.config.js";

const openrouter = createOpenRouter({
  apiKey: aiConfig.apiKey,
});

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

const HeaderMappingArraySchema = z.object({
  mappings: z.array(
    z.object({
      csvHeader: z.string(),
      crmField: CRMFieldSchema,
    }),
  ),
});

export class FallbackProvider implements AIProvider {
  constructor(
    private readonly model = openrouter.languageModel(
      aiConfig.model || "openrouter/free",
    ),
  ) {}

  async inferMapping(
    headers: string[],
    rows: Record<string, unknown>[],
  ): Promise<Record<string, string>> {
    const prompt = PromptBuilder.build(headers, rows);

    try {
      const { output } = await generateText({
        model: this.model,
        prompt,
        output: Output.object({
          schema: HeaderMappingArraySchema,
        }),
        temperature: aiConfig.temperature,
        maxRetries: aiConfig.maxRetries,
        maxOutputTokens: aiConfig.maxTokens,
        abortSignal: AbortSignal.timeout(aiConfig.timeoutMs),
      });

      if (output.mappings.length === 0) {
        throw new Error("AI returned an empty mapping.");
      }

      return Object.fromEntries(
        output.mappings.map(({ csvHeader, crmField }) => [csvHeader, crmField]),
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to infer header mapping: ${error.message}`);
      }

      throw new Error("Failed to infer header mapping.");
    }
  }
}
