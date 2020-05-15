"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = digest;var _crypto = _interopRequireDefault(require("crypto"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function digest(str) {
  let hash = Buffer.from(
  _crypto.default.createHash('sha1').update(str).digest(),
  'binary');

  const neg = hash.readInt8(0) < 0;

  if (neg) {
    let carry = true;
    for (let i = hash.length - 1; i >= 0; i--) {
      const newByte = ~hash.readUInt8(i) & 0xff;
      hash.writeUInt8(newByte + (carry && 1), i);
      carry = carry && newByte === 0xff;
    }
  }

  return (neg ? '-' : '') + hash.toString('hex').replace(/^0+/, '');
}