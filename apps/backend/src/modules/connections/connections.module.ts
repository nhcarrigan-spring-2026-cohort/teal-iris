import { Module } from "@nestjs/common";
import { ConnectionsService } from "./connections.service.js";
import { ConnectionsController } from "./connections.controller.js";
import { DbModule } from "../../db/db.module.js";

@Module({
  imports: [DbModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
