"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = _default;var _mongoose = _interopRequireDefault(require("mongoose"));
var _mongooseRegexp = _interopRequireDefault(require("mongoose-regexp"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

(0, _mongooseRegexp.default)(_mongoose.default);

async function _default() {
  try {
    await _mongoose.default.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true });

  } catch (err) {
    console.log('Failed connection to MONGO DATABASE');
    console.error(err.message);
  }
}