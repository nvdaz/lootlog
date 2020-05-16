import { VerifyCallback } from 'passport-oauth2';
import { Strategy as DiscordStrategy, Profile } from 'passport-discord';

import User, { IUser } from '../models/user';

export default new DiscordStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/discord/redirect',
    scope: ['identify'],
  },
  (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) =>
    User.findOrCreate(profile)
      .then((user: IUser): void => done(null, user))
      .catch((err: Error): void => done(err)),
);
