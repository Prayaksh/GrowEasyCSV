import { redis } from "./redis.js";
import { HeaderMapping } from "../../types/types.js";

export class CacheService {
  async get(fingerprint: string): Promise<HeaderMapping | null> {
    const cached = await redis.get(fingerprint);
    if (!cached) {
      return null;
    }
    return JSON.parse(cached);
  }

  async set(fingerprint: string, mapping: HeaderMapping) {
    await redis.set(fingerprint, JSON.stringify(mapping));
  }
}
