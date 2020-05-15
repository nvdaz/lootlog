import { PubSub } from 'apollo-server-express';

export const SLAYER_ADDED = 'SLAYER_ADDED';
export const DRAGON_ADDED = 'DRAGON_ADDED';
export const GOLEM_ADDED = 'GOLEM_ADDED';

export default new PubSub();
