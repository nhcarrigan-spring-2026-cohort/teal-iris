import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export const DB = Symbol("DB");

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>("DATABASE_URL");

        // Sanitize values: strip surrounding quotes if present
        const rawPassword = config.get<string>("DB_PASSWORD");
        const sanitize = (v: string | undefined) => {
          if (typeof v !== "string") return v;
          return v.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
        };
        const password = sanitize(rawPassword);

        // console.log("[DB] using DATABASE_URL:", !!databaseUrl);

        const pool = databaseUrl
          ? new Pool({ connectionString: sanitize(databaseUrl) })
          : new Pool({
              host: sanitize(config.get<string>("DB_HOST")),
              port: parseInt(
                sanitize(config.get<string>("DB_PORT")) || "5432",
                10,
              ),
              user: sanitize(config.get<string>("DB_USER")),
              password,
              database: sanitize(config.get<string>("DB_NAME")),
            });

        return drizzle(pool);
      },
    },
  ],
  exports: [DB],
})
export class DbModule {}
