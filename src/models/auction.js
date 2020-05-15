import { model, Schema } from 'mongoose';

const MODIFIERS = ['ENCHANTED', 'REFORGED', 'HPB'];

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
      enum: MODIFIERS,
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

const Auction = model('Auction', AuctionSchema);

export default Auction;
