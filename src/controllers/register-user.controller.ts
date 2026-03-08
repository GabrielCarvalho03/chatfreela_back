import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { FirebaseConfigService } from "../firebase/firebase.service";
import { JwtPayload } from "./Login-user.controller";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuid } from "uuid";
import * as bcrypt from "bcryptjs";

export type RegisterFormDto = {
  countryCode: string;
  email: string;
  fullName: string;
  password: string;
  phone: string;
};

@Controller("/register")
export class RegisterUserController {
  constructor(
    private firebase: FirebaseConfigService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async RegisterUser(@Body() registerUser: RegisterFormDto) {
    try {
      const userCollection = this.firebase.collection("users");
      const userExist = await userCollection
        .where("email", "==", registerUser.email)
        .get();

      if (userExist.docs.length > 0) {
        console.log("User already exists with email:", userExist);
        throw new HttpException("User already exists", HttpStatus.CONFLICT);
      }
      const uuidUser = uuid();
      const hashedPassword = await bcrypt.hash(registerUser.password, 8);
      const newUser = {
        countryCode: registerUser.countryCode,
        email: registerUser.email,
        fullName: registerUser.fullName,
        phone: registerUser.phone,
        id: uuidUser,
      };

      await userCollection.add({
        ...newUser,
        id: uuidUser,
        password: hashedPassword,
      });

      const payload: JwtPayload = {
        sub: uuidUser,
        email: registerUser.email,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        message: "User Cadastrado com sucesso",
        data: newUser,
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Error registering user:", error);
      throw new HttpException("Erro interno", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
