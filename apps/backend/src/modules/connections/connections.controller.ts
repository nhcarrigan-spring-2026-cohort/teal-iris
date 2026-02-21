import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ConnectionsService } from "./connections.service.js";
import { CreateConnectionDto } from "./dto/create-connection.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@Controller("connections")
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createConnectionDto: CreateConnectionDto) {
    return this.connectionsService.create(req.user.id, createConnectionDto);
  }
}
