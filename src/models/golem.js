import { model, Schema, SchemaTypes } from 'mongoose';

import { rewards } from '../consts/golem';

const GolemSchema = new Schema({
  owner: {
    type: SchemaTypes.ObjectId,
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

const Golem = model('Golem', GolemSchema);

export default Golem;
