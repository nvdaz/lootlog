import supportsWebp from './supportsWebp';

const map = {
  HELMET: {
    name: 'Helmet',
    image: (dragon) =>
      supportsWebp.then((webp) =>
        webp
          ? import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/helmet?webp`
            )
          : import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/helmet`
            ),
      ),
    imageStyle: {},
  },
  CHESTPLATE: {
    name: 'Chestplate',
    image: (dragon) =>
      supportsWebp.then((webp) =>
        webp
          ? import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/chestplate?webp`
            )
          : import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/chestplate`
            ),
      ),
    imageStyle: {},
  },
  LEGGINGS: {
    name: 'Leggings',
    image: (dragon) =>
      supportsWebp.then((webp) =>
        webp
          ? import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/leggings?webp`
            )
          : import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/leggings`
            ),
      ),
    imageStyle: {},
  },
  BOOTS: {
    name: 'Boots',
    image: (dragon) =>
      supportsWebp.then((webp) =>
        webp
          ? import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/boots?webp`
            )
          : import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/boots`
            ),
      ),
    imageStyle: {},
  },
  FRAGMENTS: {
    name: 'Fragments',
    image: (dragon) =>
      supportsWebp.then((webp) =>
        webp
          ? import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/fragments?webp`
            )
          : import(
              /* webpackMode: "eager" */ `../img/${dragon.toLowerCase()}/fragments`
            ),
      ),
    imageStyle: {},
  },
  ASPECT_OF_THE_DRAGONS: {
    name: 'AOTD',
    image: () =>
      supportsWebp.then((webp) =>
        webp
          ? import(
              /* webpackMode: "eager" */ `../img/aspect_of_the_dragons?webp`
            )
          : import(
              /* webpackMode: "eager" */ `../img/aspect_of_the_dragons`
            ),
      ),
    imageStyle: {
      imageRendering: 'pixelated',
    },
  },
  LEGENDARY_PET: {
    name: 'Legendary Pet',
    image: () =>
      supportsWebp.then((webp) =>
        webp
          ? import(/* webpackMode: "eager" */ `../img/pet?webp`)
          : import(/* webpackMode: "eager" */ `../img/pet`),
      ),
    imageStyle: {},
    sub: 'Legendary',
  },
  EPIC_PET: {
    name: 'Epic Pet',
    image: () =>
      supportsWebp.then((webp) =>
        webp
          ? import(/* webpackMode: "eager" */ `../img/pet?webp`)
          : import(/* webpackMode: "eager" */ `../img/pet`),
      ),
    imageStyle: {},
    sub: 'Epic',
  },
  default: {
    name: 'Unknown',
    image: () => {},
    imageStyle: {},
  },
};

export default function find(reward) {
  if (reward in map) return map[reward];
  return map.default;
}
