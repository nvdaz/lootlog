import keys from '../util/keys';
import { IBossReward } from './boss';

export enum GolemReward {
  EPIC_GOLEM_PET = 'EPIC_GOLEM_PET',
  LEGENDARY_GOLEM_PET = 'LEGENDARY_GOLEM_PET',
  PET_TIER_BOOST = 'PET_TIER_BOOST',
}

export const rewards = keys<GolemReward>(GolemReward);

export type IGolemReward = IBossReward<GolemReward>;

export const itemMap = new Map<GolemReward, string>([
  [GolemReward.LEGENDARY_GOLEM_PET, 'LEGENDARY_GOLEM_PET'],
  [GolemReward.EPIC_GOLEM_PET, 'EPIC_GOLEM_PET'],
  [GolemReward.PET_TIER_BOOST, 'PET_ITEM_TIER_BOOST_DROP'],
]);
