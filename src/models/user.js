import { model, Schema } from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  displayName: {
    type: String,
    trim: true,
    required: true,
  },
  minecraft: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  discord: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  tag: {
    type: String,
    trim: true,
    required: true,
  },
  eyePrice: {
    type: Number,
    default: 600000,
  },
  modVersion: {
    type: String,
    trim: true,
  },
});

UserSchema.methods = {
  generateAuthToken() {
    return jsonwebtoken.sign(
      { id: this._id.toHexString() },
      process.env.JWT_SECRET,
      { expiresIn: '1w' },
    );
  },
};

UserSchema.statics = {
  findByDiscord: (discord) => User.findOne({ discord }),
  findByUsername: (username) => User.findOne({ username }),
  findByMinecraft: (minecraft) =>
    User.findOne({ minecraft: minecraft.replace(/-/g, '') }),
  createUser({ username, discriminator, id }) {
    return new User({
      username,
      displayName: username,
      tag: `${username}#${discriminator}`,
      discord: id,
    }).save();
  },
  async findOrCreate({ username, discriminator, id }) {
    let user = await this.findByDiscord(id);
    if (user) await user.update({ tag: `${username}#${discriminator}` });
    else user = await this.createUser({ username, discriminator, id });

    return user;
  },
};

const User = model('User', UserSchema);

export default User;
