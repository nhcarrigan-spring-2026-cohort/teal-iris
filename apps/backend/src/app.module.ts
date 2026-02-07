import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Joi from "joi";
import { HealthController } from "./modules/health/health.controller.js";
import { AuthModule } from "./auth/auth.module.js";
import { UsersModule } from "./users/users.module.js";
import { DbModule } from "./db/db.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, ".env", "../.env"],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test")
          .default("development"),
        DATABASE_URL: Joi.string().uri().optional(),
        DB_HOST: Joi.when("DATABASE_URL", {
          is: Joi.exist(),
          then: Joi.optional(),
          otherwise: Joi.string().required(),
        }),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().optional(),
        DB_PASSWORD: Joi.string().optional(),
        DB_NAME: Joi.string().optional(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    DbModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
