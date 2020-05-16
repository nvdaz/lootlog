import { model, Schema, Document } from 'mongoose';

import dragons, { rewards, DragonType, IDragonReward } from '../consts/dragon';
import { IUser } from './user';

const DragonSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dragonType: {
    type: String,
    enum: dragons,
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
  day: {
    type: Number,
    default: 0,
    required: true,
  },
  eyesPlaced: {
    type: Number,
    default: 0,
    required: true,
  },
  leaderboardPlacement: {
    type: Number,
    default: 2,
    required: true,
  },
  eyePrice: {
    type: Number,
    default: 600000,
    required: true,
  },
  revenue: {
    type: Number,
    default: 0,
    required: true,
  },
  gross: {
    type: Number,
    default: 0,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

interface IDragonSchema extends Document {
  owner: Schema.Types.ObjectId | IUser;
  dragonType: DragonType;
  rewards: IDragonReward[];
  day: number;
  eyesPlaced: number;
  leaderboardPlacement: number;
  eyeprice: number;
  revenue: number;
  gross: number;
  lastUpdated: Date;
}

export interface IDragon extends IDragonSchema {
  owner: Schema.Types.ObjectId;
}

export interface IDragonPopulated extends IDragonSchema {
  owner: IUser;
}

const Dragon = model<IDragon>('Dragon', DragonSchema);

export default Dragon;
