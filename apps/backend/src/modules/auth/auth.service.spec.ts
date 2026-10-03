import { jest } from "@jest/globals";
import { JwtService } from "@nestjs/jwt";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../db/schema.js";
import { AuthService } from "./auth.service.js";
import type { SafeUser } from "./auth.service.js";

describe("AuthService", () => {
  it("generates a JWT with the user's id and email", async () => {
    const jwtService = {
      sign: jest.fn().mockReturnValue("signed-jwt"),
    } as unknown as JwtService;

    const db = {} as NodePgDatabase<typeof schema>;
    const authService = new AuthService(db, jwtService);

    const user: SafeUser = {
      id: "user-123",
      email: "user@example.com",
      firstName: "Test",
      lastName: "User",
      nativeLanguageId: "lang-en",
      targetLanguageId: "lang-es",
      createdAt: new Date(),
    };

    const result = await authService.login(user);

    expect(result.accessToken).toBe("signed-jwt");
    expect(jwtService.sign).toHaveBeenCalledWith({
      email: user.email,
      sub: user.id,
    });
  });
});
