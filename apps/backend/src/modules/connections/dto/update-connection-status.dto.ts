import { IsEnum } from "class-validator";
import { ConnectionStatus } from "../../../db/schema.js";

export class UpdateConnectionStatusDto {
  @IsEnum(ConnectionStatus)
  status: ConnectionStatus.ACCEPTED | ConnectionStatus.REJECTED;
}
