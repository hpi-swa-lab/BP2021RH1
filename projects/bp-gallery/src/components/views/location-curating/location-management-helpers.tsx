import { Close, Done } from '@mui/icons-material';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ComponentCommonSynonyms,
  ComponentCommonSynonymsInput,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { getDescendants } from '../../../helpers/tree-helpers';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { AlertContext, AlertType } from '../../provider/AlertProvider';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { useLocationPanelPermissions } from './LocationPanelPermissionsContext';
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
  const { canUpdateTagParent: canSetParentTags } = useLocationPanelPermissions();

  const setParentTags = useCallback(
    (parentTags: FlatTag[]) => {
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
    },
    [closesLoop, locationTag, updateTagParentMutation]
  );

  return { setParentTags, canSetParentTags };
};

export const useSetChildTags = (locationTag: FlatTag, refetch: () => void) => {
  const { closesLoop } = useClosesLoop();
  const { updateTagChildMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagChildMutation] = updateTagChildMutationSource({
    onCompleted: refetch,
  });
  const { canUpdateTagChild: canSetChildTags } = useLocationPanelPermissions();

  const setChildTags = useCallback(
    (childTags: FlatTag[]) => {
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
    },
    [closesLoop, locationTag, updateTagChildMutation]
  );

  return { setChildTags, canSetChildTags };
};

export const useSetVisible = (locationTag: FlatTag, refetch: () => void) => {
  const { updateVisibilityMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateVisibilityMutation] = updateVisibilityMutationSource({
    onCompleted: refetch,
  });
  const { canUpdateVisibility: canSetVisible } = useLocationPanelPermissions();
  const setVisible = useCallback(
    (value: boolean) => {
      updateVisibilityMutation({
        variables: {
          tagId: locationTag.id,
          visible: value,
        },
      });
    },
    [locationTag.id, updateVisibilityMutation]
  );

  return { setVisible, canSetVisible };
};

