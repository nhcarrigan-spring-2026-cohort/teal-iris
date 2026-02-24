import { Controller, Get, Patch, Body, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { BrowseUsersQueryDto } from "./dto/browse-users-query.dto";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UseGuards, Req as Request } from "@nestjs/common";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("me")
  getProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch("me")
  updateProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  browseUsers(
    @Request() req: { user: { id: string } },
    @Query() query: BrowseUsersQueryDto,
  ) {
    return this.usersService.browseUsers(req.user.id, query);
  }
}
