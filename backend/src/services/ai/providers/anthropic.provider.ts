import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { PromptBuilder } from "../prompts/prompt.builder.js";
import { aiConfig } from "../ai.config.js";
import { AIProvider } from "./provider.interface.js";

//NOTE - NOT TESTED DUE TO LACK OF API KEY
const client = new Anthropic({
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

export class AnthropicProvider implements AIProvider {
  async inferMapping(
    headers: string[],
    rows: Record<string, unknown>[],
  ): Promise<Record<string, string>> {
    console.log("AnthropicProvider.inferMapping initiated");

    const prompt = PromptBuilder.build(headers, rows);

    try {
      const response = await client.messages.create({
        model: aiConfig.model,
        max_tokens: aiConfig.maxTokens,
        temperature: aiConfig.temperature,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        tools: [
          {
            name: "header_mapping",
            description:
              "Return the mapping between CSV headers and CRM fields.",
            input_schema: {
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
                  },
                },
              },
              required: ["mappings"],
            },
          },
        ],
        tool_choice: {
          type: "tool",
          name: "header_mapping",
        },
      });

      const toolUse = response.content.find(
        (block: any) => block.type === "tool_use",
      );

      if (!toolUse) {
        throw new Error("Claude did not return a tool call.");
      }

      const parsed = HeaderMappingArraySchema.parse(toolUse.input);

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
