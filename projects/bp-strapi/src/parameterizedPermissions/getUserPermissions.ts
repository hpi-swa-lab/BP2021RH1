import { UsersPermissionsUser } from "bp-graphql/build/db-types";

export const getUserPermissions = async (user: UsersPermissionsUser | null) => {
  const query = strapi.db.query(
    "api::parameterized-permission.parameterized-permission"
  );

  const userIdWhere = user === null ? { $null: true } : { $eq: user.id };

  return await query.findMany({
    where: {
      users_permissions_user: {
        id: userIdWhere,
      },
    },
    populate: ["users_permissions_user", "archive_tag"],
  });
};
