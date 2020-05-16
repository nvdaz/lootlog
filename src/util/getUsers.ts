import { Aggregate } from 'mongoose';
import Dragon, { IDragon } from '../models/dragon';
import User from '../models/user';

export default (): Aggregate<IDragon[]> =>
  Dragon.aggregate([
    {
      $group: {
        _id: '$owner',
        lastUpdated: {
          $last: '$_id',
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: '$_id',
        lastUpdated: '$lastUpdated',
        count: '$count',
        sort: {
          $add: [
            {
              $toLong: {
                $dateFromParts: {
                  year: { $year: '$lastUpdated' },
                  month: { $month: '$lastUpdated' },
                },
              },
            },
            {
              $divide: ['$count', 10000],
            },
          ],
        },
      },
    },
    {
      $sort: {
        sort: -1,
      },
    },
    {
      $lookup: {
        from: User.collection.collectionName,
        localField: '_id',
        foreignField: '_id',
        as: 'userData',
      },
    },
    {
      $unwind: '$userData',
    },
    {
      $replaceRoot: { newRoot: '$userData' },
    },
  ]);
