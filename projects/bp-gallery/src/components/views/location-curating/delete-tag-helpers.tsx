import { getDescendants } from '../../../helpers/tree-helpers';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';

export const useDeleteSingleTag = (refetch: () => void, type: TagType) => {
  const { deleteTagMutationSource, updateTagParentMutationSource } = useGenericTagEndpoints(type);

  const [deleteTagMutation] = deleteTagMutationSource({
    onCompleted: refetch,
  });

  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: refetch,
  });

  const deleteSingleTag = (tag: FlatTag) => {
    tag.child_tags?.forEach(childTag => {
      updateTagParentMutation({
        variables: {
          tagID: childTag.id,
          parentIDs: tag.parent_tags?.map(t => t.id),
        },
      });
    });
    deleteTagMutation({
      variables: {
        id: tag.id,
      },
    });
  };

  return { deleteSingleTag };
};

export const useDeleteTagAndChildren = (refetch: () => void, type: TagType) => {
  const { deleteTagMutationSource } = useGenericTagEndpoints(type);

  const [deleteTagMutation] = deleteTagMutationSource({
    onCompleted: refetch,
  });

  const deleteTags = (tag: FlatTag) => {
    getDescendants(tag, 'child_tags').forEach(childTagId => {
      deleteTagMutation({
        variables: {
          id: childTagId,
        },
      });
    });
    deleteTagMutation({
      variables: {
        id: tag.id,
      },
    });
  };

  return { deleteTags };
};
