import getPrice from './getPrice';
import { IBossRewardPrimitive, IBossReward } from '../consts/boss';
import { itemMap as dragonItemMap, DragonType } from '../consts/dragon';
import { itemMap as slayerItemMap } from '../consts/slayer';
import { itemMap as golemItemMap } from '../consts/slayer';

export enum Mode {
  DRAGON_REWARDS,
  SLAYER_REWARDS,
  GOLEM_REWARDS,
}

interface IAppraiseDragonOptions {
  dragonType: DragonType;
}

interface IAppraiseOptions {
  rewards: IBossRewardPrimitive[];
  mode: Mode;
  options?: IAppraiseDragonOptions;
}

export default async function appraise({
  rewards,
  mode,
  options,
}: IAppraiseOptions): Promise<IBossReward[]> {
  if (mode === Mode.DRAGON_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal:
          count * (await getPrice(dragonItemMap[options.dragonType][reward])),
      })),
    );
  } else if (mode === Mode.SLAYER_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal: count * (await getPrice(slayerItemMap[reward])),
      })),
    );
  } else if (mode === Mode.GOLEM_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal: count * (await getPrice(golemItemMap[reward])),
      })),
    );
  } else {
    return [];
  }
}