export const useSetRoot = (locationTag: FlatTag, refetch: () => void) => {
  const { updateRootMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateRootMutation] = updateRootMutationSource({
    onCompleted: refetch,
  });
  const { canUpdateRoot: canSetTagAsRoot } = useLocationPanelPermissions();

  const setTagAsRoot = useCallback(
    async (isRoot: boolean) => {
      updateRootMutation({
        variables: {
          tagId: locationTag.id,
          root: isRoot,
        },
      });
    },
    [locationTag.id, updateRootMutation]
  );

  return { setTagAsRoot, canSetTagAsRoot };
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
  const { canUpdateTagParent, canUpdateRoot } = useLocationPanelPermissions();
  const canRelocateTag = canUpdateTagParent && canUpdateRoot;
  const relocateTag = useCallback(async () => {
    const selectedTag: FlatTag | undefined = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: locationTag.name,
    });
    if (selectedTag) {
      if (selectedTag.child_tags?.some(tag => tag.name === locationTag.name)) {
        if (!selectedTag.child_tags.some(tag => tag.id === locationTag.id)) {
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
        if (closesLoop(locationTag, selectedTag)) return;

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
  }, [closesLoop, locationTag, parentTag, prompt, t, updateRootMutation, updateTagParentMutation]);

  return { relocateTag, canRelocateTag };
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
  const { canUpdateTagParent, canUpdateRoot } = useLocationPanelPermissions();
  const canDetachTag = canUpdateTagParent && canUpdateRoot;
  const detachTag = useCallback(async () => {
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
  }, [
    locationTag.id,
    locationTag.name,
    locationTag.parent_tags,
    parentTag,
    prompt,
    t,
    updateRootMutation,
    updateTagParentMutation,
  ]);

  return { detachTag, canDetachTag };
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
  const { canUpdateTagParent, canUpdateRoot } = useLocationPanelPermissions();
  const canCopyTag = canUpdateTagParent && canUpdateRoot;
  const copyTag = useCallback(async () => {
    const selectedTag: FlatTag | undefined = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: locationTag.name,
    });
    if (selectedTag) {
      if (selectedTag.child_tags?.some(tag => tag.name === locationTag.name)) {
        if (!selectedTag.child_tags.some(tag => tag.id === locationTag.id)) {
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
        if (closesLoop(locationTag, selectedTag)) return;

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
  }, [closesLoop, locationTag, prompt, t, updateRootMutation, updateTagParentMutation]);

  return { copyTag, canCopyTag };
};

export const useAcceptTag = (locationTag: FlatTag, refetch: () => void) => {
  const { updateTagAcceptanceMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateAcceptedMutation] = updateTagAcceptanceMutationSource({
    onCompleted: refetch,
  });
  const { canUpdateTagAcceptance: canAcceptTag } = useLocationPanelPermissions();
  const acceptTag = useCallback(() => {
    updateAcceptedMutation({
      variables: {
        tagId: locationTag.id,
        accepted: true,
      },
    });
  }, [locationTag.id, updateAcceptedMutation]);

  return { acceptTag, canAcceptTag };
};

export const useDeleteSynonym = (locationTag: FlatTag, refetch: () => void) => {
  const { updateSynonymsMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    onCompleted: refetch,
  });
  const { canUpdateSynonyms: canDeleteSynonym } = useLocationPanelPermissions();
  const deleteSynonym = useCallback(
    (synonymName: string) => {
      updateSynonymsMutation({
        variables: {
          tagId: locationTag.id,
          synonyms:
            locationTag.synonyms?.filter(
              (s): s is ComponentCommonSynonyms => !!s && s.name !== '' && s.name !== synonymName
            ) ?? [],
        },
      });
    },
    [locationTag.id, locationTag.synonyms, updateSynonymsMutation]
  );

  return { deleteSynonym, canDeleteSynonym };
};

export const useAddSynonym = (locationTag: FlatTag, refetch: () => void) => {
  const { updateSynonymsMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    onCompleted: refetch,
  });
  const { canUpdateSynonyms: canAddSynonym } = useLocationPanelPermissions();
  const addSynonym = useCallback(
    (synonymName: string) => {
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
    },
    [locationTag.id, locationTag.synonyms, updateSynonymsMutation]
  );
  return { addSynonym, canAddSynonym };
};

