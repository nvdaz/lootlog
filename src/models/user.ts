import { model, Schema, Model, Document, DocumentQuery } from 'mongoose';
import { sign } from 'jsonwebtoken';

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
  generateAuthToken(): string {
    return sign({ id: this._id.toHexString() }, process.env.JWT_SECRET, {
      expiresIn: '1w',
    });
  },
};

UserSchema.statics = {
  findByDiscord: (discord: string): DocumentQuery<IUser, IUser> =>
    User.findOne({ discord }),
  findByUsername: (username: string): DocumentQuery<IUser, IUser> =>
    User.findOne({ username }),
  findByMinecraft: (minecraft: string): DocumentQuery<IUser, IUser> =>
    User.findOne({ minecraft: minecraft.replace(/-/g, '') }),
  createUser({
    username,
    discriminator,
    id,
  }: ICreateUserOptions): Promise<IUser> {
    return new User({
      username,
      displayName: username,
      tag: `${username}#${discriminator}`,
      discord: id,
    }).save();
  },
  async findOrCreate({
    username,
    discriminator,
    id,
  }: ICreateUserOptions): Promise<IUser> {
    let user = await this.findByDiscord(id);
    if (user) await user.update({ tag: `${username}#${discriminator}` });
    else user = await this.createUser({ username, discriminator, id });

    return user;
  },
};

interface ICreateUserOptions {
  username: string;
  discriminator: string;
  id: string;
}

interface IUserSchema extends Document {
  _id: string;
  username: string;
  displayName: string;
  minecraft: string;
  discord: string;
  tag: string;
  eyePrice: number;
  modVersion: string;
}

export interface IUser extends IUserSchema {
  generateAuthToken(): string;
}

export interface IUserModel extends Model<IUser> {
  findByDiscord(discord: string): DocumentQuery<IUser, IUser>;
  findByUsername(username: string): DocumentQuery<IUser, IUser>;
  findByMinecraft(minecraft: string): DocumentQuery<IUser, IUser>;
  createUser(options: ICreateUserOptions): Promise<IUser>;
  findOrCreate(options: ICreateUserOptions): Promise<IUser>;
}

const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);

export default User;
