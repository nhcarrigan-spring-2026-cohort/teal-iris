import { ConfigService } from "@nestjs/config";
import { jest } from "@jest/globals";
import type { Profile } from "passport-google-oauth20";
import { GoogleStrategy } from "./google.strategy.js";
import type { UsersService } from "../../users/users.service.js";

describe("GoogleStrategy", () => {
  const existingUser = {
    id: "user-123",
    email: "existing@example.com",
    firstName: "Existing",
    lastName: "User",
    nativeLanguageId: "lang-en",
    targetLanguageId: "lang-es",
    createdAt: new Date(),
  };

  const usersService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  } as unknown as UsersService;

  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        GOOGLE_CLIENT_ID: "test-client-id",
        GOOGLE_CLIENT_SECRET: "test-client-secret",
        GOOGLE_CALLBACK_URL: "http://localhost:8000/auth/google/callback",
      };

      return values[key];
    }),
  } as unknown as ConfigService;

  let strategy: GoogleStrategy;

  beforeEach(() => {
    jest.clearAllMocks();
    strategy = new GoogleStrategy(configService, usersService);
  });

  it("returns an existing user when the Google email is already registered", async () => {
    usersService.findByEmail.mockResolvedValue(existingUser);

    const profile = {
      emails: [{ value: existingUser.email }],
      displayName: "Existing User",
    } as Profile;

    const result = await strategy.validate(
      "access-token",
      "refresh-token",
      profile,
    );

    expect(result).toBe(existingUser);
    expect(usersService.findByEmail).toHaveBeenCalledWith(existingUser.email);
    expect(usersService.createUser).not.toHaveBeenCalled();
  });

  it("creates a user when the Google email is not registered", async () => {
    usersService.findByEmail.mockResolvedValue(undefined);
    usersService.createUser.mockResolvedValue(existingUser);

    const profile = {
      emails: [{ value: "new@example.com" }],
      displayName: "New User",
    } as Profile;

    const result = await strategy.validate(
      "access-token",
      "refresh-token",
      profile,
    );

    expect(result).toBe(existingUser);
    expect(usersService.findByEmail).toHaveBeenCalledWith("new@example.com");
    expect(usersService.createUser).toHaveBeenCalledWith(
      "new@example.com",
      "New User",
    );
  });

  it("rejects a Google profile without an email", async () => {
    const profile = {
      emails: [],
      displayName: "No Email",
    } as Profile;

    await expect(
      strategy.validate("access-token", "refresh-token", profile),
    ).rejects.toThrow("No email found in Google profile");

    expect(usersService.findByEmail).not.toHaveBeenCalled();
    expect(usersService.createUser).not.toHaveBeenCalled();
  });

  it("throws when a required Google OAuth environment variable is missing", () => {
    const missingConfig = {
      get: jest.fn((key: string) => {
        if (key === "GOOGLE_CLIENT_SECRET") {
          return undefined;
        }

        return "configured";
      }),
    } as unknown as ConfigService;

    expect(() => new GoogleStrategy(missingConfig, usersService)).toThrow(
      "Missing Google OAuth env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL",
    );
  });
});
