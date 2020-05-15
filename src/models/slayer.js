import { model, Schema, SchemaTypes } from 'mongoose';

import slayers, { rewards } from '../consts/slayer';

const SlayerSchema = new Schema({
  owner: {
    type: SchemaTypes.ObjectId,
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
  addSlayer({ owner, slayerType, rewards, tier }) {
    const slayer = new Slayer({ owner, slayerType, rewards, tier });

    return slayer;
  },
};

const Slayer = model('Slayer', SlayerSchema);

export default Slayer;
