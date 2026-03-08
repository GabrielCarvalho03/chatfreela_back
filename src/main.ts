import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get("PORT", { infer: true });

  console.log(`🚀Server is running on port ${port}`);
  await app.listen(port);
}

// Cache para Vercel (serverless)
let cachedApp: any;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule);
    cachedApp.enableCors();
    await cachedApp.init();
  }

  return cachedApp.getHttpAdapter().getInstance()(req, res);
}

// Para desenvolvimento local
if (require.main === module) {
  bootstrap();
}
