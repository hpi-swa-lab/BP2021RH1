import { ApolloServerPlugin } from "apollo-server-plugin-base";

export const apolloPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didResolveOperation(resolveContext) {
        await strapi.auth.verify(resolveContext.context.state.auth, {
          operation: resolveContext.operation,
          variables: resolveContext.request.variables,
        });
      },
    };
  },
};
