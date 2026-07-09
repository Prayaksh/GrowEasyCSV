import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/cache/redis.js", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    exists: vi.fn(),
    del: vi.fn(),
  },
}));

import { redis } from "../../src/services/cache/redis.js";
import { CacheService } from "../../src/services/cache/cache.service.js";

describe("CacheService", () => {
  const service = new CacheService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when cache misses", async () => {
    vi.mocked(redis.get).mockResolvedValue(null);

    await expect(service.get("abc")).resolves.toBeNull();
  });

  it("returns parsed mapping", async () => {
    vi.mocked(redis.get).mockResolvedValue(
      JSON.stringify({
        Name: "name",
      }),
    );

    await expect(service.get("abc")).resolves.toEqual({
      Name: "name",
    });
  });

  it("stores mapping", async () => {
    vi.mocked(redis.get).mockResolvedValue("{}");

    await service.set("abc", {
      Name: "name",
    });

    expect(redis.set).toHaveBeenCalled();
  });

  it("checks existence", async () => {
    vi.mocked(redis.exists).mockResolvedValue(1);

    await expect(service.has("abc")).resolves.toBe(true);
  });

  it("deletes cache", async () => {
    await service.delete("abc");

    expect(redis.del).toHaveBeenCalledWith("abc");
  });
});
