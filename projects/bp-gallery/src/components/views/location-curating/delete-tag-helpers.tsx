import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';

export const useDeleteSingleTag = (tag: FlatTag, refetch: () => void, type: TagType) => {
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

  const deleteSingleTag = () => {
    tag.child_tags?.forEach(childTag => {
      updateTagParentMutation({
        variables: {
          tagID: childTag.id,
          parentID: tag.parent_tag?.id,
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

export const useDeleteTagAndChildren = (tag: FlatTag, refetch: () => void, type: TagType) => {
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

  const deleteTags = () => {
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