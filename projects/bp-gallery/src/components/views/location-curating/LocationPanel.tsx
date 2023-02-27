import { Add } from '@mui/icons-material';
import { useMemo } from 'react';
import { useCreateLocationMutation } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import LocationBranch from './LocationBranch';
import LocationPanelHeader from './LocationPanelHeader';

const LocationPanel = ({ type = TagType.LOCATION }: { type: TagType }) => {
  const dialog = useDialog();

  const { allTagsQuery } = useGenericTagEndpoints(type);

  const { data, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const tagTree = useMemo(() => {
    if (!flattenedTags) return;

    const tagsById = Object.fromEntries(
      flattenedTags.map(tag => [tag.id, { ...tag, child_tags: [] as FlatTag[] }])
    );
    for (const tag of Object.values(tagsById)) {
      if (tag.parent_tag?.id) {
        tagsById[tag.parent_tag.id].child_tags.push(tag);
      }
    }
    return Object.values(tagsById).filter(tag => !tag.parent_tag);
  }, [flattenedTags]);

  const [createLocationTag] = useCreateLocationMutation({
    onCompleted: _ => {
      refetch();
    },
  });

  const addNewLocation = async () => {
    const collectionName = await dialog({
      preset: DialogPreset.INPUT_FIELD,
      title: 'Name des neuen Orts',
    });
    if (collectionName?.length) {
      createLocationTag({
        variables: {
          name: collectionName,
        },
      });
    }
  };

  return (
    <div>
      <div className='location-panel-header'>
        <LocationPanelHeader />
      </div>
      <div className='location-panel-content'>
        {tagTree?.map(tag => (
          <LocationBranch key={tag.id} locationTag={tag} refetch={refetch} />
        ))}
        <div className='add-tag-container' onClick={addNewLocation}>
          <Add className='add-tag-icon' />
          <div className='add-tag-text'>{`Ort hinzufügen`}</div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default LocationPanel;
