import { model, Schema, Document, Model } from 'mongoose';

import slayers, { SlayerReward, rewards, SlayerType } from '../consts/slayer';
import { IUser } from './user';

const SlayerSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  },
  slayerType: {
    type: String,
    enum: slayers,
    required: true,
  },
  tier: {
    type: Number,
    required: true,
  },
  rewards: [
    {
      reward: {
        type: String,
        enum: rewards,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
      appraisal: {
        type: Number,
        required: true,
      },
    },
  ],
  revenue: {
    type: Number,
    required: true,
  },
  gross: {
    type: Number,
    required: true,
  },
});

SlayerSchema.statics = {
  addSlayer({
    owner,
    slayerType,
    rewards,
    tier,
  }: IAddSlayerOptions): Promise<ISlayer> {
    const slayer = new Slayer({ owner, slayerType, rewards, tier });

    return slayer.save();
  },
};

export interface ISlayerReward {
  reward: SlayerReward;
  count: number;
  appraisal: number;
}

interface IAddSlayerOptions {
  owner: Schema.Types.ObjectId;
  slayerType: string;
  rewards: ISlayerReward[];
  tier: number;
}

interface ISlayerSchema extends Document {
  owner: Schema.Types.ObjectId | IUser;
  slayerType: SlayerType;
  tier: number;
  rewards: ISlayerReward[];
  revenue: number;
  gross: number;
}

export interface ISlayer extends ISlayerSchema {
  owner: Schema.Types.ObjectId;
}

export interface ISlayerPopulated extends ISlayerSchema {
  owner: IUser;
}

export interface ISlayerModel extends Model<ISlayer> {
  addSlayer(options: IAddSlayerOptions): Promise<ISlayer>;
}

const Slayer: ISlayerModel = model<ISlayer, ISlayerModel>(
  'Slayer',
  SlayerSchema,
);

export default Slayer;
