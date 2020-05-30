import { ObjectID } from 'mongodb';
import { Schema, model, DocumentQuery, Model, Document } from 'mongoose';

const BazaarSchema = new Schema({
  item: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

BazaarSchema.statics = {
  findItem: (item: string): DocumentQuery<IBazaarProduct, IBazaarProduct> =>
    Bazaar.findOne({ item }),
};

export interface IBazaarProduct extends Document {
  _id: ObjectID;
  item: string;
  price: number;
}

interface IBazaarProductModel extends Model<IBazaarProduct> {
  findItem: (item: string) => DocumentQuery<IBazaarProduct, IBazaarProduct>;
}

const Bazaar: IBazaarProductModel = model<IBazaarProduct, IBazaarProductModel>(
  'Bazaar',
  BazaarSchema,
);

export default Bazaar;
