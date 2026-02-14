// apps/backend/src/modules/auth/dto/register.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and either a number or a special character.",
  })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsString()
  @MaxLength(10)
  @Matches(/^[a-z]{2}$/, {
    message:
      'Language must be a valid 2-letter ISO 639-1 code (e.g., "en", "es")',
  })
  nativeLanguage!: string;

  @IsString()
  @MaxLength(10)
  @Matches(/^[a-z]{2}$/, {
    message:
      'Language must be a valid 2-letter ISO 639-1 code (e.g., "en", "es")',
  })
  targetLanguage!: string;
}
