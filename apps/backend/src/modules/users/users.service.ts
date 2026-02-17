import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema.js";
import { DRIZZLE } from "../../db/db.module.js";
import { users } from "../../db/schema.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async getProfile(userId: string) {
    const profile = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        passwordHash: false,
      },
    });

    if (!profile) {
      throw new NotFoundException("User profile not found");
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
      throw new NotFoundException("User profile not found");
    }

    return updatedUser;
  }
}
