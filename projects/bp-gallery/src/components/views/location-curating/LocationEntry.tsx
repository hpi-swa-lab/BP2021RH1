import {
  Check,
  ChevronRight,
  Close,
  CopyAll,
  Delete,
  Done,
  Edit,
  Eject,
  ExpandMore,
  MoveDown,
} from '@mui/icons-material';
import { Badge, Chip, IconButton } from '@mui/material';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ComponentCommonSynonymsInput } from '../../../graphql/APIConnector';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import Checkbox from './Checkbox';
import { useDeleteSingleTag, useDeleteTagAndChildren } from './delete-tag-helpers';
import './LocationEntry.scss';

const LocationEntry = ({
  locationTag,
  parentTag,
  showMore,
  onToggle,
  refetch,
  type,
  unacceptedSubtags = 0,
}: {
  locationTag: FlatTag;
  parentTag?: FlatTag;
  showMore: boolean;
  onToggle: () => void;
  refetch: () => void;
  type: TagType;
  unacceptedSubtags?: number;
}) => {
  const prompt = useDialog();
  const history: History = useHistory();
  const { t } = useTranslation();

  const {
    updateSynonymsMutationSource,
    updateVisibilityMutationSource,
    updateTagParentMutationSource,
    updateTagNameMutationSource,
    updateTagAcceptanceMutationSource,
  } = useGenericTagEndpoints(type);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [updateVisibilityMutation] = updateVisibilityMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const setVisible = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    updateVisibilityMutation({
      variables: {
        tagId: locationTag.id,
        visible: !locationTag.visible,
      },
    });
  };

  const [updateTagParentMutation] = updateTagParentMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const relocateTag = async (tagId?: string, tagName?: string) => {
    if (!tagId || !tagName) return;
    const selectedTag = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: tagName,
      type: type,
    });
    if (selectedTag) {
      if (selectedTag.child_tags.some((tag: any) => tag.name === tagName)) {
        if (selectedTag.child_tags.some((tag: any) => tag.id === tagId)) {
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
            title:
              'Es existiert bereits ein anderes Tag mit diesem Namen an der Stelle, wo sie das Tag einfügen wollen. Diese Operation wird deswegen nicht durchgeführt!',
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

  const [updateTagNameMutation] = updateTagNameMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const editName = async (tagId?: string, tagName?: string) => {
    if (!tagId || !tagName) return;
    const locationName = await prompt({
      preset: DialogPreset.INPUT_FIELD,
      title: t(`tag-panel.new-${type}-name`, { tag_name: tagName }),
    });
    if (locationName?.length) {
      updateTagNameMutation({
        variables: {
          name: locationName,
          tagId: tagId,
        },
      });
    }
  };

  const detachTag = async (tagId?: string, tagName?: string) => {
    if (!tagId || !tagName) return;
    const reallyDetach = await prompt({
      title: t(`tag-panel.detach-${type}`),
      content: tagName,
      options: [
        { name: 'Abbrechen', icon: <Close />, value: false },
        { name: 'Bestätigen', icon: <Done />, value: true },
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

  const copyTag = async (tagId?: string, tagName?: string) => {
    if (!tagId || !tagName) return;
    const selectedTag = await prompt({
      preset: DialogPreset.SELECT_LOCATION,
      content: tagName,
      type: type,
    });
    if (selectedTag) {
      updateTagParentMutation({
        variables: {
          tagID: locationTag.id,
          parentIDs: [...(locationTag.parent_tags?.map(t => t.id) ?? []), selectedTag.id],
        },
      });
    }
  };

  const [updateSynonymsMutation] = updateSynonymsMutationSource({
    onCompleted: _ => {
      refetch();
    },
  });

  const [updateAcceptedMutation] = updateTagAcceptanceMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const acceptTag = (tagId: string) => {
    updateAcceptedMutation({
      variables: {
        tagId,
        accepted: true,
      },
    });
  };

  const deleteSynonym = (tagId: string, synonymName: string) => {
    updateSynonymsMutation({
      variables: {
        tagId,
        synonyms:
          locationTag.synonyms?.filter(s => s?.name !== '' && s?.name !== synonymName) ??
          ([] as any),
      },
    });
  };

  const addSynonym = async (tagId: string, tagName: string) => {
    if (!tagId) return;
    const synonymName = await prompt({
      preset: DialogPreset.INPUT_FIELD,
      title: `Name des neuen Synonyms für ${tagName}`,
    });
    if (synonymName.length) {
      const synonyms: ComponentCommonSynonymsInput[] =
        locationTag.synonyms?.map(s => ({ name: s?.name })) ?? [];
      synonyms.push({ name: synonymName });
      updateSynonymsMutation({
        variables: {
          tagId,
          synonyms,
        },
      });
    }
  };

  const { deleteTags } = useDeleteTagAndChildren(locationTag, refetch, type);
  const { deleteSingleTag } = useDeleteSingleTag(locationTag, refetch, type);

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

  const deleteTag = async (tagId?: string, tagName?: string) => {
    if (!tagId || !tagName) return;
    const deleteOption = await prompt({
      title: t(`tag-panel.should-delete-${type}`),
      content: tagName,
      options: [
        { name: 'Abbrechen', icon: <Close />, value: 0 },
        { name: t(`tag-panel.just-delete-single-${type}`), icon: <Done />, value: 1 },
        { name: 'Bestätigen', icon: <Done />, value: 2 },
      ],
    });
    if (deleteOption === 0) return;
    let deleteClones = -1;
    if (locationTag.parent_tags && locationTag.parent_tags.length > 1) {
      deleteClones = await prompt({
        title: 'Dieses Tag besitzt Kopien an anderen Stellen. Sollen diese auch gelöscht werden?',
        content: tagName,
        options: [
          { name: 'Abbrechen', icon: <Close />, value: 0 },
          { name: 'Nur hier löschen', icon: <Done />, value: 1 },
          { name: 'Überall löschen', icon: <Done />, value: 2 },
        ],
      });
    }
    if (deleteClones === 0) return;
    switch (deleteOption) {
      case 1: {
        if (deleteClones === 1) {
          deleteLocalTagClone();
        } else {
          deleteSingleTag();
        }
        break;
      }
      case 2: {
        if (deleteClones === 1) {
          deleteLocalTagClones();
        } else {
          deleteTags();
        }
        break;
      }
    }
  };

  return (
    <div
      className={`location-entry-container ${!locationTag.accepted ? 'location-not-accepted' : ''}`}
    >
      <div className='location-entry-content'>
        <Badge color='info' overlap='circular' variant='dot' badgeContent={unacceptedSubtags}>
          <IconButton className='show-more-button' onClick={onToggle}>
            {showMore ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
        </Badge>
        <div
          className='location-name'
          onClick={() => {
            prompt({
              preset: DialogPreset.LOCATION_MANAGEMENT,
              title: locationTag.name,
              content: { locationTag: locationTag, refetch: refetch },
              maxWidth: false,
            });
          }}
          /*onClick={() => {
            history.push(`/show-more/${type}/${locationTag.id}`, {
              showBack: true,
            });
          }}*/
        >
          {locationTag.name}
        </div>
        {!locationTag.accepted && (
          <IconButton className='accept-location-name' onClick={() => acceptTag(locationTag.id)}>
            <Check />
          </IconButton>
        )}
        <div
          className='location-synonyms location-column-750'
          onClick={() => {
            addSynonym(locationTag.id, locationTag.name);
          }}
        >
          {locationTag.synonyms?.map((synonym, index) => (
            <div key={index} className='location-synonym'>
              <Chip
                key={synonym!.name}
                label={synonym!.name}
                onDelete={() => deleteSynonym(locationTag.id, synonym!.name)}
              />
            </div>
          ))}
        </div>
        <div className='edit-button location-column-110'>
          <IconButton
            onClick={() => {
              editName(locationTag.id, locationTag.name);
            }}
          >
            <Edit />
          </IconButton>
        </div>
        <div className='detach-button location-column-110'>
          <IconButton
            onClick={() => {
              detachTag(locationTag.id, locationTag.name);
            }}
          >
            <Eject />
          </IconButton>
        </div>
        <div className='relocate-button location-column-110'>
          <IconButton
            onClick={() => {
              relocateTag(locationTag.id, locationTag.name);
            }}
          >
            <MoveDown />
          </IconButton>
        </div>
        <div className='copy-button location-column-110'>
          <IconButton
            onClick={() => {
              copyTag(locationTag.id, locationTag.name);
            }}
          >
            <CopyAll />
          </IconButton>
        </div>
        <div className='is-visible-checkbox-container location-column-110'>
          <Checkbox checked={locationTag.visible ?? false} onChange={setVisible} />
        </div>
        <div className='delete-button location-column-110'>
          <IconButton
            onClick={() => {
              deleteTag(locationTag.id, locationTag.name);
            }}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default LocationEntry;
