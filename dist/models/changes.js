"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");
var _semver = require("semver");

var _versions = _interopRequireDefault(require("../../versions.json"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const VersionSchema = new _mongoose.Schema({
  version: {
    type: String,
    validate: _semver.valid,
    unique: true,
    rqeuired: true },

  etag: {
    type: String,
    unique: true,
    required: true },

  changes: [
  {
    type: String,
    required: true }],


  download: {
    type: String,
    unique: true,
    sparse: true } });



const Version = (0, _mongoose.model)('Version', VersionSchema);var _default =

Version;exports.default = _default;

_versions.default.forEach(({ version, etag, changes }) => {
  new Version({ version, etag, changes }).save().then(console.log);
});