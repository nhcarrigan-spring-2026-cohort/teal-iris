import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";

@Module({
  providers: [UsersService],
  exports: [UsersService], // export so other modules (like auth) can use it
})
export class UsersModule {}
