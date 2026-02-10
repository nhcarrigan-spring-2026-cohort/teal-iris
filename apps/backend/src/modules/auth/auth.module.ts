import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "../users/users.module.js";
import { AuthService } from "./auth.service.js";
import { LocalStrategy } from "./local.strategy.js";
import { JwtStrategy } from "./jwt.strategy.js";
import { AuthController } from "./auth.controller.js";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const expiresIn = config.get("JWT_EXPIRATION") || "1h";
        return {
          secret: config.get<string>("JWT_SECRET") || "secret",
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
