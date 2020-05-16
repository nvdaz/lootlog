import enumToArray from '../util/enumToArray';
import { IBossReward } from './boss';

export enum GolemReward {
  EPIC_GOLEM_PET,
  LEGENDARY_GOLEM_PET,
  PET_TIER_BOOST,
}

export const rewards = enumToArray<GolemReward>(GolemReward);

export interface IGolemReward extends IBossReward {
  reward: GolemReward;
}

export const itemMap = {
  LEGENDARY_PET: 'LEGENDARY_GOLEM_PET',
  EPIC_PET: 'EPIC_GOLEM_PET',
  PET_TIER_BOOST: 'PET_ITEM_TIER_BOOST_DROP',
};
