import keys from '../util/keys';
import { IBossReward } from './boss';

export enum SlayerType {
  REVENANT = 'REVENANT',
  TARANTULA = 'TARANTULA',
  WOLF = 'WOLF',
}

export default keys<SlayerType>(SlayerType);

export enum SlayerReward {
  SCYTHE_BLADE = 'SCYTHE_BLADE',
  SNAKE_RUNE = 'SNAKE_RUNE',
  REVENANT_CATALYST = 'REVENANT_CATALYST',
  BEHEADED_HORROR = 'BEHEADED_HORROR',
  SMITE_VI_BOOK = 'SMITE_VI_BOOK',
  UNDEAD_CATALYST = 'UNDEAD_CATALYST',
  PESTILENCE_RUNE = 'PESTILENCE_RUNE',
  FOUL_FLESH = 'FOUL_FLESH',
  REVENANT_FLESH = 'REVENANT_FLESH',
  DIGESTED_MOSQUITO = 'DIGESTED_MOSQUITO',
  TARANTULA_TALISMAN = 'TARANTULA_TALISMAN',
  FLY_SWATTER = 'FLY_SWATTER',
  BANE_VI_BOOK = 'BANE_VI_BOOK',
  SPIDER_CATALYST = 'SPIDER_CATALYST',
  BITE_RUNE = 'BITE_RUNE',
  TOXIC_ARROW_POISON = 'TOXIC_ARROW_POISON',
  TARANTULA_WEB = 'TARANTULA_WEB',
  OVERFLUX_CAPACITOR = 'OVERFLUX_CAPACITOR',
  GRIZZLY_BAIT = 'GRIZZLY_BAIT',
  RED_CLAW_EGG = 'RED_CLAW_EGG',
  COUTURE_RUNE = 'COUTURE_RUNE',
  CRITICAL_VI_BOOK = 'CRITICAL_VI_BOOK',
  SPIRIT_RUNE = 'SPIRIT_RUNE',
  HAMSTER_WHEEL = 'HAMSTER_WHEEL',
  WOLF_TOOTH = 'WOLF_TOOTH',
}

export const rewards = keys<SlayerReward>(SlayerReward);

export type ISlayerReward = IBossReward<SlayerReward>;

export const itemMap = new Map<SlayerReward, string>([
  [SlayerReward.SCYTHE_BLADE, 'SCYTHE_BLADE'],
  [SlayerReward.SNAKE_RUNE, 'SNAKE_1_RUNE'],
  [SlayerReward.UNDEAD_CATALYST, 'UNDEAD_CATALYST'],
  [SlayerReward.PESTILENCE_RUNE, 'ZOMBIE_SLAYER_1_RUNE'],
  [SlayerReward.SMITE_VI_BOOK, 'SMITE_6_ENCHANTED_BOOK'],
  [SlayerReward.BANE_VI_BOOK, 'BANE_OF_ARTHROPODS_6_BOOK'],
  [SlayerReward.CRITICAL_VI_BOOK, 'CRITICAL_6_BOOK'],
  [SlayerReward.REVENANT_CATALYST, 'REVENANT_CATALYST'],
  [SlayerReward.BEHEADED_HORROR, 'BEHEADED_HORROR'],
  [SlayerReward.FOUL_FLESH, 'FOUL_FLESH'],
  [SlayerReward.DIGESTED_MOSQUITO, 'DIGESTED_MOSQUITO'],
  [SlayerReward.SPIDER_CATALYST, 'SPIDER_CATALYST'],
  [SlayerReward.BITE_RUNE, 'BITE_1_RUNE'],
  [SlayerReward.RED_CLAW_EGG, 'RED_CLAW_EGG'],
  [SlayerReward.COUTURE_RUNE, 'COUTURE_1_RUNE'],
  [SlayerReward.REVENANT_FLESH, 'REVENANT_FLESH'],
  [SlayerReward.TOXIC_ARROW_POISON, 'TOXIC_ARROW_POISON'],
  [SlayerReward.TARANTULA_WEB, 'TARANTULA_WEB'],
  [SlayerReward.TARANTULA_TALISMAN, 'TARANTULA_TALISMAN'],
  [SlayerReward.FLY_SWATTER, 'FLY_SWATTER'],
  [SlayerReward.OVERFLUX_CAPACITOR, 'OVERFLUX_CAPACITOR'],
  [SlayerReward.GRIZZLY_BAIT, 'GRIZZLY_BAIT'],
  [SlayerReward.WOLF_TOOTH, 'WOLF_TOOTH'],
  [SlayerReward.HAMSTER_WHEEL, 'HAMSTER_WHEEL'],
  [SlayerReward.SPIRIT_RUNE, 'SPIRIT_1_RUNE'],
]);

export const tiers = [
  {
    tier: 1,
    price: 100,
    xp: 5,
  },
  {
    tier: 2,
    price: 2000,
    xp: 25,
  },
  {
    tier: 3,
    price: 10000,
    xp: 100,
  },
  {
    tier: 4,
    price: 50000,
    xp: 500,
  },
];
