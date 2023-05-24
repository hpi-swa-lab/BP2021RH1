import { Maybe, ParameterizedPermission } from 'bp-graphql/build/db-types';

type AddPermissionArgs = {
  userId: Maybe<string>;
  operationName: Maybe<string>;
  archive_tag: Maybe<string>;
  see_unpublished_collections: Maybe<boolean>;
};

const whereNullable = <T>(value: T | null | undefined) =>
  value === null || value === undefined
    ? {
        $null: true,
      }
    : {
        $eq: value,
      };

const mergePermissions = (permissions: ParameterizedPermission[]) => {
  if (permissions.length < 1) {
    throw new Error('trying to merge empty array of permissions');
  }
  return permissions.slice(1).reduce(
    (merged, permission) => ({
      // these should be equal anyway
      users_permissions_user: merged.users_permissions_user,
      archive_tag: merged.archive_tag,
      operation_name: merged.operation_name,
      // merge individual parameters
      see_unpublished_collections:
        (merged.see_unpublished_collections || permission.see_unpublished_collections) ?? false,
    }),
    permissions[0]
  );
};

export const preventPublicUserFromCreatingArchive = () => {
  throw new Error('Unangemeldete Nutzer können keine Archive erstellen');
};

const checkNonsensicalPermissions = ({ userId, operationName }: AddPermissionArgs) => {
  if (operationName === 'addArchiveTag' && !userId) {
    preventPublicUserFromCreatingArchive();
  }
};

export const addPermission = async ({
  userId,
  operationName,
  archive_tag,
  ...inidividualParameters
}: AddPermissionArgs) => {
  checkNonsensicalPermissions({ userId, operationName, archive_tag, ...inidividualParameters });
  const permissionQuery = strapi.db.query('api::parameterized-permission.parameterized-permission');
  const existingPermissions = await permissionQuery.findMany({
    where: {
      users_permissions_user: {
        id: whereNullable(userId),
      },
      operation_name: {
        $eq: operationName,
      },
      archive_tag: {
        id: whereNullable(archive_tag),
      },
    },
    // see https://github.com/strapi/strapi/issues/16305
    // @ts-ignore
    populate: true,
  });
  await permissionQuery.deleteMany({
    where: {
      id: {
        $in: existingPermissions.map(permission => permission.id),
      },
    },
  });
  const mergedPermission = mergePermissions([
    ...existingPermissions,
    {
      users_permissions_user: userId,
      operation_name: operationName,
      archive_tag,
      ...inidividualParameters,
    },
  ]);
  const created = await permissionQuery.create({
    data: {
      ...mergedPermission,
    },
  });
  return created.id;
};
