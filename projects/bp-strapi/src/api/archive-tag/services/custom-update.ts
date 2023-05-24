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
        });
      })
  );

  return newArchive.id;
};
