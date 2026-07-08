import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

import { AIProvider } from "./provider.interface.js";
import { PromptBuilder } from "../prompts/prompt.builder.js";
import { aiConfig } from "../ai.config.js";

//NOTE - NOT TESTED DUE TO LACK OF API KEY
const ai = new GoogleGenAI({
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

export class GeminiProvider implements AIProvider {
  async inferMapping(
    headers: string[],
    rows: Record<string, unknown>[],
  ): Promise<Record<string, string>> {
    console.log("GeminiProvider.inferMapping initiated");

    const prompt = PromptBuilder.build(headers, rows);

    try {
      const response = await ai.interactions.create({
        model: aiConfig.model,
        input: prompt,
        config: {
          temperature: aiConfig.temperature,
          maxOutputTokens: aiConfig.maxTokens,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mappings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    csvHeader: {
                      type: Type.STRING,
                    },
                    crmField: {
                      type: Type.STRING,
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
