"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.apolloServer = void 0;var _apolloServerExpress = require("apollo-server-express");

var _user = _interopRequireDefault(require("../models/user"));
var _directive = _interopRequireDefault(require("../auth/directive"));
var _definitions = _interopRequireDefault(require("./definitions"));
var _resolvers = _interopRequireDefault(require("./resolvers"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const apolloServer = new _apolloServerExpress.ApolloServer({
  typeDefs: _definitions.default,
  resolvers: _resolvers.default,
  introspection: true,
  tracing: false,
  schemaDirectives: { auth: _directive.default },
  context: async ({ req: { user: { id } = {}, ...rest } = {} }) => ({
    ...rest,
    user: id ? await _user.default.findById(id) : undefined }),

  formatError: err => {var _err$extensions;
    if (
    !(err instanceof _apolloServerExpress.AuthenticationError) &&
    (err === null || err === void 0 ? void 0 : (_err$extensions = err.extensions) === null || _err$extensions === void 0 ? void 0 : _err$extensions.code) !== 'UNAUTHENTICATED')

    console.dir(err, { depth: 8 });
    return err;
  },
  playground: {
    settings: {
      'request.credentials': 'include' },

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
        ` }] } });exports.apolloServer = apolloServer;