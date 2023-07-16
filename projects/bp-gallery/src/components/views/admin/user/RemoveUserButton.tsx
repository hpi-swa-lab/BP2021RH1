import { useMemo } from 'react';
import { useRemoveUserMutation } from '../../../../graphql/APIConnector';
import { useCanRemoveUser } from '../../../../hooks/can-do-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import { DangerousRemoveButton } from '../DangerousRemoveButton';

export const RemoveUserButton = ({ user }: { user: FlatUsersPermissionsUser | undefined }) => {
  const [removeUserMutation] = useRemoveUserMutation();

  const { canRemoveUser } = useCanRemoveUser(user?.id);

  const entity = useMemo(
    () =>
      user
        ? {
            id: user.id,
            name: user.username,
          }
        : undefined,
    [user]
  );

  return (
    <DangerousRemoveButton
      entity={entity}
      removeMutation={removeUserMutation}
      canRemove={canRemoveUser}
      removeTranslation='admin.user.remove.button'
      dialogTitleTranslation='admin.user.remove.title'
      dialogContentTranslation='admin.user.remove.content'
      successTranslation='admin.user.remove.success'
      abortTranslation='admin.user.remove.aborted'
    />
  );
};
