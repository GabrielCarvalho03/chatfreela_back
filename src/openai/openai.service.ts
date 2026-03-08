import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OpenAI } from "openai";
import { Env } from "../env";

@Injectable()
export class OpenAiConfigService {
  private openai: OpenAI;

  constructor(private configService: ConfigService<Env, true>) {
    this.openai = new OpenAI({
      apiKey: configService.get("OPENAI_API_KEY", { infer: true }),
    });
  }

  getclient() {
    return this.openai;
  }

  async generateChatResponse(messages: { role: string; content: string }[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Oiii",
          },
          {
            role: "user",
            content: "Oiii",
          },
        ],
        temperature: 0.7,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("Error generating chat response:", error);
      throw new Error("Failed to generate chat response");
    }

    return;
  }
}
