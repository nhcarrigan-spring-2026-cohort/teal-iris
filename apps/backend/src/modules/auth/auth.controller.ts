import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "@nestjs/common";

import { AuthService, SafeUser } from "./auth.service.js";
import { UsersService, User } from "../users/users.service.js";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // optional if needed for OAuth flows
  ) {}

  // =========================
  // REGISTER
  // =========================
  @Post("register")
  async register(@Body() body: RegisterDto): Promise<SafeUser> {
    return this.authService.register(body);
  }

  // =========================
  // VERIFY EMAIL
  // =========================
  @Get("verify-email")
  async verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }
}