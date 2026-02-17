// apps/backend/src/modules/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request as ExpressRequest, Response } from "express";
import { AuthService, SafeUser } from "./auth.service.js";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- Local Auth ---

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: { user: SafeUser }, @Body() _dto: LoginDto) {
    // LoginDto is passed here so class-validator can validate the body
    // req.user is populated by LocalStrategy
    return this.authService.login(req.user as SafeUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: { user: SafeUser }) {
    return req.user;
  }

  // --- Google OAuth ---

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // Guard handles the redirect automatically
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req: ExpressRequest, @Res() res: Response) {
    // req.user is populated by GoogleStrategy validate()
    // For now, we follow the existing redirect logic
    // res.redirect(`http://localhost:3000/auth/callback?token=FAKE_TOKEN`);

    // In a real scenario, we would generate a real JWT here:
    const result = await this.authService.login(req.user as SafeUser);
    res.redirect(
      `http://localhost:3000/auth/callback?token=${result.accessToken}`,
    );
  }
}
