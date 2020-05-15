import { model, Schema } from 'mongoose';

import { rewards as slayerRewards } from '../consts/slayer';
import { rewards as dragonRewards } from '../consts/dragon';

const RewardSchema = new Schema({
  type: {
    type: String,
    enum: ['DRAGON', 'SLAYER'],
    required: true,
  },
  test: {
    type: RegExp,
    required: true,
  },
  mode: {
    type: String,
    enum: ['ITEM_PACKET', 'ITEM_DELTA', 'CHAT_FORMATTED', 'CHAT_UNFORMATTED'],
    required: true,
  },
  item: {
    type: String,
    enum: [...slayerRewards, ...dragonRewards],
    unique: true,
    required: true,
  },
  minecraftItem: {
    type: String,
    required: true,
  },
  texture: {
    type: String,
    sparse: true,
  },
  metadata: {
    type: Number,
    sparse: true,
  },
});

const Reward = model('Reward', RewardSchema);

export default Reward;
