import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common";
import { UsersService, User } from "../users/users.service.js";
import { JwtService } from "@nestjs/jwt";
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
  ) {}

  // -----------------------
  // REGISTER
  // -----------------------
  async register(dto: RegisterDto): Promise<SafeUser> {
    const { email, password, firstName, lastName, nativeLanguage, targetLanguage } = dto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new ConflictException("Email already in use");

    if (nativeLanguage === targetLanguage) {
      throw new BadRequestException("Native and target language must be different");
    }

    // Create user via UsersService
    const user = await this.usersService.createUser(email, firstName ? `${firstName} ${lastName ?? ""}`.trim() : undefined);

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