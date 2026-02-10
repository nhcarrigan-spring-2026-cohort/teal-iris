import { Injectable, Inject } from "@nestjs/common";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../../db/db.module.js";

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) {}

  async findByEmail(email: string) {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user[0] ?? null;
  }
  async findById(id: string) {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] ?? null;
  }
  async createUser(data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    nativeLanguage: string;
    targetLanguage: string;
  }) {
    const result = await this.db.insert(users).values(data).returning();

    return result[0];
  }
}
