import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { DbModule } from "../../db/db.module.js"; // Needed for DRIZZLE injection

@Module({
  imports: [DbModule], // Makes DRIZZLE available to UsersService
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Allows other modules to inject UsersService
})
export class UsersModule {}
