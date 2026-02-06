import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { Request } from "express";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    // Assign defaults if env vars are missing
    const clientID = process.env.GOOGLE_CLIENT_ID || "skeleton_client_id";
    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET || "skeleton_client_secret";
    const callbackURL =
      process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/skeleton";

    // Log a warning if any skeleton/default is used
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_CALLBACK_URL
    ) {
      const missing = [
        !process.env.GOOGLE_CLIENT_ID && "GOOGLE_CLIENT_ID",
        !process.env.GOOGLE_CLIENT_SECRET && "GOOGLE_CLIENT_SECRET",
        !process.env.GOOGLE_CALLBACK_URL && "GOOGLE_CALLBACK_URL",
      ]
        .filter(Boolean)
        .join(", ");

      this.logger.warn(
        `GoogleStrategy using default placeholder values for: ${missing}`,
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ["email", "profile"],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    // Skeleton only — no DB, no JWT
    return {
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
    };
  }
}
