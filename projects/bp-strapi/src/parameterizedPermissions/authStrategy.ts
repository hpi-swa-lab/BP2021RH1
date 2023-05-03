import { getService as getUsersPermissionsService } from "@strapi/plugin-users-permissions/server/utils/index.js";

const authenticate = async (ctx) => {
  const token = await getUsersPermissionsService("jwt").getToken(ctx);

  let permissions = [];

  if (token) {
    const { id } = token;

    // Invalid token
    if (id === undefined) {
      return { authenticated: false };
    }

    const user = await getUsersPermissionsService(
      "user"
    ).fetchAuthenticatedUser(id);

    // No user associated to the token
    if (!user) {
      return { error: "Invalid credentials" };
    }

    // User blocked
    if (user.blocked) {
      return { error: "Invalid credentials" };
    }

    ctx.state.user = user;

    const permissionsQuery = strapi.db.query(
      "api::parameterized-permission.parameterized-permission"
    );

    permissions = await permissionsQuery.findMany({
      where: {
        users_permissions_user: {
          id: { $eq: user.id },
        },
      },
    });
  } else {
    // TODO: get public permissions for user `null` or something
  }

  return {
    authenticated: true,
    ability: permissions,
  };
};

const verify = (auth, config) => {
  // TODO: do the actual check
};

export const authStrategy = {
  name: "parameterizedPermissions",
  authenticate,
  verify,
};
