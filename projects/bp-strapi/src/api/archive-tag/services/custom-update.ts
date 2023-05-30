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
        const { needsParameters } = 'group' in operation ? groups[operation.group] : operation;
        return (needsParameters as Parameter[]).includes('archive_tag');
      })
      .map(async operation => {
        await addPermission({
          userId: owningUser.id.toString(),
          archive_tag: newArchive.id.toString(),
          operationName: operation.document.name,
          see_unpublished_collections: undefined,
          on_other_users: undefined,
        });
      })
  );

  return newArchive.id;
};

export const removeArchiveTag = async (id: string) => {
  const archiveQuery = strapi.db.query('api::archive-tag.archive-tag');
  const exists = archiveQuery.findOne({
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
    permissionsToDelete.map(permission => {
      permissionQuery.delete({
        where: {
          id: permission.id,
        },
      });
    })
  );

  return 1;
};
