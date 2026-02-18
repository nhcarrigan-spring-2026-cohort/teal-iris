import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { UsersService } from "./users.service.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { BrowseUsersQueryDto } from "./dto/browse-users-query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch("me")
  async updateProfile(
    @Request() req,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get()
  async browseUsers(
    @Request() req,
    @Query() query: BrowseUsersQueryDto,
  ) {
    return this.usersService.browseUsers(
      req.user.id,
      query.page ?? 1,
      query.limit ?? 10,
    );
  }
}