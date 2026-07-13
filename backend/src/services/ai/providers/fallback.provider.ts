import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

import { AIProvider } from "./provider.interface.js";
import { PromptBuilder } from "../prompts/prompt.builder.js";
import { aiConfig } from "../ai.config.js";
import { extractJSONObject } from "../../../utils/json.extractor.js";

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
      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: aiConfig.temperature,
        maxRetries: aiConfig.maxRetries,
        maxOutputTokens: aiConfig.maxTokens,
        abortSignal: AbortSignal.timeout(aiConfig.timeoutMs),
      });

      console.log("Raw AI Response:");
      console.log(text);

      let parsed: unknown;

      try {
        parsed = extractJSONObject(text);
      } catch {
        console.warn("Failed to parse JSON.");
        return {};
      }

      if (!parsed) {
        console.log("Could not parse the json");
        return {};
      }

      const result = HeaderMappingArraySchema.safeParse(parsed);

      if (!result.success) {
        console.warn("JSON did not match expected schema.");
        return {};
      }

      const mapping = Object.fromEntries(
        result.data.mappings
          .filter(
            ({ csvHeader, crmField }) =>
              typeof csvHeader === "string" &&
              CRMFieldSchema.safeParse(crmField).success,
          )
          .map(({ csvHeader, crmField }) => [csvHeader, crmField]),
      );

      console.log("Validated Mapping:");
      console.dir(mapping, { depth: null });

      return mapping;
    } catch (error) {
      console.warn("AI mapping failed.");

      if (error instanceof Error) {
        console.warn(error.message);
      }

      return {};
    }
  }
}
