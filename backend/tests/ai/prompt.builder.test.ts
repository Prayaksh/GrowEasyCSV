import { describe, expect, it } from "vitest";
import { PromptBuilder } from "../../src/services/ai/prompts/prompt.builder.ts";

describe("PromptBuilder", () => {
  it("includes headers", () => {
    const prompt = PromptBuilder.build(["Name", "Email"], []);

    expect(prompt).toContain('"Name"');
    expect(prompt).toContain('"Email"');
  });

  it("includes sample rows", () => {
    const prompt = PromptBuilder.build(
      ["Name"],
      [
        {
          Name: "John",
        },
      ],
    );

    expect(prompt).toContain("John");
  });

  it("contains CRM schema", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain("created_at");
    expect(prompt).toContain("mobile_without_country_code");
    expect(prompt).toContain("crm_note");
  });

  it("contains response section", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain("=== RESPONSE ===");
  });

  it("contains critical instructions", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain("CRITICAL INSTRUCTIONS");
    expect(prompt).toContain("Return ONLY");
  });
});
