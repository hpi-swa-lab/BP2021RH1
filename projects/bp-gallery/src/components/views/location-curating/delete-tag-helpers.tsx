import { useUpdateLocationParentMutation } from '../../../graphql/APIConnector';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';

export const useDeleteSingleTag = (tag: FlatTag, refetch: () => void) => {
  const { deleteTagMutationSource } = useGenericTagEndpoints(TagType.LOCATION);

  const [deleteTagMutation] = deleteTagMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const [updateTagParentMutation] = useUpdateLocationParentMutation({
    onCompleted: _ => {
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

export const useDeleteTagAndChildren = (tag: FlatTag, refetch: () => void) => {
  const { deleteTagMutationSource } = useGenericTagEndpoints(TagType.LOCATION);

  const getDescendants = (comment: FlatTag, descendants: string[] = []): string[] => {
    if (!comment.child_tags) return [];
    descendants.push(...comment.child_tags.map(childTag => childTag.id));
    comment.child_tags.forEach(childTag => getDescendants(childTag, descendants));
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
