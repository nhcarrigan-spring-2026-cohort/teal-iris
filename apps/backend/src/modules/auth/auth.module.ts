// apps/backend/src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import path from "path";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    // ConfigModule configured for monorepo-safe .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), "../../.env"),
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret =
          configService.get<string>("JWT_SECRET") ?? "fallback-secret";
        const expiresInEnv =
          configService.get<string>("JWT_EXPIRATION") ?? "3600";

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
          signOptions: { expiresIn: expiresInSeconds },
        };
      },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
