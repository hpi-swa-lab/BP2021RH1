import { Maybe, ParameterizedPermission, UsersPermissionsUser } from 'bp-graphql/build/db-types';
import crypto from 'crypto';
import { omit } from 'lodash';
import { minimalPasswordSatisfyingRequirements } from '../../../extensions/users-permissions/passwordRequirements';

type AddPermissionArgs = {
  user_id: Maybe<string>;
  operation_name: Maybe<string>;
  archive_tag: Maybe<string>;
  on_other_users: Maybe<boolean>;
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
      on_other_users: (merged.on_other_users || permission.on_other_users) ?? false,
    }),
    omit(permissions[0], ['id'])
  );
};

export const preventPublicUserFromCreatingArchive = () => {
  throw new Error('Unangemeldete Nutzer können keine Archive erstellen');
};

const checkNonsensicalPermissions = ({ user_id, operation_name }: AddPermissionArgs) => {
  if (operation_name === 'addArchiveTag' && !user_id) {
    preventPublicUserFromCreatingArchive();
  }
};

export const addPermission = async ({
  user_id,
  operation_name,
  archive_tag,
  ...inidividualParameters
}: AddPermissionArgs) => {
  checkNonsensicalPermissions({ user_id, operation_name, archive_tag, ...inidividualParameters });
  const permissionQuery = strapi.db.query('api::parameterized-permission.parameterized-permission');
  const existingPermissions = await permissionQuery.findMany({
    where: {
      users_permissions_user: {
        id: whereNullable(user_id),
      },
      operation_name,
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
      users_permissions_user: user_id,
      operation_name,
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

export const addUser = async (
  context: { koaContext: { state: { auth: unknown } } },
  username: string | undefined,
  email: string | undefined
) => {
  if (!username || !email) {
    throw new Error('Ungültiger Name oder ungültige E-Mail');
  }

  const usersPermissionsAuthController = strapi.plugin('users-permissions').controllers.auth;

  // fake a koaContext to prevent the controller from sending an answer
  // to the user, instead, capture the answer
  let response = undefined as { user: UsersPermissionsUser | undefined } | undefined;
  const fakeKoaContextWithParameters = <T>(params: T) => ({
    request: {
      body: params,
    },
    state: {
      auth: context.koaContext.state.auth,
    },
    send(something: { user: UsersPermissionsUser | undefined }) {
      response = something;
    },
  });

  // register won't work without a password, so we use a random temporary one
  // to prevent the unlikely event of anyone trying to log in between register
  // and the update-password-to-null below
  const temporaryPassword =
    minimalPasswordSatisfyingRequirements + crypto.randomBytes(64).toString('hex');

  await usersPermissionsAuthController.register(
    fakeKoaContextWithParameters({
      username,
      email,
      password: temporaryPassword,
    })
  );
  if (!response?.user) {
    throw new Error('User creation failed');
  }
  const { user } = response;

  const userQuery = strapi.db.query('plugin::users-permissions.user');
  // remove the temporaryPassword, to disallow a login until the user
  // has set their own password through the resetPasswordToken below
  await userQuery.update({
    where: {
      id: user.id,
    },
    data: {
      password: null,
    },
  });

  // grant the new user the same permissions the public user has
  const permissionQuery = strapi.db.query('api::parameterized-permission.parameterized-permission');
  const publicPermissions = await permissionQuery.findMany({
    where: {
      users_permissions_user: {
        id: {
          $null: true,
        },
      },
    },
    populate: ['archive_tag'],
  });
  // createMany currently doesn't insert relational data:
  // https://github.com/strapi/strapi/issues/15340#issuecomment-1385499102
  await Promise.all(
    publicPermissions.map(permission =>
      permissionQuery.create({
        data: {
          ...omit(permission, ['id']),
          users_permissions_user: user.id,
        },
      })
    )
  );

  // generate a resetPasswordToken and send an email to the user
  await usersPermissionsAuthController.forgotPassword(
    fakeKoaContextWithParameters({
      email,
    })
  );

  return user.id;
};

export const removeUser = async (id: string) => {
  if (!id) {
    return;
  }

  const userQuery = strapi.db.query('plugin::users-permissions.user');
  const exists = userQuery.findOne({
    where: {
      id,
    },
  });
  if (!exists) {
    return;
  }

  await userQuery.delete({
    where: {
      id,
    },
  });

  const permissionQuery = strapi.db.query('api::parameterized-permission.parameterized-permission');
  // deleteMany currently doesn't support relational filters:
  // https://github.com/strapi/strapi/issues/11998
  const permissionsToDelete = await permissionQuery.findMany({
    where: {
      users_permissions_user: {
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
