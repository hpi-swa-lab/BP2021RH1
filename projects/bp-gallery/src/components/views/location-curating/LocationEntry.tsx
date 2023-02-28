import {
  Check,
  ChevronRight,
  Delete,
  Edit,
  Eject,
  ExpandMore,
  MoveDown,
} from '@mui/icons-material';
import { Chip, IconButton } from '@mui/material';
import { History } from 'history';
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
  showMore,
  onToggle,
  refetch,
  type,
}: {
  locationTag: FlatTag;
  showMore: boolean;
  onToggle: () => void;
  refetch: () => void;
  type: TagType;
}) => {
  const prompt = useDialog();
  const history: History = useHistory();

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
    console.log(selectedTag);
    if (selectedTag) {
      updateTagParentMutation({
        variables: {
          tagID: locationTag.id,
          parentID: selectedTag.id,
        },
      });
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
      title: 'Neuer Name des Tags',
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
      //preset: DialogPreset.CONFIRM,
      title: 'Dieses Tag aus der Hierarchie lösen?',
      content: tagName,
      options: [
        { name: 'Abbrechen', icon: 'close', value: false },
        { name: 'Bestätigen', icon: 'done', value: true },
      ],
    });
    if (reallyDetach) {
      updateTagParentMutation({
        variables: {
          tagID: locationTag.id,
          parentID: null,
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

  const deleteTag = async (tagId?: string, tagName?: string) => {
    if (!tagId || !tagName) return;
    const deleteOption = await prompt({
      //preset: DialogPreset.CONFIRM,
      title: 'Soll folgender Ort und alle seine Unterorte gelöscht werden?',
      content: tagName,
      options: [
        { name: 'Abbrechen', icon: 'close', value: 0 },
        { name: 'Nur diesen Ort löschen', icon: 'done', value: 1 },
        { name: 'Bestätigen', icon: 'done', value: 2 },
      ],
    });
    switch (deleteOption) {
      case 1: {
        deleteSingleTag();
        break;
      }
      case 2: {
        deleteTags();
        break;
      }
    }
  };

  return (
    <div
      className={`location-entry-container ${!locationTag.accepted ? 'location-not-accepted' : ''}`}
    >
      <div className='location-entry-content'>
        <IconButton className='show-more-button' onClick={onToggle}>
          {showMore ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <div
          className='location-name'
          onClick={() => {
            history.push(`/show-more/location/${locationTag.id}`, {
              showBack: true,
            });
          }}
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
