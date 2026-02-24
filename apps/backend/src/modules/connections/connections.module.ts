import { Module } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { ConnectionsController } from "./connections.controller";
import { DbModule } from "../../db/db.module";

@Module({
  imports: [DbModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
