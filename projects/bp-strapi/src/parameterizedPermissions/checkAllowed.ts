import { DB, OperationName, operations, Variables } from 'bp-graphql';
import type { ParameterizedPermission, UsersPermissionsUser } from 'bp-graphql/build/db-types';

export const checkAllowed = async (
  operationName: OperationName,
  authorizingPermissions: ParameterizedPermission[],
  permissions: ParameterizedPermission[],
  variables: Variables,
  user: UsersPermissionsUser | null
) => {
  const db = new DB({
    picture: strapi.db.query('api::picture.picture'),
    comment: strapi.db.query('api::comment.comment'),
    faceTag: strapi.db.query('api::face-tag.face-tag'),
    orientationTag: strapi.db.query('api::orientation-tag.orientation-tag'),
    link: strapi.db.query('api::link.link'),
    permission: strapi.db.query('api::parameterized-permission.parameterized-permission'),
    exhibition: strapi.db.query('api::exhibition.exhibition'),
    exhibitionSection: strapi.db.query('api::exhibition-section.exhibition-section'),
    exhibitionPicture: strapi.db.query('api::exhibition-picture.exhibition-picture'),
  });
  const operation = operations[operationName];

  if ('isEssential' in operation) {
    return operation.isEssential;
  }

  for (const permission of authorizingPermissions) {
    const isAllowed = await operation.isAllowed({
      parameters: permission,
      variables,
      db,
      permissions,
      user,
    });

    if (isAllowed) {
      return true;
    }
  }

  return false;
};
