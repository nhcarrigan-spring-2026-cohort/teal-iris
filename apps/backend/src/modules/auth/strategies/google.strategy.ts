import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service.js";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const clientID = configService.get<string>("GOOGLE_CLIENT_ID")!;
    const clientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET")!;
    const callbackURL = configService.get<string>("GOOGLE_CALLBACK_URL")!;

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        "Missing Google OAuth env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL",
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error("No email found in Google profile");
    }

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      return existingUser;
    }

    return this.usersService.createUser(email, profile.displayName);
  }
}
