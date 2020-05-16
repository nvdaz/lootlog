import { DragonReward } from './dragon';
import { SlayerReward } from './slayer';
import { GolemReward } from './golem';
import keys from '../util/keys';

export interface IBossRewardPrimitive<
  E = DragonReward | SlayerReward | GolemReward
> {
  reward: E;
  count: number;
}

export interface IBossReward<E = DragonReward | SlayerReward | GolemReward>
  extends IBossRewardPrimitive<E> {
  appraisal: number;
}

export enum Boss {
  DRAGON = 'DRAGON',
  SLAYER = 'SLAYER',
  GOLEM = 'GOLEM',
}

export const bosses = keys<Boss>(Boss);
