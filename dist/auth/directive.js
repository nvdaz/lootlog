"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _graphql = require("graphql");
var _apolloServerExpress = require("apollo-server-express");




class AuthDirective extends _apolloServerExpress.SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = _graphql.defaultFieldResolver } = field;
    const { requires } = this.args;

    field.resolve = async function (source, args, ctx, info) {
      if (!(ctx === null || ctx === void 0 ? void 0 : ctx.user) && (requires === 'USER' || requires === 'ADMIN'))
      throw new _apolloServerExpress.AuthenticationError('Unauthenticated');
      return await resolve.call(this, source, args, ctx, info);
    };
  }}exports.default = AuthDirective;