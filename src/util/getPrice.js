import Auction from '../models/auction';
import quantile from './quantile';

export const MODIFIERS = ['ENCHANTED', 'REFORGED', 'HPB'];

export default async function getPrice(
  item,
  allowedModifiers = [],
  $lte = new Date(),
  $gte = new Date(Date.now() - 1.728e8),
  errorCount = 0,
) {
  const disallowedModifiers = MODIFIERS.filter(
    (mod) => !allowedModifiers.includes(mod),
  );

  const prices = (
    await Auction.aggregate([
      {
        $match: {
          item,
          modifiers: {
            $nin: disallowedModifiers,
          },
          endsAt: {
            $lte,
            $gte,
          },
        },
      },
      {
        $project: {
          price: '$price',
          uuid: '$uuid',
          delta: {
            $abs: {
              $subtract: ['$lastUpdated', '$endsAt'],
            },
          },
        },
      },
      {
        $match: {
          delta: {
            $lte: errorCount > 1 ? 3.6e6 : 120000,
          },
        },
      },
    ])
  ).map(({ price }) => price);

  const q3 = quantile(prices, 0.75);
  const q1 = quantile(prices, 0.25);

  const filtered = prices.filter((price) => q3 >= price && q1 <= price);

  let estimate = 0;

  if (filtered.length > 0)
    estimate = Math.round(
      filtered.reduce((a, b) => a + b, 0) / filtered.length,
    );
  else if (errorCount < 1)
    estimate = await getPrice(
      item,
      allowedModifiers,
      new Date(),
      new Date(Date.now() - 6.048e8),
      errorCount + 1,
    );

  return Math.max(item.includes('DRAGON') ? 1e5 : 1, estimate);
}
