import { UsersPermissionsUser } from 'bp-graphql/build/db-types';

export const updateMe = async (
  user: UsersPermissionsUser | null,
  username: string | undefined,
  email: string | undefined
) => {
  if (!user) {
    return;
  }

  const userQuery = strapi.db.query('plugin::users-permissions.user');
  await userQuery.update({
    where: {
      id: user.id,
    },
    data: {
      username,
      email,
    },
  });
};
