import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { eq, ne, and, count } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import { DRIZZLE } from "../../db/db.module";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { BrowseUsersQueryDto } from "./dto/browse-users-query.dto";
import { users, languages } from "../../db/schema";

// User type
export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  firstName?: string | null;
  lastName?: string | null;
  nativeLanguageId: string;
  targetLanguageId: string;
  bio?: string | null;
  timezone?: string | null;
  videoHandles: string[];
  createdAt: Date;
  updatedAt: Date;
}

// SafeUser type for exposing without passwordHash
export type SafeUser = Omit<User, "passwordHash">;

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user ? { ...user, videoHandles: user.videoHandles ?? [] } : null;
  }

  async createUser(email: string, name?: string): Promise<User> {
    const firstName = name?.split(" ")[0] ?? null;
    const lastName = name?.split(" ")[1] ?? null;

    const defaultLanguage = await this.db.query.languages.findFirst({
      where: eq(languages.code, "en"),
    });
    if (!defaultLanguage) throw new Error("Default language 'en' not found");

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
      .returning();

    return { ...newUser, videoHandles: newUser.videoHandles ?? [] };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const profile = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { passwordHash: false },
    });
    if (!profile) throw new NotFoundException("User profile not found");
    return { ...profile, videoHandles: profile.videoHandles ?? [] };
  }

  async updateProfile(
    userId: string,
    dto: Partial<UpdateProfileDto>,
  ): Promise<SafeUser> {
    const [updatedUser] = await this.db
      .update(users)
      .set({
        ...dto,
        updatedAt: new Date(),
        // Ensure videoHandles is always string[]
        videoHandles: Array.isArray(dto.videoHandles)
          ? [...dto.videoHandles]
          : [],
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) throw new NotFoundException("User profile not found");
    return { ...updatedUser, videoHandles: updatedUser.videoHandles ?? [] };
  }

  async browseUsers(
    currentUserId: string,
    query: BrowseUsersQueryDto,
  ): Promise<{
    data: SafeUser[];
    meta: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10, learning, speaking } = query;
    const offset = (page - 1) * limit;
    const clampedLimit = Math.min(limit, 100);

    const conditions = [ne(users.id, currentUserId)];
    if (learning) conditions.push(eq(users.targetLanguageId, learning));
    if (speaking) conditions.push(eq(users.nativeLanguageId, speaking));

    const whereClause = and(...conditions);

    const [data, countResult] = await Promise.all([
      this.db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          bio: users.bio,
          timezone: users.timezone,
          videoHandles: users.videoHandles,
          nativeLanguageId: users.nativeLanguageId,
          targetLanguageId: users.targetLanguageId,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(whereClause)
        .limit(clampedLimit)
        .offset(offset),
      this.db.select({ totalCount: count() }).from(users).where(whereClause),
    ]);

    const totalCount = countResult[0]?.totalCount ?? 0;

    return {
      data: data.map((u) => ({ ...u, videoHandles: u.videoHandles ?? [] })),
      meta: {
        page,
        limit: clampedLimit,
        totalCount,
        totalPages: Math.ceil(totalCount / clampedLimit),
      },
    };
  }
}
