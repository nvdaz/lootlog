import { model, Schema, SchemaTypes } from 'mongoose';

import dragons, { rewards } from '../consts/dragon';
import './reward';
const DragonSchema = new Schema({
  owner: {
    type: SchemaTypes.ObjectId,
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

const Dragon = model('Dragon', DragonSchema);

export default Dragon;
