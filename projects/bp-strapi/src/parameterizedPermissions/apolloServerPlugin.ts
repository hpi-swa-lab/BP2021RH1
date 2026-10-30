import { ApolloServerPlugin } from 'apollo-server-plugin-base';

// authStrategy.ts verifies GraphQL operations, which Strapi's own strategies don't take
type Verify = (auth: unknown, config: { operation: unknown; variables: unknown }) => Promise<void>;

export const apolloPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didResolveOperation(resolveContext) {
        await (strapi.auth.verify as Verify)(resolveContext.context.state.auth, {
          operation: resolveContext.operation,
          variables: resolveContext.request.variables,
        });
      },
    };
  },
};
