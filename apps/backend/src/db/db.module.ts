//DbModule is a container that tells NestJS how to create and share your database service.
// It registers DbService and makes it available to other modules

import { Module, Global } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.js";

// This is a "token" we use to tell NestJS which dependency to inject
export const DRIZZLE = "DRIZZLE";

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        const pool = new Pool({
          connectionString,
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
