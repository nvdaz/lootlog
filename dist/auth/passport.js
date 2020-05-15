"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _passport = _interopRequireDefault(require("passport"));
var _strategy = _interopRequireDefault(require("./strategy"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_passport.default.use(_strategy.default);var _default =

_passport.default;exports.default = _default;