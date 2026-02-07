import { Injectable, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service.js";
import { hashPassword, verifyPassword } from "./password.util.js";
import { RegisterDto } from "./dto/register.dto.js";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async login(user: { id: string; email: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("Email already in use");
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      nativeLanguage: dto.nativeLanguage,
      targetLanguage: dto.targetLanguage,
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        email: user.email,
      }),
      user: safeUser,
    };
  }
}
