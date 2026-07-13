import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

import { generateText } from "ai";
import { FallbackProvider } from "../../src/services/ai/providers/fallback.provider.js";

describe("FallbackProvider", () => {
  const mockModel = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mapping from valid JSON response", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: `
{
  "mappings": [
    {
      "csvHeader": "Name",
      "crmField": "name"
    },
    {
      "csvHeader": "Email",
      "crmField": "email"
    }
  ]
}
`,
    } as any);

    const provider = new FallbackProvider(mockModel);

    const result = await provider.inferMapping(["Name", "Email"], []);

    expect(result).toEqual({
      Name: "name",
      Email: "email",
    });
  });

  it("parses markdown wrapped JSON", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: `
Here's the mapping.

\`\`\`json
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "email"
    }
  ]
}
\`\`\`
`,
    } as any);

    const provider = new FallbackProvider(mockModel);

    const result = await provider.inferMapping(["Email"], []);

    expect(result).toEqual({
      Email: "email",
    });
  });

  it("returns empty object when JSON cannot be extracted", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: "Sorry, I could not determine the mapping.",
    } as any);

    const provider = new FallbackProvider(mockModel);

    const result = await provider.inferMapping([], []);

    expect(result).toEqual({});
  });

  it("returns empty object for invalid schema", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: `
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "not_a_real_field"
    }
  ]
}
`,
    } as any);

    const provider = new FallbackProvider(mockModel);

    const result = await provider.inferMapping([], []);

    expect(result).toEqual({});
  });

  it("returns empty object when mappings array is empty", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: `
{
  "mappings": []
}
`,
    } as any);

    const provider = new FallbackProvider(mockModel);

    const result = await provider.inferMapping([], []);

    expect(result).toEqual({});
  });

  it("returns empty object when generateText throws", async () => {
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    const provider = new FallbackProvider(mockModel);

    const result = await provider.inferMapping([], []);

    expect(result).toEqual({});
  });

  it("calls generateText exactly once", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: `
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "email"
    }
  ]
}
`,
    } as any);

    const provider = new FallbackProvider(mockModel);

    await provider.inferMapping(["Email"], []);

    expect(generateText).toHaveBeenCalledTimes(1);
  });

  it("passes the injected model", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: `
{
  "mappings": [
    {
      "csvHeader": "Email",
      "crmField": "email"
    }
  ]
}
`,
    } as any);

    const provider = new FallbackProvider(mockModel);

    await provider.inferMapping(["Email"], []);

    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: mockModel,
      }),
    );
  });

  it("passes a prompt to generateText", async () => {
    vi.mocked(generateText).mockResolvedValue({
      text: `
{
  "mappings": []
}
`,
    } as any);

    const provider = new FallbackProvider(mockModel);

    await provider.inferMapping([], []);

    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.any(String),
      }),
    );
  });
});
