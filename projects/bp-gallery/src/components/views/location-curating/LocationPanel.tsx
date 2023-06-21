import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import ProtectedRoute from '../../common/ProtectedRoute';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
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

  const { allTagsQuery, canUseTagTableViewQuery } = useGenericTagEndpoints(TagType.LOCATION);

  const { data, loading, error, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const { createNewTag, canCreateNewTag } = useCreateNewTag(refetch);

  const { tagTree: sortedTagTree } = useGetTagStructures(flattenedTags);

  const tagTree = useMemo(() => {
    if (!sortedTagTree) return;

    sortedTagTree.forEach(tag => {
      setUnacceptedSubtagsCount(tag);
    });

    return sortedTagTree;
  }, [sortedTagTree]);

  const { canRun: canUseLocationPanel, loading: canUseLocationPanelLoading } =
    canUseTagTableViewQuery();

  return (
    <ProtectedRoute canUse={canUseLocationPanel} canUseLoading={canUseLocationPanelLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else {
          return (
            <>
              <LocationPanelHeader />
              <div className='location-panel-content'>
                {tagTree?.map(tag => (
                  <LocationBranch key={tag.id} locationTag={tag} refetch={refetch} />
                ))}
                {canCreateNewTag && (
                  <AddLocationEntry
                    text={t(`tag-panel.add-location`)}
                    onClick={() => {
                      createNewTag(tagTree);
                    }}
                  />
                )}
              </div>
            </>
          );
        }
      }}
    </ProtectedRoute>
  );
};

export default LocationPanel;
