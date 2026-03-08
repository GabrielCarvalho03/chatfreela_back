import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { OpenAiModule } from "./openai/openai.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    FirebaseModule,
    OpenAiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
