import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { JwtStrategy } from "./jwt.strategy.js";
import { ConfigModule } from "@nestjs/config";
import { GoogleStrategy } from "./strategies/google.strategy.js";

import { UsersModule } from "../users/users.module.js";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy, // keep if you still use Google login
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
