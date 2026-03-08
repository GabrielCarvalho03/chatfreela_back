import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FirebaseConfigService } from "./firebase.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FirebaseConfigService],
  exports: [FirebaseConfigService],
})
export class FirebaseModule {}
