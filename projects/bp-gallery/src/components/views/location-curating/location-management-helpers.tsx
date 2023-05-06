import { Close, Done } from '@mui/icons-material';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { useDeleteTagAndChildren, useDeleteSingleTag } from './delete-tag-helpers';
import { useTranslation } from 'react-i18next';

export const useSetVisible = (locationTag: FlatTag, refetch: () => void) => {
  const { updateVisibilityMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateVisibilityMutation] = updateVisibilityMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const setVisible = () => {
    updateVisibilityMutation({
      variables: {
        tagId: locationTag.id,
        visible: !locationTag.visible,
      },
    });
  };

  return { setVisible };
};

export const useRelocateTag = (locationTag: FlatTag, refetch: () => void, parentTag?: FlatTag) => {
  const prompt = useDialog();
  const { t } = useTranslation();

  const { updateTagParentMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const relocateTag = async () => {
    const selectedTag = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: locationTag.name,
      type: TagType.LOCATION,
    });
    if (selectedTag) {
      if (selectedTag.child_tags.some((tag: any) => tag.name === locationTag.name)) {
        if (selectedTag.child_tags.some((tag: any) => tag.id === locationTag.id)) {
          updateTagParentMutation({
            variables: {
              tagID: locationTag.id,
              parentIDs: [
                ...(parentTag
                  ? (locationTag.parent_tags?.map(t => t.id) ?? []).filter(t => t !== parentTag.id)
                  : locationTag.parent_tags?.map(t => t.id) ?? []),
              ],
            },
          });
        } else {
          prompt({
            preset: DialogPreset.CONFIRM,
            title: t('tag-panel.location-already-exists', { name: locationTag.name }),
          });
        }
      } else {
        updateTagParentMutation({
          variables: {
            tagID: locationTag.id,
            parentIDs: [
              ...(parentTag
                ? (locationTag.parent_tags?.map(t => t.id) ?? []).filter(t => t !== parentTag.id)
                : locationTag.parent_tags?.map(t => t.id) ?? []),
              selectedTag.id,
            ],
          },
        });
      }
    }
  };

  return { relocateTag };
};

export const useDetachTag = (locationTag: FlatTag, refetch: () => void) => {
  const prompt = useDialog();
  const { t } = useTranslation();

  const { updateTagParentMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const detachTag = async () => {
    const reallyDetach = await prompt({
      title: t(`tag-panel.detach-${TagType.LOCATION}`),
      content: locationTag.name,
      options: [
        { name: t('common.abort'), icon: <Close />, value: false },
        { name: t('common.confirm'), icon: <Done />, value: true },
      ],
    });
    if (reallyDetach) {
      updateTagParentMutation({
        variables: {
          tagID: locationTag.id,
          parentIDs: null,
        },
      });
    }
  };

  return { detachTag };
};

export const useCopyTag = (locationTag: FlatTag, refetch: () => void) => {
  const prompt = useDialog();
  const { t } = useTranslation();

  const { updateTagParentMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const copyTag = async () => {
    const selectedTag = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: locationTag.name,
      type: TagType.LOCATION,
    });
    if (selectedTag) {
      if (selectedTag.child_tags.some((tag: any) => tag.name === locationTag.name)) {
        if (!selectedTag.child_tags.some((tag: any) => tag.id === locationTag.id)) {
          prompt({
            preset: DialogPreset.CONFIRM,
            title: t('tag-panel.location-already-exists', { name: locationTag.name }),
          });
        }
      } else {
        updateTagParentMutation({
          variables: {
            tagID: locationTag.id,
            parentIDs: [...(locationTag.parent_tags?.map(t => t.id) ?? []), selectedTag.id],
          },
        });
      }
    }
  };

  return { copyTag };
};

export const useAcceptTag = (locationTag: FlatTag, refetch: () => void) => {
  const { updateTagAcceptanceMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateAcceptedMutation] = updateTagAcceptanceMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const acceptTag = () => {
    updateAcceptedMutation({
      variables: {
        tagId: locationTag.id,
        accepted: true,
      },
    });
  };

  return { acceptTag };
};

