import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import User from '../models/user';
import authDirective from '../auth/directive';
import typeDefs from './definitions';
import resolvers from './resolvers';

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  tracing: false,
  schemaDirectives: { auth: authDirective },
  context: async ({ req: { user: { id } = {}, ...rest } = {} }) => ({
    ...rest,
    user: id ? await User.findById(id) : undefined,
  }),
  formatError: (err) => {
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
