import { Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../../db/db.module.js";
import * as schema from "../../db/schema.js";
import { usersRelational as users, languages } from "../../db/schema.js";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
  nativeLanguageId: string;
  targetLanguageId: string;
  bio?: string | null;
  timezone?: string | null;
  videoHandles?: any[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  // --- Find user by email ---
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      nativeLanguageId: String(user.nativeLanguageId),
      targetLanguageId: String(user.targetLanguageId),
      bio: user.bio ?? null,
      timezone: user.timezone ?? null,
      videoHandles: user.videoHandles ?? [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // --- Create a new user (used by OAuth) ---
  async createUser(email: string, name?: string): Promise<User> {
    // Split name into firstName / lastName
    const firstName = name?.split(" ")[0] ?? null;
    const lastName = name?.split(" ")[1] ?? null;

    // Use default language if not specified
    const defaultLanguage = await this.db.query.languages.findFirst({ where: eq(languages.code, "en") });
    if (!defaultLanguage) throw new Error("Default language 'en' not found in database");

    const [newUser] = await this.db
      .insert(users)
      .values({
        email,
        passwordHash: "",
        firstName,
        lastName,
        nativeLanguageId: defaultLanguage.id,
        targetLanguageId: defaultLanguage.id,
        bio: null,
        timezone: null,
        videoHandles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
        firstName: users.firstName,
        lastName: users.lastName,
        nativeLanguageId: users.nativeLanguageId,
        targetLanguageId: users.targetLanguageId,
        bio: users.bio,
        timezone: users.timezone,
        videoHandles: users.videoHandles,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return newUser;
  }

  // --- Get user profile by ID ---
  async getProfile(userId: string): Promise<User> {
    const profile = await this.db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!profile) throw new NotFoundException("User profile not found");

    return {
      id: profile.id,
      email: profile.email,
      passwordHash: profile.passwordHash,
      firstName: profile.firstName ?? null,
      lastName: profile.lastName ?? null,
      nativeLanguageId: String(profile.nativeLanguageId),
      targetLanguageId: String(profile.targetLanguageId),
      bio: profile.bio ?? null,
      timezone: profile.timezone ?? null,
      videoHandles: profile.videoHandles ?? [],
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  // --- Update user profile ---
  async updateProfile(userId: string, dto: Partial<User>): Promise<User> {
    const [updatedUser] = await this.db
      .update(users)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
        firstName: users.firstName,
        lastName: users.lastName,
        nativeLanguageId: users.nativeLanguageId,
        targetLanguageId: users.targetLanguageId,
        bio: users.bio,
        timezone: users.timezone,
        videoHandles: users.videoHandles,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) throw new NotFoundException("User profile not found");

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      passwordHash: updatedUser.passwordHash,
      firstName: updatedUser.firstName ?? null,
      lastName: updatedUser.lastName ?? null,
      nativeLanguageId: String(updatedUser.nativeLanguageId),
      targetLanguageId: String(updatedUser.targetLanguageId),
      bio: updatedUser.bio ?? null,
      timezone: updatedUser.timezone ?? null,
      videoHandles: updatedUser.videoHandles ?? [],
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}