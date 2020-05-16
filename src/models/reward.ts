import { model, Schema, Document, Model, DocumentQuery } from 'mongoose';

import { SlayerReward, rewards as slayerRewards } from '../consts/slayer';
import { DragonReward, rewards as dragonRewards } from '../consts/dragon';
import { GolemReward, rewards as golemRewards } from '../consts/golem';
import keys from '../util/keys';
import { bosses, Boss } from '../consts/boss';

enum MatchMode {
  ITEM_PACKET,
  ITEM_DELTA,
  CHAT_FORMATTED,
  CHAT_UNFORMATTED,
}

const matchModes = keys<MatchMode>(MatchMode);

const RewardSchema = new Schema({
  type: {
    type: String,
    enum: bosses,
    required: true,
  },
  test: {
    type: RegExp,
    required: true,
  },
  mode: {
    type: String,
    enum: matchModes,
    required: true,
  },
  item: {
    type: String,
    enum: [...slayerRewards, ...dragonRewards, ...golemRewards],
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

RewardSchema.statics = {
  findByType: (type: Boss): DocumentQuery<IReward[], IReward> =>
    Reward.find({ type }),
};

export interface IReward extends Document {
  type: Boss;
  test: RegExp;
  mode: MatchMode;
  item: DragonReward | SlayerReward | GolemReward;
  minecraftItem: string;
  texture: string;
  metadata: number;
}

export interface IRewardModel extends Model<IReward> {
  findByType(type: Boss): DocumentQuery<IReward[], IReward>;
}

const Reward: IRewardModel = model<IReward, IRewardModel>(
  'Reward',
  RewardSchema,
);

export default Reward;
