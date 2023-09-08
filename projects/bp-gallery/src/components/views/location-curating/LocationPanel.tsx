import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useVisit } from '../../../helpers/history';
import useGenericTagEndpoints from '../../../hooks/generic-endpoints.hook';
import { FlatTag, TagType } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import ProtectedRoute from '../../common/ProtectedRoute';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import AddLocationEntry from './AddLocationEntry';
import { useFoldoutStatus } from './FoldoutStatusContext';
import LocationBranch from './LocationBranch';
import LocationFilter, { LocationFilterType } from './LocationFilter';
import LocationPanelHeader from './LocationPanelHeader';
import { LocationPanelPermissionsProvider } from './LocationPanelPermissionsProvider';
import { useCreateNewTag } from './location-management-helpers';
import { useGetTagStructures } from './tag-structure-helpers';

const setUnacceptedSubtagsCount = (tag: FlatTag) => {
  let subtagCount = 0;
  tag.child_tags?.forEach((childTag: FlatTag) => {
    subtagCount += setUnacceptedSubtagsCount(childTag);
  });
  tag.unacceptedSubtags = subtagCount;
  return (tag.accepted ? 0 : 1) + subtagCount;
};

const LocationPanel = () => {
  const { t } = useTranslation();
  const { location } = useVisit();
  const foldoutStatus = useFoldoutStatus();

  const { allTagsQuery, canUseTagTableViewQuery } = useGenericTagEndpoints(TagType.LOCATION);

  const { data, loading, error, refetch } = allTagsQuery();
  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: FlatTag[] | undefined = flattened ? Object.values(flattened)[0] : undefined;

  useEffect(() => {
    if (!foldoutStatus) {
      return;
    }
    foldoutStatus.current = Object.fromEntries(
      flattenedTags
        ? flattenedTags.map(tag => [
            tag.id,
            {
              isOpen:
                location.state?.openBranches && tag.id in location.state.openBranches
                  ? location.state.openBranches[tag.id].isOpen
                  : false,
            },
          ])
        : []
    );
    // only trigger at first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const [isOpen, setOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<LocationFilterType>(LocationFilterType.CONTAINS);
  const [filterValue, setFilterValue] = useState<string | string[] | undefined>();

  return (
    <ProtectedRoute canUse={canUseLocationPanel} canUseLoading={canUseLocationPanelLoading}>
      {() => {
        if (error) {
          return <QueryErrorDisplay error={error} />;
        } else if (loading) {
          return <Loading />;
        } else {
          return (
            <LocationPanelPermissionsProvider>
              <LocationPanelHeader
                setOpen={(value: boolean) => {
                  setOpen(value);
                }}
              />
              {isOpen && (
                <LocationFilter
                  filterType={filterType}
                  setFilterType={(value: LocationFilterType) => {
                    setFilterType(value);
                  }}
                  setFilterValue={(value: string | string[] | undefined) => {
                    setFilterValue(value);
                  }}
                  setOpen={(value: boolean) => {
                    setOpen(value);
                  }}
                />
              )}
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
            </LocationPanelPermissionsProvider>
          );
        }
      }}
    </ProtectedRoute>
  );
};

export default LocationPanel;
