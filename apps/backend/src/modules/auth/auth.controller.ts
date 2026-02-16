import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { AuthService } from "./auth.service.js";
import { GoogleAuthGuard } from "./guards/google-auth.guard.js";
import type { User } from "../users/users.service.js";
import { UsersService } from "../users/users.service.js";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { LocalAuthGuard } from "./guards/local-auth.guard.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService, // injected UsersService
  ) {}

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
    return this.authService.login(req.user as SafeUser);
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
    // GoogleAuthGuard handles the redirect; no need for req here
  }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ): Promise<void> {
    // Cast req.user to User type
    let user = req.user as User;

    if (!user) {
      // Safety check: if Google didn't provide a user
      res
        .status(401)
        .send("Authentication failed: No user information provided.");
      return;
    }

    // Check if user exists in UsersService, create if not
    const existingUser = this.usersService.findByEmail(user.email);
    if (existingUser) {
      user = existingUser;
    } else {
      user = this.usersService.createUser(user.email, user.name);
    }

    // Generate JWT for the user
    const token = this.authService.generateJwt(user);

    // Redirect user to frontend with token
    const frontendUrl =
      this.configService.get<string>("FRONTEND_CALLBACK_URL") ||
      "http://localhost:3000/auth/callback";

    res.redirect(`${frontendUrl}?token=${token}`);
  }
}
