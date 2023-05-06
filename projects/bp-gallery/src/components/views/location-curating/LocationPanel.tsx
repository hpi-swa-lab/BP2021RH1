import { Add } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import LocationBranch from './LocationBranch';
import LocationPanelHeader from './LocationPanelHeader';
import { useGetTagTree } from './tag-structure-helpers';

const LocationPanel = ({ type = TagType.LOCATION }: { type: string }) => {
  const dialog = useDialog();
  const { t } = useTranslation();

  const { allTagsQuery, createTagMutationSource } = useGenericTagEndpoints(type as TagType);

  const { data, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const setUnacceptedSubtagsCount = useCallback((tag: any) => {
    if (!tag.child_tags.length) {
      return tag.accepted ? 0 : 1;
    }
    let subtagCount = 0;
    tag.child_tags.forEach((childTag: any) => {
      subtagCount += setUnacceptedSubtagsCount(childTag);
    });
    tag.unacceptedSubtags = subtagCount;
    return subtagCount;
  }, []);

  const sortedTagTree = useGetTagTree(flattenedTags);

  const tagTree = useMemo(() => {
    if (!sortedTagTree) return;

    sortedTagTree.forEach(tag => {
      tag.name, setUnacceptedSubtagsCount(tag);
    });

    return sortedTagTree;
  }, [sortedTagTree, setUnacceptedSubtagsCount]);

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
    if (collectionName?.length && !tagTree?.some((child: any) => child.name === collectionName)) {
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
