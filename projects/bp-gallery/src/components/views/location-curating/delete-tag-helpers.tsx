import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';

export const useDeleteSingleTag = (refetch: () => void, type: TagType) => {
  const { deleteTagMutationSource, updateTagParentMutationSource } = useGenericTagEndpoints(type);

  const [deleteTagMutation] = deleteTagMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
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

  const getDescendants = (tag: FlatTag, descendants: string[] = []): string[] => {
    if (!tag.child_tags) return [];
    descendants.push(...tag.child_tags.map(childTag => childTag.id));
    tag.child_tags.forEach(childTag => getDescendants(childTag, descendants));
    return descendants;
  };

  const [deleteTagMutation] = deleteTagMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const deleteTags = (tag: FlatTag) => {
    getDescendants(tag).forEach(childTagId => {
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
