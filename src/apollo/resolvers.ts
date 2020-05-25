import got from 'got';
import {
  AuthenticationError,
  UserInputError,
  withFilter,
} from 'apollo-server-express';
import {
  GraphQLScalarType,
  Kind,
  StringValueNode,
  IntValueNode,
} from 'graphql';
import crypto from 'crypto';
import moment from 'moment';
import groupBy from 'lodash.groupby';
import { coerce } from 'semver';
import { ObjectID } from 'bson';
import { tiers as slayerTiers, SlayerReward } from '../consts/slayer';
import pubSub, { SubType } from './pubSub';
import getUsers from '../util/getUsers';
import getMinecraftUser from '../util/getMinecraft';
import digest from '../util/sha1';
import User, { IUser } from '../models/user';
import { sign, verify } from 'jsonwebtoken';
import Slayer, { ISlayer } from '../models/slayer';
import Golem, { IGolem } from '../models/golem';
import Dragon, { IDragon } from '../models/dragon';
import Version, { IVersion } from '../models/version';
import Reward, { IReward } from '../models/reward';
import appraise, { Mode } from '../util/appraise';
import { DocumentQuery } from 'mongoose';
import { Boss } from '../consts/boss';
import { IDragonOverview, IAuthChallenge, ISetVersionResult } from './types';
import { DragonReward } from '../consts/dragon';
import { GolemReward } from '../consts/golem';

const dragons = (
  { _id: owner },
  { day = new Date(-1), skip = 0, limit = 50, utcOffset = 300 },
): DocumentQuery<IDragon[], IDragon> => {
  if (limit - skip > 50)
    throw new UserInputError('Requested too many values', {
      validationErrors: { limit: 'Requested too many values' },
    });

  return Dragon.find({
    owner,
    _id:
      day.getTime() === -1
        ? {
            $exists: true,
          }
        : {
            $gte: moment(day)
              .utcOffset(-utcOffset, false)
              .startOf('day')
              .valueOf(),
            $lte: moment(day)
              .utcOffset(-utcOffset, false)
              .endOf('day')
              .valueOf(),
          },
  })
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 });
};

