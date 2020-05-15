"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.handlePassportError = exports.handleJwtError = exports.jwtParser = void 0;var _expressJwt = _interopRequireDefault(require("express-jwt"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const jwtParser = (0, _expressJwt.default)({
  credentialsRequired: false,
  secret: process.env.JWT_SECRET,
  getToken: ({ headers: { authorization }, cookies: { token } }) =>
  (authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1]) || token });exports.jwtParser = jwtParser;


const handleJwtError = (err, req, res, next) =>
next(err.code !== 'invalid_token' && err);exports.handleJwtError = handleJwtError;

const handlePassportError = (err, req, res, next) => next();exports.handlePassportError = handlePassportError;