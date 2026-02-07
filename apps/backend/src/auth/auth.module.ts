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
        const expiresInRaw =
          config.get<string | number>("JWT_EXPIRES_IN") || 3600;
        const expiresIn = isNaN(Number(expiresInRaw))
          ? expiresInRaw
          : Number(expiresInRaw);
        return {
          secret: config.get<string>("JWT_SECRET") || "secretKey",
          signOptions: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
