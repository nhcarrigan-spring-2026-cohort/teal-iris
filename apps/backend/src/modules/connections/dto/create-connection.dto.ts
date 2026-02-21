import { IsUUID, IsNotEmpty } from "class-validator";

export class CreateConnectionDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;
}
