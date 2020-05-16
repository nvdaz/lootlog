import { PubSub } from 'apollo-server-express';

export enum SubType {
  SLAYER_ADDED = 'SLAYER_ADDED',
  DRAGON_ADDED = 'DRAGON_ADDED',
  GOLEM_ADDED = 'GOLEM_ADDED',
}

export default new PubSub();
