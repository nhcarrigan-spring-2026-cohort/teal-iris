import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import { DRIZZLE } from "../../db/db.module";
import { User } from "../users/users.service";

export type SafeUser = Omit<User, "passwordHash">;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    // Replace with real password check
    const isPasswordValid = password === user.passwordHash;
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    return { ...user, videoHandles: user.videoHandles ?? [] };
  }

  async generateJwt(user: SafeUser): Promise<string> {
    return `token-for-${user.id}`;
  }

  async verifyEmail(token: string): Promise<boolean> {
    return token.length > 0;
  }

  async oauthLogin(providerCode: string): Promise<SafeUser> {
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
