"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = apply;var _passport = _interopRequireDefault(require("./passport"));
var _routes = _interopRequireDefault(require("./routes"));
var _middleware = require("./middleware");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function apply(app) {
  app.use(_middleware.jwtParser, _middleware.handleJwtError);
  app.use(_passport.default.initialize());
  app.use('/auth', _routes.default);
  app.use('/graphql', _middleware.jwtParser, _middleware.handleJwtError);
}