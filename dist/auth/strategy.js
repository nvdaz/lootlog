"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _passportDiscord = require("passport-discord");

var _user = _interopRequireDefault(require("../models/user"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

new _passportDiscord.Strategy(
{
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: '/auth/discord/redirect',
  scopes: ['identify'] },

(accessToken, refreshToken, profile, done) =>
_user.default.findOrCreate(profile).
then(user => done(null, user)).
catch(err => done(err)));exports.default = _default;