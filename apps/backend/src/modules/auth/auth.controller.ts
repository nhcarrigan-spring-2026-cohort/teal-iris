import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import type { Request as ExpressRequest, Response as ExpressResponse } from "express";

import { AuthService, SafeUser } from "./auth.service.js";
import { UsersService, User } from "../users/users.service.js";
import { ConfigService } from "@nestjs/config";

import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";

import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import { GoogleAuthGuard } from "./guards/google-auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  // --- Local Authentication ---
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: { user: SafeUser }, @Body() _dto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: { user: SafeUser }) {
    return req.user;
  }

  // --- Google OAuth ---
  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {
    // GoogleAuthGuard handles redirect to Google
  }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    const user = req.user as User;

    if (!user) {
      res
        .status(401)
        .send("Authentication failed: No user information provided.");
      return;
    }

    // Generate JWT
    const token = this.authService.generateJwt(user);

    // Redirect to frontend with JWT
    const frontendUrl =
      this.configService.get<string>("FRONTEND_CALLBACK_URL") ||
      "http://localhost:3000/auth/callback";

    res.redirect(`${frontendUrl}?token=${token}`);
  }

  @Get("verify")
  async verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }
}