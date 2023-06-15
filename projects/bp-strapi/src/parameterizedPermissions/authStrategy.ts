import { errors } from '@strapi/utils';
import type { Variables } from 'bp-graphql';
import type { UsersPermissionsUser } from 'bp-graphql/build/db-types';
import { OperationDefinitionNode } from 'graphql/language/ast';
import { ParameterizedPermissionsAuth, StrapiContext } from '../types';
import { canRunOperation } from './canRunOperation';
import { getUserPermissions } from './getUserPermissions';
import { getJwtService, getUserService } from './userService';

const { UnauthorizedError } = errors;

const getToken = async (ctx: StrapiContext): Promise<{ id: string | undefined } | null> => {
  try {
    return await getJwtService().getToken(ctx);
  } catch {
    throw new UnauthorizedError();
  }
};

const authenticate = async (ctx: StrapiContext) => {
  let token = await getToken(ctx);

  let user: UsersPermissionsUser | null = null;

  if (token) {
    const { id } = token;

    // Invalid token
    if (id === undefined) {
      return { authenticated: false };
    }

    user = await getUserService().fetchAuthenticatedUser(id);

    // No user associated to the token
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    // User blocked
    if (user.blocked) {
      return { error: 'Invalid credentials' };
    }

    ctx.state.user = user;
  }

  const permissions = await getUserPermissions(user);

  return {
    authenticated: true,
    credentials: user,
    ability: permissions,
  };
};

const verify = async (
  auth: ParameterizedPermissionsAuth,
  config: { operation: OperationDefinitionNode; variables: Variables } | Record<never, never>
) => {
  if ('operation' in config) {
    const { operation, variables } = config;

    if (!(await canRunOperation(auth, operation, variables))) {
      throw new UnauthorizedError();
    }
  } else if (isGraphQLRequest()) {
    // this is a verify call in a field resolver,
    // that can only happen after we checked
    // the operation before (see apolloServerPlugin.ts)
  } else {
    throw new UnauthorizedError();
  }
};

const isGraphQLRequest = () => {
  const request = strapi.requestContext.get();
  const graphqlEndpoint = strapi.plugin('graphql').config('endpoint');
  return request.url === graphqlEndpoint;
};

export const authStrategy = {
  name: 'parameterizedPermissions',
  authenticate,
  verify,
};
