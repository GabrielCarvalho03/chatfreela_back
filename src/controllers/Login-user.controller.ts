import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FirebaseConfigService } from "../firebase/firebase.service";
import bcrypt from "bcryptjs";

type LoginUserDto = {
  email: string;
  password: string;
};

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  iat?: number;
  exp?: number;
}

@Controller("/login")
export class LoginController {
  constructor(
    private firebase: FirebaseConfigService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async LoginUser(@Body() loginUser: LoginUserDto) {
    try {
      const userCollection = this.firebase.collection("users");

      const userExist = await userCollection
        .where("email", "==", loginUser.email)
        .get();

      if (userExist.empty) {
        throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
      }
      const userData = userExist.docs[0].data();

      const isPasswordValid = await bcrypt.compare(
        loginUser.password,
        userData.password,
      );

      if (!isPasswordValid) {
        throw new HttpException("Senha incorreta", HttpStatus.UNAUTHORIZED);
      }

      const { password, ...userWithoutPassword } = userData;

      const payload: JwtPayload = {
        sub: userExist.docs[0].data().id,
        email: userData.email,
      };

      const token = await this.jwtService.signAsync(payload);
      return {
        message: "Usuário logado com sucesso",
        data: userWithoutPassword,
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Caso contrário, é erro interno
      console.error("Login error:", error);
      throw new HttpException("Erro interno", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