const dragonOverviews = async (
  { _id: owner },
  { utcOffset = 300 },
): Promise<IDragonOverview[]> => {
  const dragons = await Dragon.find({ owner });

  return Object.entries({
    '-1': dragons,
    ...Object.fromEntries(
      Object.entries(
        groupBy(dragons, (dragon) =>
          moment(dragon._id.getTimestamp())
            .utcOffset(-utcOffset, false)
            .startOf('day')
            .valueOf(),
        ),
      ).sort(
        ([a]: [string, unknown], [b]: [string, unknown]) =>
          parseInt(a) - parseInt(b),
      ),
    ),
  }).map(([day, dayDragons]) => ({
    _id: crypto.createHash('md5').update(`DATE_OVERVIEW_${day}`).digest('hex'),
    day: new Date(parseInt(day, 10)),
    revenue: Math.round(dayDragons.reduce((a, { revenue }) => a + revenue, 0)),
    gross: Math.round(dayDragons.reduce((a, { gross }) => a + gross, 0)),
    dragonCount: dayDragons.length,
    dragonTypes: dayDragons.map(({ dragonType }) => dragonType),
  }));
};

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description:
      'Represents a javascript date object serialized by its epoch timestamp',
    parseValue: (value: number): Date => new Date(value),
    serialize: (value: Date): number => value.getTime(),
    parseLiteral: ({ kind, value }: IntValueNode): Date =>
      kind === Kind.INT ? new Date(value) : null,
  }),
  RegExp: new GraphQLScalarType({
    name: 'RegExp',
    description: 'Represents a regex pattern serialized by its source',
    parseValue: (value: string): RegExp => new RegExp(value),
    serialize: (value: RegExp): string => value.toString(),
    parseLiteral: ({ kind, value }: StringValueNode): RegExp =>
      kind === Kind.STRING ? new RegExp(value) : null,
  }),
  ObjectID: new GraphQLScalarType({
    name: 'ObjectID',
    description: 'Represents a bson objectid serialized to its hex value',
    parseValue: (value: string): ObjectID => new ObjectID(value),
    serialize: (value: ObjectID): string => value.toString(),
    parseLiteral: ({ kind, value }: StringValueNode): ObjectID =>
      kind === Kind.STRING ? new ObjectID(value) : null,
  }),
  User: {
    dragons,
    dragonOverviews,
    notableSlayers: (
      { _id: owner },
      { slayerType, skip = 0, limit = 20 },
    ): DocumentQuery<ISlayer[], ISlayer> =>
      Slayer.find({
        owner,
        slayerType,
      })
        .skip(skip)
        .limit(limit)
        .sort({
          _id: -1,
        }),
    slayerXp: async ({ _id: owner }, { slayerType }): Promise<number> =>
      (await Slayer.find({ owner, slayerType })).reduce(
        (a, { tier }) => a + slayerTiers.find(({ tier: t }) => tier === t).xp,
        0,
      ),
  },
  BasicUser: {
    dragons,
    dragonOverviews,
  },
  ItemProvider: {
    __resolveType({ type }): string {
      switch (type) {
        case 'DRAGON':
          return 'DragonItemProvider';
        case 'SLAYER':
          return 'SlayerItemProvider';
        case 'GOLEM':
          return 'GolemItemProvider';
      }
    },
  },
  Reward: {
    __resolveType(): void {
      /** this is unecessary */
    },
  },
  Subscription: {
    dragonAdded: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(SubType.DRAGON_ADDED),
        ({ dragonAdded }, { owner }) =>
          !owner || dragonAdded.owner.equals(owner),
      ),
    },
  },
  Mutation: {
    async initChallenge(root, { uuid }): Promise<IAuthChallenge> {
      try {
        const username = (await getMinecraftUser(uuid)).username;

        const { _id } = await User.findByMinecraft(uuid);
        const serverID = digest(crypto.randomBytes(128).toString('hex'));

        return {
          serverID,
          token: sign(
            { data: { attempt: _id, username, uuid, serverID } },
            process.env.JWT_SECRET,
            { expiresIn: '10m' },
          ),
        };
      } catch (err) {
        throw new AuthenticationError('Invalid');
      }
    },
    async completeChallenge(root, { token }): Promise<string> {
      let id, uuid, username, serverID;
      try {
        const { data } = verify(token, process.env.JWT_SECRET);
        id = data.attempt;
        uuid = data.uuid;
        username = data.username;
        serverID = data.serverID;

        if (!id || !uuid || !username || !serverID) throw 0;
      } catch (err) {
        throw new UserInputError('Invalid challenge token', {
          validationErrors: { token: 'Invalid token' },
        });
      }

      try {
        const { statusCode } = await got(
          `https://sessionserver.mojang.com/session/minecraft/hasJoined?username=${username}&serverId=${serverID}`,
        );
        if (statusCode === 200)
          return (await User.findById(id)).generateAuthToken();
        else throw 0;
      } catch (err) {
        throw new AuthenticationError('Did not join server');
      }
    },
    async setVersion(root, { version }, { user }): Promise<ISetVersionResult> {
      const coercedVersion = coerce(version);

      await user.updateOne({ modVersion: coercedVersion });

      const hasCurrent = await Version.isCurrent(coercedVersion);

      return {
        isCurrent: hasCurrent,
        changelog: hasCurrent
          ? null
          : `https://lootlog.app/changelog/${coercedVersion}`,
      };
    },
    async updateSettings(
      root,
      { displayName, eyePrice, username },
      { user },
    ): Promise<IUser> {
      if (displayName) await user.updateOne({ displayName });
      if (eyePrice) await user.updateOne({ eyePrice });
      if (username) {
        const { success, player } = await got(
          'https://sbstats.nvda.workers.dev/',
          {
            method: 'POST',
            json: { path: 'player', options: { name: username.trim() } },
          },
        ).json();

        if (!success || !player)
          throw new UserInputError('Player has not joined Hypixel', {
            validationErrors: { username: 'Player has not joined Hypixel' },
          });

        const discord = player?.socialMedia?.links?.DISCORD;
        const minecraft = player?.minecraft;

        if (!discord)
          throw new UserInputError('Discord not connected to Hypixel', {
            validationErrors: {
              username: 'Discord not connected to Hypixel',
            },
          });
        if (discord !== user.tag)
          throw new UserInputError('Different Discord connected to Hypixel', {
            validationErrors: {
              username: 'Different Discord connected to Hypixel',
            },
          });
        if ((await User.findByMinecraft(minecraft))?.discord !== user.discord)
          throw new UserInputError('Discord connected to different account!', {
            validationErrors: {
              username: 'Discord connected to different account',
            },
          });

        await user.updateOne({
          minecraft,
          username: player?.username,
        });
      }

      return user;
    },
    async addDragon(
      root,
      { dragonType, rewards, eyesPlaced, day, leaderboardPlacement },
      { user },
    ): Promise<IDragon> {
      const appraisedRewards = await appraise<DragonReward>({
        rewards,
        mode: Mode.DRAGON_REWARDS,
        options: { dragonType },
      });
      const { _id: owner, eyePrice } = user;

      const revenue = appraisedRewards.reduce(
        (a, { appraisal }) => a + appraisal,
        0,
      );
      const gross = revenue - eyesPlaced * eyePrice;

      const dragon = new Dragon({
        owner,
        dragonType,
        rewards: appraisedRewards,
        eyesPlaced,
        eyePrice,
        day,
        leaderboardPlacement,
        revenue,
        gross,
      });

      pubSub.publish(SubType.DRAGON_ADDED, { dragonAdded: dragon });
      return await dragon.save();
    },
    async addSlayer(
      root,
      { slayerType, rewards, tier },
      { user },
    ): Promise<ISlayer> {
      const appraisedRewards = await appraise<SlayerReward>({
        rewards,
        mode: Mode.SLAYER_REWARDS,
      });
      const { _id: owner } = user;

      const revenue = appraisedRewards.reduce(
        (a, { appraisal }) => a + appraisal,
        0,
      );
      const gross =
        revenue - slayerTiers.find(({ tier: t }) => tier === t).price;

      const slayer = new Slayer({
        owner,
        slayerType,
        tier,
        rewards: appraisedRewards,
        revenue,
        gross,
      });

      pubSub.publish(SubType.SLAYER_ADDED, { slayerAdded: slayer });
      return await slayer.save();
    },
    async addGolem(
      root,
      { leaderboardPlacement, rewards },
      { user },
    ): Promise<IGolem> {
      const appraisedRewards = await appraise<GolemReward>({
        rewards,
        mode: Mode.GOLEM_REWARDS,
      });
      const { _id: owner } = user;

      const revenue = appraisedRewards.reduce(
        (a, { appraisal }) => a + appraisal,
        0,
      );

      const golem = new Golem({
        owner,
        leaderboardPlacement,
        rewards: appraisedRewards,
        revenue,
      });

      pubSub.publish(SubType.GOLEM_ADDED, { slayerAdded: golem });
      return await golem.save();
    },
  },
  Query: {
    users: getUsers,
    currentUser: (root, args, { user }): IUser => user,
    userById: (root, { id }): DocumentQuery<IUser, IUser> => User.findById(id),
    userByName: (root, { username }): DocumentQuery<IUser, IUser> =>
      User.findByUsername(username),
    itemProviders: (): DocumentQuery<IReward[], IReward> => Reward.find(),
    dragonItemProviders: (): DocumentQuery<IReward[], IReward> =>
      Reward.findByType(Boss.DRAGON),
    slayerItemProviders: (): DocumentQuery<IReward[], IReward> =>
      Reward.findByType(Boss.SLAYER),
    golemItemProviders: (): DocumentQuery<IReward[], IReward> =>
      Reward.findByType(Boss.GOLEM),
    versions: (): IVersion[] => Version.getVersions(),
  },
};
