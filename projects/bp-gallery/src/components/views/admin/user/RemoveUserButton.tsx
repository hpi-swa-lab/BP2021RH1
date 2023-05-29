import { useMemo } from 'react';
import {
  useGetUsersPermissionsUserQuery,
  useRemoveUserMutation,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { useCanRemoveUser } from '../../../../hooks/can-do-hooks';
import { FlatUsersPermissionsUser } from '../../../../types/additionalFlatTypes';
import { DangerousRemoveButton } from '../DangerousRemoveButton';

export const RemoveUserButton = ({ id }: { id: string | undefined }) => {
  const { data } = useGetUsersPermissionsUserQuery({
    variables: {
      id: id ?? '-1',
    },
  });
  const user: FlatUsersPermissionsUser | undefined =
    useSimplifiedQueryResponseData(data)?.usersPermissionsUser;

  const [removeUserMutation] = useRemoveUserMutation();

  const { canRemoveUser } = useCanRemoveUser(id);

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
