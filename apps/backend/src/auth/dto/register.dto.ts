import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsString()
  nativeLanguage: string;
  @IsString()
  targetLanguage: string;
}
