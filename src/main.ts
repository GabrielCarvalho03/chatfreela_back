import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3333);
}

// Handler para Vercel
export default async function handler(req: any, res: any) {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    // Configurar como aplicação Express
    const expressApp = app.getHttpAdapter().getInstance();

    await app.init();

    // Para debug
    console.log(`Request: ${req.method} ${req.url}`);

    // Processar a requisição
    return expressApp(req, res);
  } catch (error: any) {
    console.error("Handler error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
}

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  bootstrap();
}
