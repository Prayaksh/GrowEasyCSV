import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("ai", () => ({
  generateText: vi.fn(),
  Output: {
    object: vi.fn(() => ({})),
  },
}));

import { generateText } from "ai";
import { FallbackProvider } from "../../src/services/ai/providers/fallback.provider.js";

describe("FallbackProvider", () => {
  const mockModel = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns mapping", async () => {
    vi.mocked(generateText).mockResolvedValue({
      output: {
        mappings: [
          {
            csvHeader: "Name",
            crmField: "name",
          },
          {
            csvHeader: "Email",
            crmField: "email",
          },
        ],
      },
    } as any);

    const provider = new FallbackProvider(mockModel);

    const result = await provider.inferMapping(["Name", "Email"], []);

    expect(result).toEqual({
      Name: "name",
      Email: "email",
    });
  });

  it("throws on empty mapping", async () => {
    vi.mocked(generateText).mockResolvedValue({
      output: {
        mappings: [],
      },
    } as any);

    const provider = new FallbackProvider(mockModel);

    await expect(provider.inferMapping([], [])).rejects.toThrow(
      "Failed to infer header mapping: AI returned an empty mapping.",
    );
  });

  it("wraps SDK errors", async () => {
    vi.mocked(generateText).mockRejectedValue(new Error("Timeout"));

    const provider = new FallbackProvider(mockModel);

    await expect(provider.inferMapping([], [])).rejects.toThrow(
      "Failed to infer header mapping: Timeout",
    );
  });

  it("calls generateText exactly once", async () => {
    vi.mocked(generateText).mockResolvedValue({
      output: {
        mappings: [
          {
            csvHeader: "Email",
            crmField: "email",
          },
        ],
      },
    } as any);

    const provider = new FallbackProvider(mockModel);

    await provider.inferMapping(["Email"], []);

    expect(generateText).toHaveBeenCalledTimes(1);
  });

  it("passes the injected model", async () => {
    vi.mocked(generateText).mockResolvedValue({
      output: {
        mappings: [
          {
            csvHeader: "Email",
            crmField: "email",
          },
        ],
      },
    } as any);

    const provider = new FallbackProvider(mockModel);

    await provider.inferMapping(["Email"], []);

    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: mockModel,
      }),
    );
  });
});
