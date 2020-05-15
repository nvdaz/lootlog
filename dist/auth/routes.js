"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _express = require("express");

var _passport = _interopRequireDefault(require("./passport"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const router = new _express.Router();

router.get(
'/discord',
_passport.default.authenticate('discord', { session: false, scope: ['identify'] }));


router.get(
'/discord/redirect',
_passport.default.authenticate('discord', { failureRedirect: '/', session: false }),
(req, res) => {
  if (!req.user) return res.redirect('/?error?error=auth');
  res.cookie('token', req.user.generateAuthToken(), {
    maxAge: 6.048e8,
    httpOnly: true });

  res.redirect('/');
});


router.get('/logrout', async (req, res) => {
  req.logout();
  res.cookie('token', null);
  res.redirect('/');
});var _default =

router;exports.default = _default;