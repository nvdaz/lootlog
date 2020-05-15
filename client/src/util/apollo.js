import { ApolloClient, split, InMemoryCache, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';

const apolloClient = new ApolloClient({
  link: split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    new WebSocketLink({
      uri: process.env.GRAPHQL_WS_LINK,
      options: { reconnect: true },
    }),
    new HttpLink({
      uri: process.env.GRAPHQL_HTTP_LINK,
      credentials: 'same-origin',
    }),
  ),
  cache: new InMemoryCache(),
});

export default apolloClient;
