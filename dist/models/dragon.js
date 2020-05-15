"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");

var _dragon = _interopRequireWildcard(require("../consts/dragon"));
require("./reward");function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}
const DragonSchema = new _mongoose.Schema({
  owner: {
    type: _mongoose.SchemaTypes.ObjectId,
    required: true },

  dragonType: {
    type: String,
    enum: _dragon.default,
    required: true },

  rewards: [
  {
    reward: {
      type: String,
      enum: _dragon.rewards,
      required: true },

    count: {
      type: Number,
      required: true },

    appraisal: {
      type: Number,
      required: true } }],



  day: {
    type: Number,
    default: 0,
    required: true },

  eyesPlaced: {
    type: Number,
    default: 0,
    required: true },

  leaderboardPlacement: {
    type: Number,
    default: 2,
    required: true },

  eyePrice: {
    type: Number,
    default: 600000,
    required: true },

  revenue: {
    type: Number,
    default: 0,
    required: true },

  gross: {
    type: Number,
    default: 0,
    required: true },

  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true } });



const Dragon = (0, _mongoose.model)('Dragon', DragonSchema);var _default =

Dragon;exports.default = _default;