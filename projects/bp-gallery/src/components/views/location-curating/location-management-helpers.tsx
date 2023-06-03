import { Close, Done } from '@mui/icons-material';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentCommonSynonymsInput } from '../../../graphql/APIConnector';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { AlertContext, AlertType } from '../../provider/AlertProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { useDeleteSingleTag, useDeleteTagAndChildren } from './delete-tag-helpers';

const enum deleteOptions {
  ABORT = 0,
  DELETE_SINGLE_TAG = 1,
  DELETE_TAG_AND_CHILDREN = 2,
  DELETE_IN_SINGLE_LOCATION = 1,
  DELETE_EVERYWHERE = 2,
}

const useClosesLoop = () => {
  const openAlert = useContext(AlertContext);
  const { t } = useTranslation();
  const closesLoop = useCallback(
    (childTag: FlatTag, parentTag: FlatTag) => {
      // loop with children
      const queue: FlatTag[] = [childTag];

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

      return false;
    },
    [openAlert, t]
  );
  return { closesLoop };
};

export const useSetParentTags = (locationTag: FlatTag, refetch: () => void) => {
  const { closesLoop } = useClosesLoop();
  const { updateTagParentMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: refetch,
  });

  const setParentTags = (parentTags: FlatTag[]) => {
    const newParentTags = parentTags.filter(tag => tag.isNew);
    if (
      newParentTags.length &&
      newParentTags.some(newParentTag => closesLoop(locationTag, newParentTag))
    ) {
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
    onCompleted: refetch,
  });

  const setChildTags = (childTags: FlatTag[]) => {
    const newChildTags = childTags.filter(tag => tag.isNew);
    if (
      newChildTags.length &&
      newChildTags.some(newChildTag => closesLoop(newChildTag, locationTag))
    ) {
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
    onCompleted: refetch,
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
    onCompleted: refetch,
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

  const { updateTagParentMutationSource, updateRootMutationSource } = useGenericTagEndpoints(
    TagType.LOCATION
  );
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: refetch,
  });
  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: refetch,
  });
  const relocateTag = async () => {
    const selectedTag = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: locationTag.name,
    });
    if (selectedTag) {
      if (selectedTag.child_tags.some((tag: any) => tag.name === locationTag.name)) {
        if (!selectedTag.child_tags.some((tag: any) => tag.id === locationTag.id)) {
          prompt({
            title: t('tag-panel.location-already-exists', { name: locationTag.name }),
            options: [
              {
                name: t('common.ok'),
                value: null,
              },
            ],
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

        if (locationTag.root && !parentTag) {
          updateRootMutation({
            variables: {
              tagId: locationTag.id,
              root: false,
            },
          });
        }
      }
    }
  };

  return { relocateTag };
};

export const useDetachTag = (locationTag: FlatTag, refetch: () => void, parentTag?: FlatTag) => {
  const prompt = useDialog();
  const { t } = useTranslation();

  const { updateTagParentMutationSource, updateRootMutationSource } = useGenericTagEndpoints(
    TagType.LOCATION
  );
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: refetch,
  });
  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: refetch,
  });
  const detachTag = async () => {
    const reallyDetach = await prompt({
      preset: DialogPreset.CONFIRM,
      title: t(`tag-panel.detach-${TagType.LOCATION}`),
      content: locationTag.name,
    });
    const filteredParents = locationTag.parent_tags?.filter(
      tag => !parentTag || tag.id !== parentTag.id
    );
    if (reallyDetach) {
      updateTagParentMutation({
        variables: {
          tagID: locationTag.id,
          parentIDs: filteredParents?.map(tag => tag.id),
        },
      });
      if (filteredParents?.length) {
        updateRootMutation({
          variables: {
            tagId: locationTag.id,
            root: true,
          },
        });
      }
    }
  };

  return { detachTag };
};

export const useCopyTag = (locationTag: FlatTag, refetch: () => void) => {
  const prompt = useDialog();
  const { t } = useTranslation();
  const { closesLoop } = useClosesLoop();

  const { updateTagParentMutationSource, updateRootMutationSource } = useGenericTagEndpoints(
    TagType.LOCATION
  );
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: refetch,
  });
  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: refetch,
  });
  const copyTag = async () => {
    const selectedTag = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: locationTag.name,
    });
    if (selectedTag) {
      if (selectedTag.child_tags.some((tag: any) => tag.name === locationTag.name)) {
        if (!selectedTag.child_tags.some((tag: any) => tag.id === locationTag.id)) {
          prompt({
            title: t('tag-panel.location-already-exists', { name: locationTag.name }),
            options: [
              {
                name: t('common.ok'),
                value: null,
              },
            ],
          });
        }
      } else {
        if (closesLoop(locationTag, selectedTag as FlatTag)) return;

        if (!locationTag.parent_tags?.length) {
          updateRootMutation({
            variables: {
              tagId: locationTag.id,
              root: true,
            },
          });
        }

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
    onCompleted: refetch,
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
    onCompleted: refetch,
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
    onCompleted: refetch,
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

const useDeleteLocalTagCloneAnMoveUpChildren = (
  locationTag: FlatTag,
  refetch: () => void,
  parentTag?: FlatTag
) => {
  const { updateTagParentMutationSource, updateRootMutationSource } = useGenericTagEndpoints(
    TagType.LOCATION
  );
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: refetch,
  });
  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: refetch,
  });
  const deleteLocalTagCloneAnMoveUpChildren = () => {
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
    if (parentTag) {
      updateTagParentMutation({
        variables: {
          tagID: locationTag.id,
          parentIDs: locationTag.parent_tags?.map(t => t.id).filter(t => t !== parentTag.id),
        },
      });
    } else {
      updateRootMutation({
        variables: {
          tagId: locationTag.id,
          root: false,
        },
      });
    }
  };

  return { deleteLocalTagCloneAnMoveUpChildren };
};

