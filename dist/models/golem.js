"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");

var _golem = require("../consts/golem");

const GolemSchema = new _mongoose.Schema({
  owner: {
    type: _mongoose.SchemaTypes.ObjectId,
    trim: true,
    required: true },

  leaderboardPlacement: {
    type: Number,
    required: true },

  rewards: [
  {
    reward: {
      type: String,
      enum: _golem.rewards,
      required: true },

    count: {
      type: Number,
      required: true },

    appraisal: {
      type: Number,
      required: true } }],



  revenue: {
    type: Number,
    required: true } });



const Golem = (0, _mongoose.model)('Golem', GolemSchema);var _default =

Golem;exports.default = _default;