// apps/backend/src/modules/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { DRIZZLE } from "../../db/db.module.js";
import * as schema from "../../db/schema.js";
import { users, languages } from "../../db/schema.js";
import { RegisterDto } from "./dto/register.dto.js";

export interface SafeUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  nativeLanguageId: string;
  targetLanguageId: string;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<SafeUser> {
    const {
      email,
      password,
      firstName,
      lastName,
      nativeLanguage,
      targetLanguage,
    } = dto;

    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

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
      });

    return user;
  }

  async validateUser(email: string, pass: string): Promise<SafeUser> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new UnauthorizedException("User with this email was not found");
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException("The password provided is incorrect");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: SafeUser) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