export const useDeleteSynonym = (locationTag: FlatTag, refetch: () => void) => {
  const { updateSynonymsMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });
  const deleteSynonym = (synonymName: string) => {
    updateSynonymsMutation({
      variables: {
        tagId: locationTag.id,
        synonyms:
          locationTag.synonyms?.filter(s => s?.name !== '' && s?.name !== synonymName) ??
          ([] as any),
      },
    });
  };

  return { deleteSynonym };
};

const useDeleteLocalTagClone = (locationTag: FlatTag, refetch: () => void, parentTag?: FlatTag) => {
  const { updateTagParentMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const deleteLocalTagClone = () => {
    locationTag.child_tags?.forEach(tag => {
      updateTagParentMutation({
        variables: {
          tagID: tag.id,
          parentIDs: parentTag
            ? [...(tag.parent_tags?.map(t => t.id) ?? []), parentTag.id]
            : tag.parent_tags?.map(t => t.id) ?? [],
        },
      });
    });
    updateTagParentMutation({
      variables: {
        tagID: locationTag.id,
        parentIDs: parentTag
          ? locationTag.parent_tags?.map(t => t.id).filter(t => t !== parentTag.id)
          : [],
      },
    });
  };

  return { deleteLocalTagClone };
};

const useDeleteLocalTagClones = (
  locationTag: FlatTag,
  refetch: () => void,
  parentTag?: FlatTag
) => {
  const { updateTagParentMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const deleteLocalTagClones = () => {
    updateTagParentMutation({
      variables: {
        tagID: locationTag.id,
        parentIDs: parentTag
          ? (locationTag.parent_tags?.map(t => t.id) ?? []).filter(t => t !== parentTag.id)
          : [],
      },
    });
  };

  return { deleteLocalTagClones };
};

export const useDeleteTag = (locationTag: FlatTag, refetch: () => void, parentTag?: FlatTag) => {
  const prompt = useDialog();
  const { t } = useTranslation();

  const { deleteTags } = useDeleteTagAndChildren(refetch, TagType.LOCATION);
  const { deleteSingleTag } = useDeleteSingleTag(refetch, TagType.LOCATION);
  const { deleteLocalTagClone } = useDeleteLocalTagClone(locationTag, refetch, parentTag);
  const { deleteLocalTagClones } = useDeleteLocalTagClones(locationTag, refetch, parentTag);
  const deleteTag = async () => {
    const deleteOption = await prompt({
      title: t(`tag-panel.should-delete-${TagType.LOCATION}`),
      content: locationTag.name,
      options: [
        { name: t('common.abort'), icon: <Close />, value: 0 },
        { name: t(`tag-panel.just-delete-single-${TagType.LOCATION}`), icon: <Done />, value: 1 },
        { name: t('common.confirm'), icon: <Done />, value: 2 },
      ],
    });
    if (deleteOption === 0) return;
    let deleteClones = -1;
    if (locationTag.parent_tags && locationTag.parent_tags.length > 1) {
      deleteClones = await prompt({
        title: t('tag-panel.delete-elsewhere', { name: locationTag.name }),
        content: locationTag.name,
        options: [
          { name: t('common.abort'), icon: <Close />, value: 0 },
          { name: t('tag-panel.only-delete-here'), icon: <Done />, value: 1 },
          { name: t('tag-panel.delete-everywhere'), icon: <Done />, value: 2 },
        ],
      });
    }
    if (deleteClones === 0) return;
    switch (deleteOption) {
      case 1: {
        if (deleteClones === 1) {
          deleteLocalTagClone();
        } else {
          deleteSingleTag(locationTag);
        }
        break;
      }
      case 2: {
        if (deleteClones === 1) {
          deleteLocalTagClones();
        } else {
          deleteTags(locationTag);
        }
        break;
      }
    }
  };

  return { deleteTag };
};
