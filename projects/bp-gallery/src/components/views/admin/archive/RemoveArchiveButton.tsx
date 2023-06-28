import {
  useCanRunRemoveArchiveTagMutation,
  useGetArchiveQuery,
  useRemoveArchiveTagMutation,
} from '../../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../../types/additionalFlatTypes';
import { DangerousRemoveButton } from '../DangerousRemoveButton';

export const RemoveArchiveButton = ({ id }: { id: string }) => {
  const { data } = useGetArchiveQuery({
    variables: {
      archiveId: id,
    },
  });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [removeArchiveTagMutation] = useRemoveArchiveTagMutation();

  const { canRun: canRemoveArchive } = useCanRunRemoveArchiveTagMutation({
    variables: {
      id,
    },
  });

  return (
    <DangerousRemoveButton
      entity={archive}
      removeMutation={removeArchiveTagMutation}
      canRemove={canRemoveArchive}
      removeTranslation='admin.archives.remove.button'
      dialogTitleTranslation='admin.archives.remove.title'
      dialogContentTranslation='admin.archives.remove.content'
      successTranslation='admin.archives.remove.success'
      abortTranslation='admin.archives.remove.aborted'
    />
  );
};
