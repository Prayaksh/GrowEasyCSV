import { describe, expect, it } from "vitest";
import { z } from "zod";

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

import { extractJSONObject } from "../../src/utils/json.extractor";

/**
 * Same implementation as the provider.
 * If you later export the method into a utility,
 * simply import it here instead.
 */
describe("FallbackProvider JSON extraction", () => {
  it("parses plain JSON", () => {
    const text = `
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "email"
    }
  ]
}
`;

    expect(extractJSONObject(text)).toEqual({
      mappings: [
        {
          csvHeader: "Email",
          crmField: "email",
        },
      ],
    });
  });

  it("parses JSON wrapped in markdown", () => {
    const text = `
Here is the mapping.

\`\`\`json
{
  "mappings": [
    {
      "csvHeader": "Work Email",
      "crmField": "email"
    }
  ]
}
\`\`\`
`;

    expect(extractJSONObject(text)).toEqual({
      mappings: [
        {
          csvHeader: "Work Email",
          crmField: "email",
        },
      ],
    });
  });

  it("parses JSON after explanatory text", () => {
    const text = `
Based on the uploaded CSV, this is my best guess.

{
  "mappings": [
    {
      "csvHeader": "Organisation",
      "crmField": "company"
    }
  ]
}
`;

    expect(extractJSONObject(text)).toEqual({
      mappings: [
        {
          csvHeader: "Organisation",
          crmField: "company",
        },
      ],
    });
  });

  it("ignores surrounding text", () => {
    const text = `
The following mapping should work.

{
  "mappings": [
    {
      "csvHeader": "City",
      "crmField": "city"
    }
  ]
}

Hope this helps!
`;

    expect(extractJSONObject(text)).toEqual({
      mappings: [
        {
          csvHeader: "City",
          crmField: "city",
        },
      ],
    });
  });

  it("parses nested JSON correctly", () => {
    const text = `
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "email",
      "metadata": {
        "confidence": 0.95
      }
    }
  ]
}
`;

    expect(extractJSONObject(text)).toEqual({
      mappings: [
        {
          csvHeader: "Email",
          crmField: "email",
          metadata: {
            confidence: 0.95,
          },
        },
      ],
    });
  });

  it("returns null when no JSON exists", () => {
    const text = `
I could not confidently determine any mapping.
`;

    expect(extractJSONObject(text)).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    const text = `
{
  "mappings": [
`;

    expect(extractJSONObject(text)).toBeNull();
  });

  it("returns null for incomplete JSON", () => {
    const text = `
{
  "mappings": [
    {
      "csvHeader": "Email"
`;

    expect(extractJSONObject(text)).toBeNull();
  });

  it("returns the first JSON object when multiple objects exist", () => {
    const text = `
{
  "foo": "bar"
}

Some explanation...

{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "email"
    }
  ]
}
`;

    expect(extractJSONObject(text)).toEqual({
      foo: "bar",
    });
  });

  it("normalizes top-level JSON arrays into mappings", () => {
    const text = `
[
  {
    "csvHeader": "Email",
    "crmField": "email"
  }
]
`;

    expect(extractJSONObject(text)).toEqual({
      mappings: [
        {
          csvHeader: "Email",
          crmField: "email",
        },
      ],
    });
  });

  it("passes schema validation for a valid mapping", () => {
    const parsed = extractJSONObject(`
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "email"
    },
    {
      "csvHeader": "Organisation",
      "crmField": "company"
    }
  ]
}
`);

    const result = HeaderMappingArraySchema.safeParse(parsed);

    expect(result.success).toBe(true);
  });

  it("fails schema validation for an invalid CRM field", () => {
    const parsed = extractJSONObject(`
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "invalid_field"
    }
  ]
}
`);

    const result = HeaderMappingArraySchema.safeParse(parsed);

    expect(result.success).toBe(false);
  });

  it("fails schema validation when mappings property is missing", () => {
    const parsed = extractJSONObject(`
{
  "foo": "bar"
}
`);

    const result = HeaderMappingArraySchema.safeParse(parsed);

    expect(result.success).toBe(false);
  });
});
