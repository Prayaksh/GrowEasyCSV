import { beforeEach, describe, expect, it, vi } from "vitest";

const inferMapping = vi.fn();

vi.mock("../../src/services/ai/ai.factory.js", () => ({
  AIFactory: {
    create: () => ({
      inferMapping,
    }),
  },
}));

import { AIService } from "../../src/services/ai/ai.service.js";

describe("AIService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates inference to provider", async () => {
    inferMapping.mockResolvedValue({
      Name: "name",
    });

    const service = new AIService();

    const result = await service.inferMapping(
      ["Name"],
      [
        {
          Name: "John",
        },
      ],
    );

    expect(result).toEqual({
      Name: "name",
    });

    expect(inferMapping).toHaveBeenCalledTimes(1);
  });

  it("passes headers and rows", async () => {
    inferMapping.mockResolvedValue({});

    const headers = ["Email"];
    const rows = [
      {
        Email: "john@test.com",
      },
    ];

    const service = new AIService();

    await service.inferMapping(headers, rows);

    expect(inferMapping).toHaveBeenCalledWith(headers, rows);
  });
});
