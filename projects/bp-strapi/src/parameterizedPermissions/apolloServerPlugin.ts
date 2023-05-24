import { ApolloServerPlugin } from 'apollo-server-plugin-base';

export const apolloPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didResolveOperation(resolveContext) {
        await strapi.auth.verify(resolveContext.context.state.auth, {
          operation: resolveContext.operation,
          variables: resolveContext.request.variables,
        });
      },
      async executionDidStart(requestContext) {
        const auth = requestContext.context.state.auth;
        auth.isExecutingVerifiedOperation = true;
        return {
          async executionDidEnd() {
            auth.isExecutingVerifiedOperation = false;
          },
        };
      },
    };
  },
};
