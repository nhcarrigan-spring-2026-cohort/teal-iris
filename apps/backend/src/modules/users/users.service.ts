import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, ne, and, count, SQL } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema.js';
import { DRIZZLE } from '../../db/db.module.js';
import { users, languages } from '../../db/schema.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { BrowseUsersQueryDto } from './dto/browse-users-query.dto.js';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async browseUsers(currentUserId: string, query: BrowseUsersQueryDto) {
    const { page = 1, limit = 10, learning, speaking } = query;
    const offset = (page - 1) * limit;

    const nativeLang = alias(languages, 'native_lang');
    const targetLang = alias(languages, 'target_lang');

    const conditions: SQL[] = [ne(users.id, currentUserId)];

    if (learning) {
      conditions.push(eq(targetLang.code, learning));
    }

    if (speaking) {
      conditions.push(eq(nativeLang.code, speaking));
    }

    const whereClause = and(...conditions);

    const [data, [{ totalCount }]] = await Promise.all([
      this.db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          bio: users.bio,
          timezone: users.timezone,
          nativeLanguage: {
            code: nativeLang.code,
            name: nativeLang.name,
          },
          targetLanguage: {
            code: targetLang.code,
            name: targetLang.name,
          },
        })
        .from(users)
        .leftJoin(nativeLang, eq(users.nativeLanguageId, nativeLang.id))
        .leftJoin(targetLang, eq(users.targetLanguageId, targetLang.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      this.db
        .select({ totalCount: count() })
        .from(users)
        .leftJoin(nativeLang, eq(users.nativeLanguageId, nativeLang.id))
        .leftJoin(targetLang, eq(users.targetLanguageId, targetLang.id))
        .where(whereClause),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getProfile(userId: string) {
    const profile = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        passwordHash: false,
      },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const [updatedUser] = await this.db
      .update(users)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
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

    if (!updatedUser) {
      throw new NotFoundException('User profile not found');
    }

    return updatedUser;
  }
}
