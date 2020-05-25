import { model, Schema, Document } from 'mongoose';
import User, { IUser } from './user';
import { IDungeonReward } from '../consts/dungeon';

const DungeonSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: User.collection.collectionName,
    required: true,
  },
  dungeon: {
    type: String,
    enum: ['CATACOMBS'],
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  rewards: [
    {
      reward: {
        type: String,
        enum: [],
        required: true,
      },
      stats: {
        type: Object,
      },
      count: {
        type: Number,
        required: true,
      },
      appraisal: {
        type: Number,
        required: true,
      },
    },
  ],
  revenue: {
    type: Number,
    required: true,
  },
});

interface IDungeonSchema extends Document {
  owner: Schema.Types.ObjectId | IUser;
  dungeon: string;
  level: number;
  rewards: IDungeonReward;
  revenue: number;
}

export interface IDungeon extends IDungeonSchema {
  owner: Schema.Types.ObjectId;
}

export interface IDungeonPopulated extends IDungeonSchema {
  owner: IUser;
}

const Dungeon = model<IDungeonSchema>('Dungeon', DungeonSchema);

export default Dungeon;
