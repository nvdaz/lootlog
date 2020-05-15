"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = getPrice;exports.MODIFIERS = void 0;var _auction = _interopRequireDefault(require("../models/auction"));
var _quantile = _interopRequireDefault(require("./quantile"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const MODIFIERS = ['ENCHANTED', 'REFORGED', 'HPB'];exports.MODIFIERS = MODIFIERS;

async function getPrice(
item,
allowedModifiers = [],
$lte = new Date(),
$gte = new Date(Date.now() - 1.728e8),
errorCount = 0)
{
  const disallowedModifiers = MODIFIERS.filter(
  mod => !allowedModifiers.includes(mod));


  const prices = (
  await _auction.default.aggregate([
  {
    $match: {
      item,
      modifiers: {
        $nin: disallowedModifiers },

      endsAt: {
        $lte,
        $gte } } },



  {
    $project: {
      price: '$price',
      uuid: '$uuid',
      delta: {
        $abs: {
          $subtract: ['$lastUpdated', '$endsAt'] } } } },




  {
    $match: {
      delta: {
        $lte: errorCount > 1 ? 3.6e6 : 120000 } } }])).




  map(({ price }) => price);

  const q3 = (0, _quantile.default)(prices, 0.75);
  const q1 = (0, _quantile.default)(prices, 0.25);

  const filtered = prices.filter(price => q3 >= price && q1 <= price);

  let estimate = 0;

  if (filtered.length > 0)
  estimate = Math.round(
  filtered.reduce((a, b) => a + b, 0) / filtered.length);else

  if (errorCount < 1)
  estimate = await getPrice(
  item,
  allowedModifiers,
  new Date(),
  new Date(Date.now() - 6.048e8),
  errorCount + 1);


  return Math.max(item.includes('DRAGON') ? 1e5 : 1, estimate);
}