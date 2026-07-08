import { redis } from "./redis.js";
import { HeaderMapping } from "../../types/types.js";

export class CacheService {
  async get(key: string): Promise<HeaderMapping | null> {
    console.log("CacheService.get initiated");
    const value = await redis.get(key);
    console.log("Cached value:", value);

    if (!value) {
      console.log("couldnot find the value");
      return null;
    }

    return JSON.parse(value) as HeaderMapping;
  }

  async set(key: string, mapping: HeaderMapping): Promise<void> {
    console.log("CacheService.set initiated");
    console.log("Mapping to be stored:", mapping);
    await redis.set(key, JSON.stringify(mapping), {
      EX: 60 * 60 * 24 * 30, // 30 days
    });
  }

  async has(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }
}
