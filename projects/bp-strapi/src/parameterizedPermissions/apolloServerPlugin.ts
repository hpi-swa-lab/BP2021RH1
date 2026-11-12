import type { ApolloServerPlugin } from '@apollo/server';

// authStrategy.ts verifies GraphQL operations, which Strapi's own strategies don't take
type Verify = (auth: unknown, config: { operation: unknown; variables: unknown }) => Promise<void>;

export const apolloPlugin: ApolloServerPlugin<{ state: { auth: unknown } }> = {
  async requestDidStart() {
    return {
      async didResolveOperation(resolveContext) {
        await (strapi.auth.verify as Verify)(resolveContext.contextValue.state.auth, {
          operation: resolveContext.operation,
          variables: resolveContext.request.variables,
        });
      },
    };
  },
};
