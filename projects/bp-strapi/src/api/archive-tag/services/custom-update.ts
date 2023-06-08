import { Parameter, groups, operations } from 'bp-graphql/build';
import { UsersPermissionsUser } from 'bp-graphql/build/db-types';
import { addPermission } from '../../parameterized-permission/services/custom-update';

export const addArchiveTag = async (owningUser: UsersPermissionsUser, name: string) => {
  const archiveQuery = strapi.db.query('api::archive-tag.archive-tag');
  const newArchive = await archiveQuery.create({
    data: {
      name,
    },
  });

  await Promise.all(
    Object.values(operations)
      .filter(operation => {
        if ('isEssential' in operation) {
          return false;
        }
        const { needsParameters } = 'group' in operation ? groups[operation.group] : operation;
        return (needsParameters as Parameter[]).includes('archive_tag');
      })
      .map(async operation => {
        await addPermission({
          user_id: owningUser.id.toString(),
          archive_tag: newArchive.id.toString(),
          operation_name: operation.document.name,
          on_other_users: undefined,
        });
      })
  );

  return newArchive.id;
};

export const removeArchiveTag = async (id: string) => {
  const archiveQuery = strapi.db.query('api::archive-tag.archive-tag');
  const exists = await archiveQuery.findOne({
    where: {
      id,
    },
  });
  if (!exists) {
    return;
  }
  await archiveQuery.delete({
    where: {
      id,
    },
  });

  const permissionQuery = strapi.db.query('api::parameterized-permission.parameterized-permission');
  // deleteMany currently doesn't support relational filters:
  // https://github.com/strapi/strapi/issues/11998
  const permissionsToDelete = await permissionQuery.findMany({
    where: {
      archive_tag: {
        id,
      },
    },
  });
  await Promise.all(
    permissionsToDelete.map(permission =>
      permissionQuery.delete({
        where: {
          id: permission.id,
        },
    })
    )
  );

  return 1;
};
