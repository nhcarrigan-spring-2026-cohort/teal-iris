import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  Matches,
} from "class-validator";
import { Type } from "class-transformer";

export class BrowseUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z]{2}$/, {
    message:
      'learning must be a valid 2-letter ISO 639-1 code (e.g., "es", "fr")',
  })
  learning?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z]{2}$/, {
    message:
      'speaking must be a valid 2-letter ISO 639-1 code (e.g., "en", "de")',
  })
  speaking?: string;
}
