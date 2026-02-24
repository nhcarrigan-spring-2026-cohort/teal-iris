// apps/backend/src/main.ts
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module.js";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  // Declare port
  const port = process.env.PORT ?? 3000;

  const app = await NestFactory.create(AppModule);

  // Global validation pipe with transform and whitelist
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(port);
  logger.log(`App listening on port ${port}`);

  // Optional: log Google OAuth envs for debugging
  logger.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID}`);
  logger.log(
    `GOOGLE_CLIENT_SECRET: ${
      process.env.GOOGLE_CLIENT_SECRET ? "***hidden***" : "MISSING"
    }`,
  );
  logger.log(`GOOGLE_CALLBACK_URL: ${process.env.GOOGLE_CALLBACK_URL}`);
}

bootstrap();
