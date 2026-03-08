import { Global, Module } from "@nestjs/common";
import { OpenAiConfigService } from "./openai.service";

@Global()
@Module({
  providers: [OpenAiConfigService],
  exports: [OpenAiConfigService],
})
export class OpenAiModule {}
