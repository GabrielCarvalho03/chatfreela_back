import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FirebaseConfigService } from "../firebase/firebase.service";

@Controller("/auth/validate")
export class AuthValidateTokenController {
  constructor(
    private jwtService: JwtService,
    private firebase: FirebaseConfigService,
  ) {}

  @Post()
  async validateToken(@Body() body: { token: string }) {
    try {
      const token = this.jwtService.decode(body.token);
      if (!token || typeof token === "string") {
        throw new HttpException("Token inválido", HttpStatus.BAD_REQUEST);
      }

      const expirationDate = new Date(token.exp * 1000); // exp vem em segundos, precisa converter para milliseconds
      const now = new Date();
      const isExpired = now > expirationDate;

      if (isExpired) {
        throw new HttpException("Token expirado", HttpStatus.UNAUTHORIZED);
      }

      const userId = token.sub;
      const userDoc = await this.firebase
        .collection("users")
        .where("id", "==", userId)
        .get();

      if (userDoc.empty) {
        throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
      }

      const userData = userDoc.docs[0].data();

      return {
        message: "Token válido",
        data: {
          ...userData,
          isValid: true,
          userId: token.sub,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Erro ao validar token:", error);
      throw new HttpException(
        "Erro ao validar token",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
