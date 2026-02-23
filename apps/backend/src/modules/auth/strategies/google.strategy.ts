// apps/backend/src/modules/auth/strategies/google.strategy.ts
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
    private readonly configService: ConfigService, // ✅ mark as private for Nest injection
  ) {
    // Fetch config values BEFORE calling super
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

    // Optional: log for debugging
    this.logger.log(`GoogleStrategy initialized`);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    if (!email) {
      this.logger.error("Google profile returned without an email");
      throw new Error("No email found in Google profile");
    }

    // Check if user exists
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createUser(email, name);
      this.logger.log(`Created new user: ${email}`);
    } else {
      this.logger.log(`Found existing user: ${email}`);
    }

    return user;
  }
}
