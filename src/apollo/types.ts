import { DragonType } from '../consts/dragon';

export type Maybe<T> = T | null;

export interface IDragonOverview {
  _id: string;
  day: Date;
  revenue: number;
  gross: number;
  dragonCount: number;
  dragonTypes: DragonType[];
}

export interface IAuthChallenge {
  serverID: string;
  token: string;
}

export interface ISetVersionResult {
  isCurrent: boolean;
  changelog: string;
}
