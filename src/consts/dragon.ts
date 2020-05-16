import keys from '../util/keys';
import { IBossReward } from './boss';

export enum DragonType {
  SUPERIOR = 'SUPERIOR',
  STRONG = 'STRONG',
  UNSTABLE = 'UNSTABLE',
  WISE = 'WISE',
  YOUNG = 'YOUNG',
  OLD = 'OLD',
  PROTECTOR = 'PROTECTOR',
}

export default keys<DragonType>(DragonType);

export enum DragonReward {
  HELMET = 'HELMET',
  CHESTPLATE = 'CHESTPLATE',
  LEGGINGS = 'LEGGINGS',
  BOOTS = 'BOOTS',
  ASPECT_OF_THE_DRAGONS = 'ASPECT_OF_THE_DRAGONS',
  LEGENDARY_PET = 'LEGENDARY_PET',
  EPIC_PET = 'EPIC_PET',
  DRAGON_SCALE = 'DRAGON_SCALE',
  DRAGON_CLAW = 'DRAGON_CLAW',
  DRAGON_HORN = 'DRAGON_HORN',
  FRAGMENTS = 'FRAGMENTS',
}

export const rewards = keys<DragonReward>(DragonReward);

export type IDragonReward = IBossReward<DragonReward>;

export const itemMap = new Map<DragonType, Map<DragonReward, string>>([
  [
    DragonType.SUPERIOR,
    new Map<DragonReward, string>([
      [DragonReward.HELMET, 'SUPERIOR_DRAGON_HELMET'],
      [DragonReward.CHESTPLATE, 'SUPERIOR_DRAGON_CHESTPLATE'],
      [DragonReward.LEGGINGS, 'SUPERIOR_DRAGON_LEGGINGS'],
      [DragonReward.BOOTS, 'SUPERIOR_DRAGON_BOOTS'],
      [DragonReward.ASPECT_OF_THE_DRAGONS, 'ASPECT_OF_THE_DRAGON'],
      [DragonReward.LEGENDARY_PET, 'LEGENDARY_ENDER_DRAGON_PET'],
      [DragonReward.EPIC_PET, 'EPIC_ENDER_DRAGON_PET'],
    ]),
  ],
  [
    DragonType.STRONG,
    new Map<DragonReward, string>([
      [DragonReward.HELMET, 'STRONG_DRAGON_HELMET'],
      [DragonReward.CHESTPLATE, 'STRONG_DRAGON_CHESTPLATE'],
      [DragonReward.LEGGINGS, 'STRONG_DRAGON_LEGGINGS'],
      [DragonReward.BOOTS, 'STRONG_DRAGON_BOOTS'],
      [DragonReward.ASPECT_OF_THE_DRAGONS, 'ASPECT_OF_THE_DRAGON'],
      [DragonReward.LEGENDARY_PET, 'LEGENDARY_ENDER_DRAGON_PET'],
      [DragonReward.EPIC_PET, 'EPIC_ENDER_DRAGON_PET'],
    ]),
  ],
  [
    DragonType.UNSTABLE,
    new Map<DragonReward, string>([
      [DragonReward.HELMET, 'UNSTABLE_DRAGON_HELMET'],
      [DragonReward.CHESTPLATE, 'UNSTABLE_DRAGON_CHESTPLATE'],
      [DragonReward.LEGGINGS, 'UNSTABLE_DRAGON_LEGGINGS'],
      [DragonReward.BOOTS, 'UNSTABLE_DRAGON_BOOTS'],
      [DragonReward.ASPECT_OF_THE_DRAGONS, 'ASPECT_OF_THE_DRAGON'],
      [DragonReward.LEGENDARY_PET, 'LEGENDARY_ENDER_DRAGON_PET'],
      [DragonReward.EPIC_PET, 'EPIC_ENDER_DRAGON_PET'],
    ]),
  ],
  [
    DragonType.WISE,
    new Map<DragonReward, string>([
      [DragonReward.HELMET, 'WISE_DRAGON_HELMET'],
      [DragonReward.CHESTPLATE, 'WISE_DRAGON_CHESTPLATE'],
      [DragonReward.LEGGINGS, 'WISE_DRAGON_LEGGINGS'],
      [DragonReward.BOOTS, 'WISE_DRAGON_BOOTS'],
      [DragonReward.ASPECT_OF_THE_DRAGONS, 'ASPECT_OF_THE_DRAGON'],
      [DragonReward.LEGENDARY_PET, 'LEGENDARY_ENDER_DRAGON_PET'],
      [DragonReward.EPIC_PET, 'EPIC_ENDER_DRAGON_PET'],
    ]),
  ],
  [
    DragonType.YOUNG,
    new Map<DragonReward, string>([
      [DragonReward.HELMET, 'YOUNG_DRAGON_HELMET'],
      [DragonReward.CHESTPLATE, 'YOUNG_DRAGON_CHESTPLATE'],
      [DragonReward.LEGGINGS, 'YOUNG_DRAGON_LEGGINGS'],
      [DragonReward.BOOTS, 'YOUNG_DRAGON_BOOTS'],
      [DragonReward.ASPECT_OF_THE_DRAGONS, 'ASPECT_OF_THE_DRAGON'],
      [DragonReward.LEGENDARY_PET, 'LEGENDARY_ENDER_DRAGON_PET'],
      [DragonReward.EPIC_PET, 'EPIC_ENDER_DRAGON_PET'],
    ]),
  ],
  [
    DragonType.OLD,
    new Map<DragonReward, string>([
      [DragonReward.HELMET, 'OLD_DRAGON_HELMET'],
      [DragonReward.CHESTPLATE, 'OLD_DRAGON_CHESTPLATE'],
      [DragonReward.LEGGINGS, 'OLD_DRAGON_LEGGINGS'],
      [DragonReward.BOOTS, 'OLD_DRAGON_BOOTS'],
      [DragonReward.ASPECT_OF_THE_DRAGONS, 'ASPECT_OF_THE_DRAGON'],
      [DragonReward.LEGENDARY_PET, 'LEGENDARY_ENDER_DRAGON_PET'],
      [DragonReward.EPIC_PET, 'EPIC_ENDER_DRAGON_PET'],
    ]),
  ],
  [
    DragonType.PROTECTOR,
    new Map<DragonReward, string>([
      [DragonReward.HELMET, 'PROTECTOR_DRAGON_HELMET'],
      [DragonReward.CHESTPLATE, 'PROTECTOR_DRAGON_CHESTPLATE'],
      [DragonReward.LEGGINGS, 'PROTECTOR_DRAGON_LEGGINGS'],
      [DragonReward.BOOTS, 'PROTECTOR_DRAGON_BOOTS'],
      [DragonReward.ASPECT_OF_THE_DRAGONS, 'ASPECT_OF_THE_DRAGON'],
      [DragonReward.LEGENDARY_PET, 'LEGENDARY_ENDER_DRAGON_PET'],
      [DragonReward.EPIC_PET, 'EPIC_ENDER_DRAGON_PET'],
    ]),
  ],
]);
