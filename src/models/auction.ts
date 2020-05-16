import { model, Schema, Document } from 'mongoose';
import enumToArray from '../util/enumToArray';

export enum Modifier {
  ENCHANTED,
  REFORGED,
  HPB,
}

export const modifiers = enumToArray<Modifier>(Modifier);

const AuctionSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  item: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  modifiers: [
    {
      type: String,
      enum: modifiers,
    },
  ],
  lastUpdated: {
    type: Date,
    required: true,
  },
  endsAt: {
    type: Date,
    expires: '1mo',
  },
});

export interface IAuction extends Document {
  uuid: string;
  item: string;
  price: number;
  modifiers: Modifier[];
  lastUpdated: Date;
  endsAt: Date;
}

const Auction = model<IAuction>('Auction', AuctionSchema);

export default Auction;
