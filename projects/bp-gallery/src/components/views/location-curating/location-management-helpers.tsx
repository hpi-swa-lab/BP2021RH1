import { Close, Done } from '@mui/icons-material';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { useDeleteTagAndChildren, useDeleteSingleTag } from './delete-tag-helpers';
import { useTranslation } from 'react-i18next';
import { ComponentCommonSynonymsInput } from '../../../graphql/APIConnector';
import { useContext } from 'react';
import { AlertContext, AlertType } from '../../provider/AlertProvider';

const useClosesLoop = () => {
  const openAlert = useContext(AlertContext);
  const { t } = useTranslation();
  const closesLoop = (childTag: FlatTag, parentTag: FlatTag) => {
    // direct loop
    if (childTag.id === parentTag.id) {
      openAlert({
        alertType: AlertType.ERROR,
        message: t('tag-panel.loop-error'),
        duration: 5000,
      });
      return true;
    }

    // loop with children
    const queue: FlatTag[] = [];
    childTag.child_tags?.forEach(child => {
      queue.push(child);
    });

    while (queue.length > 0) {
      const nextTag = queue.shift();
      if (nextTag && nextTag.id === parentTag.id) {
        openAlert({
          alertType: AlertType.ERROR,
          message: t('tag-panel.loop-error'),
          duration: 5000,
        });
        return true;
      }
      nextTag?.child_tags?.forEach(child => {
        queue.push(child);
      });
    }

    // loop with parents
    const parentQueue: FlatTag[] = [];
    parentTag.parent_tags?.forEach(parent => {
      parentQueue.push(parent);
    });

    while (parentQueue.length > 0) {
      const nextTag = parentQueue.shift();
      if (nextTag && nextTag.id === childTag.id) {
        openAlert({
          alertType: AlertType.ERROR,
          message: t('tag-panel.loop-error'),
          duration: 5000,
        });
        return true;
      }
      nextTag?.parent_tags?.forEach(parent => {
        parentQueue.push(parent);
      });
    }

    return false;
  };
  return { closesLoop };
};

export const useSetParentTags = (locationTag: FlatTag, refetch: () => void) => {
  const { closesLoop } = useClosesLoop();
  const { updateTagParentMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const setParentTags = (parentTags: FlatTag[]) => {
    const newParentTag = parentTags.filter(tag => tag.child_tags);
    if (newParentTag.length && closesLoop(locationTag, newParentTag[0])) {
      return;
    }

    updateTagParentMutation({
      variables: {
        tagID: locationTag.id,
        parentIDs: parentTags.map(parent => parent.id),
      },
    });
  };

  return { setParentTags };
};

export const useSetChildTags = (locationTag: FlatTag, refetch: () => void) => {
  const { closesLoop } = useClosesLoop();
  const { updateTagChildMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagChildMutation] = updateTagChildMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const setChildTags = (childTags: FlatTag[]) => {
    const newChildTag = childTags.filter(tag => tag.child_tags);
    if (newChildTag.length && closesLoop(newChildTag[0], locationTag)) {
      return;
    }

    updateTagChildMutation({
      variables: {
        tagID: locationTag.id,
        childIDs: childTags.map(child => child.id),
      },
    });
  };

  return { setChildTags };
};

export const useSetVisible = (locationTag: FlatTag, refetch: () => void) => {
  const { updateVisibilityMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateVisibilityMutation] = updateVisibilityMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });
  const setVisible = (value: boolean) => {
    updateVisibilityMutation({
      variables: {
        tagId: locationTag.id,
        visible: value,
      },
    });
  };

  return { setVisible };
};

export const useSetRoot = (locationTag: FlatTag, refetch: () => void) => {
  const { updateRootMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const setTagAsRoot = async (isRoot: boolean) => {
    updateRootMutation({
      variables: {
        tagId: locationTag.id,
        root: isRoot,
      },
    });
  };

  return { setTagAsRoot };
};

export const useRelocateTag = (locationTag: FlatTag, refetch: () => void, parentTag?: FlatTag) => {
  const prompt = useDialog();
  const { t } = useTranslation();
  const { closesLoop } = useClosesLoop();

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
        if (!selectedTag.child_tags.some((tag: any) => tag.id === locationTag.id)) {
          prompt({
            preset: DialogPreset.CONFIRM,
            title: t('tag-panel.location-already-exists', { name: locationTag.name }),
          });
        }
      } else {
        if (closesLoop(locationTag, selectedTag as FlatTag)) return;

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
  const { closesLoop } = useClosesLoop();

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
        if (closesLoop(locationTag, selectedTag as FlatTag)) return;

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

export const useAddSynonym = (locationTag: FlatTag, refetch: () => void) => {
  const { updateSynonymsMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });
  const addSynonym = (synonymName: string) => {
    if (synonymName.length) {
      const synonyms: ComponentCommonSynonymsInput[] =
        locationTag.synonyms
          ?.filter(s => s?.name !== '' && s?.name !== synonymName)
          .map(s => ({ name: s?.name })) ?? [];
      synonyms.push({ name: synonymName });
      updateSynonymsMutation({
        variables: {
          tagId: locationTag.id,
          synonyms,
        },
      });
    }
  };
  return { addSynonym };
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

export const useUpdateName = (locationTag: FlatTag, refetch: () => void) => {
  const { updateTagNameMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagNameMutation] = updateTagNameMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const updateName = (newName: string = '') => {
    updateTagNameMutation({
      variables: {
        name: newName,
        tagId: locationTag.id,
      },
    });
  };

  return { updateName };
};

export const useCreateNewTag = (refetch: () => void) => {
  const dialog = useDialog();
  const { t } = useTranslation();
  const { createTagMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [createTagMutation] = createTagMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const createNewTag = async (potentialSiblings?: FlatTag[], parent?: FlatTag) => {
    const tagName = await dialog({
      preset: DialogPreset.INPUT_FIELD,
      title: parent
        ? t(`tag-panel.name-of-sub-${TagType.LOCATION}`, { parent: parent.name })
        : t(`tag-panel.name-of-${TagType.LOCATION}`),
    });
    if (tagName?.length && !potentialSiblings?.some(tag => tag.name === tagName)) {
      createTagMutation({
        variables: {
          name: tagName,
          parentIDs: parent ? [parent.id] : [],
          accepted: true,
        },
      });
    }
  };

  return { createNewTag };
};
