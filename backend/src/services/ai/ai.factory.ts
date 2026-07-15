// import { AnthropicProvider } from "./providers/anthropic.provider.js";
import { FallbackProvider } from "./providers/fallback.provider.js";
// import { GeminiProvider } from "./providers/gemini.provider.js";
// import { OpenAIProvider } from "./providers/openai.provider.js";
import { AIProvider } from "./providers/provider.interface.js";
import { aiConfig } from "./ai.config.js";

export class AIFactory {
  static create(): AIProvider {
    switch (aiConfig.provider) {
      // case "gemini":
      //   return new GeminiProvider();

      // case "openai":
      //   return new OpenAIProvider();

      // case "anthropic":
      //   return new AnthropicProvider();

      case "fallback":
        return new FallbackProvider();

      default:
        throw new Error("Unsupported provider");
    }
  }
}
