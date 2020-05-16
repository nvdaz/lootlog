import getPrice from './getPrice';
import { IBossRewardPrimitive, IBossReward } from '../consts/boss';
import {
  itemMap as dragonItemMap,
  DragonType,
  DragonReward,
} from '../consts/dragon';
import { itemMap as slayerItemMap, SlayerReward } from '../consts/slayer';
import { itemMap as golemItemMap, GolemReward } from '../consts/golem';

export enum Mode {
  DRAGON_REWARDS,
  SLAYER_REWARDS,
  GOLEM_REWARDS,
}

interface IAppraiseDragonOptions {
  dragonType: DragonType;
}

interface IAppraiseOptions<E> {
  rewards: IBossRewardPrimitive<E>[];
  mode: Mode;
  options?: IAppraiseDragonOptions;
}

export default async function appraise<E>({
  rewards,
  mode,
  options,
}: IAppraiseOptions<E>): Promise<IBossReward<E>[]> {
  if (mode === Mode.DRAGON_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal:
          count *
          (await getPrice(
            dragonItemMap
              .get(options.dragonType)
              .get((reward as unknown) as DragonReward),
          )),
      })),
    );
  } else if (mode === Mode.SLAYER_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal:
          count *
          (await getPrice(
            slayerItemMap.get((reward as unknown) as SlayerReward),
          )),
      })),
    );
  } else if (mode === Mode.GOLEM_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal:
          count *
          (await getPrice(
            golemItemMap.get((reward as unknown) as GolemReward),
          )),
      })),
    );
  } else {
    return [];
  }
}
