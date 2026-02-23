// apps/backend/src/modules/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { UsersService, User } from "../users/users.service.js";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE } from "../../db/db.module.js";
import { users, languages } from "../../db/schema.js";

import { RegisterDto } from "./dto/register.dto.js";

export interface SafeUser {
  id: string;
  email: string;
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof users>,
  ) {}

  // -----------------------
  // REGISTER
  // -----------------------
  async register(dto: RegisterDto): Promise<SafeUser> {
    const {
      email,
      password,
      firstName,
      lastName,
      nativeLanguage,
      targetLanguage,
    } = dto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException("Email already in use");

    if (nativeLanguage === targetLanguage) {
      throw new BadRequestException(
        "Native and target language must be different",
      );
    }

    const nativeLang = await this.db.query.languages.findFirst({
      where: eq(languages.code, nativeLanguage),
    });
    if (!nativeLang) {
      throw new BadRequestException(
        `Invalid native language code: "${nativeLanguage}"`,
      );
    }

    const targetLang = await this.db.query.languages.findFirst({
      where: eq(languages.code, targetLanguage),
    });
    if (!targetLang) {
      throw new BadRequestException(
        `Invalid target language code: "${targetLanguage}"`,
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await this.db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
        lastName,
        nativeLanguageId: nativeLang.id,
        targetLanguageId: targetLang.id,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        nativeLanguageId: users.nativeLanguageId,
        targetLanguageId: users.targetLanguageId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return this.toSafeUser(user);
  }

  // -----------------------
  // LOGIN
  // -----------------------
  async login(user: SafeUser) {
    return {
      accessToken: this.generateToken(user),
      user,
    };
  }

  // -----------------------
  // OAUTH VALIDATION
  // -----------------------
  async validateOAuthUser(email: string, name?: string): Promise<SafeUser> {
    let user: User | null = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createUser(email, name);
    }

    return this.toSafeUser(user);
  }

  // -----------------------
  // VALIDATE USER (Local login)
  // -----------------------
  async validateUser(email: string, pass: string): Promise<SafeUser> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user)
      throw new UnauthorizedException("User with this email was not found");

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch)
      throw new UnauthorizedException("The password provided is incorrect");

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // -----------------------
  // HELPERS
  // -----------------------
  private generateToken(user: SafeUser): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      nativeLanguageId: user.nativeLanguageId,
      targetLanguageId: user.targetLanguageId,
      bio: user.bio ?? null,
      timezone: user.timezone ?? null,
      videoHandles: user.videoHandles ?? [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
