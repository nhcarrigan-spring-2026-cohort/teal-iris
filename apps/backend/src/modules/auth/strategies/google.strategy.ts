import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { UsersService, User } from "../../users/users.service.js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET");
    const callbackURL = configService.get<string>("GOOGLE_CALLBACK_URL");

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

  async validate(accessToken: string, profile: Profile): Promise<User> {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    if (!email) {
      throw new Error("Google account has no email associated");
    }

    let user = this.usersService.findByEmail(email);

    if (!user) {
      user = this.usersService.createUser(email, name);
      this.logger.log(`Created new user: ${email}`);
    } else {
      this.logger.log(`Found existing user: ${email}`);
    }

    return user;
  }
}
