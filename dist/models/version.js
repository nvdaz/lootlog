"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");
var _memoizeOne = _interopRequireDefault(require("memoize-one"));
var _semver = require("semver");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const VersionSchema = new _mongoose.Schema({
  version: {
    type: String,
    validate: _semver.valid,
    unique: true,
    rqeuired: true },

  etag: {
    type: String,
    unique: true,
    required: true,
    index: true },

  changes: [
  {
    type: String,
    required: true }],


  download: {
    type: String,
    unique: true,
    sparse: true } });



const getVersions = (0, _memoizeOne.default)(async () =>
(await Version.find({})).sort((a, b) => (0, _semver.rcompare)(a.version, b.version)));


VersionSchema.statics = {
  getVersions,
  isCurrent: async version => (0, _semver.gte)(version, (await getVersions())[0].version) };


const Version = (0, _mongoose.model)('Version', VersionSchema);var _default =

Version;exports.default = _default;