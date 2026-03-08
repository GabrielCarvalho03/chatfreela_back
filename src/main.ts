import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get("PORT", { infer: true });

  console.log(`🚀Server is running on port ${port}`);
  await app.listen(port);
}

// Para Vercel (serverless)
let server: any;

export default async function handler(req: any, res: any) {
  if (!server) {
    const express = require("express");
    const expressServer = express();

    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressServer),
    );

    app.enableCors();
    app.setGlobalPrefix("api"); // opcional: adicionar prefixo

    await app.init();

    server = expressServer;
  }

  return server(req, res);
}

// Para desenvolvimento local
if (require.main === module) {
  bootstrap();
}
