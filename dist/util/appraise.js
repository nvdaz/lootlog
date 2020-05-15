"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = appraise;exports.MODE_GOLEM_REWARDS = exports.MODE_SLAYER_REWARDS = exports.MODE_DRAGON_REWARDS = void 0;var _getPrice = _interopRequireDefault(require("./getPrice"));
var _dragon = require("../consts/dragon");
var _slayer = require("../consts/slayer");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


const MODE_DRAGON_REWARDS = 'MODE_DRAGON_REWARDS';exports.MODE_DRAGON_REWARDS = MODE_DRAGON_REWARDS;
const MODE_SLAYER_REWARDS = 'MODE_SLAYER_REWARDS';exports.MODE_SLAYER_REWARDS = MODE_SLAYER_REWARDS;
const MODE_GOLEM_REWARDS = 'MODE_GOLEM_REWARDS';exports.MODE_GOLEM_REWARDS = MODE_GOLEM_REWARDS;

async function appraise({ rewards, mode, options }) {
  if (mode === MODE_DRAGON_REWARDS) {
    return await Promise.all(
    rewards.map(async ({ reward, count }) => ({
      reward,
      count,
      appraisal:
      count * (await (0, _getPrice.default)(_dragon.itemMap[options.dragonType][reward])) })));


  } else if (mode === MODE_SLAYER_REWARDS) {
    return await Promise.all(
    rewards.map(async ({ reward, count }) => ({
      reward,
      count,
      appraisal: count * (await (0, _getPrice.default)(_slayer.itemMap[reward])) })));


  } else if (mode === MODE_GOLEM_REWARDS) {
    return await Promise.all(
    rewards.map(async ({ reward, count }) => ({
      reward,
      count,
      appraisal: count * (await (0, _getPrice.default)(_slayer.itemMap[reward])) })));


  } else {
    return [];
  }
}