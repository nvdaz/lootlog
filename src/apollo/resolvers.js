import got from 'got';
import {
  AuthenticationError,
  UserInputError,
  withFilter,
} from 'apollo-server-express';
import { GraphQLScalarType, Kind } from 'graphql';
import crypto from 'crypto';
import moment from 'moment';
import groupBy from 'lodash.groupby';
import { coerce } from 'semver';

import { tiers as slayerTiers } from '../consts/slayer';
import pubSub, { DRAGON_ADDED, SLAYER_ADDED, GOLEM_ADDED } from './pubSub';
import getUsers from '../util/getUsers';
import digest from '../util/sha1';
import User from '../models/user';
import { sign, verify } from 'jsonwebtoken';
import Slayer from '../models/slayer';
import Golem from '../models/golem';
import Dragon from '../models/dragon';
import Version from '../models/version';
import Reward from '../models/reward';
import appraise, {
  MODE_DRAGON_REWARDS,
  MODE_SLAYER_REWARDS,
  MODE_GOLEM_REWARDS,
} from '../util/appraise';

const dragons = (
  { _id: owner },
  { day = new Date(-1), skip = 0, limit = 50, utcOffset = 300 },
) => {
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

const dragonOverviews = async ({ _id: owner }, { utcOffset = 300 }) => {
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
      ).sort(([a], [b]) => a - b),
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
    parseValue: (value) => new Date(value),
    serialize: (value) => value.getTime(),
    parseLiteral: ({ kind, value }) =>
      kind === Kind.INT ? new Date(value) : null,
  }),
  RegExp: new GraphQLScalarType({
    name: 'RegExp',
    description: 'Represents a regex pattern serialized by its source',
    parseValue: (value) => new RegExp(value),
    serialize: (value) => value.toString(),
    parseLiteral: ({ kind, value }) =>
      kind === Kind.STRING ? new RegExp(value) : null,
  }),
  User: {
    dragons,
    dragonOverviews,
    notableSlayers: ({ _id: owner }, { slayerType, skip = 0, limit = 20 }) =>
      Slayer.find({
        owner,
        slayerType,
      })
        .skip(skip)
        .limit(limit)
        .sort({
          _id: -1,
        }),
    slayerXp: async ({ _id: owner }, { slayerType }) =>
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
    __resolveType({ type }) {
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
  Subscription: {
    dragonAdded: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(DRAGON_ADDED),
        ({ dragonAdded }, { owner }) =>
          !owner || dragonAdded.owner.equals(owner),
      ),
    },
  },
  Mutation: {
    async initChallenge(root, { uuid }) {
      try {
        const username = (
          await got(`https://api.ashcon.app/mojang/v2/user/${uuid}`).json()
        ).username;

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
        throw new AuthenticationError();
      }
    },
    async completeChallenge(root, { token }) {
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
        if (statusCode === 200) {
          return { token: (await User.findById(id)).generateAuthToken() };
        } else throw 0;
      } catch (err) {
        throw new AuthenticationError('Did not join server');
      }
    },
    async setVersion(root, { version }, { user }) {
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
    async updateSettings(root, { displayName, eyePrice, username }, { user }) {
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
    ) {
      const appraisedRewards = await appraise({
        rewards,
        mode: MODE_DRAGON_REWARDS,
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

      pubSub.publish(DRAGON_ADDED, { dragonAdded: dragon });
      return await dragon.save();
    },
    async addSlayer(root, { slayerType, rewards, tier }, { user }) {
      const appraisedRewards = await appraise({
        rewards,
        mode: MODE_SLAYER_REWARDS,
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

      pubSub.publish(SLAYER_ADDED, { slayerAdded: slayer });
      return await slayer.save();
    },
    async addGolem(root, { leaderboardPlacement, rewards }, { user }) {
      const appraisedRewards = await appraise({
        rewards,
        mode: MODE_GOLEM_REWARDS,
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

      pubSub.publish(GOLEM_ADDED, { slayerAdded: golem });
      return await golem.save();
    },
  },
  Query: {
    users: getUsers,
    currentUser: (root, args, { user }) => user,
    userById: (root, { id }) => User.findById(id),
    userByName: (root, { username }) => User.findByUsername(username),
    itemProviders: () => Reward.find(),
    dragonItemProviders: () => Reward.find({ type: 'DRAGON' }),
    slayerItemProviders: () => Reward.find({ type: 'SLAYER' }),
    golemItemProviders: () => Reward.find({ type: 'GOLEM' }),
    versions: () => Version.getVersions(),
  },
};