const useDeleteLocalTagCloneAndChildren = (
  locationTag: FlatTag,
  refetch: () => void,
  parentTag?: FlatTag
) => {
  const { updateTagParentMutationSource, updateRootMutationSource } = useGenericTagEndpoints(
    TagType.LOCATION
  );
  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: refetch,
  });
  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: refetch,
  });
  const deleteLocalTagCloneAndChildren = () => {
    if (parentTag) {
      updateTagParentMutation({
        variables: {
          tagID: locationTag.id,
          parentIDs: (locationTag.parent_tags?.map(t => t.id) ?? []).filter(
            t => t !== parentTag.id
          ),
        },
      });
    } else {
      updateRootMutation({
        variables: {
          tagId: locationTag.id,
          root: false,
        },
      });
    }
  };

  return { deleteLocalTagCloneAndChildren };
};

export const useDeleteTag = (
  locationTag: FlatTag,
  refetch: () => void,
  parentTag?: FlatTag,
  isRoot?: boolean
) => {
  const prompt = useDialog();
  const { t } = useTranslation();

  const { deleteTags } = useDeleteTagAndChildren(refetch, TagType.LOCATION);
  const { deleteSingleTag } = useDeleteSingleTag(refetch, TagType.LOCATION);
  const { deleteLocalTagCloneAnMoveUpChildren } = useDeleteLocalTagCloneAnMoveUpChildren(
    locationTag,
    refetch,
    parentTag
  );
  const { deleteLocalTagCloneAndChildren } = useDeleteLocalTagCloneAndChildren(
    locationTag,
    refetch,
    parentTag
  );
  const deleteTag = async () => {
    const deleteOption = await prompt({
      title: t(`tag-panel.should-delete-${TagType.LOCATION}`),
      content: locationTag.name,
      options: locationTag.child_tags?.length
        ? [
            { name: t('common.abort'), icon: <Close />, value: deleteOptions.ABORT },
            {
              name: t(`tag-panel.just-delete-single-${TagType.LOCATION}`),
              icon: <Done />,
              value: deleteOptions.DELETE_SINGLE_TAG,
            },
            {
              name: t('common.confirm'),
              icon: <Done />,
              value: deleteOptions.DELETE_TAG_AND_CHILDREN,
            },
          ]
        : [
            { name: t('common.abort'), icon: <Close />, value: deleteOptions.ABORT },
            {
              name: t('common.confirm'),
              icon: <Done />,
              value: deleteOptions.DELETE_TAG_AND_CHILDREN,
            },
          ],
    });
    if (deleteOption === deleteOptions.ABORT) return;
    let deleteClones = -1;
    if (
      locationTag.parent_tags &&
      (locationTag.parent_tags.length > 1 ||
        (locationTag.parent_tags.length === 1 && locationTag.root))
    ) {
      deleteClones = await prompt({
        title: t('tag-panel.delete-elsewhere', { name: locationTag.name }),
        content: locationTag.name,
        options: [
          { name: t('common.abort'), icon: <Close />, value: deleteOptions.ABORT },
          {
            name: t('tag-panel.only-delete-here'),
            icon: <Done />,
            value: deleteOptions.DELETE_IN_SINGLE_LOCATION,
          },
          {
            name: t('tag-panel.delete-everywhere'),
            icon: <Done />,
            value: deleteOptions.DELETE_EVERYWHERE,
          },
        ],
      });
    }
    if (deleteClones === 0) return;
    switch (deleteOption) {
      case deleteOptions.DELETE_SINGLE_TAG: {
        if (deleteClones === deleteOptions.DELETE_IN_SINGLE_LOCATION) {
          deleteLocalTagCloneAnMoveUpChildren();
        } else {
          deleteSingleTag(locationTag);
        }
        break;
      }
      case deleteOptions.DELETE_TAG_AND_CHILDREN: {
        if (deleteClones === deleteOptions.DELETE_IN_SINGLE_LOCATION) {
          deleteLocalTagCloneAndChildren();
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
    onCompleted: refetch,
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
    onCompleted: refetch,
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
