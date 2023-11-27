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

  const [filteredFlattenedTags, setFilteredFlattenedTags] = useState<FlatTag[] | undefined>(
    flattenedTags
  );

  const { tagTree: sortedTagTree } = useGetTagStructures(filteredFlattenedTags);
  const { tagSubtagList } = useGetTagStructures(flattenedTags);

  const [isOpen, setOpen] = useState<boolean>(false);
  const [showFlat, setShowFlat] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<LocationFilterType>(LocationFilterType.CONTAINS);
  const [filterValue, setFilterValue] = useState<string | string[] | undefined>();

  useEffect(() => {
    if (!flattenedTags || !tagSubtagList) {
      return;
    }
    // check for correct filterValue type
    if (typeof filterValue === 'string' && filterType === LocationFilterType.IS_ANY_OF) {
      return;
    }
    if (Array.isArray(filterValue) && filterType !== LocationFilterType.IS_ANY_OF) {
      return;
    }
    switch (filterType) {
      case LocationFilterType.CONTAINS:
        setFilteredFlattenedTags(
          flattenedTags
            .filter(
              flattenedTag =>
                !filterValue?.length ||
                flattenedTag.name.toLowerCase().includes((filterValue as string).toLowerCase()) ||
                (!showFlat &&
                  tagSubtagList[flattenedTag.id].findIndex(subtag =>
                    subtag.name.toLowerCase().includes((filterValue as string).toLowerCase())
                  ) !== -1)
            )
            .sort((a, b) => (a.name < b.name ? -1 : 1))
        );
        break;
      case LocationFilterType.EQUALS:
        setFilteredFlattenedTags(
          flattenedTags
            .filter(
              flattenedTag =>
                !filterValue?.length ||
                flattenedTag.name.toLowerCase() === (filterValue as string).toLowerCase() ||
                (!showFlat &&
                  tagSubtagList[flattenedTag.id].findIndex(
                    subtag => subtag.name.toLowerCase() === (filterValue as string).toLowerCase()
                  ) !== -1)
            )
            .sort((a, b) => (a.name < b.name ? -1 : 1))
        );
        break;
      case LocationFilterType.STARTS_WITH:
        setFilteredFlattenedTags(
          flattenedTags
            .filter(
              flattenedTag =>
                !filterValue?.length ||
                flattenedTag.name.toLowerCase().startsWith((filterValue as string).toLowerCase()) ||
                (!showFlat &&
                  tagSubtagList[flattenedTag.id].findIndex(subtag =>
                    subtag.name.toLowerCase().startsWith((filterValue as string).toLowerCase())
                  ) !== -1)
            )
            .sort((a, b) => (a.name < b.name ? -1 : 1))
        );
        break;
      case LocationFilterType.ENDS_WITH:
        setFilteredFlattenedTags(
          flattenedTags
            .filter(
              flattenedTag =>
                !filterValue?.length ||
                flattenedTag.name.toLowerCase().endsWith((filterValue as string).toLowerCase()) ||
                (!showFlat &&
                  tagSubtagList[flattenedTag.id].findIndex(subtag =>
                    subtag.name.toLowerCase().endsWith((filterValue as string).toLowerCase())
                  ) !== -1)
            )
            .sort((a, b) => (a.name < b.name ? -1 : 1))
        );
        break;
      case LocationFilterType.IS_EMPTY:
        setFilteredFlattenedTags(
          flattenedTags
            .filter(
              flattenedTag =>
                flattenedTag.name === '' ||
                (!showFlat &&
                  tagSubtagList[flattenedTag.id].findIndex(subtag => subtag.name === '') !== -1)
            )
            .sort((a, b) => (a.name < b.name ? -1 : 1))
        );
        break;
      case LocationFilterType.IS_NOT_EMPTY:
        setFilteredFlattenedTags(
          flattenedTags
            .filter(
              flattenedTag =>
                flattenedTag.name !== '' ||
                (!showFlat &&
                  tagSubtagList[flattenedTag.id].findIndex(subtag => subtag.name !== '') !== -1)
            )
            .sort((a, b) => (a.name < b.name ? -1 : 1))
        );
        break;
      case LocationFilterType.IS_ANY_OF:
        setFilteredFlattenedTags(
          flattenedTags
            .filter(
              flattenedTag =>
                !filterValue?.length ||
                (filterValue as string[]).findIndex(
                  value => value.toLowerCase() === flattenedTag.name.toLowerCase()
                ) !== -1 ||
                (!showFlat &&
                  tagSubtagList[flattenedTag.id].findIndex(
                    subtag =>
                      (filterValue as string[]).findIndex(
                        value => value.toLowerCase() === subtag.name.toLowerCase()
                      ) !== -1
                  ) !== -1)
            )
            .sort((a, b) => (a.name < b.name ? -1 : 1))
        );
        break;
      default:
        setFilteredFlattenedTags(flattenedTags);
    }
  }, [filterValue, filterType, flattenedTags, tagSubtagList, showFlat]);

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
            <LocationPanelPermissionsProvider>
              <LocationPanelHeader
                isOpen={isOpen}
                setOpen={(value: boolean) => {
                  setOpen(value);
                }}
                showFlat={showFlat}
                setShowFlat={(value: boolean) => {
                  setShowFlat(value);
                }}
                showFilter={filterValue?.length ? true : false}
              />
              {isOpen && (
                <LocationFilter
                  filterType={filterType}
                  filterValue={filterValue}
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
                {(showFlat ? filteredFlattenedTags : tagTree)?.map(tag => (
                  <LocationBranch
                    key={tag.id}
                    locationTag={tag}
                    refetch={refetch}
                    forceFoldout={filterValue?.length && tag.child_tags?.length ? true : false}
                  />
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
