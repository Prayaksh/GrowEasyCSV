import OpenAI from "openai";
import { z } from "zod";

import { AIProvider } from "./provider.interface.js";
import { PromptBuilder } from "../prompts/prompt.builder.js";
import { aiConfig } from "../ai.config.js";

const client = new OpenAI({
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

export class OpenAIProvider implements AIProvider {
  async inferMapping(
    headers: string[],
    rows: Record<string, unknown>[],
  ): Promise<Record<string, string>> {
    console.log("OpenAIProvider.inferMapping initiated");

    const prompt = PromptBuilder.build(headers, rows);

    try {
      const response = await client.responses.create({
        model: aiConfig.model,
        input: prompt,
        temperature: aiConfig.temperature,
        max_output_tokens: aiConfig.maxTokens,

        text: {
          format: {
            type: "json_schema",
            name: "header_mapping",
            strict: true,
            schema: {
              type: "object",
              properties: {
                mappings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      csvHeader: {
                        type: "string",
                      },
                      crmField: {
                        type: "string",
                        enum: [
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
                        ],
                      },
                    },
                    required: ["csvHeader", "crmField"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["mappings"],
              additionalProperties: false,
            },
          },
        },
      });

      const parsed = HeaderMappingArraySchema.parse(
        JSON.parse(response.output_text),
      );

      const result: Record<string, string> = {};

      for (const mapping of parsed.mappings) {
        result[mapping.csvHeader] = mapping.crmField;
      }

      return result;
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        throw new Error(`Failed to infer header mapping: ${error.message}`);
      }

      throw new Error("Failed to infer header mapping.");
    }
  }
}
