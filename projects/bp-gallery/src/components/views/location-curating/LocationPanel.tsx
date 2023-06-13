import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import AddLocationEntry from './AddLocationEntry';
import LocationBranch from './LocationBranch';
import LocationPanelHeader from './LocationPanelHeader';
import { useCreateNewTag } from './location-management-helpers';
import { useGetTagStructures } from './tag-structure-helpers';

const setUnacceptedSubtagsCount = (tag: FlatTag) => {
  if (!tag.child_tags?.length) {
    return tag.accepted ? 0 : 1;
  }
  let subtagCount = 0;
  tag.child_tags.forEach((childTag: FlatTag) => {
    subtagCount += setUnacceptedSubtagsCount(childTag);
  });
  tag.unacceptedSubtags = subtagCount;
  return subtagCount;
};

const LocationPanel = () => {
  const { t } = useTranslation();

  const { allTagsQuery } = useGenericTagEndpoints(TagType.LOCATION);

  const { data, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const { createNewTag } = useCreateNewTag(refetch);

  const { tagTree: sortedTagTree } = useGetTagStructures(flattenedTags);

  const tagTree = useMemo(() => {
    if (!sortedTagTree) return;

    sortedTagTree.forEach(tag => {
      setUnacceptedSubtagsCount(tag);
    });

    return sortedTagTree;
  }, [sortedTagTree]);

  return (
    <div>
      <LocationPanelHeader />
      <div className='location-panel-content'>
        {tagTree?.map(tag => (
          <LocationBranch key={tag.id} locationTag={tag} refetch={refetch} />
        ))}
        <AddLocationEntry
          text={t(`tag-panel.add-location`)}
          onClick={() => {
            createNewTag(tagTree);
          }}
        />
      </div>
    </div>
  );
};

export default LocationPanel;
