import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { Env } from "src/env";

@Injectable()
export class FirebaseConfigService {
  private db!: FirebaseFirestore.Firestore;

  constructor(private configService: ConfigService<Env, true>) {}

  getFirebaseCredentials() {
    // Corrigido o nome do método
    return {
      projectId: this.configService.get("FIREBASE_PROJECT_ID", { infer: true }),
      clientEmail: this.configService.get("FIREBASE_CLIENT_EMAIL", {
        infer: true,
      }),
      privateKey: this.configService
        .get("FIREBASE_PRIVATE_KEY", { infer: true })
        ?.replace(/\\n/g, "\n"), // Adicionado ? para segurança
    };
  }

  initializeFirebase() {
    // Corrigido o nome do método
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(this.getFirebaseCredentials()),
        // Removi databaseURL porque não é necessário para Firestore
      });
    }

    this.db = admin.firestore();
    return this.db;
  }

  getFirestore() {
    if (!this.db) {
      this.initializeFirebase();
    }
    return this.db;
  }

  collection(name: string) {
    return this.getFirestore().collection(name);
  }
}
