import { describe, expect, it } from "vitest";
import { PromptBuilder } from "../../src/services/ai/prompts/prompt.builder.ts";

describe("PromptBuilder", () => {
  it("includes uploaded headers", () => {
    const prompt = PromptBuilder.build(["Name", "Email"], []);

    expect(prompt).toContain('"Name"');
    expect(prompt).toContain('"Email"');
  });

  it("includes sample rows", () => {
    const prompt = PromptBuilder.build(
      ["Name"],
      [
        {
          Name: "John Doe",
        },
      ],
    );

    expect(prompt).toContain("John Doe");
  });

  it("contains all CRM schema fields", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain("created_at");
    expect(prompt).toContain("name");
    expect(prompt).toContain("email");
    expect(prompt).toContain("country_code");
    expect(prompt).toContain("mobile_without_country_code");
    expect(prompt).toContain("company");
    expect(prompt).toContain("city");
    expect(prompt).toContain("state");
    expect(prompt).toContain("country");
    expect(prompt).toContain("lead_owner");
    expect(prompt).toContain("crm_status");
    expect(prompt).toContain("crm_note");
    expect(prompt).toContain("data_source");
    expect(prompt).toContain("possession_time");
    expect(prompt).toContain("description");
  });

  it("contains mapping rules", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain("Only map when confidence is high.");
    expect(prompt).toContain("Never invent CRM fields.");
    expect(prompt).toContain("If no mapping exists, set crmField to null.");
    expect(prompt).toContain("Use sample values to infer meaning.");
    expect(prompt).toContain("Return every input header exactly once.");
  });

  it("contains uploaded headers section", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain("Uploaded Headers:");
  });

  it("contains sample rows section", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain("Sample Rows(context):");
  });

  it("contains sample output format", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain('"mappings"');
    expect(prompt).toContain('"csvHeader"');
    expect(prompt).toContain('"crmField"');
    expect(prompt).toContain('"work_email"');
    expect(prompt).toContain('"organisation"');
    expect(prompt).toContain('"email"');
    expect(prompt).toContain('"company"');
  });

  it("starts with the expected system instruction", () => {
    const prompt = PromptBuilder.build([], []);

    expect(prompt).toContain(
      "You are mapping uploaded CSV headers to a CRM schema.",
    );
  });
});
