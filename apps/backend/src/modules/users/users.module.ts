import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { DbModule } from "../../db/db.module"; // Needed for DRIZZLE injection

@Module({
  imports: [DbModule], // Makes DRIZZLE available to UsersService
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Allows other modules to inject UsersService
})
export class UsersModule {}
