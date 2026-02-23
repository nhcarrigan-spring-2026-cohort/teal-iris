import { Injectable, UnauthorizedException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema.js";
import { DRIZZLE } from "../../db/db.module.js";
import { User } from "../users/users.service.js";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * Validate user login by email and password
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) return null;

    // Placeholder logic: replace with real password hash check
    const isPasswordValid = password === user.passwordHash;
    if (!isPasswordValid) return null;

    return { ...user, videoHandles: user.videoHandles ?? [] };
  }

  /**
   * Generate JWT token for authenticated user
   */
  async generateJwt(user: User): Promise<string> {
    // Placeholder implementation
    return `token-for-${user.id}`;
  }

  /**
   * Verify email token
   */
  async verifyEmail(token: string): Promise<boolean> {
    // Minimal placeholder implementation to satisfy TS + ESLint
    return token.length > 0;
  }

  /**
   * OAuth login stub (Google etc.)
   */
  async oauthLogin(providerCode: string): Promise<User> {
    // Example stub to satisfy linting
    const defaultLanguage = await this.db.query.languages.findFirst({
      where: eq(schema.languages.code, "en"),
    });

    if (!defaultLanguage) throw new UnauthorizedException("Invalid OAuth flow");

    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        email: `${providerCode}@example.com`,
        passwordHash: "",
        firstName: "OAuth",
        lastName: "User",
        nativeLanguageId: defaultLanguage.id,
        targetLanguageId: defaultLanguage.id,
        bio: null,
        timezone: null,
        videoHandles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return { ...newUser, videoHandles: newUser.videoHandles ?? [] };
  }
}
