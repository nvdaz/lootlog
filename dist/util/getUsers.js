"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _dragon = _interopRequireDefault(require("../models/dragon"));
var _user = _interopRequireDefault(require("../models/user"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

() =>
_dragon.default.aggregate([
{
  $group: {
    _id: '$owner',
    lastUpdated: {
      $last: '$_id' },

    count: {
      $sum: 1 } } },



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
            month: { $month: '$lastUpdated' } } } },



      {
        $divide: ['$count', 10000] }] } } },





{
  $sort: {
    sort: -1 } },


{
  $lookup: {
    from: _user.default.collection.collectionName,
    localField: '_id',
    foreignField: '_id',
    as: 'userData' } },


{
  $unwind: '$userData' },

{
  $replaceRoot: { newRoot: '$userData' } }]);exports.default = _default;