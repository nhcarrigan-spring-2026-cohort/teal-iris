import { Module } from "@nestjs/common";
import { HealthController } from "./modules/health/health.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { DbModule } from "./db/db.module.js";
import { UsersModule } from "./modules/users/users.module.js";
import { ConnectionsModule } from "./modules/connections/connections.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env",
    }),
    DbModule,
    AuthModule,
    UsersModule,
    ConnectionsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
