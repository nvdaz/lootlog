import { DragonReward } from './dragon';
import { SlayerReward } from './slayer';
import { GolemReward } from './golem';
import enumToArray from '../util/enumToArray';

export interface IBossRewardPrimitive {
  reward: DragonReward | SlayerReward | GolemReward;
  count: number;
}

export interface IBossReward extends IBossRewardPrimitive {
  appraisal: number;
}

export enum Boss {
  DRAGON = 'DRAGON',
  SLAYER = 'SLAYER',
  GOLEM = 'GOLEM',
}

export const bosses = enumToArray(Boss);
