"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");

const MODIFIERS = ['ENCHANTED', 'REFORGED', 'HPB'];

const AuctionSchema = new _mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
    required: true,
    index: true },

  item: {
    type: String,
    required: true },

  price: {
    type: Number,
    required: true },

  modifiers: [
  {
    type: String,
    enum: MODIFIERS }],


  lastUpdated: {
    type: Date,
    required: true },

  endsAt: {
    type: Date,
    expires: '1mo' } });



const Auction = (0, _mongoose.model)('Auction', AuctionSchema);var _default =

Auction;exports.default = _default;