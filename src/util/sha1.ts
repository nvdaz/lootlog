import crypto from 'crypto';

export default function digest(str: string): string {
  const hash = crypto.createHash('sha1').update(str).digest();
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
