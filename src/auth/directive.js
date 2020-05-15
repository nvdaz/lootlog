import { defaultFieldResolver } from 'graphql';
import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from 'apollo-server-express';

export default class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { requires } = this.args;

    field.resolve = async function (source, args, ctx, info) {
      if (!ctx?.user && (requires === 'USER' || requires === 'ADMIN'))
        throw new AuthenticationError('Unauthenticated');
      return await resolve.call(this, source, args, ctx, info);
    };
  }
}
