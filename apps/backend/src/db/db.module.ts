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

        const password = config.get<string>("DB_PASSWORD");
        const pool = databaseUrl
          ? new Pool({ connectionString: databaseUrl })
          : new Pool({
              host: config.get<string>("DB_HOST"),
              port: parseInt(config.get<string>("DB_PORT") || "5432", 10),
              user: config.get<string>("DB_USER"),
              password,
              database: config.get<string>("DB_NAME"),
            });

        return drizzle(pool);
      },
    },
  ],
  exports: [DB],
})
export class DbModule {}
