import { Request } from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import User, { IUser } from '../models/user';
import authDirective from '../auth/directive';
import typeDefs from './definitions';
import resolvers from './resolvers';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export interface IApolloContext {
  user?: IUser;
}

interface IJwtUser {
  id?: string;
}

interface IExpressBaseContext extends Request {
  user?: IJwtUser;
}

interface IApolloContextBase extends ExpressContext {
  req: IExpressBaseContext;
}

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  tracing: false,
  schemaDirectives: { auth: authDirective },
  context: async ({ req }: IApolloContextBase): Promise<IApolloContext> => ({
    user: req?.user?.id ? await User.findById(req?.user?.id) : undefined,
  }),
  formatError: (err): Error => {
    if (
      !(err instanceof AuthenticationError) &&
      err?.extensions?.code !== 'UNAUTHENTICATED'
    )
      console.dir(err, { depth: 8 });
    return err;
  },
  playground: {
    settings: {
      'request.credentials': 'include',
    },
    tabs: [
      {
        endpoint: '/graphql',
        query: `
          query CurrentUser {
            currentUser {
              _id
              displayName
            }
          }
        `,
      },
    ],
  },
});
