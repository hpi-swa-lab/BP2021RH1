import { Add } from '@mui/icons-material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import LocationBranch from './LocationBranch';
import LocationPanelHeader from './LocationPanelHeader';

const LocationPanel = ({ type = TagType.LOCATION }: { type: string }) => {
  const dialog = useDialog();
  const { t } = useTranslation();

  const { allTagsQuery, createTagMutationSource } = useGenericTagEndpoints(type as TagType);

  const { data, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const tagTree = useMemo(() => {
    if (!flattenedTags) return;

    const tagsById = Object.fromEntries(
      flattenedTags.map(tag => [tag.id, { ...tag, child_tags: [] as FlatTag[] }])
    );
    for (const tag of Object.values(tagsById)) {
      tag.parent_tags?.forEach(parentTag => {
        tagsById[parentTag.id].child_tags.push(tag);
        // THIS IS JUST FOR THE PROTOTYPE DO NOT USE IT IN THE FUTURE
        tagsById[parentTag.id].child_tags.sort((a, b) => a.name.localeCompare(b.name));
      });
    }
    return (
      Object.values(tagsById)
        .filter(tag => !tag.parent_tags?.length)
        // THIS IS JUST FOR THE PROTOTYPE DO NOT USE IT IN THE FUTURE
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [flattenedTags]);

  const [createLocationTag] = createTagMutationSource({
    onCompleted: (_: any) => {
      refetch();
    },
  });

  const addNewLocation = async () => {
    const collectionName = await dialog({
      preset: DialogPreset.INPUT_FIELD,
      title: t(`tag-panel.name-of-${type}`),
    });
    if (collectionName?.length) {
      createLocationTag({
        variables: {
          name: collectionName,
          accepted: true,
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
          <LocationBranch key={tag.id} locationTag={tag} refetch={refetch} type={type as TagType} />
        ))}
        <div className='add-tag-container' onClick={addNewLocation}>
          <Add className='add-tag-icon' />
          <div className='add-tag-text'>{t(`tag-panel.add-${type}`)}</div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default LocationPanel;
