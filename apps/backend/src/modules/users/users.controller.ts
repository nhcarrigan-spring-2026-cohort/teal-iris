import { Controller, Get, Patch, Body, Request } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getProfile(@Request() req) {
    req.user = { id: "00000000-0000-0000-0000-000000000000" };
    return this.usersService.getProfile(req.user.id);
  }

  @Patch("me")
  async updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    req.user = { id: "00000000-0000-0000-0000-000000000000" };
    return this.usersService.updateProfile(req.user.id, dto);
  }
}
