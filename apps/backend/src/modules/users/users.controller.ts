import {
  Controller,
  Get,
  Patch,
  Req,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService, User } from "./users.service.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { BrowseUsersQueryDto } from "./dto/browse-users-query.dto.js";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import { Request } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("me")
  async getProfile(
    @Req() req: Request & { user: { id: string } },
  ): Promise<Omit<User, "passwordHash">> {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch("me")
  async updateProfile(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: Partial<UpdateProfileDto>,
  ): Promise<Omit<User, "passwordHash">> {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async browseUsers(
    @Req() req: Request & { user: { id: string } },
    @Query() query: BrowseUsersQueryDto,
  ): Promise<{
    data: Omit<User, "passwordHash">[];
    meta: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  }> {
    return this.usersService.browseUsers(req.user.id, query);
  }
}
