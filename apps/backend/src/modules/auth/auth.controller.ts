import { Controller, Post, Body } from "@nestjs/common";
import { AuthService, SafeUser } from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
  ): Promise<SafeUser | null> {
    const user = await this.authService.validateUser(email, password);
    return user ? { ...user } : null;
  }

  @Post("verify-email")
  async verifyEmail(@Body("token") token: string): Promise<boolean> {
    return this.authService.verifyEmail(token);
  }

  @Post("oauth-login")
  async oauthLogin(
    @Body("providerCode") providerCode: string,
  ): Promise<SafeUser> {
    const user = await this.authService.oauthLogin(providerCode);
    return { ...user };
  }
}
