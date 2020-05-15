"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _mongoose = require("mongoose");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const UserSchema = new _mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true,
    required: true },

  displayName: {
    type: String,
    trim: true,
    required: true },

  minecraft: {
    type: String,
    trim: true,
    unique: true,
    sparse: true },

  discord: {
    type: String,
    trim: true,
    unique: true,
    required: true },

  tag: {
    type: String,
    trim: true,
    required: true },

  eyePrice: {
    type: Number,
    default: 600000 },

  modVersion: {
    type: String,
    trim: true } });



UserSchema.methods = {
  generateAuthToken() {
    return _jsonwebtoken.default.sign(
    { id: this._id.toHexString() },
    process.env.JWT_SECRET,
    { expiresIn: '1w' });

  } };


UserSchema.statics = {
  findByDiscord: discord => User.findOne({ discord }),
  findByUsername: username => User.findOne({ username }),
  findByMinecraft: (minecraft) =>
  User.findOne({ minecraft: minecraft.replace(/-/g, '') }),
  createUser({ username, discriminator, id }) {
    return new User({
      username,
      displayName: username,
      tag: `${username}#${discriminator}`,
      discord: id }).
    save();
  },
  async findOrCreate({ username, discriminator, id }) {
    let user = await this.findByDiscord(id);
    if (user) await user.update({ tag: `${username}#${discriminator}` });else
    user = await this.createUser({ username, discriminator, id });

    return user;
  } };


const User = (0, _mongoose.model)('User', UserSchema);var _default =

User;exports.default = _default;