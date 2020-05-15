"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _got = _interopRequireDefault(require("got"));
var _apolloServerExpress = require("apollo-server-express");




var _graphql = require("graphql");
var _crypto = _interopRequireDefault(require("crypto"));
var _moment = _interopRequireDefault(require("moment"));
var _lodash = _interopRequireDefault(require("lodash.groupby"));
var _semver = require("semver");

var _slayer = require("../consts/slayer");
var _pubSub = _interopRequireWildcard(require("./pubSub"));
var _getUsers = _interopRequireDefault(require("../util/getUsers"));
var _sha = _interopRequireDefault(require("../util/sha1"));
var _user = _interopRequireDefault(require("../models/user"));
var _jsonwebtoken = require("jsonwebtoken");
var _slayer2 = _interopRequireDefault(require("../models/slayer"));
var _golem = _interopRequireDefault(require("../models/golem"));
var _dragon = _interopRequireDefault(require("../models/dragon"));
var _version = _interopRequireDefault(require("../models/version"));
var _reward = _interopRequireDefault(require("../models/reward"));
var _appraise = _interopRequireWildcard(require("../util/appraise"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}





const dragons = (
{ _id: owner },
{ day = new Date(-1), skip = 0, limit = 50, utcOffset = 300 }) =>
{
  if (limit - skip > 50)
  throw new _apolloServerExpress.UserInputError('Requested too many values', {
    validationErrors: { limit: 'Requested too many values' } });


  return _dragon.default.find({
    owner,
    _id:
    day.getTime() === -1 ?
    {
      $exists: true } :

    {
      $gte: (0, _moment.default)(day).
      utcOffset(-utcOffset, false).
      startOf('day').
      valueOf(),
      $lte: (0, _moment.default)(day).
      utcOffset(-utcOffset, false).
      endOf('day').
      valueOf() } }).


  skip(skip).
  limit(limit).
  sort({ _id: -1 });
};

const dragonOverviews = async ({ _id: owner }, { utcOffset = 300 }) => {
  const dragons = await _dragon.default.find({ owner });

  return Object.entries({
    '-1': dragons,
    ...Object.fromEntries(
    Object.entries(
    (0, _lodash.default)(dragons, (dragon) =>
    (0, _moment.default)(dragon._id.getTimestamp()).
    utcOffset(-utcOffset, false).
    startOf('day').
    valueOf())).

    sort(([a], [b]) => a - b)) }).

  map(([day, dayDragons]) => ({
    _id: _crypto.default.createHash('md5').update(`DATE_OVERVIEW_${day}`).digest('hex'),
    day: new Date(parseInt(day, 10)),
    revenue: Math.round(dayDragons.reduce((a, { revenue }) => a + revenue, 0)),
    gross: Math.round(dayDragons.reduce((a, { gross }) => a + gross, 0)),
    dragonCount: dayDragons.length,
    dragonTypes: dayDragons.map(({ dragonType }) => dragonType) }));

};var _default =

{
  Date: new _graphql.GraphQLScalarType({
    name: 'Date',
    description:
    'Represents a javascript date object serialized by its epoch timestamp',
    parseValue: value => new Date(value),
    serialize: value => value.getTime(),
    parseLiteral: ({ kind, value }) =>
    kind === _graphql.Kind.INT ? new Date(value) : null }),

  RegExp: new _graphql.GraphQLScalarType({
    name: 'RegExp',
    description: 'Represents a regex pattern serialized by its source',
    parseValue: value => new RegExp(value),
    serialize: value => value.toString(),
    parseLiteral: ({ kind, value }) =>
    kind === _graphql.Kind.STRING ? new RegExp(value) : null }),

  User: {
    dragons,
    dragonOverviews,
    notableSlayers: ({ _id: owner }, { slayerType, skip = 0, limit = 20 }) =>
    _slayer2.default.find({
      owner,
      slayerType }).

    skip(skip).
    limit(limit).
    sort({
      _id: -1 }),

    slayerXp: async ({ _id: owner }, { slayerType }) =>
    (await _slayer2.default.find({ owner, slayerType })).reduce(
    (a, { tier }) => a + _slayer.tiers.find(({ tier: t }) => tier === t).xp,
    0) },


  BasicUser: {
    dragons,
    dragonOverviews },

  ItemProvider: {
    __resolveType({ type }) {
      switch (type) {
        case 'DRAGON':
          return 'DragonItemProvider';
        case 'SLAYER':
          return 'SlayerItemProvider';
        case 'GOLEM':
          return 'GolemItemProvider';}

    } },

  Subscription: {
    dragonAdded: {
      subscribe: (0, _apolloServerExpress.withFilter)(
      () => _pubSub.default.asyncIterator(_pubSub.DRAGON_ADDED),
      ({ dragonAdded }, { owner }) =>
      !owner || dragonAdded.owner.equals(owner)) } },



  Mutation: {
    async initChallenge(root, { uuid }) {
      try {
        const username = (
        await (0, _got.default)(`https://api.ashcon.app/mojang/v2/user/${uuid}`).json()).
        username;

        const { _id } = await _user.default.findByMinecraft(uuid);
        const serverID = (0, _sha.default)(_crypto.default.randomBytes(128).toString('hex'));

        return {
          serverID,
          token: (0, _jsonwebtoken.sign)(
          { data: { attempt: _id, username, uuid, serverID } },
          process.env.JWT_SECRET,
          { expiresIn: '10m' }) };


      } catch (err) {
        throw new _apolloServerExpress.AuthenticationError();
      }
    },
    async completeChallenge(root, { token }) {
      let id, uuid, username, serverID;
      try {
        const { data } = (0, _jsonwebtoken.verify)(token, process.env.JWT_SECRET);
        id = data.attempt;
        uuid = data.uuid;
        username = data.username;
        serverID = data.serverID;

        if (!id || !uuid || !username || !serverID) throw 0;
      } catch (err) {
        throw new _apolloServerExpress.UserInputError('Invalid challenge token', {
          validationErrors: { token: 'Invalid token' } });

      }

      try {
        const { statusCode } = await (0, _got.default)(
        `https://sessionserver.mojang.com/session/minecraft/hasJoined?username=${username}&serverId=${serverID}`);

        if (statusCode === 200) {
          return { token: (await _user.default.findById(id)).generateAuthToken() };
        } else throw 0;
      } catch (err) {
        throw new _apolloServerExpress.AuthenticationError('Did not join server');
      }
    },
    async setVersion(root, { version }, { user }) {
      const coercedVersion = (0, _semver.coerce)(version);

      await user.updateOne({ modVersion: coercedVersion });

      const hasCurrent = await _version.default.isCurrent(coercedVersion);

      return {
        isCurrent: hasCurrent,
        changelog: hasCurrent ?
        null :
        `https://lootlog.app/changelog/${coercedVersion}` };

    },
    async updateSettings(root, { displayName, eyePrice, username }, { user }) {
      if (displayName) await user.updateOne({ displayName });
      if (eyePrice) await user.updateOne({ eyePrice });
      if (username) {var _player$socialMedia, _player$socialMedia$l, _await$User$findByMin;
        const { success, player } = await (0, _got.default)(
        'https://sbstats.nvda.workers.dev/',
        {
          method: 'POST',
          json: { path: 'player', options: { name: username.trim() } } }).

        json();

        if (!success || !player)
        throw new _apolloServerExpress.UserInputError('Player has not joined Hypixel', {
          validationErrors: { username: 'Player has not joined Hypixel' } });


        const discord = player === null || player === void 0 ? void 0 : (_player$socialMedia = player.socialMedia) === null || _player$socialMedia === void 0 ? void 0 : (_player$socialMedia$l = _player$socialMedia.links) === null || _player$socialMedia$l === void 0 ? void 0 : _player$socialMedia$l.DISCORD;
        const minecraft = player === null || player === void 0 ? void 0 : player.minecraft;

        if (!discord)
        throw new _apolloServerExpress.UserInputError('Discord not connected to Hypixel', {
          validationErrors: {
            username: 'Discord not connected to Hypixel' } });


        if (discord !== user.tag)
        throw new _apolloServerExpress.UserInputError('Different Discord connected to Hypixel', {
          validationErrors: {
            username: 'Different Discord connected to Hypixel' } });


        if (((_await$User$findByMin = await _user.default.findByMinecraft(minecraft)) === null || _await$User$findByMin === void 0 ? void 0 : _await$User$findByMin.discord) !== user.discord)
        throw new _apolloServerExpress.UserInputError('Discord connected to different account!', {
          validationErrors: {
            username: 'Discord connected to different account' } });



        await user.updateOne({
          minecraft,
          username: player === null || player === void 0 ? void 0 : player.username });

      }

      return user;
    },
    async addDragon(
    root,
    { dragonType, rewards, eyesPlaced, day, leaderboardPlacement },
    { user })
    {
      const appraisedRewards = await (0, _appraise.default)({
        rewards,
        mode: _appraise.MODE_DRAGON_REWARDS,
        options: { dragonType } });

      const { _id: owner, eyePrice } = user;

      const revenue = appraisedRewards.reduce(
      (a, { appraisal }) => a + appraisal,
      0);

      const gross = revenue - eyesPlaced * eyePrice;

      const dragon = new _dragon.default({
        owner,
        dragonType,
        rewards: appraisedRewards,
        eyesPlaced,
        eyePrice,
        day,
        leaderboardPlacement,
        revenue,
        gross });


      _pubSub.default.publish(_pubSub.DRAGON_ADDED, { dragonAdded: dragon });
      return await dragon.save();
    },
    async addSlayer(root, { slayerType, rewards, tier }, { user }) {
      const appraisedRewards = await (0, _appraise.default)({
        rewards,
        mode: _appraise.MODE_SLAYER_REWARDS });

      const { _id: owner } = user;

      const revenue = appraisedRewards.reduce(
      (a, { appraisal }) => a + appraisal,
      0);

      const gross =
      revenue - _slayer.tiers.find(({ tier: t }) => tier === t).price;

      const slayer = new _slayer2.default({
        owner,
        slayerType,
        tier,
        rewards: appraisedRewards,
        revenue,
        gross });


      _pubSub.default.publish(_pubSub.SLAYER_ADDED, { slayerAdded: slayer });
      return await slayer.save();
    },
    async addGolem(root, { leaderboardPlacement, rewards }, { user }) {
      const appraisedRewards = await (0, _appraise.default)({
        rewards,
        mode: _appraise.MODE_GOLEM_REWARDS });

      const { _id: owner } = user;

      const revenue = appraisedRewards.reduce(
      (a, { appraisal }) => a + appraisal,
      0);


      const golem = new _golem.default({
        owner,
        leaderboardPlacement,
        rewards: appraisedRewards,
        revenue });


      _pubSub.default.publish(_pubSub.GOLEM_ADDED, { slayerAdded: golem });
      return await golem.save();
    } },

  Query: {
    users: _getUsers.default,
    currentUser: (root, args, { user }) => user,
    userById: (root, { id }) => _user.default.findById(id),
    userByName: (root, { username }) => _user.default.findByUsername(username),
    itemProviders: () => _reward.default.find(),
    dragonItemProviders: () => _reward.default.find({ type: 'DRAGON' }),
    slayerItemProviders: () => _reward.default.find({ type: 'SLAYER' }),
    golemItemProviders: () => _reward.default.find({ type: 'GOLEM' }),
    versions: () => _version.default.getVersions() } };exports.default = _default;