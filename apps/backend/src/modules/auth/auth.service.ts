// apps/backend/src/modules/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
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
    //verification token
    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const [user] = await this.db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
        lastName,
        verificationToken,
        verificationTokenExpiry,
        emailVerified: null,
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

    // //log verification url
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
    console.log("Email verification URL:", verificationUrl);

    return user;
  }

  async validateUser(email: string, pass: string): Promise<SafeUser> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new UnauthorizedException("User with this email was not found");
    }
    //block if user is not verified
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        "Please verify your email before logging in",
      );
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

  //Email verification
  async verifyEmail(token: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    if (user.emailVerified) {
      throw new BadRequestException("Email is already verified");
    }
    if (
      !user.verificationTokenExpiry ||
      Date.now() > user.verificationTokenExpiry.getTime()
    ) {
      await this.db
        .update(users)
        .set({
          verificationToken: null,
          verificationTokenExpiry: null,
        })
        .where(eq(users.id, user.id));

      throw new BadRequestException(
        "Verification token has expired. Please request a new one.",
      );
    }

    await this.db
      .update(users)
      .set({
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    return { message: "Email successfully verified" };
  }
}
