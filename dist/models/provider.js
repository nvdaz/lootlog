"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");

var _slayer = require("../consts/slayer");
var _dragon = require("../consts/dragon");

const ProviderSchema = new _mongoose.Schema({
  type: {
    type: String,
    enum: ['DRAGON', 'SLAYER'],
    required: true },

  chat: {
    type: RegExp,
    sparse: true },

  name: {
    type: RegExp,
    sparse: true },

  matchType: {
    type: String,
    enum: ['FORMATTED', 'UNFORMATTED'],
    required: true },


  requiredStatus: [
  {
    type: String,
    enum: ['MESSAGE', 'ITEM'],
    required: true }],


  item: {
    type: String,
    enum: [..._slayer.rewards, ..._dragon.rewards],
    unique: true,
    required: true } });



const Provider = (0, _mongoose.model)('Provider', ProviderSchema);var _default =

Provider;exports.default = _default;