"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");

var _slayer = require("../consts/slayer");
var _dragon = require("../consts/dragon");

const RewardSchema = new _mongoose.Schema({
  type: {
    type: String,
    enum: ['DRAGON', 'SLAYER'],
    required: true },

  test: {
    type: RegExp,
    required: true },

  mode: {
    type: String,
    enum: ['ITEM_PACKET', 'ITEM_DELTA', 'CHAT_FORMATTED', 'CHAT_UNFORMATTED'],
    required: true },

  item: {
    type: String,
    enum: [..._slayer.rewards, ..._dragon.rewards],
    unique: true,
    required: true },

  minecraftItem: {
    type: String,
    required: true },

  texture: {
    type: String,
    sparse: true },

  metadata: {
    type: Number,
    sparse: true } });



const Reward = (0, _mongoose.model)('Reward', RewardSchema);var _default =

Reward;exports.default = _default;