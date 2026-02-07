import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as express from "express";
import { AuthService } from "./auth.service.js";
import { RegisterDto } from "./dto/register.dto.js";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  login(@Req() req: express.Request) {
    return this.authService.login(
      (req as any).user as { id: string; email: string },
    );
  }

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
