import { OpenAI } from "./deps.ts";

export class OpenAIProxy {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for Deno
    });
  }

  /**
   * Forward requests to OpenAI API
   * @param endpoint - The OpenAI API endpoint to call (e.g., 'chat/completions')
   * @param requestData - The request payload to send to OpenAI
   * @returns The response from OpenAI
   */
  async forward(endpoint: string, requestData: any): Promise<any> {
    // Handle different endpoints appropriately
    switch (endpoint) {
      case "chat/completions":
        return await this.client.chat.completions.create(requestData);

      case "completions":
        return await this.client.completions.create(requestData);

      case "embeddings":
        return await this.client.embeddings.create(requestData);

      case "images/generations":
        return await this.client.images.generate(requestData);

      case "audio/transcriptions":
        return await this.client.audio.transcriptions.create(requestData);

      case "audio/translations":
        return await this.client.audio.translations.create(requestData);

      case "moderations":
        return await this.client.moderations.create(requestData);

      default:
        // For any other endpoints, try to dynamically call them
        try {
          // This is a fallback for endpoints not explicitly handled
          const path = endpoint.split("/");
          let current: any = this.client;

          for (const segment of path) {
            if (!current[segment]) {
              throw new Error(`Unknown API endpoint: ${endpoint}`);
            }
            current = current[segment];
          }

          if (typeof current.create === "function") {
            return await current.create(requestData);
          } else {
            throw new Error(`Unsupported OpenAI API endpoint: ${endpoint}`);
          }
        } catch (error) {
          throw new Error(
            `Failed to call OpenAI API endpoint ${endpoint}: ${error.message}`
          );
        }
    }
  }
}
