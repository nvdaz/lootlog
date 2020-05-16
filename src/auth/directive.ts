import { defaultFieldResolver } from 'graphql';
import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from 'apollo-server-express';
import { IApolloContext } from '../apollo';

export default class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field): void {
    const { resolve = defaultFieldResolver } = field;
    const { requires } = this.args;

    field.resolve = async function (
      source,
      args,
      ctx: IApolloContext,
      info,
    ): Promise<unknown> {
      if (!ctx?.user && (requires === 'USER' || requires === 'ADMIN'))
        throw new AuthenticationError('Unauthenticated');
      return await resolve.call(this, source, args, ctx, info);
    };
  }
}
