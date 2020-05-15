import { Strategy as DiscordStrategy } from 'passport-discord';

import User from '../models/user';

export default new DiscordStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/discord/redirect',
    scopes: ['identify'],
  },
  (accessToken, refreshToken, profile, done) =>
    User.findOrCreate(profile)
      .then((user) => done(null, user))
      .catch((err) => done(err)),
);
