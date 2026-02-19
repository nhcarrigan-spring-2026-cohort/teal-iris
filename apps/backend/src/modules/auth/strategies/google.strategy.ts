import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import type { Request as _Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    // Assign defaults if env vars are missing
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    // -------------------------------
    // Throw an error if any required env var is missing
    // This prevents the app from silently running with invalid placeholders
    // -------------------------------
    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        `Missing Google OAuth env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL`,
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, profile: Profile) {
    // Skeleton only — no DB, no JWT
    return {
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
    };
  }
}
