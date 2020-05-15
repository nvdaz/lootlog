"use strict";Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, "coerce", { enumerable: true, get: function () {return _semver.coerce;} });exports.default = exports.isCurrent = exports.currentVersion = void 0;var _semver = require("semver");

var _version = _interopRequireDefault(require("../models/version"));
var _versions = _interopRequireDefault(require("../../versions.json"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const currentVersion = _versions.default.
map(({ version }) => version).
sort(_semver.rcompare)[0];exports.currentVersion = currentVersion;



const isCurrent = version => (0, _semver.gte)(version, currentVersion);exports.isCurrent = isCurrent;var _default =

_versions.default;exports.default = _default;