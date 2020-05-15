import getPrice from './getPrice';
import { itemMap as dragonItemMap } from '../consts/dragon';
import { itemMap as slayerItemMap } from '../consts/slayer';
import { itemMap as golemItemMap } from '../consts/slayer';

export const MODE_DRAGON_REWARDS = 'MODE_DRAGON_REWARDS';
export const MODE_SLAYER_REWARDS = 'MODE_SLAYER_REWARDS';
export const MODE_GOLEM_REWARDS = 'MODE_GOLEM_REWARDS';

export default async function appraise({ rewards, mode, options }) {
  if (mode === MODE_DRAGON_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal:
          count * (await getPrice(dragonItemMap[options.dragonType][reward])),
      })),
    );
  } else if (mode === MODE_SLAYER_REWARDS) {
    return await Promise.all(
      rewards.map(async ({ reward, count }) => ({
        reward,
        count,
        appraisal: count * (await getPrice(slayerItemMap[reward])),
      })),
    );
  } else if (mode === MODE_GOLEM_REWARDS) {
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
