// apps/backend/src/auth/auth.service.ts

// Check if email exists, Hash password, Save user, Return response

import { ConflictException, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { DRIZZLE } from "../db/db.module.js";
import * as schema from "../db/schema.js";
import { users } from "../db/schema.js";
import { RegisterDto } from "./dto/register.dto.js";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async register(dto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      nativeLanguage,
      targetLanguage,
    } = dto;

    // Check if email already exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    //  Hash the password (NEVER store plain text)
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert user into database
    const [user] = await this.db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
        lastName,
        nativeLanguage,
        targetLanguage,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        nativeLanguage: users.nativeLanguage,
        targetLanguage: users.targetLanguage,
        createdAt: users.createdAt,
      });

    // Return safe user profile (no passwordHash)
    return user;
  }
}
