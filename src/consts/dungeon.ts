import keys from '../util/keys';
import { IBossReward } from './boss';

export enum DungeonReward {}

export const rewards = keys<DungeonReward>(DungeonReward);

export interface IDungeonRewardStats {
  [key?: string]: number;
}

export interface IDungeonReward extends IBossReward<DungeonReward> {
  stats: IDungeonRewardStats;
}

export const itemMap = new Map<DungeonReward, string>([]);
