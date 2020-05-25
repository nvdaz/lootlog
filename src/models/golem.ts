import { model, Schema, Document } from 'mongoose';

import { rewards, IGolemReward } from '../consts/golem';
import { IUser } from './user';

const GolemSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  },
  leaderboardPlacement: {
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
});

interface IGolemSchema extends Document {
  owner: Schema.Types.ObjectId | IUser;
  leaderboardPlacement: Schema.Types.ObjectId;
  rewards: IGolemReward[];
  revenue: number;
}

export interface IGolem extends IGolemSchema {
  owner: Schema.Types.ObjectId;
}

export interface IGolemPopulated extends IGolemSchema {
  owner: IUser;
}

const Golem = model<IGolem>('Golem', GolemSchema);

export default Golem;
