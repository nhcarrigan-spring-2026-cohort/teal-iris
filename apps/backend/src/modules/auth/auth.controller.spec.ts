import { jest } from "@jest/globals";
import type { ConfigService } from "@nestjs/config";
import type { Response } from "express";
import { AuthController } from "./auth.controller.js";
import type { AuthService, SafeUser } from "./auth.service.js";

describe("AuthController", () => {
  it("redirects to the frontend callback with the JWT", async () => {
    const user: SafeUser = {
      id: "user-123",
      email: "user@example.com",
      firstName: "Test",
      lastName: "User",
      nativeLanguageId: "lang-en",
      targetLanguageId: "lang-es",
      createdAt: new Date(),
    };

    const authService = {
      login: jest.fn().mockResolvedValue({
        accessToken: "signed-jwt",
        user: {
          id: user.id,
          email: user.email,
        },
      }),
    } as unknown as AuthService;

    const configService = {
      get: jest.fn().mockReturnValue("http://localhost:3001"),
    } as unknown as ConfigService;

    const redirect = jest.fn();
    const response = {
      redirect,
    } as unknown as Response;

    const controller = new AuthController(authService, configService);

    await controller.googleAuthCallback({ user } as never, response);

    expect(authService.login).toHaveBeenCalledWith(user);
    expect(configService.get).toHaveBeenCalledWith("FRONTEND_URL");
    expect(redirect).toHaveBeenCalledWith(
      "http://localhost:3001/auth/callback?token=signed-jwt",
    );
  });
});
