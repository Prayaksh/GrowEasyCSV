import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import fs from "fs";
import path from "path";

import { CacheService } from "../../src/services/cache/cache.service.js";
import { AIService } from "../../src/services/ai/ai.service.js";

// Spy before importing the app/router
vi.spyOn(CacheService.prototype, "get").mockResolvedValue(null);
vi.spyOn(CacheService.prototype, "set").mockResolvedValue(undefined);

vi.spyOn(AIService.prototype, "inferMapping").mockResolvedValue({
  fullname: "name",
  mail: "email",
});

const { default: app } = await import("../helpers/app.js");

describe("POST /parse", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(CacheService.prototype.get).mockResolvedValue(null);
    vi.mocked(CacheService.prototype.set).mockResolvedValue(undefined);

    vi.mocked(AIService.prototype.inferMapping).mockResolvedValue({
      fullname: "name",
      mail: "email",
    });
  });

  it("returns 400 when no file is uploaded", async () => {
    const res = await request(app).post("/parse");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("parses a valid csv successfully", async () => {
    const file = path.join(process.cwd(), "tests", "fixtures", "sample.csv");

    const res = await request(app).post("/parse").attach("file", file);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.rows)).toBe(true);
    expect(res.body.mapping).toBeDefined();
  });

  it("returns 400 for an empty csv", async () => {
    const file = path.join(process.cwd(), "tests", "fixtures", "empty.csv");

    const res = await request(app).post("/parse").attach("file", file);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("handles invalid csv gracefully", async () => {
    const file = path.join(process.cwd(), "tests", "fixtures", "invalid.csv");

    const res = await request(app).post("/parse").attach("file", file);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.rows)).toBe(true);
  });

  it("parses an xlsx successfully", async () => {
    const file = path.join(process.cwd(), "tests", "fixtures", "sample.xlsx");

    const res = await request(app).post("/parse").attach("file", file);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.rows)).toBe(true);
  });
});
