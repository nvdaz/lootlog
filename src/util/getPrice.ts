import Auction, { Modifier, modifiers, IAuction } from '../models/auction';
import quantile from './quantile';
import Bazaar from '../models/bazaar';

export default async function getPrice(
  item: string,
  allowedModifiers: Modifier[] = [],
  $lte: Date = new Date(),
  $gte: Date = new Date(Date.now() - 1.728e8),
  errorCount = 0,
): Promise<number> {
  const product = await Bazaar.findItem(item);

  if (product) {
    return Math.round(product.price);
  }

  const disallowedModifiers: Modifier[] = modifiers.filter(
    (mod: Modifier): boolean => !allowedModifiers.includes(mod),
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
  ).map(({ price }: IAuction): number => price);

  const q3 = quantile(prices, 0.75);
  const q1 = quantile(prices, 0.25);

  const filtered = prices.filter(
    (price: number): boolean => q3 >= price && q1 <= price,
  );

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
