<<<<<<< HEAD
<<<<<<< HEAD
// apps/backend/src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./strategies/local.strategy.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { GoogleStrategy } from "./strategies/google.strategy.js";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") ?? "fallback-secret",
        signOptions: {
          expiresIn: (configService.get<string>("JWT_EXPIRATION") ??
            "1h") as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
=======
import { UsersModule as _UsersModule } from "../users/users.module.js";
=======
>>>>>>> d11b965 (chore(backend): migrate project to ESM and update tsconfig)
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { UsersModule } from "../users/users.module.js";

@Module({
  imports: [PassportModule, UsersModule],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
<<<<<<< HEAD
  providers: [AuthService],
>>>>>>> 9007d9f (chore(backend): fix ESLint config and clean lint errors)
=======
  exports: [AuthService],
>>>>>>> d11b965 (chore(backend): migrate project to ESM and update tsconfig)
})
export class AuthModule {}
