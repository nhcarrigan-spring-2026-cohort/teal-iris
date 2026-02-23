import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { User } from "../users/users.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
  ): Promise<{ token: string; user: User | null }> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error("Invalid credentials");

    const token = await this.authService.generateJwt(user);
    return { token, user };
  }

  @Post("verify-email")
  async verifyEmail(
    @Body("token") token: string,
  ): Promise<{ success: boolean }> {
    const success = await this.authService.verifyEmail(token);
    return { success };
  }

  @Post("oauth-login")
  async oauthLogin(@Body("providerCode") providerCode: string): Promise<User> {
    return this.authService.oauthLogin(providerCode);
  }
}
