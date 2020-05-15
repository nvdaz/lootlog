"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");

var _slayer = _interopRequireWildcard(require("../consts/slayer"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

const SlayerSchema = new _mongoose.Schema({
  owner: {
    type: _mongoose.SchemaTypes.ObjectId,
    trim: true,
    required: true },

  slayerType: {
    type: String,
    enum: _slayer.default,
    required: true },

  tier: {
    type: Number,
    required: true },

  rewards: [
  {
    reward: {
      type: String,
      enum: _slayer.rewards,
      required: true },

    count: {
      type: Number,
      required: true },

    appraisal: {
      type: Number,
      required: true } }],



  revenue: {
    type: Number,
    required: true },

  gross: {
    type: Number,
    required: true } });



SlayerSchema.statics = {
  addSlayer({ owner, slayerType, rewards, tier }) {
    const slayer = new Slayer({ owner, slayerType, rewards, tier });

    return slayer;
  } };


const Slayer = (0, _mongoose.model)('Slayer', SlayerSchema);var _default =

Slayer;exports.default = _default;