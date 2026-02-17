// apps/backend/src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller.js"; // ESM-compatible
import { HealthController } from "./modules/health/health.controller.js"; // include HealthController

import { AuthModule } from "./modules/auth/auth.module.js";
import { DbModule } from "./db/db.module.js";
import { UsersModule } from "./modules/users/users.module.js";
import { ConnectionsModule } from "./modules/connections/connections.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env", // root-level .env
    }),
    DbModule,
    AuthModule,
    UsersModule,
    ConnectionsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [],
})
export class AppModule {}