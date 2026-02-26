import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { ChatGateway } from "./chat.gateway.js";
import { WsJwtGuard } from "./guards/ws-jwt.guard.js";

@Module({
  imports: [AuthModule],
  providers: [ChatGateway, WsJwtGuard],
})
export class ChatModule {}
