import dotenv from "dotenv";

dotenv.config();

export const aiConfig = {
  provider: process.env.AI_PROVIDER!,
  apiKey: process.env.AI_API_KEY!,
  model: process.env.AI_MODEL!,
  temperature: Number(process.env.AI_TEMPERATURE ?? 0),
  maxTokens: Number(process.env.AI_MAX_TOKENS ?? 1000),
  timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 30000),
  maxRetries: Number(process.env.AI_MAX_RETRIES ?? 3),
};
