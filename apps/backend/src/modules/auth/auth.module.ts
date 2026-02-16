// apps/backend/src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "path";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./strategies/local.strategy.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { GoogleStrategy } from "./strategies/google.strategy.js";
import { UsersModule } from "../users/users.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), "../../.env"), // root .env
    }),
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret =
          configService.get<string>("JWT_SECRET") ?? "fallback-secret";
        const expiresInEnv =
          configService.get<string>("JWT_EXPIRATION") ?? "3600";

        // Convert to number of seconds
        let expiresInSeconds: number;
        if (/^\d+$/.test(expiresInEnv)) {
          expiresInSeconds = parseInt(expiresInEnv, 10);
        } else if (/^\d+h$/.test(expiresInEnv)) {
          expiresInSeconds = parseInt(expiresInEnv, 10) * 3600;
        } else {
          expiresInSeconds = 3600;
        }

        return {
          secret,
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}