const useDeleteLocalTagCloneAndMoveUpChildren = (
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
  const deleteLocalTagCloneAndMoveUpChildren = useCallback(() => {
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
  }, [
    locationTag.child_tags,
    locationTag.id,
    locationTag.parent_tags,
    parentTag,
    updateRootMutation,
    updateTagParentMutation,
  ]);

  return { deleteLocalTagCloneAndMoveUpChildren };
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
  const deleteLocalTagCloneAndChildren = useCallback(() => {
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
  }, [
    locationTag.id,
    locationTag.parent_tags,
    parentTag,
    updateRootMutation,
    updateTagParentMutation,
  ]);

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

  const { tagPictures } = useGenericTagEndpoints(TagType.LOCATION);
  const { deleteTags } = useDeleteTagAndChildren(refetch, TagType.LOCATION);
  const { deleteSingleTag } = useDeleteSingleTag(refetch, TagType.LOCATION);
  const { deleteLocalTagCloneAndMoveUpChildren } = useDeleteLocalTagCloneAndMoveUpChildren(
    locationTag,
    refetch,
    parentTag
  );
  const { deleteLocalTagCloneAndChildren } = useDeleteLocalTagCloneAndChildren(
    locationTag,
    refetch,
    parentTag
  );
  const descendants = getDescendants(locationTag, 'child_tags');

  const tagPicturesQueryResponse = tagPictures({
    variables: { tagIDs: [locationTag.id] },
    fetchPolicy: 'no-cache',
  });
  const flattenedTagPictures = useSimplifiedQueryResponseData(tagPicturesQueryResponse.data);

  const descendantsPicturesQueryResponse = tagPictures({
    variables: { tagIDs: descendants },
    fetchPolicy: 'no-cache',
  });

  const flattenedDescendantsPictures = useSimplifiedQueryResponseData(
    descendantsPicturesQueryResponse.data
  );

  const { canDeleteTag: canRunDeleteTag, canUpdateTagParent: canRunUpdateTagParent } =
    useLocationPanelPermissions();
  const canDeleteTag = canRunDeleteTag && canRunUpdateTagParent;

  const deleteTag = useCallback(async () => {
    const deleteOption = await prompt({
      title: t(`tag-panel.should-delete-${TagType.LOCATION}`),
      content: locationTag.name,
      options: [
        { name: t('common.abort'), icon: <Close />, value: deleteOptions.ABORT },
        ...(locationTag.child_tags?.length
          ? [
              {
                name: t(`tag-panel.just-delete-single-${TagType.LOCATION}`),
                icon: <Done />,
                value: deleteOptions.DELETE_SINGLE_TAG,
              },
            ]
          : []),
        {
          name: t('common.confirm'),
          icon: <Done />,
          value: deleteOptions.DELETE_TAG_AND_CHILDREN,
        },
      ],
    });
    if (deleteOption === deleteOptions.ABORT) return;
    if (flattenedTagPictures?.locationTags[0].pictures.length) {
      await prompt({
        preset: DialogPreset.CONFIRM,
        title: t('tag-panel.not-allowed-to-delete', {
          count: flattenedTagPictures.locationTags[0].pictures.length,
        }),
      });
      return;
    }
    if (deleteOption === deleteOptions.DELETE_TAG_AND_CHILDREN) {
      const tags: any[] = flattenedDescendantsPictures?.locationTags;
      if (tags.some((tag: any) => tag.pictures.length)) {
        await prompt({
          preset: DialogPreset.CONFIRM,
          title: t('tag-panel.not-allowed-to-delete-sublocation'),
        });
        return;
      }
    }

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
    if (deleteClones === deleteOptions.ABORT) return;
    switch (deleteOption) {
      case deleteOptions.DELETE_SINGLE_TAG: {
        if (deleteClones === deleteOptions.DELETE_IN_SINGLE_LOCATION) {
          deleteLocalTagCloneAndMoveUpChildren();
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
  }, [
    deleteLocalTagCloneAndChildren,
    deleteLocalTagCloneAndMoveUpChildren,
    deleteSingleTag,
    deleteTags,
    flattenedDescendantsPictures,
    flattenedTagPictures,
    locationTag,
    prompt,
    t,
  ]);

  return { deleteTag, canDeleteTag };
};

export const useUpdateName = (locationTag: FlatTag, refetch: () => void) => {
  const { updateTagNameMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [updateTagNameMutation] = updateTagNameMutationSource({
    onCompleted: refetch,
  });
  const { canUpdateTagName: canUpdateName } = useLocationPanelPermissions();

  const updateName = useCallback(
    (newName: string = '') => {
      updateTagNameMutation({
        variables: {
          name: newName,
          tagId: locationTag.id,
        },
      });
    },
    [locationTag.id, updateTagNameMutation]
  );

  return { updateName, canUpdateName };
};

export const useCreateNewTag = (refetch: () => void) => {
  const dialog = useDialog();
  const { t } = useTranslation();
  const { createTagMutationSource } = useGenericTagEndpoints(TagType.LOCATION);
  const [createTagMutation] = createTagMutationSource({
    onCompleted: refetch,
  });
  const { canCreateTag: canCreateNewTag } = useLocationPanelPermissions();

  const createNewTag = useCallback(
    async (potentialSiblings?: FlatTag[], parent?: FlatTag) => {
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
    },
    [createTagMutation, dialog, t]
  );

  return { createNewTag, canCreateNewTag };
};
