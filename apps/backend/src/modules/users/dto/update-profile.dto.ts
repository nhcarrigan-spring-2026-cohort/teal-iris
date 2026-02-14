import {
  IsOptional,
  IsString,
  Length,
  IsTimeZone,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class VideoHandlesDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  discord?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  zoom?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(0, 500)
  bio?: string;

  @IsOptional()
  @IsTimeZone()
  timezone?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoHandlesDto)
  videoHandles?: VideoHandlesDto;
}
